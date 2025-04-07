package storage

import (
	"context"
	"io"

	"github.com/minio/minio-go/v7"
)

func (r *StorageRepository) UploadFile(ctx context.Context, bucketName string, objectName string, file io.Reader, size int64) error {
	bucketExists, errExists := r.minioClient.BucketExists(ctx, bucketName)
	if errExists != nil {
		return errExists
	}

	makeBucketOpts := minio.MakeBucketOptions{}

	if !bucketExists {
		err := r.minioClient.MakeBucket(ctx, bucketName, makeBucketOpts)
		if err != nil {
			return err
		}
	}

	putOpts := minio.PutObjectOptions{
		DisableMultipart: false,
	}

	_, err := r.minioClient.PutObject(ctx, bucketName, objectName, file, size, putOpts)
	if err != nil {
		return err
	}
	return nil
}
