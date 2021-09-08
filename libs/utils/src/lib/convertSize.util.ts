const unit = (input) => {
  return String(input).match(/[\d.\-+]*\s*(.*)/)[1] || ''
}

const unitLess = (length) => parseFloat(length)

export const convertCSSLength = (baseFontSize) => {
  if (baseFontSize == null) {
    baseFontSize = '16px'
  }
  return function (length, toUnit = 'px', fromContext = null, toContext = null) {
    if (fromContext == null) {
      fromContext = baseFontSize
    }
    if (toContext == null) {
      toContext = fromContext
    }
    const fromUnit = unit(length)

    if (fromUnit === toUnit) {
      return length
    }

    let pxLength = unitLess(length)

    if (fromUnit !== 'px') {
      if (fromUnit === 'em') {
        pxLength = unitLess(length) * unitLess(fromContext)
      } else if (fromUnit === 'rem') {
        pxLength = unitLess(length) * unitLess(baseFontSize)
      } else if (fromUnit === 'ex') {
        pxLength = unitLess(length) * unitLess(fromContext) * 2
      } else {
        return length
      }
    }

    let outputLength = pxLength
    if (toUnit !== 'px') {
      if (toUnit === 'em') {
        outputLength = pxLength / unitLess(toContext)
      } else if (toUnit === 'rem') {
        outputLength = pxLength / unitLess(baseFontSize)
      } else if (toUnit === 'ex') {
        outputLength = pxLength / unitLess(toContext) / 2
      } else {
        return length
      }
    }

    return parseFloat(outputLength.toFixed(5)) + toUnit
  }
}
