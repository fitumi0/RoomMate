package room

import "github.com/go-playground/validator/v10"

type CreateRoomRequest struct {
	Title       string `json:"title" validate:"required,min=1,max=32"`
	Description string `json:"description" validate:"max=256"`
	Public      bool   `json:"public" validate:"required"`
}

type CreateRoomResponse struct {
	ID uint64
}

func (r *CreateRoomRequest) Validate() error {
	return validator.New().Struct(r)
}
