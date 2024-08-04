import { FastifyInstance, FastifyRequest } from "fastify";
// import DBService from "../services/noorm/db.service"; -> need to be updated
import DBService from "../services/orm/db.service";
import FSService from "../services/fs.service";
import ThumbnailsService from "../services/thumbnails.service";
import { Room } from "@roommate/models/IRoom";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify: FastifyInstance, options: object) {
	const dbService = new DBService();
	const videoService = new FSService();
	const thumbnailsService = new ThumbnailsService();

	// #region Rooms

	// Create Room
	fastify.post(
		"/api/room/:name/:isPublic?",
		{
			schema: {
				params: {
					type: "object",
					properties: {
						name: { type: "string" },
						// it is necessary to be boolean cast type, else it will be string
						isPublic: { type: "boolean" },
					},
				},
			},
		},
		async (
			request: FastifyRequest<{
				Params: { name: string; isPublic?: boolean };
			}>,
			reply
		) => {
			if (!request.params.name) {
				reply
					.code(400)
					.send(`Name is required, ${request.params.name}`);
				return;
			}

			reply.send(
				await dbService.createRoom(
					request.params.name,
					request.params.isPublic ?? false
				)
			);
		}
	);

	// Get Room(s)
	fastify.get(
		"/api/rooms/:id?",
		async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
			if (!request.params.id) {
				reply.send(await dbService.getPublicRooms());
				return;
			}

			if (request.params.id === "all") {
				reply.send(await dbService.getAllRooms());
				return;
			}

			reply.send(await dbService.getRoom(request.params.id));
		}
	);

	// Update Room
	fastify.patch("/api/room/:id", async (request, reply) => {
		reply.send(await dbService.updateRoom(request.body as Room));
	});

	// Delete Room
	fastify.delete(
		"/api/room/:id",
		async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
			reply.send(await dbService.deleteRoom(request.params.id));
		}
	);

	// #endregion

	// #region Videos

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

	fastify.get(
		"/api/thumbnails/:name/thumbnails:ext",
		async (
			request: FastifyRequest<{ Params: { name: string; ext: string } }>,
			reply
		) => {
			switch (request.params.ext) {
				case ".jpg":
					reply
						.code(200)
						.send(
							await thumbnailsService.getVideoThumbnailsFile(
								request.params.name,
								"jpg"
							)
						);
					break;
				case ".vtt":
					reply
						.code(200)
						.send(
							await thumbnailsService.getVideoThumbnailsFile(
								request.params.name,
								"vtt"
							)
						);
					break;
				default:
					reply.code(404).send("Not found");
			}

			return reply;
		}
	);

	// #endregion
}

export default routes;
