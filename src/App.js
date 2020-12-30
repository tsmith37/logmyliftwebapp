import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import { Nav, Navbar, NavbarBrand, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Exercise from './components/exercise.component';
import ExerciseList from './components/exercise-list.component';
import { ExerciseModal } from './components/exercise-modal.component';
import AddWorkout from './components/add-workout.component';
import WorkoutList from './components/workout-list.component';
import { WorkoutModal } from './components/workout-modal.component';
import LiftList from './components/lift-list.component';
import MostRecentWorkoutRedirect from './components/most-recent-workout-redirect.component';

require('dotenv').config()

class App extends Component {
	constructor(props) {
		super(props);
		
		this.toggleAddExerciseModal = this.toggleAddExerciseModal.bind(this);
		this.toggleAddWorkoutModal = this.toggleAddWorkoutModal.bind(this);
		this.closeAddExerciseModal = this.closeAddExerciseModal.bind(this);
		this.closeAddWorkoutModal = this.closeAddWorkoutModal.bind(this);
	
		this.state = {
			showAddExerciseModal: false,
			showAddWorkoutModal: false
		};
	}

	toggleAddExerciseModal() {
		this.setState({
			showAddExerciseModal: !this.state.showAddExerciseModal
		});
	}

	toggleAddWorkoutModal() {
		this.setState({
			showAddWorkoutModal: !this.state.showAddWorkoutModal,
		});
	}

	closeAddExerciseModal() {
		this.setState({
			showAddExerciseModal: false
		});

		document.querySelector('body').classList.remove('modal-open');
	}

	closeAddWorkoutModal() {
		this.setState({
			showAddWorkoutModal: false
		});

		document.querySelector('body').classList.remove('modal-open');
	}

	render() {
		return (
		<Router>
			<div>
				<Navbar dark expand="md" className="navbar-expand bg-dark">
					<NavbarBrand href="/exercise">LogMyLift</NavbarBrand>
					<Nav navbar>
					<ExerciseModal 
						isModalOpen={this.state.showAddExerciseModal} 
						modalPrompt="Create"
						modalTitle="Add Exercise"
						toggle={this.toggleAddExerciseModal} 
						onComplete={this.closeAddExerciseModal}
						key={"createExercise"}/>	
					<WorkoutModal 
						isModalOpen={this.state.showAddWorkoutModal} 
						modalTitle="Add Workout"
						modalPrompt="Create"
						toggle={this.toggleAddWorkoutModal} 
						onComplete={this.closeAddWorkoutModal}
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
								<DropdownItem className="bg-dark" onClick={this.toggleAddWorkoutModal}>
									Start new
								</DropdownItem>																	
							</DropdownMenu>
						</UncontrolledDropdown>
						<UncontrolledDropdown>
							<DropdownToggle nav caret>
								Exercises
							</DropdownToggle>
							<DropdownMenu className="navbar-dark bg-dark">
								<DropdownItem className="bg-dark">
									<NavLink to={"/exercise"} className="nav-link navbar-dark">
										Show all
									</NavLink>
								</DropdownItem>	
								<DropdownItem divider className="bg-dark"/>		
								<DropdownItem className="bg-dark" onClick={this.toggleAddExerciseModal}>
										Add
								</DropdownItem>																	
							</DropdownMenu>
						</UncontrolledDropdown>
						</Nav>
						<Nav navbar className="ml-auto">
							<Button color="primary" href="/workout-add">
								Start workout
							</Button>
						</Nav>
				</Navbar>

				<div className="container mt-3">
					<Switch>
						<Route exact path={["/", "/exercise"]} component={ExerciseList} />
						<Route path="/exercise/:id" component={Exercise} />
						<Route exact path={["/workout"]} component={WorkoutList} />
						<Route exact path="/workout-add" component={AddWorkout} />
						<Route path="/workout/:id" component={LiftList} />
						<Route path="/lifts/:id" component={LiftList} />
						<Route path="/continue-workout" component={MostRecentWorkoutRedirect} />
					</Switch>
				</div>
			</div>
		</Router>
		);
	}
}

export default App;
