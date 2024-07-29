import { FastifyInstance, FastifyRequest } from "fastify";
import DBService from "../services/db.service";
import FSService from "../services/fs.service";
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify: FastifyInstance, options: object) {
	const dbService = new DBService();
	const videoService = new FSService();

	// #region Rooms
	fastify.get(
		"/api/public-rooms",
		async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
			reply.send(await dbService.getPublicRooms());
		}
	);

	fastify.get("/api/all-rooms", async (request, reply) => {});

	// Create Room
	fastify.post("/api/room", async (request, reply) => {});

	// Get Room
	fastify.get(
		"/api/room/:id",
		async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
			reply.send(await dbService.getRoom(request.params.id));
		}
	);

	// Update Room
	fastify.patch("/api/room/:id", async (request, reply) => {});

	// Delete Room
	fastify.delete("/api/room/:id", async (request, reply) => {});

	// #endregion

	fastify.get("/api/videos", async (request, reply) => {
		const videoExtensionsRegex = /\.(mp4|webm|ogg)$/i;

		reply.send(videoService.getVideos(videoExtensionsRegex));
	});

	fastify.get(
		"/api/video/:name",
		async (
			request: FastifyRequest<{ Params: { name: string } }>,
			reply
		) => {
			const range = request.headers.range;
			const name = request.params.name;

			const fileSize = videoService.getVideoInfo(name)!.size;

			if (!videoService.videoExists(name)) {
				reply.code(404).send("Video not found");
			}

			if (!range) {
				const video = videoService.getVideo(name);
				const head = {
					"Content-Length": fileSize,
					"Content-Type": "video/mp4",
				};

				reply.code(200).headers(head).send(video);

				return reply;
			}

			const chunk = videoService.getVideoChunk(name, range);
			const [start, end] = videoService.getChunkRange(range, fileSize);

			const head = {
				"Content-Range": `bytes ${start}-${end}/${fileSize}`,
				"Accept-Ranges": "bytes",
				"Content-Length": end - start + 1,
				"Content-Type": "video/mp4",
			};

			reply.code(206).headers(head).send(chunk);
			return reply;
		}
	);
}

export default routes;
