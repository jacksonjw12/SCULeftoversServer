import db from '../dbConnect'
require('../models')

const typeDefinitions = `
type User {
  id: String!
  email: String
  createdAt: String
  updatedAt: String
  status: String
  posts: [Post]
}
`

const query = `
  User: User
  userById(id: String!): User
`
const mutation = `
    updateStatus(
        id: String
        status: String
    ): User
    createUser(
        email: String
        password: String
    ): User
`
const resolvers = {
    Query: {
        User(root,args,context){
            return db.models.user.findById(context.userId)
        },
        userById(root,{id}){
            return db.models.user.findById(id)
        }
    },
    Mutation: {
        updateStatus(root,{id,newStatus}){
            return db.models.user.findOne({ where: { id: id } })
                .then((user) => {
                   return user.update({
                       status:newStatus
                   })

                })
                .catch(err=> err)
        },
        createUser(root,args){
            return db.models.user.create(args)
        }
    },
    User: {
        posts(user) {
            return user.getPosts()
        }
    }
}

const moduleSchema = {
  schema: {
    query,
    typeDefinitions,
    mutation,
  },
  resolvers,
}

export default moduleSchema
