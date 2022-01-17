import React, { Component } from 'react';
import { Alert, Button, InputGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';

import ExerciseDataService from '../services/exercise.service';

export class ExerciseModal extends Component 
{
    constructor(props) 
    {
        super(props);

        this.setExerciseId = this.setExerciseId.bind(this);
        this.validateExercise = this.validateExercise.bind(this);  
        this.addExercise = this.addExercise.bind(this);  
        this.editExercise = this.editExercise.bind(this);  

        if (this.props.exercise)
        {
            this.state = 
            {
                exerciseId: this.props.exercise.id,
                name: this.props.exercise.name,
                description: this.props.exercise.description,
                message: ''
            };
        }
        else
        {
            this.state = 
            {
              exerciseId: -1,
              name: '',
              description: '',
              message: ''
            };
        }
    }

    componentDidMount() { this.setExerciseId(this.props.exercise ? this.props.exercise.id: -1); }

    setExerciseId(value) { this.setState({exerciseId: value}); }
    setName(value) { this.setState({name: value}); }
    setDescription(value) { this.setState({description: value}); }

    validateExercise()
    {
      if ((this.state.name === ''))
      {
          this.setMessage('Name is not valid.');
          return false;
      }

      return true;
    }

    enableExercisePrompt() {
        if ((this.state.name === '')) {
            return false;
        }

        return true;
    }

    addExercise()
    {
        var data = 
        {
            name: this.state.name,
            description: this.state.description
        };

        ExerciseDataService.create(data)
        .then(response => {
            this.props.onComplete();
        })
        .catch(e => {
            console.log(e);
        });
    }

    editExercise()
    {
        var data = 
        {
            id: this.state.exerciseId,
            name: this.state.name,
            description: this.state.description
        };

        ExerciseDataService.update(this.state.exerciseId, data)
        .then(response => {
            this.props.onComplete();
        })
        .catch(e => {
            console.log(e);
        });
    }

    execute = () =>
    {
        if (!this.validateExercise())
        {
            return;
        }

        if (this.state.exerciseId !== -1)
        {
            this.editExercise();
        }
        else
        {
            this.addExercise();
        }
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
						<Input placeholder="Name" onChange={(e) => this.setName(`${e.target.value}`)} value={this.state.name}/>
						<Input placeholder="Description" onChange={(e) => this.setDescription(`${e.target.value}`)} value={this.state.description}/>
                    </InputGroup>
                    <Alert color="danger" isOpen={this.state.message !== ""}>{this.state.message}</Alert>
				</ModalBody>
				<ModalFooter>
                    <Button disabled={!this.enableExercisePrompt()} color='primary' onClick={() => this.execute()}>{this.props.modalPrompt}</Button>{' '}
					<Button color='secondary' onClick={this.props.toggle}>Cancel</Button>
				</ModalFooter>
			</Modal>
		);
	}
}