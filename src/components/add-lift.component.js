import React, { Component } from 'react';
import { ExerciseSelector } from './exercise-selector.component';
import { Button, InputGroup, Input } from 'reactstrap';
import LiftDataService from '../services/lift.service';

export class AddLiftComponent extends Component {
    constructor(props) {
      super(props);
      this.setWorkoutId = this.setWorkoutId.bind(this);
      this.setExerciseId = this.setExerciseId.bind(this);
      this.setWeight = this.setWeight.bind(this);
      this.setReps = this.setReps.bind(this);
      this.setDescription = this.setDescription.bind(this);

      this.state = {
        workoutId: this.props.workoutId,
        exerciseId: this.props.exerciseId,
        weight: '',
        reps: '',
        description: '',

        message: ''
      };
    }

    componentDidMount() {
      this.setWorkoutId(this.props.workoutId);
    }

    resetFields()
    {
      this.setState({
        weight: '',
        reps: '',
        description: '',
      });
    }

    setWorkoutId(id)
    {
      this.setState({
        workoutId: id
      });
    }

    setWeight(value) {
      this.setState({
        weight: value,

        message: ''
      });
    }

    setReps(value) {
      this.setState({
        reps: value,

        message: ''
      });
    }

    setDescription(value) {
      this.setState({
        description: value,

        message: ''
      });
    }

    setExerciseId(value){
      this.setState({
        exerciseId: value,

        message: ''
      });
    }

    addLift = () => {
      if (!(this.state.workoutId > 0))
      {
        this.setState({
					message: 'Workout not properly loaded.'
        });
        
        return;
      }

      if (!(this.state.exerciseId > 0))
      {
        this.setState({
					message: 'Exercise not selected.'
        });
        
        return;
      }

      if (!(this.state.reps > 0))
      {
        this.setState({
					message: 'Invalid reps.'
        });
        
        return;
      }

      if (!(this.state.weight > 0))
      {
        this.setState({
					message: 'Invalid weight.'
        });
        
        return;
      }

      var data = {
        exerciseId: this.state.exerciseId,
        workoutId: this.state.workoutId,
        weight: this.state.weight,
        reps: this.state.reps,
        description: this.state.description
      };
  
      LiftDataService.create(data)
        .then(response => {
          this.resetFields();
          this.setState({
            message: 'Lift added.'
          });
          console.log(response.data);
          this.props.liftAdded();
        })
        .catch(e => {
          console.log(e);
        });
    }

    initFromLift = (exName, weight, reps, description) => {
      this.setState({
          weight: weight,
          reps: reps,
          description: description
      })
    }

    render() {
      return (
        <div>
            <ExerciseSelector getInputData={this.setExerciseId}/>
            <InputGroup>                                
                <Input placeholder="Weight" min={0} max={9999} type="number" step="5" onChange={(e) => this.setWeight(`${e.target.value}`)} value={this.state.weight}/>
                <Input placeholder="Reps" min={0} max={9999} type="number" step="1" onChange={(e) => this.setReps(`${e.target.value}`)} value={this.state.reps}/>
                <Input placeholder="Description" onChange={(e) => this.setDescription(`${e.target.value}`)} value={this.state.description}/>
            </InputGroup>
            <Button color="success" onClick={() => this.addLift()}>Add</Button>
            <Button color="danger">Cancel</Button>
						<p>{this.state.message}</p>
        </div>
      );
    }
  }