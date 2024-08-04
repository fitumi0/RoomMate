import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL =
	process.env.NODE_ENV === "production"
		? undefined
		: process.env.REACT_APP_BASE_URL;
const socket = io(URL!, { transports: ["websocket"] });

export default socket;
