import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LiftDataService from '../services/lift.service';
import WorkoutDataService from '../services/workout.service';
import { Button, Col, Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Table } from 'reactstrap';
import { LiftModal } from './lift-modal.component';
import { LiftOptionsModal } from './lift-options-modal.component';

export default class LiftCollapsible extends Component {
	constructor(props) {
		super(props);
		this.retrieveLifts = this.retrieveLifts.bind(this);
		this.retrieveWorkout = this.retrieveWorkout.bind(this);
		this.refreshList = this.refreshList.bind(this);
		this.setActiveLift = this.setActiveLift.bind(this);
		this.getGroupedLifts = this.getGroupedLifts.bind(this);
		this.selectNewToOldSort = this.selectNewToOldSort.bind(this);
		this.selectOldToNewSort = this.selectOldToNewSort.bind(this);
		this.selectHeaviestSort = this.selectHeaviestSort.bind(this);
		this.selectLightestSort = this.selectLightestSort.bind(this);
		this.selectSortIfNotAlreadySorted = this.selectSortIfNotAlreadySorted.bind(this);
		this.toggleSortDropdown = this.toggleSortDropdown.bind(this);
		this.toggleAddLiftModal = this.toggleAddLiftModal.bind(this);
		this.toggleLiftOptionsModal = this.toggleLiftOptionsModal.bind(this);
		this.closeAddLiftModalAndRefresh = this.closeAddLiftModalAndRefresh.bind(this);
		this.closeAllModalsAndRefresh = this.closeAllModalsAndRefresh.bind(this);
		
		this.state = {
			workout_id: this.props.match.params.id,
			workoutDescription: '',
			workoutStartTime: null,
			lifts: [],
			sortBy: 'createdAt',
			sortDir: 'DESC',
			currentLift: null,
			currentIndex: -1,
			sortDropdownOpen: false,
			showAddLiftModal: false,
			showLiftOptionsModal: false,
			expandedRows: []
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

	toggleLiftOptionsModal(lift, index) {
		this.setState({
			currentLift: lift,
			currentIndex: index,
			showLiftOptionsModal: !this.state.showLiftOptionsModal
		});

		document.querySelector('body').classList.remove('modal-open');
	}

	closeAddLiftModalAndRefresh() {
		this.setState({
			showAddLiftModal: false
		});
		this.refreshList();
	}

	closeAllModalsAndRefresh(){
		this.setState({
			showAddLiftModal: false,
			showLiftOptionsModal: false
		});
		this.refreshList();
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
				this.getGroupedLifts();
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

	handleRowClick(exerciseName)
	{
		const currentExpandedRows = this.state.expandedRows;
        const isRowCurrentlyExpanded = currentExpandedRows.includes(exerciseName);
        
        const newExpandedRows = isRowCurrentlyExpanded ? 
			currentExpandedRows.filter(id => id !== exerciseName) : 
			currentExpandedRows.concat(exerciseName);
        
        this.setState({expandedRows : newExpandedRows});
	}

	renderExercise(exercise) {
        const clickCallback = () => this.handleRowClick(exercise.exerciseName);
        const itemRows = [
			<tr onClick={clickCallback} key={"row-data-" + exercise.exerciseName} className="bg-light">
			    <td>				
					<Link className="text-dark" to={"/exercise/" + exercise.id}>
						{exercise.exerciseName}
					</Link>
				</td>		
				<td></td>
			</tr>
        ];
        
        if(this.state.expandedRows.includes(exercise.exerciseName)) {		
			exercise.lifts.forEach((lift, index) => {
				itemRows.push(
					<tr 
						key={"row-expanded-1-" + lift.id}
						onClick={() => this.toggleLiftOptionsModal(lift, index)} 
					>
					<td>{new Date(lift.createdAt).toLocaleTimeString()}<br/>{lift.description}</td>
					<td>{lift.weight} x {lift.reps}</td>
					</tr>
				);
			});	
		}

        return itemRows;    
    }

	getGroupedLifts()
	{
		let exerciseIds = new Set(this.state.lifts.map(lift => lift.exercise.name));
		let lifts = this.state.lifts;
		let groupedLifts = [];
		exerciseIds.forEach(function(name, index) {
			let liftsByExercise = lifts.filter(lift => lift.exercise.name === name);
			groupedLifts.push({"exerciseName": name, "id": liftsByExercise[0].exercise.id, "lifts": liftsByExercise});
		});

		return groupedLifts;
	}

	getActiveLift() {return this.state.currentLift;}

	render() {
		const { lifts } = this.state;
		let allExerciseRows = [];
		let groupedLifts = this.getGroupedLifts();
		groupedLifts.forEach(exercise =>
			{
				const perExerciseRow = this.renderExercise(exercise);
				allExerciseRows = allExerciseRows.concat(perExerciseRow);
			});

		return (
			<div>
				<Container>
					<Row>						
						<Col xs="auto">
							<h4>{this.state.workoutDescription}</h4>
						</Col>		
						<Col xs="auto">
							<h4>{new Date(this.state.workoutStartTime).toLocaleDateString()}</h4>
						</Col>
					</Row>
				</Container>
				<Container>
					<Row>
						<Col>
							Start: {new Date(Math.min.apply(null, lifts.map(function(x) {return new Date(x.createdAt);}))).toLocaleTimeString()}
						</Col>
						<Col>
							Exercises: {new Set(lifts.map(lift => lift.exercise.id)).size}
						</Col>
					</Row>
					<Row>
						<Col>
							End: {new Date(Math.max.apply(null, lifts.map(function(x) {return new Date(x.createdAt);}))).toLocaleTimeString()}
						</Col>
						<Col>
							Sets: {lifts.length}
						</Col>
					</Row>
				</Container>
				<Container>
					<Row>						
						<Col xs="auto">
							<Button color="primary" onClick ={this.toggleAddLiftModal}>
								Add
							</Button>
						</Col>		
						<Col xs="auto">							
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
						</Col>
					</Row>
				</Container>
				<LiftModal 
					isModalOpen={this.state.showAddLiftModal} 
					modalPrompt="Add Lift"
					toggle={this.toggleAddLiftModal} 
					workoutId={this.state.workout_id}
					onComplete={this.closeAddLiftModalAndRefresh}
					key={-1} 
					defaultLift={null} />	
				<LiftOptionsModal
					isModalOpen={this.state.showLiftOptionsModal}
					toggle={this.toggleLiftOptionsModal}
					lift={this.state.currentLift ? this.state.currentLift : null}
					workoutId={this.state.workout_id}
					onComplete={this.closeAllModalsAndRefresh}
					key={"options" + (this.state.currentLift ? this.state.currentLift.id : 0)} />
				<Table hover>
					<tbody>
						{lifts && allExerciseRows}
					</tbody>
				</Table>
			</div>
		);
	}
}
