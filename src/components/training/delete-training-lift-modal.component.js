import React from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import TrainingLiftDataService from '../../services/training/training-lift.service';

export default function DeleteTrainingLiftModal(props) {    
    const execute = () => {
        TrainingLiftDataService.delete(props.lift.id)
        .then(response => {
            props.onComplete();
            props.toggle();
        })
    }

    return (
        <Modal
            isOpen={props.isModalOpen}
            toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>Delete Lift</ModalHeader>
            <ModalBody>
                Are you sure you want to delete this training lift?
				</ModalBody>
            <ModalFooter>
                <Button color='danger' onClick={() => execute()}>Yes, delete</Button>{' '}
                <Button color='secondary' onClick={props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}