import React, { Component } from 'react';
import UserSettingsDataService from '../services/userSettings.service';
import { Button, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap'

export default class WorkoutList extends Component {
	constructor(props) {
		super(props);

		this.retrieveUserSettings = this.retrieveUserSettings.bind(this);
		this.updateUserSettings = this.updateUserSettings.bind(this);
        this.toggleGroupLifts = this.toggleGroupLifts.bind(this);  
        this.setMessage = this.setMessage.bind(this);  
	
		this.state = {
			groupLiftsByExercise: false,
			message: ''
		};
	}

	setMessage(value) { this.setState({message: value}); }
	toggleGroupLifts(value) { this.setState({groupLiftsByExercise: !this.state.groupLiftsByExercise}); }

	componentDidMount() {
		this.retrieveUserSettings();
	}

	retrieveUserSettings() {
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

	updateUserSettings() {
		var data = 
		{
			groupLiftsByExercise: this.state.groupLiftsByExercise ? "true" : "false"
		};
		console.log(data);

		UserSettingsDataService.update(data)
        .then(response => {
          this.setMessage("Settings saved");
        })
        .catch(e => {
			this.setMessage("Settings not saved");
        });      
	}

	render() {
		
		return (
			<div>
				<div>
					<h4>User Settings</h4>
				</div>
				<InputGroup>            
					<InputGroupAddon addonType="prepend">
              			<InputGroupText>Group lifts by exercise</InputGroupText>
            		</InputGroupAddon>
					<Input type="checkbox" checked={this.state.groupLiftsByExercise} onChange={this.toggleGroupLifts}/>
				</InputGroup>
				<Button onClick={() => this.updateUserSettings()}>
					Save
				</Button>
				<br />
				<p>{this.state.message}</p>
			</div>	
		);
	}
}
