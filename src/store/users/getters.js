import { get } from 'lodash'

export const user = (state) => (username) => get(state, username, null)