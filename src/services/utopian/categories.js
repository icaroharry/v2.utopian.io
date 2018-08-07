// imports.
import { map } from 'lodash-es'

// export the categories.
export const categories = [
  'ideas',
  'development',
  'bug-hunting',
  'translations',
  'graphics',
  'analysis',
  'social',
  'documentation',
  'tutorials',
  'video-tutorials',
  'copywriting',
  'blog'
]

export const tasks = [
  'task-bug-hunting',
  'task-analysis',
  'task-social',
  'task-development',
  'task-documentation',
  'task-copywriting',
  'task-graphics'
]

// map categories into selectable options array.
export const categoryOptions = map(categories, (categoryName) => ({ value: categoryName, label: categoryName }))
