from config import db

class Workout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(20), unique=False, nullable=False)
    exercise = db.Column(db.String(50), unique=False, nullable=False)
    duration = db.Column(db.String(20))
    reps = db.Column(db.String(50))
    sets = db.Column(db.String(20))
    weight = db.Column(db.String(50))  # New field for weight

    def to_json(self):
        return{
            'id': self.id,
            'date': self.date,
            'exercise': self.exercise,
            'duration': self.duration,
            'reps': self.reps,
            'sets': self.sets,
            'weight': self.weight  # Include weight in the JSON representation
        }