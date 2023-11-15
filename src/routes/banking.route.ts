import { Router } from "express";
import BankingController from "../controllers/banking.controller";
import { Route } from "../interfaces/route.interface";
import dtoValidationMiddleware from "../middlewares/validation.middleware";
import { TransferDto, DepositDto, WithdrawDto } from "../dtos/banking.dto";
import authMiddleware from "../middlewares/auth.middleware";

export default class BankingRoute implements Route {
    
    public path: string = "/banking"
    public router: Router = Router()
    public controller: BankingController = new BankingController()

    constructor(){
        this.initializeRoutes()
    }

    private initializeRoutes(){
        
        this.router.post(
            "/transfer",
            authMiddleware,
            dtoValidationMiddleware(TransferDto, "body"),
            this.controller.transfer
        )

        this.router.post(
            "/fund",
            authMiddleware,
            dtoValidationMiddleware(DepositDto, "body"),
            this.controller.deposit
        )

        this.router.post(
            "/withdraw",
            authMiddleware,
            dtoValidationMiddleware(WithdrawDto, "body"),
            this.controller.withdraw
        )

    }

}