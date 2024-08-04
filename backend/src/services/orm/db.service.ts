import { PrismaClient, Room } from "@prisma/client";

class DBService {
	private prisma = new PrismaClient();
	constructor() {}

	// #region Users

	// #endregion

	// #region Rooms
	public async getPublicRooms() {
		return this.prisma.room.findMany({ where: { public: true } });
	}

	public async getAllRooms() {
		return this.prisma.room.findMany();
	}

	public async createRoom(name: string, isPublic: boolean = false) {
		return this.prisma.room.create({
			data: {
				name: name,
				public: isPublic,
			},
		});
	}

	public async getRoom(id: string) {
		return this.prisma.room.findUnique({ where: { id: id } });
	}

	public async updateRoom(room: Room) {
		return this.prisma.room.update({
			where: { id: room.id },
			data: room,
		});
	}

	public async markDeletedRoom(id: string) {
		return this.prisma.room.update({
			where: { id: id },
			data: { deleted: true },
		});
	}

	public async deleteRoom(id: string) {
		return this.prisma.room.delete({ where: { id: id } });
	}
	// #endregion

	// #region Messages

	// #endregion
}

export default DBService;
