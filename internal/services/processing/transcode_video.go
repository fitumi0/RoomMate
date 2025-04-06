package processing

import (
	"context"
	"fmt"
	"io"
	"log"
	"os/exec"
	"roommate/internal/utils"
	"sync"
)

// TranscodeVideo transcodes a video into multiple resolutions and uploads them to S3
func (s *ProcessingService) TranscodeVideo(ctx context.Context, src io.Reader, filename string) error {
	videoInfo, err := utils.GetVideoInfo(src)
	if err != nil {
		log.Printf("Failed to get video info: %v", err)
		return err
	}

	resolutions := utils.GetDownscaleResolutions(videoInfo.Width, videoInfo.Height)

	var ffmpegArgs []string

	ffmpegArgs = append(ffmpegArgs, "-i", "pipe:0")
	for _, res := range resolutions {
		ffmpegArgs = append(ffmpegArgs,
			"-vf", fmt.Sprintf("scale=w=%d:h=%d", res.Width, res.Height),
			"-c:v", "libx264", "-preset", "superfast", "-crf", "28",
			"-f", "mp4", "pipe:1",
		)
	}

	cmd := exec.CommandContext(ctx, "ffmpeg", ffmpegArgs...)
	cmd.Stdin = src

	pipes := make([]*io.PipeReader, len(resolutions))
	writers := make([]*io.PipeWriter, len(resolutions))

	for i := range pipes {
		pipes[i], writers[i] = io.Pipe()
	}

	stdout, _ := cmd.StdoutPipe()

	go func() {
		defer func() {
			for _, w := range writers {
				w.Close()
			}
		}()

		buf := make([]byte, 32*1024)
		for {
			n, err := stdout.Read(buf)
			if err != nil {
				break
			}
			for _, w := range writers {
				w.Write(buf[:n])
			}
		}
	}()

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start ffmpeg: %w", err)
	}

	var wg sync.WaitGroup
	for i, pipeReader := range pipes {
		wg.Add(1)
		go func(i int, reader io.Reader) {
			defer wg.Done()
			outName := fmt.Sprintf("transcoded/%dx%d_%s", resolutions[i].Width, resolutions[i].Height, filename)
			err := s.storageRepository.UploadVideoReader(ctx, outName, reader)
			if err != nil {
				log.Printf("Failed to upload %s: %v", outName, err)
			}
		}(i, pipeReader)
	}

	wg.Wait()

	if err := cmd.Wait(); err != nil {
		return fmt.Errorf("ffmpeg failed: %w", err)
	}

	return nil
}
