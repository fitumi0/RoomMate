import fs, { Stats } from "fs";
import path from "path";

class FSService {
	public static videoPath = path.join(
		__dirname,
		"../",
		"../",
		"../",
		"videos"
	);

	constructor() {}

	private getVideoPath(name: string) {
		return path.join(FSService.videoPath, name);
	}

	public getVideos(filter: RegExp = /.mp4/) {
		return fs
			.readdirSync(FSService.videoPath)
			.filter((file) => filter.test(file));
	}

	public getVideoInfo(name: string): Stats | null {
		if (!this.videoExists(name)) {
			return null;
		}

		return fs.statSync(this.getVideoPath(name));
	}

	public videoExists(name: string) {
		return fs.existsSync(this.getVideoPath(name));
	}

	public getVideo(name: string) {
		const filePath = this.getVideoPath(name);

		if (!this.videoExists(name)) {
			return null;
		}

		return fs.createReadStream(filePath);
	}

	public getChunkRange(range: string, fileSize: number): [number, number] {
		const parts = range.replace(/bytes=/, "").split("-");
		const start = parseInt(parts[0], 10);
		const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

		return [start, end];
	}

	public getVideoChunk(name: string, range: string) {
		if (range === undefined) {
			return this.getVideo(name);
		}

		const [start, end] = this.getChunkRange(
			range,
			this.getVideoInfo(name)!.size
		);
		const filePath = this.getVideoPath(name);

		return fs.createReadStream(filePath, {
			start: Number(start),
			end: Number(end),
		});
	}
}

export default FSService;
