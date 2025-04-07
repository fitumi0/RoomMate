package utils

import (
	"fmt"
	"io"
	"os/exec"
	"roommate/internal/types"
	"strconv"
	"strings"
)

// GetVideoInfo returns video info
func GetVideoInfo(r io.Reader) (*types.VideoInfo, error) {
	cmd := exec.Command(
		"ffprobe",
		"-v", "error",
		"-select_streams", "v:0",
		"-show_entries", "stream=width,height:format=duration,bit_rate",
		"-of", "csv=p=0",
		"-i", "pipe:0",
	)

	// Limit the input to 2MB.
	// TODO: failed to get video info: exit status 1
	// now idk how get info without loading the whole file
	cmd.Stdin = io.LimitReader(r, 2*1024*1024)

	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("failed to get video info: %w", err)
	}

	// Парсим вывод
	parts := strings.Split(
		strings.ReplaceAll(
			strings.TrimSpace(string(output)), "\r\n", ","),
		",",
	)

	if len(parts) < 4 {
		return nil, fmt.Errorf("unexpected output from ffprobe: %s", output)
	}

	width, err := strconv.Atoi(strings.TrimSpace(parts[0]))
	if err != nil {
		return nil, fmt.Errorf("failed to parse width: %w", err)
	}

	height, err := strconv.Atoi(strings.TrimSpace(parts[1]))
	if err != nil {
		return nil, fmt.Errorf("failed to parse height: %w", err)
	}

	duration, err := strconv.ParseFloat(strings.TrimSpace(parts[2]), 64)
	if err != nil {
		return nil, fmt.Errorf("failed to parse duration: %w", err)
	}

	bitrate, err := strconv.Atoi(strings.TrimSpace(parts[3]))
	if err != nil {
		return nil, fmt.Errorf("failed to parse bitrate: %w", err)
	}

	info := &types.VideoInfo{
		Width:           width,
		Height:          height,
		DurationSeconds: duration,
		BitrateKbit:     bitrate,
	}

	return info, nil
}
