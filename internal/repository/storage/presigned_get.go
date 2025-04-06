package storage

import (
	"context"
	"net/url"
	"time"
)

func (r *StorageRepository) PresignedGet(ctx context.Context, bucketName string, objectName string) (*url.URL, error) {
	return r.minioClient.PresignedGetObject(ctx, bucketName, objectName, time.Minute*15, nil)
}
