import { useState, useEffect } from 'react';
import './App.css';
import WorkoutList from './WorkoutList';
import WorkoutForm from './WorkoutForm';
import Calendar from './CalendarView';
import 'react-calendar/dist/Calendar.css';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState({});

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Fetch workouts only when logged in
  useEffect(() => {
    if (loggedIn) {
      fetchWorkouts();
    }
  }, [loggedIn]);

  // Fetch workouts with auth in POST body
  const fetchWorkouts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/workouts/list', {
        method: 'POST', // your backend expects POST here for auth
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts);
        setLoginError('');
      } else {
        setLoginError('Unauthorized: Please check your credentials');
        setLoggedIn(false);
      }
    } catch (error) {
      setLoginError('Error fetching workouts');
    }
  };

  // Simple login handler
  const handleLogin = async (e) => {
    e.preventDefault();

    // Just try to fetch workouts to verify credentials
    try {
      const response = await fetch('http://127.0.0.1:5000/workouts/list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts);
        setLoggedIn(true);
        setLoginError('');
      } else {
        setLoginError('Invalid username or password.');
        setLoggedIn(false);
      }
    } catch {
      setLoginError('Network error');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentWorkout({});
  };

  const openCreateModal = () => {
    if (!isModalOpen) setIsModalOpen(true);
  };

  const openEditModal = (workout) => {
    if (isModalOpen) return;
    setCurrentWorkout(workout);
    setIsModalOpen(true);
  };

  // Pass username/password down to WorkoutList and WorkoutForm for authenticated calls
  const onUpdate = () => {
    closeModal();
    fetchWorkouts();
  };

  if (!loggedIn) {
    return (
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
      </div>
    );
  }
  

  return (
    <>
    
      <Calendar workouts={workouts} />
      <WorkoutList
        workouts={workouts}
        updateWorkout={openEditModal}
        updateCallback={onUpdate}
        username={username}
        password={password}
      />

      <button onClick={openCreateModal}>Create Workout</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <WorkoutForm
              existingWorkout={currentWorkout}
              updateCallback={onUpdate}
              username={username}
              password={password}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
