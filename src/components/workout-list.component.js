import React, { Component } from 'react';
import WorkoutDataService from '../services/workout.service';
import { Link } from 'react-router-dom';
import { Button, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Table } from 'reactstrap'
import { WorkoutModal } from './workout-modal.component';
import { DeleteWorkoutModal } from './delete-workout-modal.component'
import JwPagination from 'jw-react-pagination';

export default class WorkoutList extends Component {
	constructor(props) {
		super(props);
		this.onChangeSearchDescription = this.onChangeSearchDescription.bind(this);
		this.retrieveWorkouts = this.retrieveWorkouts.bind(this);
		this.refreshList = this.refreshList.bind(this);
		this.setActiveWorkout = this.setActiveWorkout.bind(this);
		this.onChangePage = this.onChangePage.bind(this);
		this.toggleEditWorkoutModal = this.toggleEditWorkoutModal.bind(this);
		this.toggleDeleteWorkoutModal = this.toggleDeleteWorkoutModal.bind(this);
		this.selectNewToOldSort = this.selectNewToOldSort.bind(this);
		this.selectOldToNewSort = this.selectOldToNewSort.bind(this);
		this.selectSortIfNotAlreadySorted = this.selectSortIfNotAlreadySorted.bind(this);
		this.toggleSortDropdown = this.toggleSortDropdown.bind(this);
	
		this.state = {
			workouts: [],
			currentWorkout: null,
			currentIndex: -1,
			searchDescription: "",
			pageOfWorkouts: [],
			showAddWorkoutModal: false,
			showDeleteWorkoutModal: false,
			showEditWorkoutModal: false,
			sortDropdownOpen: false,
			sortBy: 'createdAt',
			sortDir: 'DESC'
		};
	}

	componentDidMount() {
		this.retrieveWorkouts();
	}

	onChangeSearchDescription(e) {
		const searchDescription = e.target.value;
		
		this.retrieveWorkouts(searchDescription, this.state.sortBy, this.state.sortDir);
		this.setState({
			searchDescription: searchDescription
		});
	}

	toggleEditWorkoutModal() {
		this.setState({
			showEditWorkoutModal: !this.state.showEditWorkoutModal
		});

		document.querySelector('body').classList.remove('modal-open');
	}

	toggleDeleteWorkoutModal() {
		this.setState({
			showDeleteWorkoutModal: !this.state.showDeleteWorkoutModal
		});
	}

	retrieveWorkouts(description, sortBy, sortDir) {
		WorkoutDataService.getAll(description, sortBy, sortDir)
			.then(response => {
				this.setState({
					workouts: response.data
				});
			})
			.catch(e => {
				console.log(e);
			});
	}

	refreshList() {
		this.retrieveWorkouts(this.state.searchDescription, this.state.sortBy, this.state.sortDir);
		this.setState({
			currentWorkout: null,
			currentIndex: -1
		});
	}
	
	selectNewToOldSort() {
		this.selectSortIfNotAlreadySorted('createdAt', 'DESC');
	}

	selectOldToNewSort() {
		this.selectSortIfNotAlreadySorted('createdAt', 'ASC');
	}

	selectSortIfNotAlreadySorted(sortBy, sortDir) {
		if (this.state.sortBy !== sortBy || this.state.sortDir !== sortDir)		
		{
			this.retrieveWorkouts(this.state.searchDescription, sortBy, sortDir);
			this.setState({
				sortBy: sortBy,
				sortDir: sortDir
			});
		}
	}

	toggleSortDropdown() {
		this.setState({
			sortDropdownOpen: !this.state.sortDropdownOpen
		});
	}

	setActiveWorkout(workout, index) {
		this.setState({
			currentWorkout: workout,
			currentIndex: index
		});
	}

	onChangePage(wk) {
        this.setState({ 
			pageOfWorkouts: wk,
			currentWorkout: null,
			currentIndex: -1
		});
    }

	render() {
		const { searchDescription, workouts, } = this.state;

		return (
			<div>
				<div>
					<h4>Workout List</h4>
				</div>
				<Container>
					<Row>
						<Col xs="auto">
							<input
								type="text"
								className="form-control"
								placeholder="Search by description"
								value={searchDescription}
								onChange={this.onChangeSearchDescription}
							/>
						</Col>
						<Col xs="1">
							<Dropdown isOpen={this.state.sortDropdownOpen} toggle={this.toggleSortDropdown}>
							<DropdownToggle caret>
								Sort
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem onClick={this.selectNewToOldSort}>Newest to oldest</DropdownItem>
								<DropdownItem onClick={this.selectOldToNewSort}>Oldest to newest</DropdownItem>
							</DropdownMenu>
							</Dropdown>
						</Col>
					</Row>
				</Container>	
				<WorkoutModal 
					isModalOpen={this.state.showEditWorkoutModal} 
					modalTitle="Edit Workout"
					modalPrompt="Update"
					toggle={this.toggleEditWorkoutModal} 
					workout={this.state.currentWorkout}
					onComplete={this.refreshList}
					key={"edit" + (this.state.currentWorkout ? this.state.currentWorkout.id : 0)} />
				<DeleteWorkoutModal
					isModalOpen={this.state.showDeleteWorkoutModal}
					modalTitle="Delete Workout"
					modalPrompt="Delete"
					toggle={this.toggleDeleteWorkoutModal}
					workoutId={this.state.currentWorkout ? this.state.currentWorkout.id : 0}
					onComplete={this.refreshList}
					key={"delete" + (this.state.currentWorkout ? this.state.currentWorkout.id : 0)} />
				<Table hover>
					<thead>
						<tr>
							<th>Description</th>
							<th>Date</th>
							<th>Time</th>
							<th>Edit</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{workouts &&
							this.state.pageOfWorkouts.map((workout, index) => (
								<tr 
									key={index} 
									onClick={() => this.setActiveWorkout(workout, index)} 
									>
								<td>
									<Link to={"/workout/" + workout.id}>
										{workout.description}
									</Link>
								</td>
								<td>{new Date(workout.createdAt).toLocaleDateString()}</td>
								<td>{new Date(workout.createdAt).toLocaleTimeString()}</td>
								<td><Button onClick={this.toggleEditWorkoutModal}>Edit</Button></td>
								<td><Button onClick={this.toggleDeleteWorkoutModal}>Delete</Button></td>
								</tr>
						))}
					</tbody>
				</Table>
				<JwPagination items={this.state.workouts} onChangePage={this.onChangePage} />
			</div>	
		);
	}
}
