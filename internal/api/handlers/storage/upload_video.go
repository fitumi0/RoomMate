package storage

import (
	"encoding/json"
	"net/http"
)

func (h *StorageHandler) UploadVideo(w http.ResponseWriter, r *http.Request) {
	// TODO: idk how neccessary is it will be without transcoding
	w.WriteHeader(http.StatusNotImplemented)
	json.NewEncoder(w).Encode(501)
}
