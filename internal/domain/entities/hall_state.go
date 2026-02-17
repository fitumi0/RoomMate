package entities

import (
	"time"

	"roommate/internal/domain"
)

type PlaybackState string

const (
	PlaybackStatePlaying   PlaybackState = "playing"
	PlaybackStateBuffering PlaybackState = "buffering"
	PlaybackStateSyncing   PlaybackState = "syncing"
	PlaybackStatePaused    PlaybackState = "paused"
)

type HallState struct {
	HallID         int
	MediaID        string // TODO: ??
	State          PlaybackState
	BasePositionMS int64
	Rate           float64 // Playback rate (default 1.0)
	ChangedAt      time.Time
	InitiatorID    int // ID of the user who triggered the state change TODO: probably not needed, but change ID type
}

func (s *HallState) Validate() error {
	if s == nil {
		return domain.ErrorEmptyStructure
	}

	// TODO: implement

	return nil
}
