import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Container, Row, Table } from 'reactstrap';
import { useParams } from 'react-router-dom';

import TrainingLiftDataService from '../../services/training/training-lift.service';
import TrainingProgramDataService from '../../services/training/training-program.service';
import TrainingWorkoutDataService from '../../services/training/training-workout.service';

import DeleteTrainingLiftModal from './delete-training-lift-modal.component';
import TrainingLiftModal from './training-lift-modal.component';
import TrainingWorkoutModal from './training-workout-modal.component';

export default function TrainingWorkoutEditor() {
	let params = useParams();
	const [workoutId, setWorkoutId] = useState(params.id);
	const [workout, setWorkout] = useState("workout");
	const [program, setProgram] = useState("program");
	const [lifts, setLifts] = useState([]);
	const [activeLift, setActiveLift] = useState("");
	const [editWorkoutModalOpen, setEditWorkoutModalOpen] = useState(false);
	const [createLiftModalOpen, setCreateLiftModalOpen] = useState(false);
	const [editLiftModalOpen, setEditLiftModalOpen] = useState(false);
	const [copyLiftModalOpen, setCopyLiftModalOpen] = useState(false);
	const [deleteLiftModalOpen, setDeleteLiftModalOpen] = useState(false);
	const [expandedRows, setExpandedRows] = useState([]);

	const retrieveWorkout = () => {
		TrainingWorkoutDataService.get(params.id)
			.then(response => {
				setWorkout(response.data);
				retrieveProgram(response.data.trainingProgramId);
			})
			.catch(e => {
				console.log(e);
			});
	}

	const retrieveProgram = (programId) => {
		TrainingProgramDataService.get(programId)
			.then(response => {
				setProgram(response.data);
			})
			.catch(e => {
				console.log(e);
			});
	}

	const retrieveLifts = () => {
		TrainingLiftDataService.findByWorkoutId(params.id)
			.then(response => {
				setLifts(response.data);
			})
			.catch(e => {
				console.log(e);
			});
	}

	const handleRowClick = (e, lift) => {
		setActiveLift(lift);

		if (e.target.value != "up" && e.target.value != "down") {
			const currentExpandedRows = expandedRows;
			const isRowCurrentlyExpanded = currentExpandedRows.includes(lift.id);

			const newExpandedRows = isRowCurrentlyExpanded ?
				currentExpandedRows.filter(id => id !== lift.id) :
				currentExpandedRows.concat(lift.id);

			setExpandedRows(newExpandedRows);
		}
	}

	const renderTrainingLift = (lift) => {
		const itemRows = [
			<tr onClick={(e) => handleRowClick(e, lift)} key={"row-data-" + lift.id} className="bg-light">
				<td>{lift.sequence}</td>
				<td>{lift.exercise ? lift.exercise.name : "Exercise"}</td>
				<td>{lift.reps}</td>
				<td>{lift.description}</td>			
				<td>
					<ButtonGroup>
						<Button value="down" disabled={lift.sequence === 1} onClick={() => move(lift, false)}>Down</Button>
						<Button value="up" onClick={() => move(lift, true)}>Up</Button>
					</ButtonGroup>
				</td>
			</tr>
		];

		if (expandedRows.includes(lift.id)) {
			itemRows.push(renderExpandedRow(lift));
		}

		return itemRows;
	}

	const renderExpandedRow = (lift) => {
		return (
			<tr
				key={"row-expanded-1-" + lift.id}
				onClick={() => setActiveLift(lift)}
			>
				<td>
					<Button color='primary' onClick={() => setEditLiftModalOpen(!editLiftModalOpen)}>Edit</Button>{' '}
					<Button color='secondary' onClick={() => setCopyLiftModalOpen(!copyLiftModalOpen)}>Copy</Button>{' '}
					<Button color='danger' onClick={() => setDeleteLiftModalOpen(!deleteLiftModalOpen)}>Delete</Button>
				</td>
				<td />
				<td />
				<td />
				<td />
			</tr>
		)
    }

	const renderRows = () => {
		let allRows = [];
		lifts.forEach(lift => {
			const liftRow = renderTrainingLift(lift);
			allRows = allRows.concat(liftRow);
		});

		return allRows;
	}

	useEffect(() => {
		retrieveWorkout();
		retrieveLifts();
	}, [workoutId]);

	const fixSequence = () => {
		let sortedLifts = lifts.sort((a, b) => a.sequence - b.sequence);
		let seq = 1;
		for (const lift of sortedLifts) {

			var data = setSequence(lift, seq);
			updateLift(data, retrieveLifts);

			seq++;
		}
	}

	const move = (lift, upDownEnum) => {
		if (lift.sequence === 1 && !upDownEnum) {
			return;
		}

		var liftData = setSequence(lift, upDownEnum ? lift.sequence + 1 : lift.sequence - 1);

		var swappedLift = lifts.find(({ sequence }) => sequence === (upDownEnum ? lift.sequence + 1 : lift.sequence - 1));
		if (swappedLift && swappedLift.id != lift.id) {
			var swappedLiftData = setSequence(swappedLift, lift.sequence);
		}

		updateLift(liftData, () => {
			if (swappedLift && swappedLift.id != lift.id) {
				updateLift(swappedLiftData, retrieveLifts);
			}
			retrieveLifts();
		})
	}

	const setSequence = (lift, sequence) => {
		return {
			id: lift.id,
			trainingWorkoutId: lift.trainingWorkoutId,
			sequence: sequence,
			reps: lift.reps,
			description: lift.description,
			exerciseId: lift.exerciseId
		};
	}

	const updateLift = (liftData, onComplete) => {
		TrainingLiftDataService.update(liftData)
			.then(response => {
				onComplete();
			})
			.catch(e => {
				console.log(e);
			});
	}

	return (
		<div>
			<Container fluid={true}>
				<Row>
					<Col xs="auto">
						<h4>{program.name}</h4>
					</Col>
				</Row>
				<Row>
					<Col xs="auto">
						<h2>{workout.name} - Week {workout.week} Day {workout.day}</h2>
					</Col>
				</Row>
			</Container>
			<Container fluid={true}>
				<Button color="primary" onClick={() => setEditWorkoutModalOpen(true)}>Edit</Button>{' '}
				<Button color="success" onClick={() => setCreateLiftModalOpen(true)}>Create</Button>{' '}
				<Button color="info" onClick={() => fixSequence()}>Sequence</Button>
			</Container>
			<TrainingWorkoutModal
				isModalOpen={editWorkoutModalOpen}
				modalPrompt="Edit"
				modalTitle="Edit Workout"
				toggle={() => setEditWorkoutModalOpen(!editWorkoutModalOpen)}
				onComplete={() => retrieveWorkout()}
				workout={workout}
				programId={program.id}
				mode="edit"
				key={"editWorkout"} />
			<TrainingLiftModal
				isModalOpen={createLiftModalOpen}
				modalPrompt="Create"
				modalTitle="Create Lift"
				toggle={() => setCreateLiftModalOpen(!createLiftModalOpen)}
				onComplete={() => retrieveLifts()}
				workoutId={workoutId}
				mode="create"
				key="createLift" />
			<TrainingLiftModal
				isModalOpen={editLiftModalOpen}
				modalPrompt="Edit"
				modalTitle="Edit Lift"
				toggle={() => setEditLiftModalOpen(!editLiftModalOpen)}
				onComplete={() => retrieveLifts()}
				workoutId={workoutId}
				lift={activeLift}
				mode="edit"
				key="editLift" />
			<TrainingLiftModal
				isModalOpen={copyLiftModalOpen}
				modalPrompt="Copy"
				modalTitle="Copy Lift"
				toggle={() => setCopyLiftModalOpen(!copyLiftModalOpen)}
				onComplete={() => retrieveLifts()}
				workoutId={workoutId}
				lift={activeLift}
				mode="copy"
				key="copyLift" />
			<DeleteTrainingLiftModal
				isModalOpen={deleteLiftModalOpen}
				toggle={() => setDeleteLiftModalOpen(!deleteLiftModalOpen)}
				onComplete={() => retrieveLifts()}
				lift={activeLift}
				key="deleteLift" />
			<Container fluid={true}>
			<Table hover>
				<thead>
					<tr>
						<th>Sequence</th>
						<th>Exercise</th>
						<th>Reps</th>
						<th>Description</th>
						<th>Move</th>
					</tr>
				</thead>
				<tbody>
					{renderRows()}
				</tbody>
				</Table>
			</Container>
		</div>
	)
}