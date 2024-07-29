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
