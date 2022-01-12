import { Button, InputGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import WorkoutDataService from '../../services/workout.service';

export default function StartTrainingWorkoutModal(props) {
    const [trainingWorkout, setTrainingWorkout] = useState(props.trainingWorkout);
    const [trainingProgram, setTrainingProgram] = useState(props.trainingProgram);
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (props.trainingWorkout) {
            setDescription(props.trainingWorkout && props.trainingProgram ? 
                props.trainingProgram.name + " W" + props.trainingWorkout.week + "D" + props.trainingWorkout.day + " - " + props.trainingWorkout.name
                : "");
            setTrainingWorkout(props.trainingWorkout);
        }
    }, [props]);

    const validateWorkout = () => {
        if (!trainingWorkout || trainingWorkout.id <= 0) {
            setMessage('Workout is not properly loaded.');
            return false;
        }
        else if (!trainingProgram || trainingProgram <= 0) {
            setMessage('Program is not properly loaded.');
            return false;
        }
        else if ((description === '')) {
            setMessage('Description is not valid.');
            return false;
        }

        return true;
    }

    const createWorkout = () => {
        var data =
        {
            description: description
        };

        WorkoutDataService.create(data)
            .then(response => {
                props.onComplete(response.data.id);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const execute = () => {
        if (!validateWorkout()) { return; }

        createWorkout();

        props.toggle();
    }

    return (
        <Modal
			isOpen={props.isModalOpen}
			toggle={props.toggle}>
			<ModalHeader toggle={props.toggle}>{props.modalTitle}</ModalHeader>
			<ModalBody>
				<InputGroup>
					<Input placeholder="Description" onChange={e => setDescription(e.target.value)} value={description} />
				</InputGroup>
				<p>{message}</p>
			</ModalBody>
			<ModalFooter>
				<Button color='primary' onClick={() => execute()}>{props.modalPrompt}Create</Button>{' '}
				<Button color='secondary' onClick={props.toggle}>Cancel</Button>
			</ModalFooter>
        </Modal>
    )
}