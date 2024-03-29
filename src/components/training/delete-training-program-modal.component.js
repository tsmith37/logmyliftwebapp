import React, { useState } from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

import TrainingProgramDataService from '../../services/training/training-program.service';

export default function DeleteTrainingProgramModal(props) {
    const [program, setProgram] = useState(props.program);

    const execute = () => {
        TrainingProgramDataService.delete(program.id)
        .then(response => {
            props.onComplete();
            props.toggle();
        })
    }

    return (
        <Modal
            isOpen={props.isModalOpen}
            toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>Delete Program</ModalHeader>
            <ModalBody>
                Are you sure you want to delete this program?
			</ModalBody>
            <ModalFooter>
                <Button color='danger' onClick={() => execute()}>Yes, delete</Button>{' '}
                <Button color='secondary' onClick={props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}