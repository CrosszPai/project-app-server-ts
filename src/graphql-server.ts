import { ApolloServer } from 'apollo-server-fastify'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './resolvers/user-resolver'
import * as path from 'path'
import { ObjectIdScalar } from './object-id.scalar'
import { ObjectId } from 'mongodb'
import { TypegooseMiddleware } from './typegoose-middleware'
import { connect } from 'mongoose'

async function bootstrap() {
    const mongoose = await connect(process.env.MONGO_DB_URL as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    // clean and seed database with some data
    await mongoose.connection.db.dropDatabase();
    const schema = await buildSchema({
        resolvers: [UserResolver],
        emitSchemaFile: path.resolve(__dirname, "schema.gql"),
        globalMiddlewares: [TypegooseMiddleware],
        scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    })
    const handler = new ApolloServer({
        schema,
    }).createHandler()

    return handler
}

export default bootstrap