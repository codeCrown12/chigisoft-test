import { app } from "../src/index"
import request from "supertest"

describe('POST /auth/register', () => {

    it('should throw error when email is already taken', async () => {
        const res = await request(app.app)
        .post('/auth/register')
        .send({
            email: "johnwick@gmail.com",
            username: "spiderwick",
            password: "1234"
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Email already taken")
    })

    it('should throw error when username is already taken', async () => {
        const res = await request(app.app)
        .post('/auth/register')
        .send({
            email: "spiderman@gmail.com",
            username: "johnwick",
            password: "1234"
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Username already taken")
    })

})

describe('POST /auth/login', () => {

    it('should throw error when email is invalid', async () => {
        const res = await request(app.app)
        .post('/auth/login')
        .send({
            email: "spiderman@gmail.com",
            password: "1234"
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Invalid credentials")
    })

    it('should throw error when password is invalid', async () => {
        const res = await request(app.app)
        .post('/auth/login')
        .send({
            email: "johnwick@gmail.com",
            password: "wrongpassword"
        });
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Invalid credentials")
    })

})