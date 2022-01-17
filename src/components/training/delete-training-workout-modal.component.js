import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import TrainingWorkoutDataService from '../../services/training/training-workout.service';

export default function DeleteTrainingWorkoutModal(props) {
    const [workout, setWorkout] = useState(props.workout);

    const execute = () => {
        TrainingWorkoutDataService.delete(workout.id)
        .then(response => {
            props.onComplete();
            props.toggle();
        })
    }

    return (
        <Modal
            isOpen={props.isModalOpen}
            toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>Delete Workout</ModalHeader>
            <ModalBody>
                Are you sure you want to delete this workout?
			</ModalBody>
            <ModalFooter>
                <Button color='danger' onClick={() => execute()}>Yes, delete</Button>{' '}
                <Button color='secondary' onClick={props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}