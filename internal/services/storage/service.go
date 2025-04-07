package storage

import (
	"roommate/internal/repository/storage"
)

type StorageService struct {
	StorageRepository *storage.StorageRepository
}

func NewStorageService(storageRepository *storage.StorageRepository) *StorageService {
	return &StorageService{StorageRepository: storageRepository}
}
