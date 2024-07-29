import Fastify from "fastify";
import path from "path";
import routes from "./routes/api";
import fastifyStatic from "@fastify/static";

import * as dotenv from "dotenv";
dotenv.config();

const fastify = Fastify({
	logger: true,
});

// cors
fastify.register(require("@fastify/cors"), {
	origin: true,
	methods: ["GET", "POST", "PATCH", "DELETE"],
});

// In future will be deleted and used nginx!
fastify.register(fastifyStatic, {
	root: path.join(__dirname, "../", "build"),
	prefix: "/",
});

fastify.register(routes);

fastify.get("/", async (request, reply) => {
	return reply.sendFile("index.html");
});

fastify.listen({ host: "0.0.0.0", port: 8080 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
