import _ from 'lodash'
import userSchema from './userSchema'
import postSchema from './postSchema'
const schemas = [
    userSchema,
    postSchema,
];

const moduleQueries = []
const moduleTypeDefinitions = []
const moduleMutations = []
const moduleResolvers = []
schemas.forEach((schema) => {
  const moduleSchema = schema

  moduleQueries.push(moduleSchema.schema.query)
  moduleTypeDefinitions.push(moduleSchema.schema.typeDefinitions)
  moduleMutations.push(moduleSchema.schema.mutation)

  moduleResolvers.push(moduleSchema.resolvers)
})

export const schema = [`
type Query {
  ${moduleQueries.join('\n')}
}
${moduleTypeDefinitions.join('\n')}
type Mutation {
  ${moduleMutations.join('\n')}
}
schema {
  query: Query
  mutation: Mutation
}
`]


function mergeModuleResolvers(baseResolvers) {
  moduleResolvers.forEach((module) => {
    baseResolvers = _.merge(baseResolvers, module) // eslint-disable-line no-param-reassign
  })

  return baseResolvers
}

export const resolvers = mergeModuleResolvers({})
