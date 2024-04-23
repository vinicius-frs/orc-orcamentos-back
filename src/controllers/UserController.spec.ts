import { UserController } from "./UserController";
import { Request } from 'express'
import { makeMockResponse } from "../__mocks__/mockResponse.mock";
import { makeMockRequest } from "../__mocks__/mockRequest.mock";

const mockUserService = {
    createUser: jest.fn(),
    getUser: jest.fn((userId) => {
        return {
            id_user: userId,
            email: 'test@test.com',
            name: 'Test name'
        }
    }),
    deleteUser: jest.fn(),
}

jest.mock('../services/UserService', () => {
    return {
        UserService: jest.fn().mockImplementation(() => {
            return mockUserService
        })
    }
})

describe('UserController', () => {
    
    const userController = new UserController();
    const mockResponse = makeMockResponse()

    it('Deve adicionar um novo usuário', () => {
        const mockRequest = {
            body: {
                name: 'Test',
                email: 'test@test.com',
                password: 'testpass'
            }
        } as Request

        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(201)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário criado' })
    })

    it('Deve retornar erro por não informar o name', () => {
        const mockRequest = {
            body: {
                name: '',
                email: 'test@test.com',
                password: 'testpass'
            }
        } as Request

        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! name, email e password obrigatórios'})
    })

    it('Deve retornar erro por não informar o email', () => {
        const mockRequest = {
            body: {
                name: 'Test',
                email: '',
                password: 'testpass'
            }
        } as Request

        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! name, email e password obrigatórios'})
    })

    it('Deve retornar erro por não informar o password', () => {
        const mockRequest = {
            body: {
                name: 'Test',
                email: 'test@test.com',
                password: ''
            }
        } as Request

        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! name, email e password obrigatórios'})
    })

    it('Deve retornar os dados do usuário de acordo com id', async() => {
        const mockRequest = makeMockRequest({
            params: {
                userId: '1'
            }
        })

        await userController.getUser(mockRequest, mockResponse)
        expect(mockUserService.getUser).toHaveBeenCalledWith('1')
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toMatchObject({
            userId: '1',
            name: 'Test name',
            email: 'test@test.com'
        })
    })

    it('Deve retornar erro ao não informar o id', async() => {
        const mockRequest = makeMockRequest({
            params: {
                userId: ''
            }
        })

        await userController.getUser(mockRequest, mockResponse)
        expect(mockUserService.getUser).not.toHaveBeenCalled()
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! userId obrigatório'})
    })

    it('Deve remover um usuário', () => {
        const mockRequest = {
            body: {
                email: 'teste@teste.com'
            }
        } as Request

        userController.deleteUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário deletado'})
    })

    it('Deve dar erro ao remover um usuário sem informar email', () => {
        const mockRequest = {
            body: {
                email: ''
            }
        } as Request

        userController.deleteUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Email obrigatório'})
    })
})
