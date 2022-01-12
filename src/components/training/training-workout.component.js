import React, { useState, useEffect } from 'react';
import TrainingLiftDataService from '../../services/training/training-lift.service';
import TrainingProgramDataService from '../../services/training/training-program.service';
import TrainingWorkoutDataService from '../../services/training/training-workout.service';
import TrainingLiftModal from './training-lift-modal.component';
import DeleteTrainingLiftModal from './delete-training-lift-modal.component';
import StartTrainingLiftModal from './start-training-lift-modal.component';
import StartTrainingWorkoutModal from './start-training-workout-modal.component';
import { Button, ButtonGroup, Col, Container, Row, Table } from 'reactstrap';
import JwPagination from 'jw-react-pagination';
import { useNavigate, useParams } from 'react-router-dom';

export default function TrainingWorkout() {
	let params = useParams();
	const [workoutId, setWorkoutId] = useState(params.id);
	const [workout, setWorkout] = useState("workout");
	const [program, setProgram] = useState("program");
	const [lifts, setLifts] = useState([]);
	const [pageOfLifts, setPageOfLifts] = useState([]);
	const [activeLift, setActiveLift] = useState("");
	const [startWorkoutModalOpen, setStartWorkoutModalOpen] = useState(false);
	const [createLiftModalOpen, setCreateLiftModalOpen] = useState(false);
	const [editLiftModalOpen, setEditLiftModalOpen] = useState(false);
	const [copyLiftModalOpen, setCopyLiftModalOpen] = useState(false);
	const [deleteLiftModalOpen, setDeleteLiftModalOpen] = useState(false);
	const [startLiftModalOpen, setStartLiftModalOpen] = useState(false);
	const [expandedRows, setExpandedRows] = useState([]);
	const navigate = useNavigate();

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
				setPageOfLifts(response.data.slice(0, 10));
			})
			.catch(e => {
				console.log(e);
			});
	}

	const handleRowClick = (e, lift) => {
		setActiveLift(lift);

		if (e.target.value != "start") {
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
				<td><Button value="start" onClick={() => setStartLiftModalOpen(!startLiftModalOpen)}>Start</Button></td>
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
					<ButtonGroup>
						<Button disabled={lift.sequence === 1} onClick={() => move(lift, false)}>Down</Button>
						<Button onClick={() => move(lift, true)}>Up</Button>
					</ButtonGroup>
				</td>
				<td><Button color='primary' onClick={() => setEditLiftModalOpen(!editLiftModalOpen)}>Edit</Button></td>
				<td><Button color='secondary' onClick={() => setCopyLiftModalOpen(!copyLiftModalOpen)}>Copy</Button></td>
				<td><Button color='danger' onClick={() => setDeleteLiftModalOpen(!deleteLiftModalOpen)}>Delete</Button></td>
				<td/>
			</tr>
		)
    }

	const renderRows = () => {
		let allRows = [];
		pageOfLifts.forEach(lift => {
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

	const redirectWorkout = (id) => {
		navigate('/workout/' + id);
	}

	return (
		<div>
			<Container>
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
			<Container>
				<Row>
					<Col xs="2">
						<Button color="primary" onClick={() => setStartWorkoutModalOpen(true)}>
							Start
						</Button>
					</Col>
					<Col xs="2">
						<Button color="primary" onClick={() => setCreateLiftModalOpen(true)}>
							Create
						</Button>
					</Col>
					<Col xs="2">
						<Button color="primary" onClick={() => fixSequence()}>
							Sequence
						</Button>
					</Col>
				</Row>
			</Container>
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
			<StartTrainingLiftModal
				isModalOpen={startLiftModalOpen}
				modalTitle="Start Lift"
				toggle={() => setStartLiftModalOpen(!startLiftModalOpen)}
				onComplete={() => { }}
				trainingLift={activeLift}
			/>
			<StartTrainingWorkoutModal
				isModalOpen={startWorkoutModalOpen}
				modalTitle="Start Workout"
				toggle={() => setStartWorkoutModalOpen(!startWorkoutModalOpen)}
				onComplete={(e) => redirectWorkout(e)}
				trainingWorkout={workout}
				trainingProgram={program}
			/>
			<Table hover>
				<thead>
					<tr>
						<th>Sequence</th>
						<th>Exercise</th>
						<th>Reps</th>
						<th>Description</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{renderRows()}
				</tbody>
			</Table>
			<JwPagination items={lifts} onChangePage={data => setPageOfLifts(data)} />
		</div>
	)
}