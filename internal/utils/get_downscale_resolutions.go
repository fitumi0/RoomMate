package utils

import "roommate/internal/types"

// GetDownscaleResolutions returns a list of target resolutions
func GetDownscaleResolutions(originalWidth, originalHeight int) []types.Resolution {
	// from 4k to 144p (height)
	targetWidths := []int{3840, 2560, 1920, 1280, 854, 640, 426, 256}

	resolutions := make([]types.Resolution, 0)

	aspectRatio := float64(originalWidth) / float64(originalHeight)

	for _, targetWidth := range targetWidths {
		if targetWidth >= originalWidth {
			continue
		}

		targetHeight := int(float64(targetWidth) / aspectRatio)

		if targetHeight%2 != 0 {
			targetHeight++
		}

		resolutions = append(resolutions, types.Resolution{
			Width:  targetWidth,
			Height: targetHeight,
		})
	}

	return resolutions
}
