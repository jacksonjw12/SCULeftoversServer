import db from '../dbConnect'
import GraphQLJSON from 'graphql-type-json'
require('../models')

const typeDefinitions = `
scalar JSON

type Post {
  id: String!
  title: String
  data: JSON
  createdAt: String
  updatedAt: String
  pictureURL: String
  owner: User
}
`

const query = `
  postById(id: String!): Post
`
const mutation = `
    updatePost(
        id: String!
        title: String
        pictureURL: String
    ): Post
    createPost(
        title: String
        pictureURL: String
    ): Post
`
const resolvers = {
    JSON: GraphQLJSON,
    Query: {
        postById(root,{id}){
            return db.models.post.findById(id)
        }
    },
    Mutation: {
        updatePost: (root,args,context) => {
            return db.models.post.update(args, {
                where: {id: args.id, owner_id: context.viewerId},
            }).then(() => db.models.post.findById(args.id)).catch((err) => {
                console.error('update post error =', err)
                return err
            })
        },
        createPost: (root,args,context) => {
            const ownerId = context.viewerId
            const newArgs = {
                title: args.title,
                pictureURL: args.pictureURL,
                owner_id: ownerId,
            }
          return db.models.post.create(newArgs).then(post => post)
        }
    },
    Post: {
        owner(post) {
            return post.getOwner()
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
