package models

import (
	"time"

	"gorm.io/gorm"
)

type Room struct {
	ID          uint64    `gorm:"column:id;primary_key;auto_increment"`
	Title       string    `gorm:"column:title"`
	Description string    `gorm:"column:description"`
	CreatedAt   time.Time `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt   time.Time `gorm:"column:updated_at;autoUpdateTime"`
	IsTemporary bool      `gorm:"column:is_temporary"`
}

func (room *Room) Create(db *gorm.DB) error {
	tx := db.Model(room).Create(room)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}
