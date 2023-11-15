import database from "../database";
import { PrismaClient, TransactionStatus, TransactionType } from "@prisma/client";
import { StatusCodes } from "http-status-codes"
import { DepositDto, TransferDto, WithdrawDto } from "../dtos/banking.dto";
import HttpException from "../utils/exception";

export default class BankingService {

    private dbService: PrismaClient = database.getClient()

    private round(value: number) {
        return Math.round(100 * value) / 100
    }

    private formatNumber(num: number) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    public async transfer(userId: number, dto: TransferDto) {

        if(userId == dto.receipient_id) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Cannot transfer to self"
            )
        }

        if(dto.amount < 100) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Amount must be greater than 100"
            )
        }
        
        const sender = await this.dbService.user.findFirst({
            where: {
                id: userId,
                is_blocked: false
            }
        })
        
        if(!sender) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "User not found or account restricted"
            )
        }
        
        const receipient = await this.dbService.user.findFirst({
            where: {
                id: dto.receipient_id
            }
        })

        if(!receipient) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Receipient not found"
            )
        }
        
        const senderBalance = this.round(sender.account_balance - dto.amount)

        if(senderBalance < 0) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Insufficient balance"
            )
        }

        const receipientBalance = this.round(receipient.account_balance + dto.amount)

        const debitSender = this.dbService.user.update({
            where: {
                id: sender.id
            },
            data: {
                account_balance: senderBalance
            }
        })

        const creditReceiver = this.dbService.user.update({
            where: {
                id: receipient.id
            },
            data: {
                account_balance: receipientBalance
            }
        })

        const recordTransaction = this.dbService.transaction.create({
            data: {
                amount: dto.amount,
                user_id: userId,
                type: TransactionType.transfer,
                status: TransactionStatus.success,
                transfer: {
                    create: {
                        receipient_id: dto.receipient_id
                    }
                }
            }
        })

        await this.dbService.$transaction([debitSender, creditReceiver, recordTransaction])

        return {
            message: "Transfer successful",
            account_balance: senderBalance
        }
    
    }

    public async deposit(userId: number, dto: DepositDto) {

        if(dto.amount < 100) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Amount must be greater than 100"
            )
        }

        const user = await this.dbService.user.findFirst({
            where: {
                id: userId,
                is_blocked: false
            }
        })
        
        if(!user) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "User not found or account restricted"
            )
        }

        const balance = this.round(user.account_balance + dto.amount)

        const creditUser = this.dbService.user.update({
            where: {
                id: userId
            },
            data: {
                account_balance: balance
            }
        })

        const recordTransaction = this.dbService.transaction.create({
            data: {
                amount: dto.amount,
                user_id: userId,
                type: TransactionType.deposit,
                status: TransactionStatus.success,
                deposit: {
                    create: {
                        method: dto.method
                    }
                }
            }
        })

        await this.dbService.$transaction([creditUser, recordTransaction])

        return {
            message: "Deposit successful",
            account_balance: balance
        }

    }

    public async withdraw(userId: number, dto: WithdrawDto) {

        if(dto.amount < 100) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Amount must be greater than 100"
            )
        }

        const user = await this.dbService.user.findFirst({
            where: {
                id: userId,
                is_blocked: false
            }
        })
        
        if(!user) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "User not found or account restricted"
            )
        }

        const balance = this.round(user.account_balance - dto.amount)

        if(balance < 0) {
            throw new HttpException(
                StatusCodes.BAD_REQUEST,
                "Insufficient balance"
            )
        }

        const debitUser = this.dbService.user.update({
            where: {
                id: userId
            },
            data: {
                account_balance: balance
            }
        })

        const recordTransaction = this.dbService.transaction.create({
            data: {
                amount: dto.amount,
                user_id: userId,
                type: TransactionType.withdraw,
                status: TransactionStatus.success,
                withdraw: {
                    create: {
                        destination_account_number: dto.destination_account_number,
                        destination_bank: dto.destination_bank
                    }
                }
            }
        })

        await this.dbService.$transaction([debitUser, recordTransaction])

        return {
            message: "Withdrawal successful",
            account_balance: balance
        }

    }

}