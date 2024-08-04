import Fastify from "fastify";
import path from "path";
import routes from "./routes/api";
import fastifyStatic from "@fastify/static";
import sockets from "./routes/sockets";
import fastifyCors from "@fastify/cors";

const fastify = Fastify({
	logger: true,
});

fastify.register(fastifyCors, {
	origin: true,
	methods: ["GET", "POST", "PATCH", "DELETE"],
});

// In future will be deleted and used nginx!
fastify.register(fastifyStatic, {
	root: path.join(__dirname, "../", "build"),
	prefix: "/",
});

fastify.register(routes);
fastify.register(sockets);

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
