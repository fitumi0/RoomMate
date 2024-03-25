export interface IMessage {
  id?: string;
  roomId: string;
  senderId?: string;
  senderName?: string;
  text: string;
  date: Date;
}
