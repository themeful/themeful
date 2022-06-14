import { Injectable } from '@nestjs/common'
import { ExtendedStyle, Style, StyleGuideBase, StyleGuides, StyleMap } from '@typings'
import { clone, convertCSSLength, slugify, sortMap, unifyStyle } from '@utils'
import { take } from 'rxjs'
import * as smq from 'sort-media-queries'
import { FileService } from './file.service'
import { SyncService } from './sync.service'

@Injectable()
export class StyleGuideService {
  private styleGuides: StyleGuides

  constructor(private readonly syncService: SyncService, private readonly file: FileService) {
    this.file
      .styleGuides$()
      .pipe(take(1))
      .subscribe((styleGuides) => {
        this.styleGuides = styleGuides
      })
  }

  public create(style: Style, styleGuide = 'global'): boolean {
    const key = slugify([style.group, style.name])

    style = unifyStyle(style)

    if (!this.styleGuides[styleGuide] || this.styleGuides[styleGuide].styles[key]) {
      return false
    }
    this.styleGuides[styleGuide].styles[key] = style

    this.reorder(styleGuide)

    this.writeFiles(this.styleGuides)

    return true
  }

  public update(name: string, style: Style, styleGuide = 'global'): boolean {
    const key = slugify([style.group, style.name])

    style = unifyStyle(style)

    if (
      !this.styleGuides[styleGuide]?.styles[name] ||
      (key !== name && this.styleGuides[styleGuide].styles[key])
    ) {
      return false
    }
    delete this.styleGuides[styleGuide].styles[name]
    this.styleGuides[styleGuide].styles[key] = style

    this.reorder(styleGuide)

    if (name !== key) {
      this.syncService.styleGuides({
        action: 'update',
        primary: `${styleGuide}_${name}`,
        secondary: slugify([styleGuide, style.group, style.name]),
      })
    }
    this.writeFiles(this.styleGuides)

    return true
  }

  public delete(name: string, styleGuide = 'global'): boolean {
    if (!this.styleGuides[styleGuide] || !this.styleGuides[styleGuide].styles[name]) {
      return false
    }
    delete this.styleGuides[styleGuide].styles[name]

    this.writeFiles(this.styleGuides)
    return true
  }

  public duplicate(oldSlug: string, { name }: { name: string }): boolean {
    const newSlug = slugify([name])
    if (oldSlug === newSlug || this.styleGuides[newSlug]) {
      return false
    }
    this.styleGuides[newSlug] = { ...clone(this.styleGuides[oldSlug]), name }

    this.syncService.styleGuideBases({
      action: 'duplicate',
      primary: oldSlug,
      secondary: newSlug,
    })
    this.writeFiles(this.styleGuides)

    return true
  }

  public createStyleGuide({ name, baseFontSize }: StyleGuideBase): boolean {
    const slug = slugify([name])
    if (!Object.keys(this.styleGuides).includes(slug)) {
      this.styleGuides[slug] = {
        name,
        baseFontSize,
        styles: {},
      }
      this.writeFiles(this.styleGuides)

      return true
    }
    return false
  }

  public updateStyleGuide(
    currentSlug: string,
    { name = 'Global', baseFontSize }: StyleGuideBase
  ): boolean {
    const slug = currentSlug === 'global' ? 'global' : slugify([name])

    this.styleGuides[slug] = {
      ...this.styleGuides[currentSlug],
      name,
      baseFontSize,
    }

    if (currentSlug !== slug) {
      delete this.styleGuides[currentSlug]
      this.syncService.styleGuideBases({
        action: 'update',
        primary: currentSlug,
        secondary: slug,
      })
      this.writeFiles(this.styleGuides)
    } else {
      this.writeFiles(this.styleGuides)
    }

    return true
  }

  public deleteStyleGuide(styleGuide: string): boolean {
    if (!this.styleGuides[styleGuide]) {
      return false
    }

    delete this.styleGuides[styleGuide]
    this.writeFiles(this.styleGuides)

    return true
  }

  private reorder(styleGuide = 'global') {
    const specialeSortTypes = ['mediaquery']
    const section = this.styleGuides[styleGuide].styles
    const convert = convertCSSLength(`${this.styleGuides[styleGuide].baseFontSize}px`)
    let newSection: StyleMap = {}
    let mediaqueries = Object.values(section)
      .filter((bv: Style) => bv.type === 'mediaquery')
      .reduce((result: string[], item: Style) => {
        result.push(item.value)
        return result
      }, [])
    mediaqueries = smq(mediaqueries)

    Object.keys(section).forEach((key: string) => {
      if (!specialeSortTypes.includes(section[key].type)) {
        newSection[key] = section[key] as ExtendedStyle
      }
    })
    newSection = sortMap<ExtendedStyle>(newSection, ([aKey, aValue], [bKey, bValue]) => {
      if (aValue.type === bValue.type) {
        if (['size', 'font-size'].includes(aValue.type)) {
          return parseFloat(convert(aValue.value)) > parseFloat(convert(bValue.value)) ? 1 : -1
        }
        return aKey > bKey ? 1 : -1
      }
      return aValue.type > bValue.type ? 1 : -1
    })

    mediaqueries.forEach((mediaquery) => {
      const key = Object.keys(section).filter((key) => section[key].value === mediaquery)[0]
      newSection[key] = section[key]
    })

    this.styleGuides[styleGuide].styles = newSection
  }

  private writeFiles(styleGuides: StyleGuides) {
    this.styleGuides = sortMap(styleGuides, ([a], [b]): number => {
      if ([a, b].includes('global')) {
        return a === 'global' ? -1 : 1
      }
      return a > b ? 1 : -1
    }) as StyleGuides
    this.file.save('styleGuides', this.styleGuides)
  }
}
