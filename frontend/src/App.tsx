import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Player from "./Player.js";
import socket from "./sockets/socket.js";
import Chat from "./components/Chat.js";

function App() {
	const base = process.env["REACT_APP_BASE_URL"];

	const [isConnected, setIsConnected] = useState(socket.connected);
	const [videosList, setData] = useState<string[]>([]);
	const [videoSrc, setVideoSrc] = useState<string>(``);
	const [videoThumbnails, setVideoThumbnails] = useState<string>(``);
	const [selectedVideo, setSelectedVideo] = useState<string>(`1080.mp4`);

	useEffect(() => {
		socket.on("connect", () => {
			setIsConnected(true);
		});

		socket.on("disconnect", () => {
			setIsConnected(false);
		});

		const handleSourceChanged = (source: string) => {
			setVideoSrc(source);
		};

		socket.on("sourceChanged", handleSourceChanged);

		return () => {
			socket.off("connect");
			socket.off("disconnect");
		};
	}, []);

	useEffect(() => {
		axios
			.get(`${base}/api/videos`)
			.then((response) => {
				setData(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	const handleVideoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedVideo(event.target.value);
	};

	async function handleConfirmClick() {
		const videoSource = `${base}/api/video/${selectedVideo}`;
		setVideoSrc(videoSource);
		setVideoThumbnails(
			`${base}/api/thumbnails/${selectedVideo}/thumbnails.vtt`
		);
		socket.emit("sourceChanged", { roomId: 1, source: videoSource });
	}

	let videos: JSX.Element[] = [];
	videosList.forEach((element) => {
		videos.push(
			<option key={element} value={element}>
				{element}
			</option>
		);
	});

	return (
		<div className="App">
			<header>RoomMate</header>

			<main>
				<label htmlFor="videos">Choose a video:</label>

				<select name="videos" id="videos" onChange={handleVideoChange}>
					{videos}
				</select>
				<button onClick={handleConfirmClick}>Confirm</button>
				<p>{isConnected ? "Connected" : "Not connected"}</p>
				<Player src={videoSrc} thumbnails={videoThumbnails}></Player>
				<Chat></Chat>
			</main>

			<footer>
				<a href="https://github.com/fitumi0/RoomMate">Github</a>
				<a href="http://t.me/fitumi_zero">Telegram</a>
			</footer>
		</div>
	);
}

export default App;
