import { useId, useState } from "react";
import { UserMessage, MessageType } from "@rommate/types/messages";
function Chat() {
	const [input, setInput] = useState("");
	const messageInput = useId();
	let messages: UserMessage[] = [];

	return (
		<div>
			<h1>Chat</h1>
			<div id="chat">
				{messages.map((message) => (
					<div className="message" key={message.id}>
						<p>{message.userId}</p>
						<p>{message.timestamp.toISOString()}</p>
						<p>{message.content}</p>
					</div>
				))}
				<div id="inputWrapper">
					<input
						id={messageInput}
						placeholder="Type a message"
						onChange={(e) => setInput(e.target.value)}
					/>
					<button
						id="sendButton"
						onClick={(e) => {
							const message: UserMessage = {
								id: "123",
								type: MessageType.USER,
								userId: "test",
								content: input,
								timestamp: new Date(),
							};
							messages.push();
						}}>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}

export default Chat;
