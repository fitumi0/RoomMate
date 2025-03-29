package room

import "github.com/go-playground/validator/v10"

type CreateRoomRequest struct {
	Title       string `json:"title" validate:"required"`
	Description string `json:"description"`
}

type CreateRoomResponse struct {
	ID uint64
}

func (r *CreateRoomRequest) Validate() error {
	return validator.New().Struct(r)
}
