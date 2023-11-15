import { NextFunction, Request, Response } from "express"
import AuthService from "../services/auth.service";
import { StatusCodes } from "http-status-codes"

export default class AuthController {

    private readonly service: AuthService = new AuthService()

    public register = async (request: Request, response: Response, next: NextFunction) => {
        const res = await this.service.register(request.body)
        response.status(StatusCodes.OK).send({ error: false, data: res })
    }

    public login = async (request: Request, response: Response, next: NextFunction) => {
        const res = await this.service.login(request.body)
        response.status(StatusCodes.OK).send({ error: false, data: res })
    }

}