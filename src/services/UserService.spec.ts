import { UserService } from "./UserService";
import * as jwt from 'jsonwebtoken'

jest.mock('../repositories/UserRepository')
jest.mock('../database', () => {
    initialize: jest.fn()
})
jest.mock('jsonwebtoken')

const mockUserRepository = require('../repositories/UserRepository')

describe('UserService', () => {
    const userService = new UserService(mockUserRepository)
    const mockUser = {
        id_user: '123',
        name: 'test',
        email: 'test@test.com',
        password: 'testpass'
    }

    it('Deve adicionar um novo usuário', async() => {
        mockUserRepository.createUser = jest.fn().mockImplementation(() => Promise.resolve(mockUser))
        const response = await userService.createUser('test', 'test@test.com', 'testpass');
        expect(mockUserRepository.createUser).toHaveBeenCalled()
        expect(response).toMatchObject(mockUser)
    })

    it('Deve retornar um usuário autenticado', async() => {
        jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation(() => Promise.resolve(mockUser))
        jest.spyOn(jwt, 'sign').mockImplementation(() => 'token')
        const token = await userService.getToken('vsantos@test.com', 'passtest')
        expect(token).toBe('token')
    })

    it('Deve retornar erro caso nao encontre um usuario', async() => {
        jest.spyOn(userService, 'getAuthenticatedUser').mockImplementation(() => Promise.resolve(null))
        await expect(userService.getToken('invalid@test.com', 'wrongpass')).rejects.toThrowError(new Error('Email ou senha incorretos'))
    })

})
