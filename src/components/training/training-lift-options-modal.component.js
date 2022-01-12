import React, { useState } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import TrainingLiftModal from './training-lift-modal.component';
import DeleteTrainingLiftModal from './delete-training-lift-modal.component';

export default function TrainingLiftOptionsModal(props) {
    const [lift, setLift] = useState(props.lift);
    const [workoutId, setWorkoutId] = useState(props.workoutId);
    const [editLiftModalOpen, setEditLiftModalOpen] = useState(false);
    const [copyLiftModalOpen, setCopyLiftModalOpen] = useState(false);
    const [deleteLiftModalOpen, setDeleteLiftModalOpen] = useState(false);

    return (
        <div>
            <TrainingLiftModal
                isModalOpen={editLiftModalOpen}
                modalPrompt="Edit"
                modalTitle="Edit Lift"
                toggle={() => setEditLiftModalOpen(!editLiftModalOpen)}
                onComplete={() => props.onComplete()}
                workoutId={props.workoutId}
                lift={props.lift}
                mode="edit"
                key="editLift" />
            <TrainingLiftModal
                isModalOpen={copyLiftModalOpen}
                modalPrompt="Copy"
                modalTitle="Copy Lift"
                toggle={() => setCopyLiftModalOpen(!copyLiftModalOpen)}
                onComplete={() => props.onComplete()}
                workoutId={props.workoutId}
                lift={props.lift}
                mode="copy"
                key="copyLift" />
            <DeleteTrainingLiftModal
                isModalOpen={deleteLiftModalOpen}
                toggle={() => setDeleteLiftModalOpen(!deleteLiftModalOpen)}
                onComplete={() => props.onComplete()}
                lift={props.lift}
                key="deleteLift" />
            <Modal
                isOpen={props.isModalOpen}
                toggle={props.toggle}>
                <ModalBody>
                    <Button color='primary' onClick={() => setEditLiftModalOpen(true)}>Edit Lift</Button>{' '}
                    <Button color='secondary' onClick={() => setCopyLiftModalOpen(true)}>Copy Lift</Button>{' '}
                    <Button color='danger' onClick={() => setDeleteLiftModalOpen(true)}>Delete Lift</Button>{' '}
                </ModalBody>
            </Modal>
        </div>
    );
}