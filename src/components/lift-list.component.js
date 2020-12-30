import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LiftDataService from '../services/lift.service';
import WorkoutDataService from '../services/workout.service';
import { Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table } from 'reactstrap';
import { LiftModal } from './lift-modal.component';
import { DeleteLiftModal } from './delete-lift-modal.component';
import JwPagination from 'jw-react-pagination';

export default class LiftList extends Component {
	constructor(props) {
		super(props);
		this.retrieveLifts = this.retrieveLifts.bind(this);
		this.retrieveWorkout = this.retrieveWorkout.bind(this);
		this.refreshList = this.refreshList.bind(this);
		this.setActiveLift = this.setActiveLift.bind(this);
		this.selectNewToOldSort = this.selectNewToOldSort.bind(this);
		this.selectOldToNewSort = this.selectOldToNewSort.bind(this);
		this.selectHeaviestSort = this.selectHeaviestSort.bind(this);
		this.selectLightestSort = this.selectLightestSort.bind(this);
		this.selectSortIfNotAlreadySorted = this.selectSortIfNotAlreadySorted.bind(this);
		this.toggleSortDropdown = this.toggleSortDropdown.bind(this);
		this.toggleAddLiftModal = this.toggleAddLiftModal.bind(this);
		this.toggleCopyLiftModal = this.toggleCopyLiftModal.bind(this);
		this.toggleEditLiftModal = this.toggleEditLiftModal.bind(this);
		this.toggleDeleteLiftModal = this.toggleDeleteLiftModal.bind(this);
		this.closeAddLiftModalAndRefresh = this.closeAddLiftModalAndRefresh.bind(this);
		this.closeCopyLiftModalAndRefresh = this.closeCopyLiftModalAndRefresh.bind(this);
		this.closeEditLiftModalAndRefresh = this.closeEditLiftModalAndRefresh.bind(this);
		this.closeDeleteLiftModalAndRefresh = this.closeDeleteLiftModalAndRefresh.bind(this);
		this.onChangePage = this.onChangePage.bind(this);
		
		this.state = {
			workout_id: this.props.match.params.id,
			workoutDescription: '',
			workoutStartTime: null,
			lifts: [],
			pageOfLifts: [],
			sortBy: 'createdAt',
			sortDir: 'DESC',
			currentLift: null,
			currentIndex: -1,
			sortDropdownOpen: false,
			showAddLiftModal: false,
			showCopyLiftModal: false,
			showEditLiftModal: false,
			showDeleteLiftModal: false
		};
	}

	selectNewToOldSort() {
		this.selectSortIfNotAlreadySorted('createdAt', 'DESC');
	}

	selectOldToNewSort() {
		this.selectSortIfNotAlreadySorted('createdAt', 'ASC');
	}

	selectHeaviestSort() {
		this.selectSortIfNotAlreadySorted('weight', 'DESC');
	}

	selectLightestSort() {
		this.selectSortIfNotAlreadySorted('weight', 'ASC');
	}

	selectSortIfNotAlreadySorted(sortBy, sortDir) {
		if (this.state.sortBy !== sortBy || this.state.sortDir !== sortDir)		
		{
			this.retrieveLifts(sortBy, sortDir);
			this.setState({
				sortBy: sortBy,
				sortDir: sortDir,
				currentLift: null,
				currentIndex: -1
			});
		}
	}

	toggleSortDropdown() {
		this.setState({
			sortDropdownOpen: !this.state.sortDropdownOpen
		});
	}

	toggleAddLiftModal() {
		this.setState({
			showAddLiftModal: !this.state.showAddLiftModal
		});

		document.querySelector('body').classList.remove('modal-open');
	}

	toggleCopyLiftModal() {
		this.setState({
			showCopyLiftModal: !this.state.showCopyLiftModal
		});

		document.querySelector('body').classList.remove('modal-open');
	}

	toggleEditLiftModal() {
		this.setState({
			showEditLiftModal: !this.state.showEditLiftModal
		});

		document.querySelector('body').classList.remove('modal-open');
	}

	toggleDeleteLiftModal() {
		this.setState({
			showDeleteLiftModal: !this.state.showDeleteLiftModal
		});

		document.querySelector('body').classList.remove('modal-open');
	}

	closeAddLiftModalAndRefresh() {
		this.setState({
			showAddLiftModal: false
		});
		this.refreshList();
	}

	closeEditLiftModalAndRefresh() {
		this.setState({
			showEditLiftModal: false
		});
		this.refreshList();
	}

	closeCopyLiftModalAndRefresh() {
		this.setState({
			showCopyLiftModal: false
		});
		this.refreshList();
	}

	closeDeleteLiftModalAndRefresh() {
		this.setState({
			showDeleteLiftModal: false
		});
		this.refreshList();
	}

	onChangePage(ex) {
        this.setState({ 
			pageOfLifts: ex,
			currentLift: null,
			currentIndex: -1
		});
    }

	componentDidMount() {
		this.retrieveWorkout();
		this.retrieveLifts();
	}

	retrieveWorkout() {
		WorkoutDataService.get(this.state.workout_id)
		.then(response => {
			this.setState({
				workoutDescription: response.data.description,
				workoutStartTime: response.data.createdAt
			});
		})
		.catch(e => {
			console.log(e);
		});
	}

	retrieveLifts(sortBy=this.state.sortBy, sortDir=this.state.sortDir) {	
		LiftDataService.findByWorkoutId(this.state.workout_id, sortBy, sortDir)
			.then(response => {
				this.setState({
					lifts: response.data
				});
			})
			.catch(e => {
				console.log(e);
			});		
	}

	refreshList() {
		this.retrieveLifts();
		this.setState({
			currentLift: null,
			currentIndex: -1
		});
	}

	setActiveLift(lift, index) {
		this.setState({
			currentLift: lift,
			currentIndex: index
		});
	}

	getActiveLift() {return this.state.currentLift;}

	render() {
		const { lifts } = this.state;

		return (
			<div>
				<div className="row">
					<div className="col-sm-8">
						<h4>{this.state.workoutDescription}</h4>
					</div>
					<div className="col-sm-2">						
						<h4>{new Date(this.state.workoutStartTime).toLocaleDateString()}</h4>
					</div>
					<div className="col-sm-1">
						<Dropdown isOpen={this.state.sortDropdownOpen} toggle={this.toggleSortDropdown}>
							<DropdownToggle caret>
								Sort
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem onClick={this.selectNewToOldSort}>Newest to oldest</DropdownItem>
								<DropdownItem onClick={this.selectOldToNewSort}>Oldest to newest</DropdownItem>
								<DropdownItem onClick={this.selectHeaviestSort}>Heaviest</DropdownItem>
								<DropdownItem onClick={this.selectLightestSort}>Lightest</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
					<div className="col-sm-1"><h5>
						<Button color="primary" onClick ={this.toggleAddLiftModal}>
							Add
						</Button>
						</h5>					
					</div>
				</div>
				<div className="row">
					<div className="col-sm-2">
						Set count: {lifts.length}
					</div>
					<div className="col-sm-2">
						Exercise count: {new Set(lifts.map(lift => lift.exercise.id)).size}
					</div>
					<div className="col-sm-2">
						Start time: {new Date(Math.min.apply(null, lifts.map(function(x) {return new Date(x.createdAt);}))).toLocaleTimeString()}
					</div>
					<div className="col-sm-2">
						End time: {new Date(Math.max.apply(null, lifts.map(function(x) {return new Date(x.createdAt);}))).toLocaleTimeString()}
					</div>
				</div>
				<LiftModal 
					isModalOpen={this.state.showAddLiftModal} 
					modalPrompt="Add Lift"
					toggle={this.toggleAddLiftModal} 
					workoutId={this.state.workout_id}
					onComplete={this.closeAddLiftModalAndRefresh}
					key={-1} 
					defaultLift={null} />	
				<LiftModal 
					isModalOpen={this.state.showCopyLiftModal} 
					modalPrompt="Copy Lift"
					toggle={this.toggleCopyLiftModal} 
					workoutId={this.state.workout_id}
					onComplete={this.closeCopyLiftModalAndRefresh}
					key={"copy" + (this.state.currentLift ? this.state.currentLift.id : 0)} 
					liftToCopy={this.state.currentLift} />		
				<LiftModal 
					isModalOpen={this.state.showEditLiftModal} 
					modalPrompt="Edit Lift"
					toggle={this.toggleEditLiftModal} 
					workoutId={this.state.workout_id}
					onComplete={this.closeEditLiftModalAndRefresh}
					key={"edit" + (this.state.currentLift ? this.state.currentLift.id : 0)} 
					liftToEdit={this.state.currentLift} />			
				<DeleteLiftModal
					isModalOpen={this.state.showDeleteLiftModal}
					toggle={this.toggleDeleteLiftModal}
					liftId={this.state.currentLift ? this.state.currentLift.id : 0}
					onComplete={this.closeDeleteLiftModalAndRefresh}
					key={"delete" + (this.state.currentLift ? this.state.currentLift.id : 0)} />
				<Table hover>
					<thead>
						<tr>
							<th>Exercise</th>
							<th>Weight</th>
							<th>Reps</th>
							<th>Time</th>
							<th>Description</th>
							<th>Edit</th>
							<th>Copy</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{lifts &&
							this.state.pageOfLifts.map((lift, index) => (
								<tr 
									key={index} 
									current-lift={lift} 
									onClick={() => this.setActiveLift(lift, index)} 
									>
								<td>
									<Link to={"/exercise/" + lift.exercise.id}>
										{lift.exercise.name}
									</Link>
								</td>
								<td>{lift.weight}</td>
								<td>{lift.reps}</td>
								<td>{new Date(lift.createdAt).toLocaleTimeString()}</td>
								<td>{lift.description}</td>
								<td><Button onClick={this.toggleEditLiftModal}>Edit</Button></td>
								<td><Button onClick={this.toggleCopyLiftModal}>Copy</Button></td>
								<td><Button onClick={this.toggleDeleteLiftModal}>Delete</Button></td>
								</tr>
							))}
					</tbody>
				</Table>
				<JwPagination items={this.state.lifts} onChangePage={this.onChangePage} />
			</div>
		);
	}
}
