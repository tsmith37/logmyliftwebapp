import React, { useState, useEffect } from 'react';
import { Alert, Button, Col, Collapse, Container, Form, Input, InputGroup, InputGroupText, Label, Row, Table } from 'reactstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import LiftDataService from '../../services/lift.service';
import TrainingLiftDataService from '../../services/training/training-lift.service';
import WorkoutDataService from '../../services/workout.service';

import { ExerciseSelector } from '../exercise-selector.component';

export default function StartTrainingLift(props) {
    let location = useLocation();
    const [trainingWorkout, setTrainingWorkout] = useState(location.state.trainingWorkout);
    const [workoutId, setWorkoutId] = useState(location.state.workoutId);
    const [trainingLift, setTrainingLift] = useState(location.state.trainingLift);

    const [weight, setWeight] = useState();
    const [reps, setReps] = useState(location.state.trainingLift ? location.state.trainingLift.reps : 0);
    const [description, setDescription] = useState(location.state.trainingLift ? location.state.trainingLift.description : "");
    const [exerciseId, setExerciseId] = useState(location.state.trainingLift ? location.state.trainingLift.exerciseId : -1);
    const [message, setMessage] = useState("");

    const [workoutDescription, setWorkoutDescription] = useState("");
    const [workoutStartTime, setWorkoutStartTime] = useState("");

    const [totalLifts, setTotalLifts] = useState(1);

    const [showExerciseLifts, setShowExerciseLifts] = useState(false);
    const [exerciseLifts, setExerciseLifts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        let isPlannedExerciseChange = (location.state.trainingLift.exerciseId !== trainingLift.exerciseId);

        setTrainingWorkout(location.state.trainingWorkout);
        setWorkoutId(location.state.workoutId);
        setTrainingLift(location.state.trainingLift);
        if (location.state.trainingLift && (location.state.trainingLift.exerciseId !== exerciseId)) {
            setWeight("");
        }

        setReps(location.state.trainingLift ? location.state.trainingLift.reps : 0);
        setDescription(location.state.trainingLift ? location.state.trainingLift.description : "");
        setExerciseId(isPlannedExerciseChange ? location.state.trainingLift.exerciseId : exerciseId);
        setMessage("");
    }, [location]);

    useEffect(() => {
        WorkoutDataService.get(location.state.workoutId)
            .then(response => {
                setWorkoutDescription(response.data.description);
                setWorkoutStartTime(response.data.createdAt);
            })
            .catch(e => {
                console.log(e);
            });
    }, [workoutId]);

    useEffect(() => {
        findTotalLiftCount();
    }, [trainingWorkout]);

    useEffect(() => {
        LiftDataService.findByExerciseId(exerciseId)
            .then(response => {
                setExerciseLifts(response.data.slice(0, 10));
                setShowExerciseLifts(false);
            })
            .catch(e => {
                console.log(e);
            });
    }, [exerciseId])

    const findTotalLiftCount = () => {
        TrainingLiftDataService.findByWorkoutId(trainingWorkout.id)
            .then(response => {
                let trainingLifts = response.data;
                if (trainingLifts) {
                    setTotalLifts(Math.max.apply(Math, trainingLifts.map((x) => { return x.sequence; })));
                }
                else {
                    setTotalLifts(0);
                }
            })
            .catch(e => {
                console.log(e);
            });
    }


    const navigateNextTrainingLift = () => {
        TrainingLiftDataService.findByWorkoutId(trainingWorkout.id)
            .then(response => {
                let remainingTrainingLifts = response.data.filter(lift => lift.sequence > trainingLift.sequence);
                if (!remainingTrainingLifts || !remainingTrainingLifts.length) {
                    endWorkout();
                }
                else {
                    let nextTrainingLift = remainingTrainingLifts[0];
                    navigate('/training/workout/start', { state: { "workoutId": workoutId, "trainingWorkout": trainingWorkout, "trainingLift": nextTrainingLift } });
                }
            })
            .catch(e => {
                console.log(e);
            });
    }

    const liftAddEnabled = () => {
        if (!workoutId || workoutId <= 0) {
            return false;
        }
        else if (!exerciseId || exerciseId <= 0) {
            return false;
        }
        else if (!trainingLift || trainingLift.id <= 0) {
            return false;
        }
        else if (!weight || weight <= 0) {
            return false;
        }
        else if (!reps || reps <= 0) {
            return false;
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
        if (!validateLift()) { return; }

        var data =
        {
            exerciseId: exerciseId,
            workoutId: workoutId,
            weight: weight,
            reps: reps,
            description: description
        };

        LiftDataService.create(data)
            .then(response => {
                navigateNextTrainingLift()
            })
            .catch(e => {
                console.log(e);
            });
    }

    const skipLift = () => {
        navigateNextTrainingLift();
    }

    const endWorkout = () => {
        navigate('/workout/' + workoutId);
    }

    const renderRows = () => {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Weight</th>
                        <th>Reps</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {exerciseLifts &&
                        exerciseLifts.map((lift, index) => (
                            <tr key={index}>
                                <td>{new Date(lift.createdAt).toLocaleDateString()}</td>
                                <td>{new Date(lift.createdAt).toLocaleTimeString()}</td>
                                <td>{lift.weight}</td>
                                <td>{lift.reps}</td>
                                <td>{lift.description}</td>
                            </tr>
                        ))}
                </tbody>
            </Table>
        );
    }

    return (        
        <Container fluid={true}>
            <div>
                <Form>
                    <Link className="text-dark" to={'/workout/' + workoutId}>
                        <h4>{workoutDescription} - {new Date(workoutStartTime).toLocaleDateString()}</h4>
                    </Link>
                    <h5>Continue training...</h5>
                    <ExerciseSelector getInputData={ex => setExerciseId(ex)} defaultExerciseId={trainingLift.exerciseId} />
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
                    <Label for="description">Description</Label>
                    <InputGroup xs="auto">
                        <Input id="description" placeholder="Workout description" onChange={e => setDescription(e.target.value)} value={description} />
                    </InputGroup>   
                    <br />
                    <Alert color="danger" isOpen={message !== ""}>{message}</Alert>
                    <br />
                    <p>{trainingLift.sequence} / {totalLifts}</p>
                    <Button color="primary" disabled={!liftAddEnabled()} onClick={() => createLift()}>Add</Button>{' '}
                    <Button color="secondary" onClick={() => skipLift()}>Skip</Button>{' '}
                    <Button color="danger" onClick={() => endWorkout()}>End</Button>
                    <br />
                    <br />
                    <Button onClick={() => setShowExerciseLifts(!showExerciseLifts)}>View previous lifts for exercise</Button>
                    <Collapse isOpen={showExerciseLifts}>
                        {renderRows()}
                    </Collapse>
                </Form>
            </div>        
        </Container>
    )
}