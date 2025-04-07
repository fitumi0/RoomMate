package processing

import (
	"encoding/json"
	"log"
	"net/http"
)

func (h *ProcessingHandler) TranscodeAndUploadVideo(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}

	file, handler, err := r.FormFile("video")
	if err != nil {
		http.Error(w, "Unable to retrieve file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	errTranscode := h.processingService.TranscodeVideo(r.Context(), file, handler.Filename)
	if errTranscode != nil {
		log.Printf("Failed to transcode video: %v", errTranscode)
		http.Error(w, "Failed to transcode video", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w)
}
