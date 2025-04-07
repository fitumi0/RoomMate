package storage

import (
	"roommate/internal/services/storage"
)

// StorageHandler handles all storage-related HTTP requests
type StorageHandler struct {
	storageService *storage.StorageService
}

// NewStorageHandler creates a new storage handler
func NewStorageHandler(storageService *storage.StorageService) *StorageHandler {
	return &StorageHandler{
		storageService: storageService,
	}
}
