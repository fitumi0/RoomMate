import { FastifyInstance, FastifyRequest } from "fastify";
import DBService from "../services/db.service";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify: FastifyInstance, options: object) {
	const dbService = new DBService(fastify);
	fastify.get(
		"/public-rooms",
		async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
			reply.send(await dbService.getPublicRooms());
		}
	);

	fastify.get(
		"/room/:id",
		async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
			return request.params.id;
		}
	);

	fastify.post("/create-room", async (request, reply) => {
		return request.body;
	});
}

export default routes;
