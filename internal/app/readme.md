# application

т.е. use-cases / services

Сервисы, берут интерфейсы из домена

<!-- TODO:
type HallMemberRepository interface{}

type HallPlaybackStateRepository interface{}

type RefreshTokenRepository interface{}
 -->

 <!-- 
 type HallHub struct {
    clients map[string]map[*Client]bool // hallID -> clients
    broadcast chan Event
    register chan *Client
    unregister chan *Client
}

type Client struct {
    hallID string
    conn   *websocket.Conn
    send   chan []byte
}

r.Get("/ws/hall/{id}", hall_handler.NewHallWSHandler(hallService).Handle)
  -->

