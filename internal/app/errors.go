package app

import "errors"

var (
	ErrorUserCreate     = errors.New("error user create")
	ErrorUserExists     = errors.New("user already exists")
	ErrorUserValidation = errors.New("error user validation")
)
