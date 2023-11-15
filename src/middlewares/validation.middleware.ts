import { plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { Request, RequestHandler } from "express";
import { logger } from "../utils/logger";
import { sanitize } from "class-sanitizer";
import HttpException from "../utils/exception";


const dtoValidationMiddleware =
    (
        dto: any,
        path: "body" | "query" | "params" = "body",
        skipMissingProperties = false,
        whitelist = true,
        forbidNonWhitelisted = false,
    ): RequestHandler => {
        return (req: Request, res, next) => {
            const dtoObject = plainToInstance(dto, req[path])
            validate(dtoObject, {
                skipMissingProperties,
                whitelist,
                forbidNonWhitelisted
            }).then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    logger.error(errors)
                    next(new HttpException(400, "Request validation error"))
                } else {
                    sanitize(dtoObject)
                    req[path] = dtoObject
                    next()
                }
            })
        }
    }

export default dtoValidationMiddleware