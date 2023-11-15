import { app } from "../src/index"
import request from "supertest"

/** login, get your token (JWT) and put it here in the 'token' variable below 👇👇 */ 
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwMDA1MTc0MywiZXhwIjoxNzAyNjQzNzQzfQ.d8YvflHTY_Livu_Ix14HqrqgwFs4QCKy2oaRhWVFpkc"

describe('POST /banking/transfer', () => {
    
    it('should throw error when receipient Id matches sender Id', async () => {
        const res = await request(app.app)
        .post('/banking/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 100,
            receipient_id: 1
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Cannot transfer to self")
    })
    
    it('should throw error when invalid receipient Id is passed', async () => {
        const res = await request(app.app)
        .post('/banking/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 100,
            receipient_id: 20
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Receipient not found")
    })

    it('should throw error for amount less than 100', async () => {
        const res = await request(app.app)
        .post('/banking/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 50,
            receipient_id: 2
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Amount must be greater than 100")
    })

    it('should throw error for insufficient balance', async () => {
        const res = await request(app.app)
        .post('/banking/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 1000000,
            receipient_id: 2
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Insufficient balance")
    })

    it('should be successful', async () => {
        const res = await request(app.app)
        .post('/banking/transfer')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 200,
            receipient_id: 2
        });
        expect(res.status).toEqual(200);
    })

})

describe('POST /banking/fund', () => {

    it('should throw error for amount less than 100', async () => {
        const res = await request(app.app)
        .post('/banking/fund')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 50,
            method: "card"
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Amount must be greater than 100")
    })

    it('should be successful', async () => {
        const res = await request(app.app)
        .post('/banking/fund')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 200,
            method: "card"
        });
        expect(res.status).toEqual(200);
    })

})

describe('POST /banking/withdraw', () => {

    it('should throw error for amount less than 100', async () => {
        const res = await request(app.app)
        .post('/banking/withdraw')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 50,
            destination_bank: "first bank",
            destination_account_number: "3847563847"
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Amount must be greater than 100")
    })

    it('should throw error for insufficient balance', async () => {
        const res = await request(app.app)
        .post('/banking/withdraw')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 1000000,
            destination_bank: "first bank",
            destination_account_number: "3847563847"
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Insufficient balance")
    })

    it('should be successful', async () => {
        const res = await request(app.app)
        .post('/banking/withdraw')
        .set('Authorization', `Bearer ${token}`)
        .send({
            amount: 200,
            destination_bank: "first bank",
            destination_account_number: "3847563847"
        });
        expect(res.status).toEqual(200);
    })

})