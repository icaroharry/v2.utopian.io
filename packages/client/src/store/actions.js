import { Loading, Dialog } from 'quasar'

// start the loading indication (full overlay).
export const startLoading = (store, message) => {
  // default options
  Loading.show({ message })
}

// start the loading indication (full overlay).
export const stopLoading = (store, any) => {
  // default options
  Loading.hide()
}

// show a generic dialog (options to configure).
export const showDialog = (store, options) => {
  Dialog.create(options)
}
