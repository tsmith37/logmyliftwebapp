import React, { Component } from 'react';
import { Outlet, NavLink } from 'react-router-dom'
import { Nav, Navbar, NavbarBrand, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { ExerciseModal } from './components/exercise-modal.component';
import { WorkoutModal } from './components/workout-modal.component';

import UserSettingsDataService from './services/userSettings.service';

class App extends Component {
	constructor(props) {
		super(props);
		
		this.toggleAddExerciseModal = this.toggleAddExerciseModal.bind(this);
		this.toggleAddWorkoutModal = this.toggleAddWorkoutModal.bind(this);
		this.closeAddExerciseModal = this.closeAddExerciseModal.bind(this);
		this.closeAddWorkoutModal = this.closeAddWorkoutModal.bind(this);
	
		this.state = {
			showAddExerciseModal: false,
			showAddWorkoutModal: false,
			groupLiftsByExercise: true
		};
	}

	componentDidMount() { 
		UserSettingsDataService.get()
			.then(response => {
				this.setState({
					groupLiftsByExercise: response.data.groupLiftsByExercise
				});
			})
			.catch(e => {
				console.log(e);
			}); 
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
								Exercises
							</DropdownToggle>
							<DropdownMenu className="navbar-dark bg-dark">
								<DropdownItem className="bg-dark">
									<NavLink to={"/exercise"} className="nav-link navbar-dark">
										Show all
									</NavLink>
								</DropdownItem>							
							</DropdownMenu>
						</UncontrolledDropdown>
						</Nav>
						<Nav navbar className="ml-auto">
							<Button color="primary" onClick={this.toggleAddWorkoutModal}>
								Start
							</Button>
						</Nav>
				</Navbar>
				<Outlet/>
			</div>
		);
	}
}

export default App;
