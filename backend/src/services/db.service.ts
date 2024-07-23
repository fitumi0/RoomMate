import { FastifyInstance } from "fastify";

class DBService {
	private fastify: FastifyInstance;

	constructor(fastify: FastifyInstance) {
		this.fastify = fastify;
	}

	private async getClient() {
		return await this.fastify.pg.connect();
	}

	public async getPublicRooms() {
		const client = await this.getClient();
		try {
			const result = await client.query(
				'SELECT * FROM "Room" WHERE public IS TRUE'
			);
			return result.rows;
		} catch (err) {
			throw err;
		} finally {
			client.release();
		}
	}

	// Добавьте другие методы для работы с базой данных здесь
}

export default DBService;
