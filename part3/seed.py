from app.persistence.repository import db
from app.models.user import User
from app import create_app, bcrypt

app = create_app()

with app.app_context():
    users = [
        User(
            id='36c9050e-ddd3-4c3b-9731-9f487208bbc1',
            first_name='Admin',
            last_name='HBnB',
            email='admin@hbnb.io',
            is_admin=True
        ),
        User(
            id='a57a3c3b-dc4e-4b3e-9c17-5bcb3a58c6b1',
            first_name='Admin',
            last_name='Two',
            email='admin2@hbnb.io',
            is_admin=True
        ),
        User(
            id='5fcf861a-85b1-4ef7-8b3f-2cb1e3e0ad12',
            first_name='User',
            last_name='One',
            email='user1@hbnb.io',
            is_admin=False
        ),
        User(
            id='f97a647f-fdc6-4ce2-8b34-998ee111c5a1',
            first_name='User',
            last_name='Two',
            email='user2@hbnb.io',
            is_admin=False
        )
    ]

    for user in users:
        user.hash_password('12345678')
        db.session.add(user)

    db.session.commit()

    print("Database seeded successfully.")

