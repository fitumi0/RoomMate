package entities

import (
	"time"

	"roommate/internal/domain"
)

type PlaybackState string

const (
	PlaybackStatePlaying PlaybackState = "playing"
	PlaybackStatePaused  PlaybackState = "paused"
)

type HallPlaybackState struct {
	HallID          int
	MediaID         string
	State           PlaybackState
	BasePositionMS  int64
	Rate            float64
	ChangedAt       time.Time
	UpdatedByUserID int
}

func (s *HallPlaybackState) Validate() error {
	if s == nil {
		return domain.ErrorEmptyStructure
	}

	// TODO: implement

	return nil
}
