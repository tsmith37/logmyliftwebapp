import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Input, InputGroup, Label } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';

import TrainingLiftDataService from '../../services/training/training-lift.service';
import TrainingProgramDataService from '../../services/training/training-program.service';
import TrainingWorkoutDataService from '../../services/training/training-workout.service';
import WorkoutDataService from '../../services/workout.service';

import WorkoutSelector from '../workout-selector.component';

export default function StartTrainingWorkout() {
    let params = useParams();
    const [trainingWorkoutId, setTrainingWorkoutId] = useState(params.id);
    const [trainingWorkout, setTrainingWorkout] = useState();
    const [description, setDescription] = useState("");
    const [selectedWorkoutId, setSelectedWorkoutId] = useState(-1);
    const navigate = useNavigate();

    useEffect(() => {
        if (params.id) {
            retrieveTrainingWorkout();
        }
    }, [trainingWorkoutId]);

    const retrieveTrainingWorkout = () => {
        TrainingWorkoutDataService.get(params.id)
            .then(response => {
                setTrainingWorkout(response.data);
                retrieveProgram(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const retrieveProgram = (trainingWorkout) => {
        TrainingProgramDataService.get(trainingWorkout.trainingProgramId)
            .then(response => {
                setDefaultDescription(trainingWorkout, response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const setDefaultDescription = (trainingWorkout, program) => {
        setDescription(trainingWorkout && program ?
            program.name + " W" + trainingWorkout.week + "D" + trainingWorkout.day + " - " + trainingWorkout.name
            : "");
    }

    const navigateFirstTrainingLift = (workoutId) => {
        TrainingLiftDataService.findByWorkoutId(trainingWorkout.id)
            .then(response => {
                let trainingLifts = response.data;
                if (!trainingLifts || !trainingLifts.length) {
                    navigate('/workout/' + workoutId);
                }
                else {
                    let firstTrainingLift = trainingLifts[0];
                    navigate('/training/workout/start', { state: { "workoutId": workoutId, "trainingWorkout": trainingWorkout, "trainingLift": firstTrainingLift } });
                }
            })
            .catch(e => {
                console.log(e);
            });
    }

    const startWorkout = () => {
        var data =
        {
            description: description
        };

        WorkoutDataService.create(data)
            .then(response => {
                let workoutId = response.data.id;
                navigateFirstTrainingLift(workoutId);
            })
            .catch(e => {
                console.log(e);
            });
    }

    const startExistingWorkout = () => {
        if (selectedWorkoutId !== -1) {
            navigateFirstTrainingLift(selectedWorkoutId);
        }
    }

    return (
        <Container fluid={true}>
            <div>
                <Form>
                    <h4>Start Workout</h4>
                    <Label for="description">Description</Label>
                    <InputGroup xs="auto">
				        <Input id="description" placeholder="Workout description" onChange={e => setDescription(e.target.value)} value={description} />
                    </InputGroup>
                    <br/>
                    <Button color="primary" onClick={() => startWorkout()}>Start</Button>
                    <br />
                    <br />
                    <Label for="workoutSelector">Want to use an existing workout? Select it below:</Label>
                    <br />
                    <WorkoutSelector name="workoutSelector" onSelect={ex => setSelectedWorkoutId(ex.id)} />
                    <br />
                    <Button color="secondary" disabled={selectedWorkoutId < 1} onClick={() => startExistingWorkout()}>Use Existing</Button>
                </Form>
            </div>
        </Container>
    )
}