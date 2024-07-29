import postgres from "postgres";
import * as dotenv from "dotenv";
dotenv.config();

const sql = postgres(dotenv.config().parsed!.DATABASE_CONNECTION_STRING);

export default sql;
