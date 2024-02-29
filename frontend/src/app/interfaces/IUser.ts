export interface IUser {
  id: string;
  username: string;
  name?: string;
  email: string;
  registrationDate?: Date;
  lastModified?: Date;
  token: string;
}
