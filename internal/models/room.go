package models

import (
	"time"

	"gorm.io/gorm"
)

type Room struct {
	ID          uint64    `gorm:"column:id;primary_key;type:GENERATED ALWAYS AS IDENTITY"`
	Title       string    `gorm:"column:title"`
	Description string    `gorm:"column:description"`
	CreatedAt   time.Time `gorm:"column:created_at;autoCreateTime"`
	UpdatedAt   time.Time `gorm:"column:updated_at;autoUpdateTime"`
	Public      bool      `gorm:"column:public"`
	Temporary   bool      `gorm:"column:temporary"`
	Deleted     bool      `gorm:"column:deleted"`
}

func (room *Room) Create(db *gorm.DB) (uint64, error) {
	tx := db.Model(room).Create(room)
	if tx.Error != nil {
		return 0, tx.Error
	}

	return room.ID, nil
}

func (room *Room) Update(db *gorm.DB) error {
	tx := db.Model(room).Where("id = ?", room.ID).Updates(room)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}

func (room *Room) Delete(db *gorm.DB) error {
	tx := db.Model(room).Update("deleted", true)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}

func (room *Room) Restore(db *gorm.DB) error {
	tx := db.Model(room).Update("deleted", false)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}

// Vanish is a full delete, instead of set tag deleted
func (room *Room) Vanish(db *gorm.DB) error {
	tx := db.Model(room).Delete(room)
	if tx.Error != nil {
		return tx.Error
	}

	return nil
}

func GetPublicRooms(db *gorm.DB) (*[]Room, error) {
	rooms := []Room{}
	tx := db.
		Model(&Room{}).
		Where("public = ?", true).
		Where("deleted = ?", false).
		Find(&rooms)

	if err := tx.Error; err != nil {
		return nil, err
	}

	return &rooms, nil
}

func GetAllRooms(db *gorm.DB) ([]Room, error) {
	rooms := []Room{}
	tx := db.Model(&Room{}).Where("deleted = ?", false).Find(&rooms)

	if tx.Error != nil {
		return nil, tx.Error
	}

	return rooms, nil
}

func (room *Room) Get(db *gorm.DB) (*Room, error) {
	result := db.First(room)
	if result.Error != nil {
		return nil, result.Error
	}

	return room, nil
}
