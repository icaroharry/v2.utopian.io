/**
 * Configure / initialize firebase functions.
 *
 * @param {firebase.app.App}  firebase  Firebase application instance to configure.
 */
const configureFunctions = (firebase) => {
  // get emulator base URL (example: "https://127.0.0.1:500").
  const emulatorURL = process.env.FIREBASE_EMULATOR || null
  // if an emulator URL was given.
  if (emulatorURL !== null) {
    firebase.functions().useFunctionsEmulator(emulatorURL)
  }
}

// default export the functions configure function.
export default configureFunctions
