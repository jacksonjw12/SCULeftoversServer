require('dotenv').config({ silent: true })

const auth = (req, res, next) => {
  const { SERVER_API_KEY } = process.env

  if (req.body.operationName === 'GetSettings') {
    return next()
  }
  //
  // if (req.header('sculeftoversgraphql_apikey') === SERVER_API_KEY) {
  //   req.session.user = 'ouadmin'
  //   req.session.viewerId = 1
  //   req.session.admin = true
  // } else
    if (req.session.user && req.session.userId) {
        console.log('session OK =', req.session.user, req.session.userId) // , req.sessionID);
  } else {
    console.log('auth SESSION ERROR 401 sessionID =', req.sessionID) // , req.sessionID);
    return res.sendStatus(401)
  }

  return next()
}

export default auth
