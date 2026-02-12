package domain

import "errors"

// TODO: как будто бы это полная хуйня и надо сделать по другому

var (
	ErrorNotFound                  = errors.New("not found")
	ErrorEmptyStructure            = errors.New("empty structure")
	ErrorIncorrectPassword         = errors.New("incorrect password")
	ErrorIncorrectUsername         = errors.New("incorrect username")
	ErrorIncorrectUserStatus       = errors.New("incorrect user status")
	ErrorIncorrectIdentifier       = errors.New("incorrect identifier")
	ErrorIncorrectHallTitle        = errors.New("incorrect hall title")
	ErrorIncorrectHallCode         = errors.New("incorrect hall code")
	ErrorIncorrectHallStatus       = errors.New("incorrect hall status")
	ErrorIncorrectHallVisibility   = errors.New("incorrect hall visibility")
	ErrorIncorrectHallCapacity     = errors.New("incorrect hall capacity")
	ErrorIncorrectSyncVersion      = errors.New("incorrect sync version")
	ErrorIncorrectMemberRole       = errors.New("incorrect member role")
	ErrorIncorrectPlaybackState    = errors.New("incorrect playback state")
	ErrorIncorrectPlaybackPosition = errors.New("incorrect playback position")
	ErrorIncorrectPlaybackRate     = errors.New("incorrect playback rate")
	ErrorIncorrectMediaIdentifier  = errors.New("incorrect media identifier")
	ErrorIncorrectTokenHash        = errors.New("incorrect token hash")
	ErrorIncorrectTokenExpiry      = errors.New("incorrect token expiry")
)
