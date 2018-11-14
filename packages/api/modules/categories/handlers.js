const Category = require('./category.model')
const SubCategory = require('./subcategory.model')

/**
 * Get the categories available in the requested language
 * If the language doesn't exist, English is used as a fallback
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.lang - language as route element
 *
 * @returns ordered list of categories
 * @author Grégory LATINIER
 */
const getCategories = async (req, h) => {
  const lang = req.params.lang
  const categories = await Category.find({ active: true })
    .select(`color key icon text ${lang !== 'en' && 'translations'}`)
    .sort({ text: 1 })
  // The UI requested another language than English, we replace the text with the translation if found
  if (lang !== 'en') {
    const translated = categories.map((category) => {
      const translation = category.translations && category.translations.find((t) => t.lang === lang)
      if (translation) {
        category.text = translation.text
      }

      const { translations, ...obj } = category.toJSON()
      return obj
    })
    return h.response(translated.sort((a, b) => a.text.localeCompare(b.text)))
  }

  return h.response(categories)
}

/**
 * Get the subcategories of a category available in the requested language
 * If the language doesn't exist, English is used as a fallback
 *
 * @param {object} req - request
 * @param {object} req.params - request parameters
 * @param {string} req.params.lang - language as route element
 * @param {string} req.params.category - category filter as route element
 *
 * @returns ordered list of subcategories
 * @author Grégory LATINIER
 */
const getSubCategories = async (req, h) => {
  const { lang, category } = req.params
  const subcategories = await SubCategory
    .aggregate()
    .lookup({
      from: 'categories',
      localField: 'category',
      foreignField: '_id',
      as: 'Category'
    })
    .unwind('$Category')
    .match({ active: true, 'Category.key': category })
    .project(`key text ${lang !== 'en' && 'translations'}`)
    .sort({ text: 1 })

  if (lang !== 'en') {
    const translated = subcategories.map((subcategory) => {
      const translation = subcategory.translations && subcategory.translations.find((t) => t.lang === lang)
      if (translation) {
        subcategory.text = translation.text
      }

      const { translations, ...obj } = subcategory
      return obj
    })
    return h.response(translated.sort((a, b) => a.text.localeCompare(b.text)))
  }

  return h.response(subcategories)
}

module.exports = {
  getCategories,
  getSubCategories
}
