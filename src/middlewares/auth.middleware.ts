import { NextFunction, Request, Response, RequestHandler } from "express"
import HttpException from "../utils/exception"
import { PrismaClient } from "@prisma/client"
import database from "../database"
import AuthService from "../services/auth.service"
import { StatusCodes } from "http-status-codes"

const authMiddleware: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    const authService: AuthService = new AuthService()
    const dbService: PrismaClient = database.getClient()
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            "Unauthorized"
        )
    }

    const userPayload = authService.verifyJWT(token)

    if (!userPayload) {
        throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            "Invalid Token"
        )
    }

    const user = await dbService.user.findFirst({
        where: {
            id: userPayload.userId
        }
    })

    if(!user) {
        throw new HttpException(
            StatusCodes.UNAUTHORIZED,
            "Invalid user"
        )
    }

    req.user = user

    next()
}

export default authMiddleware