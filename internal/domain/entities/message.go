package entities

// TODO: implement, скорее всего поменяются типы полей
type Message struct {
	ID     int
	UserID int
	HallID int
	Text   string
}

func (m *Message) Validate() error {
	return nil
}
