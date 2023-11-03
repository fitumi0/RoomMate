import psycopg2
import uuid
import datetime
import config

class RoomHelper:
    def __init__(self, dbname, user, password, host='localhost', port=5432):
        self.conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
        self.user_table = config.room_table
        self.cur = self.conn.cursor()

    def raw_execute(self, query, params=None):
        self.cur.execute(query, params)
        self.conn.commit()

    def add_room(self, room_name, room_capacity = 4, room_public = True):
        self.cur.execute(f"INSERT INTO {self.user_table} (id, name, public, capacity) VALUES (\'{uuid.uuid4()}\', \'{room_name}\', {room_public}, {room_capacity})")
        self.conn.commit()

    def delete_room(self, room_name):
        self.cur.execute(f"DELETE FROM {self.user_table} WHERE name=\'{room_name}\'")

    def update_room(self):
        pass

    def room_exists(self, room_name):
        self.cur.execute(f"SELECT name FROM {self.user_table} WHERE name=\'{room_name}\'")
        return len(self.cur.fetchall()) > 0

    def get_rooms(self):
        self.cur.execute(f"SELECT * FROM {self.user_table}")
        return self.cur.fetchall()
   

if __name__ == "__main__":
    db = RoomHelper(config.room_database, config.user, config.password)
    rooms = db.get_rooms()
    print(rooms)