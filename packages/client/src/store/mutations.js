// set the application encryption key.
export const setEncryptionKey = (state, key) => {
  state.encryptionKey = key
}

// set overlay mutation.
export const setOverlay = (state, overlay = false) => {
  state.overlay = overlay
}
