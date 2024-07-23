import Fastify from "fastify";
import routes from "./routes/api";
import * as dotenv from "dotenv";
import fastifyPostgres from "@fastify/postgres";
dotenv.config();

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifyPostgres, {
	connectionString: dotenv.config().parsed?.DATABASE_CONNECTION_STRING,
});

fastify.register(routes);

fastify.listen({ port: 8080 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
