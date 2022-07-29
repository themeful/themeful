import * as systemFind from 'find'
import { readFileSync } from 'fs'

export interface FindInResult {
  filename: string
  matches: string[]
  line: string[] | null
}
export type FindInResults = FindInResult[]

function searchFile(data, content) {
  const match = content.match(data.regex),
    linesMatch = content.match(data.lineRegEx)

  return {
    filename: data.filename,
    matches: match,
    lines: linesMatch,
  }
}

function getFileFilter(fileFilter) {
  if (typeof fileFilter === 'string') {
    fileFilter = new RegExp(fileFilter)
  } else if (typeof fileFilter === 'undefined') {
    fileFilter = new RegExp('.')
  }
  return fileFilter
}

function getRegEx(pattern, regex?) {
  let flags, term

  if (typeof pattern === 'object' && pattern.flags) {
    term = pattern.term
    flags = pattern.flags
  } else {
    term = pattern
    flags = 'gm'
  }

  const grabLineRegEx = '(.*' + term + '.*)'

  if (regex === 'line') {
    return new RegExp(grabLineRegEx, flags)
  }

  return new RegExp(term, flags)
}

function getMatchedFiles(pattern, files) {
  const matchedFiles = []
  for (let i = files.length - 1; i >= 0; i--) {
    const fileContent = readFileSync(files[i], 'utf-8')
    const searchResult = searchFile(
      {
        regex: getRegEx(pattern),
        lineRegEx: getRegEx(pattern, 'line'),
        filename: files[i],
      },
      fileContent
    )
    matchedFiles.push(searchResult)
  }

  return matchedFiles
}

export const findInSync = (pattern, directory, fileFilter): FindInResults => {
  const files = systemFind.fileSync(getFileFilter(fileFilter), directory)
  return getMatchedFiles(pattern, files)
}

export const findSync = (directory, fileFilter): string[] => {
  return systemFind.fileSync(getFileFilter(fileFilter), directory)
}
