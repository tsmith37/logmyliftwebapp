import React, { useState, useEffect } from 'react';
import TrainingProgramDataService from '../../services/training/training-program.service';
import TrainingWorkoutDataService from '../../services/training/training-workout.service';
import { Button, ButtonGroup, Col, Container, Row, Table } from 'reactstrap'
import JwPagination from 'jw-react-pagination';
import { Link, useParams } from 'react-router-dom';
import TrainingWorkoutModal from './training-workout-modal.component';
import DeleteTrainingWorkoutModal from './delete-training-workout-modal.component';

export default function TrainingProgram() {
	let params = useParams();
	const [programId, setProgramId] = useState(params.id);
	const [program, setProgram] = useState("program");
	const [workouts, setWorkouts] = useState([]);
	const [pageOfWorkouts, setPageOfWorkouts] = useState([]);
	const [createWorkoutModalOpen, setCreateWorkoutModalOpen] = useState(false);
	const [copyWorkoutModalOpen, setCopyWorkoutModalOpen] = useState(false);
	const [editWorkoutModalOpen, setEditWorkoutModalOpen] = useState(false);
	const [deleteWorkoutModalOpen, setDeleteWorkoutModalOpen] = useState(false);
	const [activeWorkout, setActiveWorkout] = useState("activeWorkout");
	const [searchTerm, setSearchTerm] = useState("");
	const [expandedRows, setExpandedRows] = useState([]);

	const retriveProgram = () => {
		TrainingProgramDataService.get(params.id)
			.then(response => {
				setProgram(response.data);
			})
			.catch(e => {
				console.log(e);
			});
	}

	const retrieveWorkouts = () => {
		TrainingWorkoutDataService.findByProgramId(params.id, searchTerm)
			.then(response => {
				setWorkouts(response.data);
				setPageOfWorkouts(response.data.slice(0, 10));
			})
			.catch(e => {
				console.log(e);
			});
	}

	const handleRowClick = (e, workout) => {
		setActiveWorkout(workout);

		if (e.target.value != "start") {
			const currentExpandedRows = expandedRows;
			const isRowCurrentlyExpanded = currentExpandedRows.includes(workout.id);

			const newExpandedRows = isRowCurrentlyExpanded ?
				currentExpandedRows.filter(id => id !== workout.id) :
				currentExpandedRows.concat(workout.id);

			setExpandedRows(newExpandedRows);
		}
	}

	const renderTrainingWorkout = (workout) => {
		const itemRows = [
			<tr onClick={(e) => handleRowClick(e, workout)} key={"row-data-" + workout.id} className="bg-light">
			<td>
				<Link to={"/training/workout/" + workout.id}>
					{workout.name}
				</Link>
			</td>
			<td>{workout.description}</td>
			<td>{workout.week}</td>
			<td>{workout.day}</td>
			</tr>
		];

		if (expandedRows.includes(workout.id)) {
			itemRows.push(renderExpandedRow(workout));
		}

		return itemRows;
	}

	const renderExpandedRow = (workout) => {
		return (
			<tr
				key={"row-expanded-1-" + workout.id}
				onClick={() => setActiveWorkout(workout)}
			>
				<td>
					<ButtonGroup>
						<Button disabled={workout.week === 1 && workout.day === 1} onClick={() => move(workout, false)}>Down</Button>
						<Button onClick={() => move(workout, true)}>Up</Button>
					</ButtonGroup>
				</td>
				<td><Button onClick={() => setCopyWorkoutModalOpen(true)}>Copy</Button></td>
				<td><Button onClick={() => setEditWorkoutModalOpen(true)}>Edit</Button></td>
				<td><Button onClick={() => setDeleteWorkoutModalOpen(true)}>Delete</Button></td>
			</tr>
		)
	}

	const renderRows = () => {
		let allRows = [];
		pageOfWorkouts.forEach(workout => {
			const workoutRow = renderTrainingWorkout(workout);
			allRows = allRows.concat(workoutRow);
		});

		return allRows;
	}

	const setWeekDay = (workout, week, day) => {
		return {
			id: workout.id,
			trainingProgramId: workout.trainingProgramId,
			name: workout.name,
			description: workout.description,
			week: week,
			day: day
		};
	}

	const move = (workout, upDownEnum) => {
		if (workout.week === 1 && workout.day === 1 && !upDownEnum) {
			return;
		}

		let newWeek = workout.week;
		let newDay = workout.day;
		if (upDownEnum)
		{
			if (workout.day === 7) {
				newWeek++;
				newDay = 1;
			}
			else {
				newDay++;
            }
		}
		else {
			if (workout.day === 1) {
				newWeek--;
				newDay = 7;
			}
			else {
				newDay--;
            }
        }
		var workoutData = setWeekDay(workout, newWeek, newDay);

		var swappedWorkout = workouts.find(({ week, day }) => (week === newWeek && day === newDay ));
		if (swappedWorkout && swappedWorkout.id != workout.id) {
			var swappedWorkoutData = setWeekDay(swappedWorkout, workout.week, workout.day);
		}

		updateWorkout(workoutData, () => {
			if (swappedWorkout && swappedWorkout.id != workout.id) {
				updateWorkout(swappedWorkoutData, retrieveWorkouts);
			}
			retrieveWorkouts();
		})
	}

	const updateWorkout = (workoutData, onComplete) => {
		TrainingWorkoutDataService.update(workoutData.id, workoutData)
			.then(response => {
				onComplete();
			})
			.catch(e => {
				console.log(e);
			});
	}

	useEffect(() => {
		retriveProgram();
	}, [programId]);

	useEffect(() => {
		retrieveWorkouts();
	}, [programId, searchTerm]);

	return (
		<div>
			<Container>
				<Row>
					<Col xs="auto">
						<h4>{program.name}</h4>
					</Col>
					<Col xs="auto">
						<h6>{program.description}</h6>
					</Col>
				</Row>
			</Container>
			<Container>
				<Row>
					<Col xs="auto">
						<input
							type="text"
							className="form-control"
							placeholder="Search by name"
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</Col>
					<Col xs="1">
						<Button color="primary" onClick={() => setCreateWorkoutModalOpen(true)}>
							Create
						</Button>
					</Col>
				</Row>
			</Container>
			<TrainingWorkoutModal
				isModalOpen={editWorkoutModalOpen}
				modalPrompt="Edit"
				modalTitle="Edit Workout"
				toggle={() => setEditWorkoutModalOpen(!editWorkoutModalOpen)}
				onComplete={() => retrieveWorkouts()}
				workout={activeWorkout}
				programId={programId}
				mode="edit"
				key={"edit" + (activeWorkout ? activeWorkout.id : 0)} />
			<TrainingWorkoutModal
				isModalOpen={createWorkoutModalOpen}
				modalPrompt="Create"
				modalTitle="Create Workout"
				toggle={() => setCreateWorkoutModalOpen(!createWorkoutModalOpen)}
				onComplete={() => retrieveWorkouts()}
				programId={programId}
				mode="create"
				key={"addWorkout"} />
			<TrainingWorkoutModal
				isModalOpen={copyWorkoutModalOpen}
				modalPrompt="Copy"
				modalTitle="Copy Workout"
				toggle={() => setCopyWorkoutModalOpen(!copyWorkoutModalOpen)}
				onComplete={() => retrieveWorkouts()}
				workout={activeWorkout}
				programId={programId}
				mode="copy"
				key={"copyWorkout"} />
			<DeleteTrainingWorkoutModal
				isModalOpen={deleteWorkoutModalOpen}
				modalPrompt="Delete"
				modalTitle="Delete Workout"
				toggle={() => setDeleteWorkoutModalOpen(!deleteWorkoutModalOpen)}
				onComplete={() => retrieveWorkouts()}
				workout={activeWorkout}
				key={"delete" + (activeWorkout ? activeWorkout.id : 0)} />
			<Table hover>
				<thead>
					<tr>
						<th>Workout</th>
						<th>Description</th>
						<th>Week</th>
						<th>Day</th>
					</tr>
				</thead>
				<tbody>
					{renderRows()}
				</tbody>
			</Table>
			<JwPagination items={workouts} onChangePage={data => setPageOfWorkouts(data)} />
		</div>
	)
}