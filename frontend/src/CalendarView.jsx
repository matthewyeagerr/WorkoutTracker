// src/components/CalendarView.jsx

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; // Make sure this file exists or remove this line

const CalendarView = ({ workouts }) => {
  const [selectedDate, setSelectedDate] = useState(null);


const formatDate = (date) => {
  return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
};

const getDayLabel = (date) => {
  const targetDate = formatDate(date);
  const match = workouts.find(w => {
    // Convert workout date to ISO for comparison
    const wDate = new Date(w.date).toISOString().slice(0, 10);
    return wDate === targetDate;
  });
  return match ? match.exercise : null;
};

const getDetailsForDate = (date) => {
  const targetDate = formatDate(date);
  return workouts.filter(w => {
    const wDate = new Date(w.date).toISOString().slice(0, 10);
    return wDate === targetDate;
  });
};


  return (
    <div className="calendar-container">
      <Calendar
        onClickDay={(value) => setSelectedDate(value)}
        tileContent={({ date }) => {
          const label = getDayLabel(date);
          return label ? <p className="calendar-label">{label}</p> : null;
        }}
      />

      {selectedDate && (
        <div className="details">
          <h3>Workouts for {formatDate(selectedDate)}</h3>
          {getDetailsForDate(selectedDate).length === 0 && <p>No workouts logged.</p>}
          {getDetailsForDate(selectedDate).map((w, index) => (
            <div key={index} className="workout-detail">
              <p><strong>{w.exercise}</strong></p>
              {w.duration && <p>Duration: {w.duration}</p>}
              {w.distance && <p>Distance: {w.distance}</p>}
              {w.reps && <p>Reps: {w.reps}</p>}
              {w.sets && <p>Sets: {w.sets}</p>}
              {w.weight && <p>Weight: {w.weight}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
