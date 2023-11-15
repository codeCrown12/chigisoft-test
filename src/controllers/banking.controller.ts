import { NextFunction, Request, Response } from "express"
import BankingService from "../services/banking.service"
import { StatusCodes } from "http-status-codes"

export default class BankingController {

    private readonly service: BankingService = new BankingService()

    public transfer = async (request: Request, response: Response, next: NextFunction) => {
        const res = await this.service.transfer(request.user?.id as number, request.body)
        response.status(StatusCodes.OK).send({ error: false, data: res })
    }

    public deposit = async (request: Request, response: Response, next: NextFunction) => {
        const res = await this.service.deposit(request.user?.id as number, request.body)
        response.status(StatusCodes.OK).send({ error: false, data: res })
    }

    public withdraw = async (request: Request, response: Response, next: NextFunction) => {
        const res = await this.service.withdraw(request.user?.id as number, request.body)
        response.status(StatusCodes.OK).send({ error: false, data: res })
    }

}
