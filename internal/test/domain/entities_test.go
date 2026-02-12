package domain

import (
	"roommate/internal/domain/entities"
	"testing"
)

func TestUserValidate(t *testing.T) {
	good := &entities.User{
		ID:           1,
		Username:     "qwe",
		PasswordHash: "01234567890123456789", // 20 chars for example
	}

	if err := good.Validate(); err != nil {
		t.Errorf("Error for good case: %v", err)
	} else {
		t.Logf("Test passed")
	}

	bad := &entities.User{
		ID:           2,
		Username:     "",
		PasswordHash: "short",
	}

	if err := bad.Validate(); err == nil {
		t.Errorf("Error for bad case: %v", err)
	} else {
		t.Logf("Test passed")
	}
}
