package room

import "github.com/go-playground/validator/v10"

type UpdateRoomRequest struct {
	ID          uint64 `json:"id" validate:"required"`
	Title       string `json:"title" validate:"min=1,max=32"`
	Description string `json:"description" validate:"max=256"`
	IsTemporary bool   `json:"is_temporary"`
}

type UpdateRoomResponse struct{}

func (r *UpdateRoomRequest) Validate() error {
	return validator.New().Struct(r)
}
