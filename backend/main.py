from flask import request, jsonify
from config import app, db
from models import Workout


def authenticate(username, password):
    return username == app.config['USERNAME'] and password == app.config['PASSWORD']

@app.route("/workouts/list", methods=['POST'])
def get_workouts():
    data = request.get_json()
    if not data or not authenticate(data.get('username'), data.get('password')):
        return jsonify({"message": "Unauthorized"}), 401
    workouts = Workout.query.all()
    return jsonify({"workouts": [w.to_json() for w in workouts]})

@app.route('/workouts', methods=['POST'])
def add_workout():
    data = request.get_json()
    if not data or not authenticate(data.get('username'), data.get('password')):
        return jsonify({'message': 'Unauthorized'}), 401
    new_workout = Workout(
        date=data['date'],
        exercise=data['exercise'],
        duration=data.get('duration', ''),
        sets=data.get('sets', ''),
        reps=data.get('reps', ''),
        weight=data.get('weight', '')
    )
    db.session.add(new_workout)
    db.session.commit()
    return jsonify({'message': 'Workout added!'})

@app.route("/update_workout/<int:workout_id>", methods=["PATCH"])
def update_workout(workout_id):
    data = request.get_json()
    if not data or not authenticate(data.get('username'), data.get('password')):
        return jsonify({'message': 'Unauthorized'}), 401
    workout = Workout.query.get(workout_id)
    if not workout:
        return jsonify({"message": "Workout not found"}), 404

    workout.date = data.get("date", workout.date)
    workout.exercise = data.get("exercise", workout.exercise)
    workout.duration = data.get("duration", workout.duration)
    workout.sets = data.get("sets", workout.sets)
    workout.reps = data.get("reps", workout.reps)
    workout.weight = data.get("weight", workout.weight)

    db.session.commit()
    return jsonify({"message": "Workout updated successfully"}), 200

@app.route("/delete_workout/<int:workout_id>", methods=['DELETE'])
def delete_workout(workout_id):
    data = request.get_json()
    if not data or not authenticate(data.get('username'), data.get('password')):
        return jsonify({'message': 'Unauthorized'}), 401
    workout = Workout.query.get(workout_id)
    if not workout:
        return jsonify({"message": "Workout not found"}), 404

    db.session.delete(workout)
    db.session.commit()
    return jsonify({"message": "Workout deleted successfully"}), 200


# Run app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)