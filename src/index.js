import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Exercise from './components/exercise.component';
import ExerciseList from './components/exercise-list.component';
import LiftCollapsibleList from './components/lift-collapsible-list.component';
import MostRecentWorkoutRedirect from './components/most-recent-workout-redirect.component';
import WorkoutList from './components/workout-list.component';
import UserSettings from './components/user-settings.component';

ReactDOM.render(
	<BrowserRouter>
		<Routes>
			<Route path="/" element={<App />}>
				<Route path="workout" element={<WorkoutList />} />
				<Route path="exercise" element={<ExerciseList />} />
				<Route path="exercise/:id" element={<Exercise />} />
				<Route path="workout" element={<WorkoutList />} />
				<Route path="workout/:id" element={<LiftCollapsibleList />} />
				<Route path="/continue-workout" element={<MostRecentWorkoutRedirect />} />
				<Route path="/user-settings" element={<UserSettings />} />
			</Route>


		{/*<Route exact path={"/"} element={<ExerciseList />} />*/}
		{/*<Route path="exercise" element={<ExerciseList />}>*/}
		{/*	<Route path=":id" element={<Exercise />} />*/}
		{/*</Route>*/}
		{/*<Route exact path={"/workout"} element={<WorkoutList />} />*/}
		{/*<Route path="/workout/:id" element={*/}
		{/*	this.state.groupLiftsByExercise ?*/}
		{/*		<LiftCollapsibleList /> : <LiftList />} />*/}
		{/*<Route path="/lifts/:id" element={*/}
		{/*	this.state.groupLiftsByExercise ?*/}
		{/*		<LiftCollapsibleList /> : <LiftList />} />*/}
		{/*<Route path="/continue-workout" element={<MostRecentWorkoutRedirect />} />*/}
		{/*<Route path="/user-settings" element={<UserSettings />} />*/}
	</Routes>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
