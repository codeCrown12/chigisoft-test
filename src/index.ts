import App from "./app"
import AuthRoute from "./routes/auth.route"
import BankingRoute from "./routes/banking.route"

export const app = new App([
    new AuthRoute(),
    new BankingRoute()
])

app.listen()