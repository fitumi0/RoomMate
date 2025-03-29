package room

import "github.com/go-playground/validator/v10"

type GetRoomRequest struct {
	ID uint64 `json:"id" validate:"required"`
}

type GetRoomResponse struct {
	ID uint64
}

func (r *GetRoomRequest) Validate() error {
	return validator.New().Struct(r)
}
