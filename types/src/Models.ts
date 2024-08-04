export interface Room {
	id: string;
	name: string;
	public: boolean;
	createdAt: Date;
	updatedAt: Date;
	deleted: boolean;
	deletedAt: Date;
}

export interface User {
	id: string;
	username: string;
	name: string;
	passwordHash: string;
	email: string;
	registrationDate: Date;
	dateModified: Date;
	token: string;
	deleted: boolean;
}
