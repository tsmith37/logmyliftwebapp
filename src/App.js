import React, { useState } from 'react';
import { Outlet, useNavigate , NavLink } from 'react-router-dom';
import { Nav, Navbar, NavbarBrand, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import ExerciseModal from './components/exercise-modal.component';
import { WorkoutModal } from './components/workout-modal.component';

function App() {
	const [addExerciseModalOpen, setAddExerciseModalOpen] = useState(false);
	const [addWorkoutModalOpen, setAddWorkoutModalOpen] = useState(false);
	// const navigate = useNavigate();

	// const redirectWorkout = (id) => {
	// 	navigate('/workout/' + id);
    // }

	return (
		<div>
			<Navbar dark expand="md" className="navbar-expand bg-dark">
				<NavbarBrand href="/exercise">LogMyLift</NavbarBrand>
				<Nav navbar>
				<ExerciseModal 
					isModalOpen={addExerciseModalOpen} 
					modalPrompt="Create"
					modalTitle="Add Exercise"
					toggle={() => setAddExerciseModalOpen(!addExerciseModalOpen)} 
					onComplete={() => setAddExerciseModalOpen(false)}
					key={"createExercise"}/>	
				<WorkoutModal 
					isModalOpen={addWorkoutModalOpen} 
					modalTitle="Add Workout"
					modalPrompt="Create"
					toggle={() => setAddWorkoutModalOpen(!addWorkoutModalOpen)} 
					// onComplete={(e) => redirectWorkout(e)}
					key={"createWorkout"}/>	
					<UncontrolledDropdown>
						<DropdownToggle nav caret>
							Workouts
						</DropdownToggle>
						<DropdownMenu className="navbar-dark bg-dark">
							<DropdownItem className="bg-dark">
								<NavLink to={"/workout"} className="nav-link navbar-dark">
									Show all
								</NavLink>
							</DropdownItem>	
							<DropdownItem divider className="bg-dark"/>						
							<DropdownItem className="bg-dark">
								<NavLink to={"/continue-workout"} className="nav-link navbar-dark">
									Continue
								</NavLink>
							</DropdownItem>	
							<DropdownItem divider className="bg-dark"/>						
							<DropdownItem className="bg-dark">
								<NavLink to={"/user-settings"} className="nav-link navbar-dark">
									Settings
								</NavLink>	
							</DropdownItem>											
						</DropdownMenu>
					</UncontrolledDropdown>
					<UncontrolledDropdown>
						<DropdownToggle nav caret>
							Training
						</DropdownToggle>
						<DropdownMenu className="navbar-dark bg-dark">
							<DropdownItem className="bg-dark">
								<NavLink to={"/exercise"} className="nav-link navbar-dark">
									Exercises
								</NavLink>
							</DropdownItem>
							<DropdownItem className="bg-dark">
								<NavLink to={"/training/program"} className="nav-link navbar-dark">
									Programs
								</NavLink>
							</DropdownItem>
						</DropdownMenu>
					</UncontrolledDropdown>
					</Nav>
					<Nav navbar className="ml-auto">
					<Button color="primary" onClick={() => setAddWorkoutModalOpen(true)}>
							Start
					</Button>
					</Nav>
			</Navbar>			
				<Outlet />
		</div>
	)
}

export default App;