import { IsNotEmpty, IsNumber, IsString, IsEnum } from "class-validator";

enum Method {
    card = "card",
    bank_transfer = "bank_transfer"
}

export class DepositDto {

    @IsNumber()
    @IsNotEmpty()
    amount: number

    @IsString()
    @IsNotEmpty()
    @IsEnum(Method)
    method: string

}

export class TransferDto {

    @IsNumber()
    @IsNotEmpty()
    amount: number

    @IsNumber()
    @IsNotEmpty()
    receipient_id: number

}

export class WithdrawDto {

    @IsNumber()
    @IsNotEmpty()
    amount: number

    @IsString()
    @IsNotEmpty()
    destination_bank: string

    @IsString()
    @IsNotEmpty()
    destination_account_number: string

}