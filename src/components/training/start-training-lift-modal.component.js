import { Button, InputGroup, InputGroupText, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import LiftDataService from '../../services/lift.service';
import { ExerciseSelector } from '../exercise-selector.component';
import WorkoutSelector from '../workout-selector.component';

export default function StartTrainingLiftModal(props) {   
    const [trainingLift, setTrainingLift] = useState(props.trainingLift);
    const [workout, setWorkout] = useState(-1);
    const [weight, setWeight] = useState(0);
    const [reps, setReps] = useState(0);
    const [description, setDescription] = useState("");
    const [exerciseId, setExerciseId] = useState(-1);
    const [message, setMessage] = useState("");

    useEffect(() =>
    {
        if (props.trainingLift)
        {
            setReps(props.trainingLift.reps ? props.trainingLift.reps : 0);
            setDescription(props.trainingLift.description ? props.trainingLift.description : "");
            setExerciseId(props.trainingLift.exerciseId);
            setTrainingLift(props.trainingLift);
        }
    }, [props]);

    const validateLift = () => {
        if (!workout || workout.id <= 0) {
            setMessage('Workout is not properly loaded.');
            return false;
        }
        else if (!exerciseId || exerciseId <= 0) {
            setMessage('Exercise is not properly loaded.');
            return false;
        }
        else if (!trainingLift || trainingLift.id <= 0) {
            setMessage('Training lift is not properly loaded.');
            return false;
        }
        else if (!weight || weight <= 0) {
            setMessage('Weight is not valid.');
            return false;
        }
        else if (!reps || reps <= 0) {
            setMessage('Reps is not valid.');
            return false;
        }

        return true;
    }

    const createLift = () => {
        var data =
        {
            exerciseId: exerciseId,
            workoutId: workout.id,
            weight: weight,
            reps: reps,
            description: description
        };

        LiftDataService.create(data)
            .then(response => {
                props.onComplete();
                props.toggle();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const execute = () => {
        if (!validateLift()) { return; }

        createLift();

        props.toggle();
    }

    return (
        <Modal
            isOpen={props.isModalOpen}
            toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>{props.modalTitle}</ModalHeader>
            <ModalBody>
                <WorkoutSelector onSelect={ex => setWorkout(ex)}/>
                <br />
                <p>Adding to workout: {workout ? new Date(workout.createdAt).toLocaleDateString() + " - " + workout.description : "Select a workout"}</p>
                <br />
                <ExerciseSelector getInputData={ex => setExerciseId(ex)} defaultExerciseId={exerciseId} />
                <br />
                <InputGroup>
                    <Input placeholder="Weight" min={0} max={9999} type="number" step="5" onChange={e => setWeight(e.target.value)} value={weight} />
                    <InputGroupText>lbs</InputGroupText>
                </InputGroup>
                <br />
                <InputGroup>
                    <Input placeholder="Reps" min={0} max={9999} type="number" step="1" onChange={e => setReps(e.target.value)} value={reps} />
                    <InputGroupText>reps</InputGroupText>
                </InputGroup>
                <br />
                <InputGroup>
                    <Input placeholder="Description" onChange={e => setDescription(e.target.value)} value={description} />
                </InputGroup>
                <br />
                <p>{message}</p>
            </ModalBody>
            <ModalFooter>
                <Button color='primary' onClick={() => execute()}>{props.modalPrompt}Create</Button>{' '}
                <Button color='secondary' onClick={props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}