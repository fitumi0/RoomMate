import postgres from "postgres";
import { config } from "dotenv";

const sql = postgres(config().parsed!.DATABASE_URL);

export default sql;
