export function onRequest (handler) {
  // lets us add __trigger without altering handler:
  let cloudFunction = (req, res) => { handler(req, res) }
  cloudFunction.__trigger = {httpsTrigger: {}}
  return cloudFunction
}

// default export.
export default onRequest
