import React, { Component } from 'react';
import { ExerciseSelector } from './exercise-selector.component';
import { Button, InputGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import LiftDataService from '../services/lift.service';

export class LiftModal extends Component 
{
    constructor(props) 
    {
        super(props);
        
        this.setWorkoutId = this.setWorkoutId.bind(this);
        this.setExerciseId = this.setExerciseId.bind(this);
        this.setWeight = this.setWeight.bind(this);
        this.setReps = this.setReps.bind(this);
        this.setDescription = this.setDescription.bind(this);
        this.setMessage = this.setMessage.bind(this);  
        this.validateLift = this.validateLift.bind(this);  
        this.addLift = this.addLift.bind(this);  
        this.editLift = this.editLift.bind(this);  

      if (this.props.liftToCopy)
      {
        this.state = 
        {
          workoutId: this.props.workoutId,
          exerciseId: this.props.liftToCopy.exerciseId,
          weight: this.props.liftToCopy.weight,
          reps: this.props.liftToCopy.reps,
          description: this.props.liftToCopy.description,
          message: ''
        };
      }
      else if (this.props.liftToEdit)
      {
        this.state = 
        {
          workoutId: this.props.workoutId,
          exerciseId: this.props.liftToEdit.exerciseId,
          weight: this.props.liftToEdit.weight,
          reps: this.props.liftToEdit.reps,
          description: this.props.liftToEdit.description,
          liftId: this.props.liftToEdit.id,
          message: ''
        };
      }      
      else
      {
        this.state = 
        {
          workoutId: this.props.workoutId,
          exerciseId: -1,
          weight: '',
          reps: '',
          description: '',
          message: ''
        };
      }
    }

    componentDidMount() { this.setWorkoutId(this.props.workoutId); }

    setWorkoutId(value) { this.setState({workoutId: value}); }
    setExerciseId(value) { this.setState({exerciseId: value}); }
    setWeight(value) { this.setState({weight: value}); }
	  setReps(value) { this.setState({reps: value}); }
    setDescription(value) { this.setState({description: value}); }
    setMessage(value) { this.setState({message: value}); }

    resetFields()
    {
      this.setState({
        weight: '',
        reps: '',
        description: '',
        message: ''
      });
    }

    execute = () =>
    {
      if (this.state.liftId)
      {
        this.editLift();
      }
      else
      {
        this.addLift();
      }
    }

    addLift()
    {
      if (!this.validateLift())
      {
        return;
      }

      var data = 
      {
        exerciseId: this.state.exerciseId,
        workoutId: this.state.workoutId,
        weight: this.state.weight,
        reps: this.state.reps,
        description: this.state.description
      };
  
      LiftDataService.create(data)
        .then(response => {
          this.resetFields();
          this.props.onComplete();
        })
        .catch(e => {
          console.log(e);
        });
    }

    editLift()
    {
      if (!this.validateLift())
      {
        return;
      }

      var data = 
      {
        id: this.state.liftId,
        exerciseId: this.state.exerciseId,
        workoutId: this.state.workoutId,
        weight: this.state.weight,
        reps: this.state.reps,
        description: this.state.description
      };
  
      LiftDataService.update(this.state.liftId, data)
        .then(response => {
          this.resetFields();
          this.props.onComplete();
        })
        .catch(e => {
          console.log(e);
        });      
    }

    validateLift()
    {
      if (!(this.state.workoutId > 0))
      {
          this.setMessage('Workout not properly loaded.');
          return false;
      }

      if (!(this.state.exerciseId > 0))
      {
          this.setMessage('Exercise not selected.');
          return false;
      }

      if (!(this.state.reps > 0))
      {
          this.setMessage('Invalid reps.');
          return false;
      }

      if (!(this.state.weight > 0))
      {
          this.setMessage('Invalid weight.');
          return false;
      }

      return true;
    }
    
    render() 
    {		
        return (
			<Modal
				isOpen={this.props.isModalOpen}
				toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>{this.props.modalPrompt}</ModalHeader>
				<ModalBody>
          <ExerciseSelector getInputData={this.setExerciseId} defaultExerciseId={this.state.exerciseId}/>
					<InputGroup>     
						<Input placeholder="Weight" min={0} max={9999} type="number" step="5" onChange={(e) => this.setWeight(`${e.target.value}`)} value={this.state.weight}/>
						<Input placeholder="Reps" min={0} max={9999} type="number" step="1" onChange={(e) => this.setReps(`${e.target.value}`)} value={this.state.reps}/>
						<Input placeholder="Description" onChange={(e) => this.setDescription(`${e.target.value}`)} value={this.state.description}/>
            		</InputGroup>
					<p>{this.state.message}</p>
				</ModalBody>
				<ModalFooter>
					<Button color='primary' onClick={() => this.execute()}>OK</Button>{' '}
					<Button color='secondary' onClick={this.props.toggle}>Cancel</Button>
				</ModalFooter>
			</Modal>
		);
	}
}