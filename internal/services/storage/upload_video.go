package storage

import (
	"context"
	"errors"
	"io"
	"net/url"
)

func (s *StorageService) UploadVideo(ctx context.Context, filename string, video io.Reader, filesize int64) (*url.URL, error) {
	if filesize == 0 {
		return nil, errors.New("file size cannot be zero")
	}

	bucketName := "uploads"

	err := s.StorageRepository.UploadFile(ctx, bucketName, filename, video, filesize)
	if err != nil {
		return nil, err
	}

	url, err := s.StorageRepository.PresignedGet(ctx, bucketName, filename)
	if err != nil {
		return nil, err
	}

	return url, nil
}
