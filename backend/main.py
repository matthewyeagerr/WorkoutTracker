from flask import request, jsonify
from config import app, db
from models import Workout

@app.route("/workouts", methods=['GET']) # decorator to define a route. create new route, what route (/contacts), valid methods. use GET method for this url
def get_workouts():
    workouts = Workout.query.all() # uses flask sqlalchemy to get all workouts from the database
    json_workouts = list(map(lambda x: x.to_json(), workouts)) # convert each workout to JSON, cant return python object directly, must convert to JSON. workouts is list of Workout objects, map applies to each object in the list
    return jsonify({"workouts": json_workouts}) # return a json object


@app.route('/workouts', methods=['POST'])
def add_workout():
    data = request.get_json()
    new_workout = Workout(
        date=data['date'],
        exercise=data['exercise'],
        duration=data.get('duration', ''),
        sets=data.get('sets', ''),
        reps=data.get('reps', ''),
        weight=data.get('weight', '')  # Assuming weight is a new field added to the Workout model
    )
    db.session.add(new_workout)
    db.session.commit()
    return jsonify({'message': 'Workout added!'})


# PATCH (update) a workout
@app.route("/update_workout/<int:workout_id>", methods=["PATCH"])
def update_workout(workout_id):
    workout = Workout.query.get(workout_id)
    if not workout:
        return jsonify({"message": "Workout not found"}), 404

    data = request.get_json()
    workout.date = data.get("date", workout.date)
    workout.exercise = data.get("exercise", workout.exercise)
    workout.duration = data.get("duration", workout.duration)
    workout.sets = data.get("sets", workout.sets)
    workout.reps = data.get("reps", workout.reps)
    workout.weight = data.get("weight", workout.weight)

    db.session.commit()
    return jsonify({"message": "Workout updated successfully"}), 200

# DELETE a workout
@app.route("/delete_workout/<int:workout_id>", methods=['DELETE'])
def delete_workout(workout_id):
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