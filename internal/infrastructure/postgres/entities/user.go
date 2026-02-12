package entities

type PgUser struct {
	ID           int    `gorm:"column:id;primaryKey"`
	Username     string `gorm:"column:username;unique"`
	PasswordHash string `gorm:"column:password_hash;not null"`
}

func (u *PgUser) TableName() string {
	return "users"
}
