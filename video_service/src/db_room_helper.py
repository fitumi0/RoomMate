import sqlite3
import uuid
import datetime
import config

class RoomHelper:
    def __init__(self, dbname, room_table):
        self.conn = sqlite3.connect(dbname, check_same_thread=False)
        self.cur = self.conn.cursor()
        self.room_table = config.room_table

        self.cur.execute(f"""
            CREATE TABLE IF NOT EXISTS {room_table} (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT UNIQUE NOT NULL,
                public BOOLEAN NOT NULL,
                permanent BOOLEAN NOT NULL                
            )
            """)

    def raw_execute(self, query):
        self.cur.execute(query)
        self.conn.commit()

    def add_room(self, room_name, room_public = True, room_permanent = False):
        self.cur.execute(f"INSERT INTO {self.room_table} (name, public, permanent) VALUES (\'{room_name}\', {room_public}, {room_permanent})")
        self.conn.commit()

    def remove_room(self, room_name):
        self.cur.execute(f"DELETE FROM {self.room_table} WHERE name=\'{room_name}\'")
        self.conn.commit()
        

    def update_room(self, room_name, room_public, room_permanent):
        self.cur.execute(F"UPDATE {self.room_table} SET public = {room_public}, permanent = {room_permanent} WHERE name=\'{room_name}\'")
        self.conn.commit()

    def room_exists(self, room_name):
        self.cur.execute(f"SELECT name FROM {self.room_table} WHERE name=\'{room_name}\' LIMIT 1")
        return len(self.cur.fetchall()) > 0

    def get_rooms(self):
        self.cur.execute(f"SELECT name FROM {self.room_table}")
        return self.cur.fetchall()
   

if __name__ == "__main__":
    db = RoomHelper(config.root_database, config.room_table)