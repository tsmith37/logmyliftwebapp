import React, { Component } from 'react';
import ExerciseDataService from '../services/exercise.service';
import { Link } from 'react-router-dom';
import { Button, Table } from 'reactstrap'
import { ExerciseModal } from './exercise-modal.component';
import JwPagination from 'jw-react-pagination';

export default class ExerciseList extends Component {
	constructor(props) {
		super(props);
		this.onChangeSearchName = this.onChangeSearchName.bind(this);
		this.retrieveExercises = this.retrieveExercises.bind(this);
		this.refreshList = this.refreshList.bind(this);
		this.setActiveExercise = this.setActiveExercise.bind(this);
		this.searchName = this.searchName.bind(this);
		this.onChangePage = this.onChangePage.bind(this);
		this.toggleEditExerciseModal = this.toggleEditExerciseModal.bind(this);
		this.toggleAddExerciseModal = this.toggleAddExerciseModal.bind(this);
		this.closeEditExerciseModalAndRefresh = this.closeEditExerciseModalAndRefresh.bind(this);
		this.closeAddExerciseModalAndRefresh = this.closeAddExerciseModalAndRefresh.bind(this);
	
		this.state = {
			exercises: [],
			currentExercise: null,
			currentIndex: -1,
			searchName: "",
			pageOfExercises: [],
			showEditExerciseModal: false,
			showAddExerciseModal: false
		};
	}

	componentDidMount() {
		this.retrieveExercises();
	}

	onChangeSearchName(e) {
		const searchName = e.target.value;

		this.setState({
			searchName: searchName
		});

		this.searchName(searchName);
	}

	toggleEditExerciseModal() {
		this.setState({
			showEditExerciseModal: !this.state.showEditExerciseModal
		});
	}

	closeEditExerciseModalAndRefresh() {
		this.setState({
			showEditExerciseModal: false
		});
		this.refreshList();

		document.querySelector('body').classList.remove('modal-open');
	}

	toggleAddExerciseModal() {
		this.setState({
			showAddExerciseModal: !this.state.showAddExerciseModal
		});
	}

	closeAddExerciseModalAndRefresh() {
		this.setState({
			showAddExerciseModal: false
		});
		this.refreshList();

		document.querySelector('body').classList.remove('modal-open');
	}

	retrieveExercises() {
		ExerciseDataService.getAll()
			.then(response => {
				this.setState({
					exercises: response.data
				});
			})
			.catch(e => {
				console.log(e);
			});
	}

	refreshList() {
		this.retrieveExercises();
		this.setState({
			currentExercise: null,
			currentIndex: -1
		});
	}

	setActiveExercise(exercise, index) {
		this.setState({
			currentExercise: exercise,
			currentIndex: index
		});
	}

	searchName(searchName) {
		ExerciseDataService.findByName(searchName)
			.then(response => {
				this.setState({
					exercises: response.data
				});
			})
			.catch(e => {
				console.log(e);
			});
	}

	onChangePage(ex) {
        this.setState({ 
			pageOfExercises: ex,
			currentExercise: null,
			currentIndex: -1
		});
    }

	render() {
		const { searchName, exercises } = this.state;

		return (
			<div>
				<div>
					<h4>Exercise List</h4>
				</div>
				<div className="row">
					<div className="col-sm-10">
						<input
							type="text"
							className="form-control"
							placeholder="Search by name"
							value={searchName}
							onChange={this.onChangeSearchName}
						/>
					</div>
					<div className="col-sm-1">
						<Button color="primary" onClick={this.toggleAddExerciseModal}>
							Add
						</Button>
					</div>
				</div>
				<ExerciseModal 
					isModalOpen={this.state.showAddExerciseModal} 
					modalPrompt="Create"
					modalTitle="Add Exercise"
					toggle={this.toggleAddExerciseModal} 
					onComplete={this.closeAddExerciseModalAndRefresh}
					key={-1}/>	
				<ExerciseModal 
					isModalOpen={this.state.showEditExerciseModal} 
					modalPrompt="Update"
					modalTitle="Edit Exercise"
					toggle={this.toggleEditExerciseModal} 
					exercise={this.state.currentExercise}
					onComplete={this.closeEditExerciseModalAndRefresh}
					key={"edit" + (this.state.currentExercise ? this.state.currentExercise.id : 0)}/>	
				<Table hover>
					<thead>
						<tr>
							<th>Name</th>
							<th>Description</th>
							<th>Edit</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>
						{exercises &&
							this.state.pageOfExercises.map((exercise, index) => (
								<tr 
									key={index} 
									current-exercise={exercise} 
									onClick={() => this.setActiveExercise(exercise, index)} 
									>
								<td>
									<Link to={"/exercise/" + exercise.id}>
										{exercise.name}
									</Link>
								</td>
								<td>{exercise.description}</td>
								<td><Button onClick={this.toggleEditExerciseModal}>Edit</Button></td>
								</tr>
						))}
					</tbody>
				</Table>
				<JwPagination items={this.state.exercises} onChangePage={this.onChangePage} />
			</div>
		);
	}
}
