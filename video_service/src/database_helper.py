import psycopg2
import uuid
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class UserHelper:
    def __init__(self, dbname, user, password, host='localhost', port=5432):
        self.conn = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
        self.user_table = "\"UserServiceSchema\".\"user\""
        self.cur = self.conn.cursor()

    def raw_execute(self, query, params=None):
        self.cur.execute(query, params)
        self.conn.commit()

    def change_user_full_name(self, first_name, last_name, username):
        self.cur.execute(f"UPDATE {self.user_table} SET first_name = %s, last_name = %s WHERE username = %s", 
                         (first_name, last_name, username))
        self.conn.commit()

    def change_user_email(self, email, username):
        self.cur.execute(f"UPDATE {self.user_table} SET email = %s WHERE username = %s", 
                         (email, username))
        self.conn.commit()

    def change_user_username(self, new_username, username):
        self.cur.execute(f"UPDATE {self.user_table} SET username = %s WHERE username = %s", 
                         (new_username, username))
        self.conn.commit()
    
    def register_user(self, username, email, password):
        self.cur.execute(f"INSERT INTO {self.user_table} (id, username, registration_date, email, password) VALUES (%s, %s, %s, %s, %s)", 
                         (str(uuid.uuid4()), username, datetime.datetime.now(), email, generate_password_hash(password, method='scrypt')))
        self.conn.commit()

    def username_is_free(self, username):
        self.cur.execute(f"SELECT username FROM {self.user_table} WHERE username='{username}'")
        self.conn.commit()

        if (len(self.cur.fetchall()) == 1):
            return False

        return True

    def email_is_free(self, email):
        self.cur.execute(f"SELECT email FROM {self.user_table} WHERE email='{email}'")
        self.conn.commit()

        if (len(self.cur.fetchall()) == 1):
            return False

        return True

if __name__ == "__main__":
    db = UserHelper("RoomMate_db", "postgres", "admin")
    print(db.username_is_free("fitumi0"))
    # db.raw_execute("SELECT password FROM \"UserServiceSchema\".\"user\"")
    # print(check_password_hash())
    # db.register_user("Anton", "Червяков", "fitumi0", datetime.datetime.now(), "fitumi@gmail.com", "abu_bandit", 1)
    # db.change_user_username("neprtn", "_neprtn")
    # db.change_user_email("masha@gmail.com", "neprtn")
    pass