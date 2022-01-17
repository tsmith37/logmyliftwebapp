import React, { useEffect, useState } from 'react';
import { Alert, Button, Input, InputGroup, InputGroupText, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import TrainingLiftDataService from '../../services/training/training-lift.service';

import { ExerciseSelector } from '../exercise-selector.component';

export default function TrainingLiftModal(props) {
    const [mode, setMode] = useState(props.mode);
    const [lift, setLift] = useState(props.lift);
    const [workoutId, setWorkoutId] = useState(props.workoutId);
    const [sequence, setSequence] = useState(1);
    const [reps, setReps] = useState(0);
    const [description, setDescription] = useState("");
    const [exerciseId, setExerciseId] = useState(-1);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if ((props.mode === "edit" || props.mode === "copy") && props.lift)
        {
            setSequence(props.lift.sequence);
            setReps(props.lift.reps ? props.lift.reps : 0);
            setDescription(props.lift.description ? props.lift.description : "");
            setExerciseId(props.lift.exerciseId);
            setWorkoutId(props.lift.trainingWorkoutId);
        }
    }, [props]);

    const liftPromptEnabled = () => {
        if (!workoutId || workoutId <= 0) {
            return false;
        }
        else if (!exerciseId || exerciseId <= 0) {
            return false;
        }
        else if (!sequence || sequence <= 0) {
            return false;
        }
        else if (mode === "edit" && !lift) {
        }

        return true;
    }

    const validateLift = () => {
        if (!workoutId || workoutId <= 0) {
            setMessage('Workout is not properly loaded.');
            return false;
        }
        else if (!exerciseId || exerciseId <= 0) {
            setMessage('Exercise is not properly loaded.');
            return false;
        }
        else if (!sequence || sequence <= 0) {
            setMessage('Sequence is not valid.');
            return false;
        }
        else if (mode === "edit" && !lift) {
            setMessage('Lift not properly loaded and mode is set to edit.');
        }

        return true;
    }

    const createLift = () => {
        var data =
        {
            trainingWorkoutId: workoutId,
            sequence: sequence,
            reps: reps,
            description: description,
            exerciseId: exerciseId
        };

        TrainingLiftDataService.create(data)
            .then(response => {
                props.onComplete();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const editLift = () => {
        var data =
        {
            id: props.lift.id,
            trainingWorkoutId: workoutId,
            sequence: sequence,
            reps: reps,
            description: description,
            exerciseId: exerciseId
        };

        TrainingLiftDataService.update(data)
            .then(response => { 
                props.onComplete();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const execute = () => {
        if (!validateLift()) { return; }

        if (mode === "edit") {
            editLift();
        }
        else {
            createLift();
        }

        props.toggle();
    }

    return (
        <Modal
            isOpen={props.isModalOpen}
            toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>{props.modalTitle}</ModalHeader>
            <ModalBody>
                <ExerciseSelector getInputData={ex => setExerciseId(ex)} defaultExerciseId={exerciseId} />
                <br />
                <InputGroup>
                    <Input placeholder="Description" onChange={e => setDescription(e.target.value)} value={description} />
                </InputGroup>
                <br />
                <InputGroup>
                    <InputGroupText>Sequence #</InputGroupText>
                    <Input placeholder="Sequence" min={1} max={9999} type="number" step="1" onChange={e => setSequence(e.target.value)} value={sequence} />
                </InputGroup>
                <br />
                <InputGroup>
                    <Input placeholder="Reps" min={0} max={9999} type="number" step="1" onChange={e => setReps(e.target.value)} value={reps} />
                    <InputGroupText>reps</InputGroupText>
                </InputGroup>
                <br />
                <Alert color="danger" isOpen={message !== ""}>{message}</Alert>
            </ModalBody>
            <ModalFooter>
                <Button color='primary' disabled={!liftPromptEnabled()} onClick={() => execute()}>{props.modalPrompt}</Button>{' '}
                <Button color='secondary' onClick={props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}