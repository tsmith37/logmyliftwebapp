import React, { Component } from 'react';
import LiftDataService from '../services/lift.service';
import ExerciseDataService from '../services/exercise.service';
import {  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table } from 'reactstrap';
import JwPagination from 'jw-react-pagination';

export default class Exercise extends Component {
	constructor(props) {
		super(props);

		this.setExerciseId = this.setExerciseId.bind(this);
		this.getExercise = this.getExercise.bind(this);
		this.getLifts = this.getLifts.bind(this);
		this.onChangePage = this.onChangePage.bind(this);		
		this.selectNewToOldSort = this.selectNewToOldSort.bind(this);
		this.selectOldToNewSort = this.selectOldToNewSort.bind(this);
		this.selectHeaviestSort = this.selectHeaviestSort.bind(this);
		this.selectLightestSort = this.selectLightestSort.bind(this);
		this.selectSortIfNotAlreadySorted = this.selectSortIfNotAlreadySorted.bind(this);
		this.toggleSortDropdown = this.toggleSortDropdown.bind(this);

		this.state = {
			exerciseId: this.props.match.params.id,
			exercise: null,
			lifts: [],
			pageOfLifts: [],
			sortDropdownOpen: false,
			sortBy: 'createdAt',
			sortDir: 'DESC'
		};
	}

	componentDidMount() {
		this.setExerciseId(this.props.match.params.id);
		this.getExercise(this.props.match.params.id);
		this.getLifts(this.props.match.params.id);
	}

	setExerciseId(value) { this.setState({exerciseId: value}); }

	getExercise(value)
	{
		ExerciseDataService.get(value)
			.then(response => {
				this.setState({
					exercise: response.data
				});
			})
		.catch(e => {
			console.log(e);
		});
	}

	getLifts(value, sortBy='createdAt', sortDir='DESC')
	{
		LiftDataService.findByExerciseId(value, sortBy, sortDir)
			.then(response => {
				this.setState({
					lifts: response.data
				});
			})
		.catch(e => {
			console.log(e);
		});
	}

	onChangePage(ex) {
        this.setState({ 
			pageOfLifts: ex
		});
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
			this.getLifts(this.state.exerciseId, sortBy, sortDir);
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

	render() {
		const { lifts } = this.state;

		return (
			<div>
				<div className="row">
					<div className="col-sm-5">
						<h4>{this.state.exercise ? this.state.exercise.name : "Name"}</h4>
					</div>
					<div className="col-sm-5">						
						<h4>{this.state.exercise ? this.state.exercise.description : "Description"}</h4>
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
				</div>		
				<Table hover>
					<thead>
						<tr>
							<th>Date</th>
							<th>Time</th>
							<th>Weight</th>
							<th>Reps</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						{lifts &&
							this.state.pageOfLifts.map((lift, index) => (
								<tr key={index}>
								<td>{new Date(lift.createdAt).toLocaleDateString()}</td>
								<td>{new Date(lift.createdAt).toLocaleTimeString()}</td>
								<td>{lift.weight}</td>
								<td>{lift.reps}</td>
								<td>{lift.description}</td>
								</tr>
							))}
					</tbody>
				</Table>
				<JwPagination items={this.state.lifts} onChangePage={this.onChangePage} />
			</div>
		);
	}
}


