import React, { useState, useEffect } from 'react';
import TrainingProgramDataService from '../../services/training/training-program.service';
import TrainingWorkoutDataService from '../../services/training/training-workout.service';
import { Button, Col, Container, Row, Table } from 'reactstrap'
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
	const [editWorkoutModalOpen, setEditWorkoutModalOpen] = useState(false);
	const [deleteWorkoutModalOpen, setDeleteWorkoutModalOpen] = useState(false);
	const [activeWorkout, setActiveWorkout] = useState("activeWorkout");
	const [searchTerm, setSearchTerm] = useState("");

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
				key={"edit" + (activeWorkout ? activeWorkout.id : 0)} />
			<TrainingWorkoutModal
				isModalOpen={createWorkoutModalOpen}
				modalPrompt="Create"
				modalTitle="Create Workout"
				toggle={() => setCreateWorkoutModalOpen(!createWorkoutModalOpen)}
				onComplete={() => retrieveWorkouts()}
				programId={programId}
				key={"addWorkout"} />
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
						<th>Start</th>
						<th>Edit</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{workouts &&
						pageOfWorkouts.map((workout, index) => (
							<tr key={index}
								onClick={() => setActiveWorkout(workout)}
							>
								<td>
									<Link to={"/training/workout/" + workout.id}>
									{workout.name}
									</Link>
								</td>
								<td>{workout.description}</td>
								<td>{workout.week}</td>
								<td>{workout.day}</td>
								<td><Button>Start</Button></td>
								<td><Button onClick={() => setEditWorkoutModalOpen(true)}>Edit</Button></td>
								<td><Button onClick={() => setDeleteWorkoutModalOpen(true)}>Delete</Button></td>
							</tr>
						))}
				</tbody>
			</Table>
			<JwPagination items={workouts} onChangePage={data => setPageOfWorkouts(data)} />
		</div>
	)
}