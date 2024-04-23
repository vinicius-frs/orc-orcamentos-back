import 'reflect-metadata'
import express, { Request, Response } from 'express';
import { router } from './routes';

const server = express();

const cors = require('cors')
server.use(cors());

server.use(express.json())
server.use(router)

server.get('/', (request: Request, response: Response) => {
    return response.status(200).json({ message: 'ORC Orçamentos API' })
})

server.listen(5000, () => console.log('Server on'))
