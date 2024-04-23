import { Request, Response } from 'express'
import { UserService } from '../services/UserService'

export class UserController {
    userService: UserService

    constructor(
        userService = new UserService()
    ){
        this.userService = userService
    }

    createUser = (request: Request, response: Response): Response => {
        const user = request.body

        if(!user.name || !user.email || !user.password){
            return response.status(400).json({ message: 'Bad request! name, email e password obrigatórios'})
        }

        this.userService.createUser(user.name, user.email, user.password)
        return response.status(201).json({ message: 'Usuário criado'})
    }

    getUser = async(request: Request, response: Response) => {
        const { userId } = request.params
        if(!userId){
            return response.status(400).json({ message: 'Bad request! userId obrigatório'})
        }
        const userData = await this.userService.getUser(userId)
        return response.status(200).json({
            userId: userData?.id_user,
            name: userData?.name,
            email: userData?.email
        })
    } 

    deleteUser = (request: Request, response: Response): Response => {
        const user = request.body

        if(!user.email){
            return response.status(400).json({ message: 'Bad request! Email obrigatório'})
        }

        this.userService.deleteUser(user.email)
        return response.status(200).json({ message: 'Usuário deletado'})
    }
}
