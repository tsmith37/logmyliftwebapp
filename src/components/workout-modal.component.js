import React, { Component } from 'react';
import { Button, InputGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import WorkoutDataService from '../services/workout.service';

export class WorkoutModal extends Component 
{
    constructor(props) 
    {
        super(props);

        this.setWorkoutId = this.setWorkoutId.bind(this);
        this.validateWorkout = this.validateWorkout.bind(this);  

        if (this.props.workout)
        {
            this.state = 
            {
                workoutId: this.props.workout.id,
                description: this.props.workout.description,            
                message: ''
            };
        }
        else
        {
            this.state = 
            {
                workoutId: -1,
                description: '',
                message: ''
            };
        }
    }

    componentDidMount() { this.setWorkoutId(this.props.workout ? this.props.workout.id: -1); }

    setWorkoutId(value) { this.setState({workoutId: value}); }
    setDescription(value) { this.setState({description: value}); }

    validateWorkout()
    {
      if ((this.state.description === ''))
      {
          this.setMessage('Description is not valid.');
          return false;
      }

      return true;
    }

    addWorkout()
    {
        var data = 
        {
            description: this.state.description
        };

        WorkoutDataService.create(data)
        .catch(e => {
            console.log(e);
        });
    }

    editWorkout()
    {
        var data = 
        {
            id: this.state.workoutId,
            description: this.state.description
        };

        WorkoutDataService.update(this.state.workoutId, data)
        .catch(e => {
            console.log(e);
        });
    }

    execute = () =>
    {
        if (!this.validateWorkout())
        {
            return;
        }

        if (this.state.workoutId !== -1)
        {
            this.editWorkout();
        }
        else
        {
            this.addWorkout();
        }

        this.props.onComplete();
        this.props.toggle();
    }

    render() 
    {		
        return (	
			<Modal
				isOpen={this.props.isModalOpen}
				toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>{this.props.modalTitle}</ModalHeader>
				<ModalBody>
					<InputGroup>
						<Input placeholder="Description" onChange={(e) => this.setDescription(`${e.target.value}`)} value={this.state.description}/>
            		</InputGroup>
					<p>{this.state.message}</p>
				</ModalBody>
				<ModalFooter>
					<Button color='primary' onClick={() => this.execute()}>{this.props.modalPrompt}</Button>{' '}
					<Button color='secondary' onClick={this.props.toggle}>Cancel</Button>
				</ModalFooter>
			</Modal>
		);
	}
}