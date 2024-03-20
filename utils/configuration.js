import dotenv from 'dotenv';

dotenv.config();

const pwd = process.env.PASSWORD;
const dbusername = process.env.DB_USERNAME

export const PORT = process.env.PORT;

export const secret_key = process.env.SECRET_KEY;

export const dbConnStr = `mongodb+srv://${dbusername}:${pwd}@cluster0.z3afn56.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// betiniakarandut
// EzcuvLTT4gbA7JZF