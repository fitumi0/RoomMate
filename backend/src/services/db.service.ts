import sql from "./db";
import { type Room } from "@roommate/room";

class DBService {
	constructor() {}
	public async getPublicRooms() {
		return sql`SELECT * FROM "Room" WHERE public IS TRUE`;
	}

	public async getRoom(id: string) {
		return sql`SELECT * FROM "Room" WHERE id = ${id} LIMIT 1`;
	}

	public async createRoom(room: Room) {}

	public async updateRoom(room: Room) {}

	public async deleteRoom(id: string) {}

	public async getVideos() {}
}

export default DBService;
