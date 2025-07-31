import { useState, useEffect } from 'react';

const WorkoutForm = ({ existingWorkout = {}, updateCallback, username, password }) => {
  const [date, setDate] = useState(existingWorkout.date || '');
  const [exercise, setExercise] = useState(existingWorkout.exercise || '');
  const [duration, setDuration] = useState(existingWorkout.duration || '');
  const [reps, setReps] = useState(existingWorkout.reps || '');
  const [sets, setSets] = useState(existingWorkout.sets || '');
  const [weight, setWeight] = useState(existingWorkout.weight || '');

  const updating = Object.entries(existingWorkout).length !== 0;

  // If existingWorkout changes (e.g. opening modal with a different workout), update state accordingly
  useEffect(() => {
    setDate(existingWorkout.date || '');
    setExercise(existingWorkout.exercise || '');
    setDuration(existingWorkout.duration || '');
    setReps(existingWorkout.reps || '');
    setSets(existingWorkout.sets || '');
    setWeight(existingWorkout.weight || '');
  }, [existingWorkout]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = {
      username,  // add username and password for auth
      password,
      date,
      exercise,
      duration,
      reps,
      sets,
      weight,
    };

    const url = `http://127.0.0.1:5000/${updating ? `update_workout/${existingWorkout.id}` : 'workouts'}`;
    const options = {
      method: updating ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    if (response.status !== 200 && response.status !== 201) {
      const result = await response.json();
      alert(result.message);
    } else {
      updateCallback();
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {/* form inputs unchanged */}
      <div>
        <label htmlFor="date">Date:</label>
        <input type="text" id="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div>
        <label htmlFor="exercise">Exercise:</label>
        <input type="text" id="exercise" value={exercise} onChange={e => setExercise(e.target.value)} />
      </div>
      <div>
        <label htmlFor="duration">Duration:</label>
        <input type="text" id="duration" value={duration} onChange={e => setDuration(e.target.value)} />
      </div>
      <div>
        <label htmlFor="reps">Reps:</label>
        <input type="text" id="reps" value={reps} onChange={e => setReps(e.target.value)} />
      </div>
      <div>
        <label htmlFor="sets">Sets:</label>
        <input type="text" id="sets" value={sets} onChange={e => setSets(e.target.value)} />
      </div>
      <div>
        <label htmlFor="weight">Weight:</label>
        <input type="text" id="weight" value={weight} onChange={e => setWeight(e.target.value)} />
      </div>

      <button type="submit">{updating ? 'Update Workout' : 'Create Workout'}</button>
    </form>
  );
};

export default WorkoutForm;
