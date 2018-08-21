// import { currency } from '@blocker/steem-formatter'
// helper for currency formatting.
export const parseCurrencyString = (valueString, minFraction = 0, maxFraction = 2, locale = undefined) => {
  return parseFloat(valueString).toLocaleString(locale, {
    minimumFractionDigits: minFraction,
    maximumFractionDigits: maxFraction
  })
}
