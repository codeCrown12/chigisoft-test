# CHIGISOFT TASK

### HOW TO SET UP LOCALLY
- Set up your MySQL database using either XAMPP or WAMPP.
- Set your DATABASE_URL in your env file and it should follow this format "mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME".

**Note:** For easy set up of your environment variables, create your ".env" file and copy the values from the ".env.example" file created and paste there, and then just add/modify values as you see fit.

- Run the command below to install dependencies.
```bash
npm ci # install dependencies
```
- Next run the command below to generate the db client, create an SQL migration file, and run the migration file against the database.
```bash
npx prisma migrate dev --name init
```
- Finally run the command below to start the development server
```bash
npm run dev 
# You should see the messages below
# 2023-11-15 22:07:23:723 [info]: 📡 [server]: Server is running @ http://localhost:${PORT}
# 2023-11-15 22:07:23:723 [info]: 🛢️ [Database]: Database connected
```