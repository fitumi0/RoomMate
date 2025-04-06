package storage

import (
	"github.com/minio/minio-go/v7"
	"gorm.io/gorm"
)

// StorageRepository
type StorageRepository struct {
	db          *gorm.DB
	minioClient *minio.Client
}

// NewStorageRepository creates a new storage repository
func NewStorageRepository(db *gorm.DB, minioClient *minio.Client) *StorageRepository {
	return &StorageRepository{
		db:          db,
		minioClient: minioClient,
	}
}
