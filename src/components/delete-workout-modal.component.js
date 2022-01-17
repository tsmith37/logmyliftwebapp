import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import WorkoutDataService from '../services/workout.service';

export class DeleteWorkoutModal extends Component {
    constructor(props) {
        super(props);

        this.setWorkoutId = this.setWorkoutId.bind(this);

        this.state =
        {
            workoutId: this.props.workoutId
        }
    }

    componentDidMount() { this.setWorkoutId(this.props.workoutId); }

    setWorkoutId(value) { this.setState({ workoutId: value }); }

    execute = () => {
        WorkoutDataService.delete(this.state.workoutId)
            .then(response => {
                this.props.onComplete();
                this.props.toggle();
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        return (
            <Modal
                isOpen={this.props.isModalOpen}
                toggle={this.props.toggle}>
                <ModalHeader toggle={this.props.toggle}>Delete Workout</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this workout?
				</ModalBody>
                <ModalFooter>
                    <Button color='danger' onClick={() => this.execute()}>Yes, delete</Button>{' '}
                    <Button color='secondary' onClick={this.props.toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}