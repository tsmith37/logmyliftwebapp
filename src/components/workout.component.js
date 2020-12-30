import React, { Component } from 'react';
import WorkoutDataService from '../services/workout.service';
import { Link } from 'react-router-dom';

export default class Workout extends Component {
	constructor(props) {
		super(props);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.getWorkout = this.getWorkout.bind(this);
		this.updateWorkout = this.updateWorkout.bind(this);
		this.deleteWorkout = this.deleteWorkout.bind(this);
		
		this.state = {
			currentWorkout: {
				id: null,
				description: ""
			},
			message: ""
		};
	}

	componentDidMount() {
		this.getWorkout(this.props.match.params.id);
	}
	
	onChangeDescription(e) {
		const description = e.target.value;

		this.setState(function(prevState) {
			return {
				currentWorkout: {
					...prevState.currentWorkout,
					description: description
				}
			};
		});
	}

	getWorkout(id) {
		WorkoutDataService.get(id)
			.then(response => {
				this.setState({
					currentWorkout: response.data
				});
			})
			.catch(e => {
				console.log(e);
			});
	}

	updateWorkout() {
		WorkoutDataService.update(this.state.currentWorkout.id, this.state.currentWorkout)
			.then(response => {
				console.log(response.data);
				this.setState({
					message: 'Workout updated successfully.'
				});
			})
			.catch(e => {
				console.log(e);
			});
	}

	deleteWorkout() {	
		WorkoutDataService.delete(this.state.currentWorkout.id)
			.then(response => {
				this.props.history.push('/workout')
			})
			.catch(e => {
				console.log(e);
			});
	}

	render() {
		const { currentWorkout } = this.state;

		return (
			<div>
				{currentWorkout ? (
					<div className="edit-form">
						<h4>Workout</h4>
						<form>
							<div className="form-group">
								<label htmlFor="name">Description</label>
								<input
									type="text"
									className="form-control"
									id="name"
									value={currentWorkout.description}
									onChange={this.onChangeDescription}
								/>
							</div>
						</form>
						<button
							className="badge badge-danger mr-2"
							onClick={this.deleteWorkout}
						>
							Delete
						</button>
						<button
							type="submit"
							className="badge badge-success"
							onClick={this.updateWorkout}
						>
							Update
						</button>
						<button
							type="submit"
							className="badge badge-success">
							<Link
								to={"/lifts/" + currentWorkout.id}
							>
								Show lifts
							</Link>
						</button>
						<p>{this.state.message}</p>
					</div>
				) : (
					<div>
						<br />
						<p>Please click on a Workout...</p>
					</div>
				)}
			</div>
		);
	}
}


