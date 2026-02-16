package user

import (
	app "roommate/internal/app/services/user"
)

type UserHandler struct {
	userService *app.UserService
}

func NewUserHandler(userService *app.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}
