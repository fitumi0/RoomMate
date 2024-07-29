export interface Room {
	id: string;
	name: string;
	public: boolean;
	createdAt: Date;
	updatedAt: Date;
	deleted: boolean;
	deletedAt: Date;
}
