export interface ChatMessages {
	id: string;
	roomId: string;
	senderId: string;
	timeSent: Date;
	content: string;
	// attachments: any;
}
