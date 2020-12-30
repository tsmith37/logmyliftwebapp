import React, { Component } from 'react';
import WorkoutDataService from '../services/workout.service';

export default class AddWorkout extends Component {
	constructor(props) {
		super(props);
		this.onChangeDescription = this.onChangeDescription.bind(this);
		this.saveWorkout = this.saveWorkout.bind(this);
		this.newWorkout = this.newWorkout.bind(this);

		this.state = {
			id: null,
			description: "",
			
			submitted: false
		};
	}

	onChangeDescription(e) {
		this.setState({
			description: e.target.value
		});
	}
	
	saveWorkout() {
		var data = {
			description: this.state.description
		};

		WorkoutDataService.create(data)
			.then(response => {
				this.setState({
					id: response.data.id,
					description: response.data.description,

					submitted: true
				});
				console.log(response.data);
			})
			.catch(e => {
				console.log(e);
			});
	}

	newWorkout() {
		this.setState({
			id: null,
			description: "",
	
			submitted: false
		});
	}

	render() {
		return (
		<div className="submit-form">
			{this.state.submitted ? (
				<div>
					<h4>Submitted successfully.</h4>
					<button className="btn btn-success" onClick={this.newWorkout}>
						Add another
					</button>
				</div>
			) : (
				<div>

					<div className="form-group">
						<label htmlFor="description">Description</label>
						<input
							type="text"
							class-name="form-control"
							id="description"
							value={this.state.description}
							onChange={this.onChangeDescription}
							name="description"
						/>
					</div>

					<button onClick={this.saveWorkout} className="btn btn-success">
						Submit
					</button>
				</div>
			)}
		</div>
		);
	}
}
