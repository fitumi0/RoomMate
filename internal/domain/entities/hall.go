package entities

import (
	"strings"
	"time"

	"roommate/internal/domain"
)

type HallStatus string

const (
	HallStatusOpen  HallStatus = "open"
	HallStatusLive  HallStatus = "live"
	HallStatusEnded HallStatus = "ended"
)

type HallVisibility string

const (
	HallVisibilityPublic      HallVisibility = "public"
	HallVisibilityPrivate     HallVisibility = "private"
	HallVisibilityFriendsOnly HallVisibility = "friends-only"
)

// HallType enum
const (
	HallAnonymous = iota
	HallUser
	HallSystem
)

// TODO: sync with PgHall
type Hall struct {
	ID          int    `json:"id"`
	Title       string `json:"title,omitempty"` // Hall title (e.g. Interstellar)
	Description string `json:"description,omitempty"`
	// TODO: provide Schedule info

	// System
	Type       uint8          `json:"type"`                 // Hall type ref
	TTL        uint64         `json:"ttl,omitempty"`        // For anonymous type
	Code       string         `json:"code,omitempty"`       // Access code (PIN) if provided
	OwnerID    int64          `json:"owner_id,omitempty"`   // Owner ID -1 for System, 0 for anon
	Status     HallStatus     `json:"status,omitempty"`     // Hall status ref
	Visibility HallVisibility `json:"visibility,omitempty"` // Hall visibility ref
	MaxMembers uint16         `json:"max_members,omitempty"`

	SyncVersion int64 `json:"sync_version,omitempty"` // NA

	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`
}

func (h *Hall) Validate() error {
	if h == nil {
		return domain.ErrorEmptyStructure
	}

	title := strings.TrimSpace(h.Title)

	if len(title) < 3 { // TODO: мб изменить на регулярку
		return domain.ErrorIncorrectHallTitle
	}

	if h.Code != "" && len(strings.TrimSpace(h.Code)) < 4 {
		return domain.ErrorIncorrectHallCode
	}

	// Пока так, ибо пользователю будет мало что доступно к заполнению

	// if h.Status != "" && h.Status != HallStatusOpen && h.Status != HallStatusLive && h.Status != HallStatusEnded {
	// 	return domain.ErrorIncorrectHallStatus
	// }

	// if h.Visibility != "" && h.Visibility != HallVisibilityPrivate && h.Visibility != HallVisibilityPublic {
	// 	return domain.ErrorIncorrectHallVisibility
	// }

	// if h.SyncVersion < 0 {
	// 	return domain.ErrorIncorrectSyncVersion
	// }

	// if h.OwnerUserID < 0 {
	// 	return domain.ErrorIncorrectIdentifier
	// }

	return nil
}

func (h *Hall) EffectiveTitle() string {
	return strings.TrimSpace(h.Title)
}

func (h *Hall) EffectiveMaxMembers() uint16 {
	return h.MaxMembers
}
