package processing

import (
	"roommate/internal/repository/processing"
	"roommate/internal/repository/storage"
)

type ProcessingService struct {
	processingRepository *processing.ProcessingRepository
	storageRepository    *storage.StorageRepository
}

func NewProcessingService(processingRepository *processing.ProcessingRepository, storageRepository *storage.StorageRepository) *ProcessingService {
	return &ProcessingService{processingRepository: processingRepository, storageRepository: storageRepository}
}
