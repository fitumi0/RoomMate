import { FastifyInstance } from "fastify";
import { Server } from "socket.io";
import fp from "fastify-plugin";
import { type PlayerState } from "@roommate/player/IPlayerState";

async function fastifySockets(fastify: FastifyInstance, options: object) {
	const io = new Server(fastify.server, {
		cors: { origin: process.env.FRONT_URL },
	});

	io.on("connection", (socket) => {
		fastify.log.info(`User connected, ${socket.id}`);

		socket.on("disconnect", () => {
			fastify.log.info(`User disconnected, ${socket.id}`);
		});

		socket.on("joinRoom", async (roomId) => {
			socket.join(roomId);
			socket.to(roomId).emit("user-connected", socket.id);
		});

		// #region Player State Events

		socket.on(
			"sourceChanged",
			async (data: { roomId: string; source: string }) => {
				socket./*to(roomId).*/ broadcast.emit(
					"sourceChanged",
					data.source
				);
			}
		);

		socket.on(
			"playerStateChanged",
			(data: { roomId: string; playerState: PlayerState }) => {
				socket./*to(roomId).*/ broadcast.emit(
					"playerStateChanged",
					data.playerState
				);
			}
		);

		// #endregion
	});

	fastify.decorate("io", io);
}

const sockets = fp(fastifySockets);

export default sockets;
