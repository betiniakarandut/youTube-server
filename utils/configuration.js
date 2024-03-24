import dotenv from 'dotenv';

dotenv.config();

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const encodedPassword = encodeURIComponent(dbPassword)


export const dbConnStr = `mongodb+srv://${process.env.DB_USERNAME}:${encodedPassword}@cluster0.z3afn56.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
