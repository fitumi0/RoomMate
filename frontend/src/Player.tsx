import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import {
	MediaPlayer,
	MediaPlayerInstance,
	MediaProvider,
} from "@vidstack/react";
import {
	defaultLayoutIcons,
	DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { useEffect, useRef } from "react";
import socket from "./sockets/socket.js";
import { PlayerState } from "@rommate/types/player";

function Player({ src, thumbnails }: { src: string; thumbnails: string }) {
	const player = useRef<MediaPlayerInstance>(null);

	useEffect(() => {
		const currentPlayer = player.current!;

		const handlePlayerStateChanged = (playerState: PlayerState) => {
			currentPlayer.currentTime = playerState.currentTime;
			currentPlayer.paused = playerState.paused;
			currentPlayer.playbackRate = playerState.playbackRate;
		};

		socket.on("playerStateChanged", handlePlayerStateChanged);

		currentPlayer.subscribe(({ seeking, paused }) => {
			if (!seeking) {
				const state: PlayerState = {
					currentTime: currentPlayer.currentTime,
					paused: paused,
					playbackRate: currentPlayer.playbackRate,
				};

				socket.emit("playerStateChanged", {
					roomId: 1,
					playerState: state,
				});
			}
		});

		return () => {
			socket.off("playerStateChanged", handlePlayerStateChanged);
		};
	}, []);

	return (
		<MediaPlayer ref={player} title="" src={src} id="player">
			<MediaProvider />
			<DefaultVideoLayout
				id="layout"
				thumbnails={thumbnails}
				icons={defaultLayoutIcons}
			/>
		</MediaPlayer>
	);
}

export default Player;
