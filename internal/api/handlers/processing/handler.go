package processing

import (
	"roommate/internal/services/processing"
	"roommate/internal/services/storage"
)

// ProcessingHandler handles all processing-related HTTP requests
type ProcessingHandler struct {
	processingService *processing.ProcessingService
	storageService    *storage.StorageService
}

// NewProcessingHandler creates a new processing handler
func NewProcessingHandler(processingService *processing.ProcessingService, storageService *storage.StorageService) *ProcessingHandler {
	return &ProcessingHandler{
		processingService: processingService,
		storageService:    storageService,
	}
}
