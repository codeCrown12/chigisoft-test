import database from "../database";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs"
import jwt, { JsonWebTokenError } from "jsonwebtoken"
import { StatusCodes } from "http-status-codes"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config"
import HttpException from "../utils/exception";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";

export default class AuthService {

    private dbService: PrismaClient = database.getClient()

    public async register(dto: RegisterDto) {
        const emailExist = await this.dbService.user.findFirst({
            where: {
                email: dto.email
            }
        })
        if(emailExist) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Email already taken"
            )
        }
        const usernameExist = await this.dbService.user.findFirst({
            where: {
                username: dto.username
            }
        })
        if(usernameExist) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Username already taken"
            )
        }
        const hashedPassword = await this.hashPassword(dto.password)
        const user = await this.dbService.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                password: hashedPassword
            }
        })
        const { id, email, username } = user
        return {
            id,
            email,
            username
        }
    }

    public async login(dto: LoginDto) {
        const user = await this.dbService.user.findFirst({
            where: {
                email: dto.email
            }
        })
        if(!user) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST, 
                "Invalid credentials"
            )
        }
        const isPasswordValid = await this.verifyPassword(user.password, dto.password)
        if(!isPasswordValid) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST, 
                "Invalid credentials"
            )
        }
        const token = await this.issueJWT(user.id)
        const { id, email, username } = user
        return {
            token,
            user: {
                id,
                email,
                username
            }
        }
    }

    private async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password, salt)
    }

    private async verifyPassword(passwordFromDb: string, loginPassword: string) {
        return await bcrypt.compare(loginPassword, passwordFromDb)
    }

    public async issueJWT(userId: number) {
        const token: string = jwt.sign(
            { userId },
            JWT_SECRET as string,
            { expiresIn: JWT_EXPIRES_IN }
        )
        return token
    }

    public verifyJWT(token: string) {
        try {
            return jwt.verify(token, JWT_SECRET as string) as { userId: number }
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                throw new HttpException(
                    StatusCodes.UNAUTHORIZED,
                    error.message
                )
            }
        }
    }

}