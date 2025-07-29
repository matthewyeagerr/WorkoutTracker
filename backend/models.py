from config import db

class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), unique = False, nullable=False) #nullable=False means this field must have a value
    last_name = db.Column(db.String(50), unique = False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False) # unique=True means this field must be unique across all records
    
    def to_json(self):
        return{
            'id': self.id,
            'firstName': self.first_name,
            'lastName': self.last_name,
            'email': self.email
        }