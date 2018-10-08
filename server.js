var express = require('express');
//var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
// GraphQL schema
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import bodyParser from 'body-parser'
import { makeExecutableSchema } from 'graphql-tools'
import { schema, resolvers } from './src/db/schema/merge_schemas'

import auth from './src/db/auth'
import db from './src/db/dbConnect'
// var schema = buildSchema(`
//     type Query {
//         message: String
//     }
// `);
// Root resolver
var root = {
    message: () => 'Hello World!'
};




const bcrypt = require('bcrypt')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const st = new SequelizeStore({
    db,
    // checkExpirationInterval: 15 * 60 * 1000,
    // expiration: 7 * 24 * 60 * 60 * 1000
  });
//st.sync()
const app = express()
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: st,
  resave: true,
  saveUninitialized: true,
  maxAge: process.env.COOKIE_MAX_AGE,
  proxy: true, // if you do SSL outside of node.

}))

app.use(bodyParser.json())

app.use(express.static('public'))
const logger = { log: e => console.log(e) }

const log = (req, res, next) => {
  console.log('graphql: operationName =', req.body.operationName)
  // console.log('graphql query =', req.body.query);
  // console.log('server.js: req.body', req.body);
  return next()
}
const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
  logger,
//  connectors: models      // Don't seem to need this.
})

app.get('/login', (req, res) => {
  // const handle = req.query.handle;
  const {
    email,
    password,
  } = req.query
  console.log(`/login email=${email}, sessionID=${req.sessionID}`) // eslint-disable-line max-len
  let whereClause

  if (email && password) {
    whereClause = { where: { email: email } }
  } else {
    console.log('ERROR: Login failed insufficient info', JSON.stringify(req.query)) // eslint-disable-line max-len
    return res.status(401).send('Login failed')
  }

    return db.models.user.findOne(whereClause)
    .then((user) => {
        if (user) {
            console.log("found user")
            console.log(user.validatePassword)
            user.validatePassword(password).then((validated)=> {


                if(validated){
                    console.log('Login success: user', user.email)
                    req.session.user = user.email
                    req.session.admin = user.email == 'admin'
                    req.session.userId = user.id

                    delete user.password
                    return res.json(user)
                }
                else{
                    console.log('login failed')
                    return res.status(401).send('login failed')
                }


        })
        .catch((err)=>{

          console.log('/login ERROR: db error for whereClause', JSON.stringify(whereClause), JSON.stringify(error))
          return res.status(401).send('login failed')
        })


      }

    })
    .catch((error) => {

      console.log('/login ERROR: db error for whereClause', JSON.stringify(whereClause), JSON.stringify(error))
      return res.status(401).send('login failed')
    })
})

app.get('/logout', (req, res) => {
  req.session.destroy()
  res.send('logged out')
})

// Get content endpoint
// app.get('/content', auth, (req, res) => {
//   res.send('You can only see this after you\'ve logged in.')
// })



app.use('/graphql', auth, bodyParser.json(), log, graphqlExpress(req => ({
    // schema: schema,
    // rootValue: root,
    // graphiql: true
    schema: executableSchema,
    context: {
        user: req.session.user,
        admin: req.session.admin,
        userId: req.session.userId,
  }, // at least(!) an empty object
})))
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  query: `
{
  User{
    id
    email
    createdAt
  }
}`,
}))

app.listen(8000, () => console.log('GraphQL Server Running On localhost:8000/graphiql'));
