package processing

import (
	"gorm.io/gorm"
)

// ProcessingRepository
type ProcessingRepository struct {
	db *gorm.DB
}

// NewRoomRepository creates a new processing repository
func NewProcessingRepository(db *gorm.DB) *ProcessingRepository {
	return &ProcessingRepository{db: db}
}
