import sql from "./db";
import { type Room } from "@roommate/models/IRoom";
import moment from "moment";
import { v4 as uuv4 } from "uuid";

class DBService {
	constructor() {}
	public async getPublicRooms() {
		return sql`SELECT * FROM "Room" WHERE public IS TRUE`;
	}

	public async getRoom(id: string) {
		return sql`SELECT * FROM "Room" WHERE id = ${id} LIMIT 1`;
	}

	public async createRoom(name: string, isPublic: boolean = false) {
		return sql`INSERT INTO "Room" VALUES (
        ${uuv4()}, 
        ${name}, 
        ${isPublic}, 
        ${moment().local(true).format()}, 
        ${null}, 
        ${false}, 
        ${null})`;
	}

	public async updateRoom(room: Room) {}

	public async deleteRoom(id: string) {}

	public async getVideos() {}
}

export default DBService;
