import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { Route } from "../interfaces/route.interface";
import dtoValidationMiddleware from "../middlewares/validation.middleware";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";

export default class AuthRoute implements Route {
    
    public path: string = "/auth"
    public router: Router = Router()
    public controller: AuthController = new AuthController()

    constructor(){
        this.initializeRoutes()
    }

    private initializeRoutes(){
        
        this.router.post(
            "/register", 
            dtoValidationMiddleware(RegisterDto, "body"),
            this.controller.register
        )
        
        this.router.post(
            "/login", 
            dtoValidationMiddleware(LoginDto, "body"),
            this.controller.login
        )

    }

}