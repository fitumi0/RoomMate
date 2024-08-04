import ffmpeg from "ffmpeg";
import ffprobe from "ffprobe";
import ffprobeStatic from "ffprobe-static";
import path from "path";
import fs from "fs";
import FSService from "./fs.service";

class ThumbnailsService {
	constructor() {}

	private getPath(name: string) {
		const p = path.join(FSService.videoPath, name);

		if (!fs.existsSync(p)) {
			fs.mkdirSync(p, { recursive: true });
		}

		return p;
	}

	private getFilePath(name: string) {
		return path.join(FSService.videoPath, name);
	}

	private getVideoPath(name: string) {
		return path.join(FSService.videoPath, name);
	}

	private formatTime(seconds: number) {
		const date = new Date(seconds * 1000);
		const hours = String(date.getUTCHours()).padStart(2, "0");
		const minutes = String(date.getUTCMinutes()).padStart(2, "0");
		const secs = String(date.getUTCSeconds()).padStart(2, "0");
		const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
		return `${hours}:${minutes}:${secs}.${milliseconds}`;
	}

	public async getVideoThumbnailsFile(name: string, ext: string) {
		switch (ext) {
			case "jpg":
				if (
					!fs.existsSync(
						this.getFilePath(
							`${name.split(".")[0]}-thumbnails/thumbnails.jpg`
						)
					)
				) {
					await this.createVideoThumbnails(name);
				}

				return fs.createReadStream(
					this.getFilePath(
						`${name.split(".")[0]}-thumbnails/thumbnails.jpg`
					)
				);
			case "vtt":
				if (
					!fs.existsSync(
						this.getFilePath(
							`${name.split(".")[0]}-thumbnails/thumbnails.vtt`
						)
					)
				) {
					await this.createVideoThumbnails(name);
				}

				return fs.createReadStream(
					this.getFilePath(
						`${name.split(".")[0]}-thumbnails/thumbnails.vtt`
					)
				);
			default:
				return null;
		}
	}

	public async createVideoThumbnails(name: string): Promise<void> {
		const thumbnailsDir = this.getPath(`${name.split(".")[0]}-thumbnails/`);
		const thumbnailsFileName = thumbnailsDir + `thumbnails.jpg`;
		const vttFile = path.join(thumbnailsDir, "thumbnails.vtt");
		const video = this.getVideoPath(name);

		const process = new ffmpeg(video);

		const imageHeight = 160;
		let aspectRatio!: number;
		let imageWidth!: number;
		let rows: number = 10;
		let cols!: number;
		let frames!: number;
		let frequency!: number;

		new Promise((resolve, reject) => {
			ffprobe(video, { path: ffprobeStatic.path }, (err, data) => {
				if (err) {
					reject(err);
				}

				resolve(data);
			});
		}).then((data: any) => {
			aspectRatio = data.streams[0].width! / data.streams[0].height!;
		});

		await process
			.then((video) => {
				const videoLength = video.metadata.duration!.seconds;
				frequency = Math.max(videoLength * 0.0025, 10);

				imageWidth = Math.round(imageHeight * aspectRatio);
				frames = videoLength / frequency;
				rows = 10;
				cols = Math.max(Math.floor(frames / rows), 1);

				video.addCommand(
					"-vf",
					`fps=1/${frequency},scale=${imageWidth}:${imageHeight},tile=${rows}x${cols}`
				);
				video.addCommand("-y", thumbnailsFileName);
				video.addCommand("-q:v", `2`);
				video.save(thumbnailsFileName);
			})
			.catch((err) => {
				console.log(err);
			});

		const vttStream = fs.createWriteStream(vttFile);
		vttStream.write("WEBVTT\n\n");

		for (let i = 0; i < frames; i++) {
			vttStream.write(
				`${this.formatTime(i * frequency)} --> ${this.formatTime(
					(i + 1) * frequency
				)}\n`
			);

			const x = (i % rows) * imageWidth;
			const y = Math.floor(i / rows) * imageHeight;

			vttStream.write(
				`thumbnails.jpg#xywh=${x},${y},${imageWidth},${imageHeight}\n\n`
			);
		}

		vttStream.end();
	}
}

export default ThumbnailsService;
