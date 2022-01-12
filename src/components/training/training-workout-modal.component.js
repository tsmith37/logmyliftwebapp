import { Button, InputGroup, InputGroupText, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import TrainingWorkoutDataService from '../../services/training/training-workout.service';

export default function TrainingWorkoutModal(props) {    
    const [workout, setWorkout] = useState(props.workout);
    const [programId, setProgramId] = useState(props.programId);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [week, setWeek] = useState(0);
    const [day, setDay] = useState(0);
    const [mode, setMode] = useState("create");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (props.workout)
        {
            setProgramId(workout.trainingProgramId);
            setName(workout.name);
            setDescription(workout.description ? workout.description : "");
            setWeek(workout.week ? workout.week : 0);
            setDay(workout.day ? workout.day : 1);
            setMode("edit");
        }
    }, [workout]);

    const validateWorkout = () => {
        if (!programId || programId <= 0)
        {
            setMessage('Program not properly loaded.');
            return false;
        }
        else if (name === '') {
            setMessage('Name is not valid.');
            return false;
        }       
        else if (week <= 0) {
            setMessage('Week is not valid.');
            return false;
        }
        else if (day <= 0) {
            setMessage('Day is not valid.');
            return false;
        }
        else if (mode === "edit" && workout.id <= 0) {
            setMessage('Workout not properly loaded.');
            return false;
        }

        return true;
    }

    const createWorkout = () => {
        var data =
        {
            trainingProgramId: programId,
            name: name,
            description: description,
            week: week,
            day: day
        };

        TrainingWorkoutDataService.create(data)
            .then(response => {
                props.onComplete();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const editWorkout = () => {
        var data =
        {
            id: workout.id,
            trainingProgramId: workout.trainingProgramId,
            name: name,
            description: description,
            week: week,
            day: day
        };

        TrainingWorkoutDataService.update(workout.id, data)
            .then(response => {
                props.onComplete();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const execute = () => {
        if (!validateWorkout()) { return; }

        if (mode === "edit") {
            editWorkout();
        }
        else
        {
            createWorkout();
        }

        props.toggle();
    }

    return (
        <Modal
            isOpen={props.isModalOpen}
            toggle={props.toggle}>
            <ModalHeader toggle={props.toggle}>{props.modalTitle}</ModalHeader>
            <ModalBody>
                <InputGroup>
                    <Input placeholder="Name" onChange={e => setName(e.target.value)} value={name} />
                    <Input placeholder="Description" onChange={e => setDescription(e.target.value)} value={description} />
                </InputGroup>
                <br />
                <InputGroup>
                    <InputGroupText>Week</InputGroupText>
                    <Input placeholder="#" min={1} max={9999} type="number" step="1" onChange={e => setWeek(e.target.value)} value={week} />                    
                </InputGroup>
                <br />
                <InputGroup>
                    <InputGroupText>Day</InputGroupText>
                    <Input placeholder="#" min={1} max={7} type="number" step="1" onChange={e => setDay(e.target.value)} value={day} />
                </InputGroup>
                <p>{message}</p>
            </ModalBody>
            <ModalFooter>
                <Button color='primary' onClick={() => execute()}>{props.modalPrompt}</Button>{' '}
                <Button color='secondary' onClick={props.toggle}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}