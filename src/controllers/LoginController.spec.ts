import { LoginController } from "./LoginController";
import { Request } from 'express'
import { makeMockResponse } from "../__mocks__/mockResponse.mock";

const mockUserService = {
    getToken: jest.fn(() => {
      return 'token'
    }),
}

jest.mock('../services/UserService', () => {
    return {
        UserService: jest.fn().mockImplementation(() => {
            return mockUserService
        })
    }
})

describe('LoginController', () => {
    
    const loginController = new LoginController();
    const mockResponse = makeMockResponse()

    it('Deve autenticar o usuario', async() => {
        const mockRequest = {
            body: {
                email: 'test@test.com',
                password: 'testpass'
            }
        } as Request

        await loginController.login(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toMatchObject({token: 'token'})
    })
})
