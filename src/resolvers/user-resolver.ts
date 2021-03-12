import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { User, UserModel } from "../entities/user";

@Resolver(of => User)
export class UserResolver {
    @Query(returns => [User])
    async users() {
        return await UserModel.find()
    }
    @Mutation(returns => User)
    async createUser(
        @Arg("email") email: string,
        @Arg("password") password: string
    ) {
        return await UserModel.create({
            email,
            password
        })
    }

}