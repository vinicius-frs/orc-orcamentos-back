import { sign } from "jsonwebtoken"
import { AppDataSource } from "../database"
import { User } from "../entities/User"
import { UserRepository } from "../repositories/UserRepository"

export class UserService {
    private userRepository: UserRepository

    constructor(
        userRepository = new UserRepository(AppDataSource.manager)
    ){
        this.userRepository = userRepository
    }

    createUser = (name: string, email: string, password: string) => {
        const user = new User(name, email, password)
        return this.userRepository.createUser(user)
    }

    deleteUser = (email: string) => {
        
    }

    getUser = (userId: string): Promise<User | null> => {
        return this.userRepository.getUser(userId)
    }

    getAuthenticatedUser = async(email: string, password: string): Promise<User | null> => {
        return await this.userRepository.getUserByEmailAndPassword(email, password)
    }

    getToken = async(email: string, password: string): Promise<string> => {
        const user = await this.getAuthenticatedUser(email, password)

        if(!user){
            throw new Error('Email ou senha incorretos')
        }

        const tokenData = {
            name: user?.name,
            email: user?.email,
        }

        const tokenKey = '12345'

        const tokenOptions = {
            subject: user?.id_user
        }

        const token = sign(tokenData, tokenKey, tokenOptions)

        return token
    }
}

