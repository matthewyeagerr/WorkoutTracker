import React from "react";

const WorkoutList = ({ workouts, updateWorkout, updateCallback, username, password }) => {
  const onDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete_workout/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), // pass auth here
      });
      if (response.status === 200) {
        updateCallback();
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete workout");
      }
    } catch (error) {
      alert(error);
    }
  };

  // Group workouts by date
  const groupWorkoutsByDate = () => {
    const grouped = {};
    workouts.forEach((workout) => {
      if (!grouped[workout.date]) {
        grouped[workout.date] = [];
      }
      grouped[workout.date].push(workout);
    });
    return grouped;
  };

  const groupedWorkouts = groupWorkoutsByDate();

  return (
    <div>
      <h2>Workouts</h2>
      {Object.entries(groupedWorkouts).map(([date, workoutsForDate]) => (
        <details
          key={date}
          style={{
            marginBottom: "1rem",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "0.5rem",
          }}
        >
          <summary
            style={{
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "1.1rem",
            }}
          >
            {date}
          </summary>
          <table style={{ width: "100%", marginTop: "0.5rem" }}>
            <thead>
              <tr>
                <th>Exercise</th>
                <th>Duration</th>
                <th>Reps</th>
                <th>Sets</th>
                <th>Weight (lbs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workoutsForDate.map((workout) => (
                <tr key={workout.id}>
                  <td>{workout.exercise}</td>
                  <td>{workout.duration}</td>
                  <td>{workout.reps}</td>
                  <td>{workout.sets}</td>
                  <td>{workout.weight}</td>
                  <td>
                    <button onClick={() => updateWorkout(workout)}>Update</button>{" "}
                    <button onClick={() => onDelete(workout.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ))}
    </div>
  );
};

export default WorkoutList;
