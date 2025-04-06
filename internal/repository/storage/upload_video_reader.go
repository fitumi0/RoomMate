package storage

import (
	"context"
	"io"

	"github.com/minio/minio-go/v7"
)

func (r *StorageRepository) UploadVideoReader(ctx context.Context, objectName string, reader io.Reader) error {
	bucketName := "transcoded"

	putOpts := minio.PutObjectOptions{
		ContentType: "video/mp4",
	}

	_, err := r.minioClient.PutObject(ctx, bucketName, objectName, reader, -1, putOpts)
	if err != nil {
		return err
	}

	return nil
}
