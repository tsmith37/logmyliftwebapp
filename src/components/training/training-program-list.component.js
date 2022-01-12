import React, { useState, useEffect } from 'react';
import TrainingProgramDataService from '../../services/training/training-program.service';
import { Button, Col, Container, Row, Table } from 'reactstrap'
import { Link } from 'react-router-dom';
import JwPagination from 'jw-react-pagination';
import TrainingProgramModal from './training-program-modal.component';
import DeleteTrainingProgramModal from './delete-training-program-modal.component';

export default function TrainingProgramList()
{
	const [programs, setPrograms] = useState([]);
	const [pageOfPrograms, setPageOfPrograms] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [createProgramModalOpen, setCreateProgramModalOpen] = useState(false);
	const [editProgramModalOpen, setEditProgramModalOpen] = useState(false);
	const [deleteProgramModalOpen, setDeleteProgramModalOpen] = useState(false);
	const [activeProgram, setActiveProgram] = useState("");

	const onChangePage = (data) => {
		setPageOfPrograms(data);
	}

	const retrievePrograms = () => {
		TrainingProgramDataService.findByName(searchTerm)
			.then(response => {
				setPrograms(response.data);
				setPageOfPrograms(response.data.slice(0, 10));
			})
			.catch(e => {
				console.log(e);
			});
    }

	useEffect(() => {
		retrievePrograms();
	}, [searchTerm]);

    return (
		<div>
			<div>
				<h4>Program List</h4>
			</div>
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
						<Button color="primary" onClick={() => setCreateProgramModalOpen(true)}>
							Create
						</Button>
					</Col>
				</Row>
			</Container>
			<TrainingProgramModal
				isModalOpen={editProgramModalOpen}
				modalPrompt="Edit"
				modalTitle="Edit Program"
				toggle={() => setEditProgramModalOpen(!editProgramModalOpen)}
				onComplete={() => retrievePrograms()}
				program={activeProgram}
				key={"edit" + (activeProgram ? activeProgram.id : 0)} />
			<TrainingProgramModal
				isModalOpen={createProgramModalOpen}
				modalPrompt="Create"
				modalTitle="Create Program"
				toggle={() => setCreateProgramModalOpen(!createProgramModalOpen)}
				onComplete={() => retrievePrograms()}
				key={"addProgram"} />
			<DeleteTrainingProgramModal
				isModalOpen={deleteProgramModalOpen}
				modalPrompt="Delete"
				modalTitle="Delete Program"
				toggle={() => setDeleteProgramModalOpen(!deleteProgramModalOpen)}
				onComplete={() => retrievePrograms()}
				program={activeProgram}
				key={"delete" + (activeProgram ? activeProgram.id : 0)} />
			<Table hover>
				<thead>
					<tr>
						<th>Name</th>
						<th>Description</th>
						<th>Created time</th>
						<th>Edit</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{programs &&
						pageOfPrograms.map((program, index) => (
							<tr key={index}
								onClick={() => setActiveProgram(program)}
							>
								<td>
									<Link to={"/training/program/" + program.id}>
										{program.name}
									</Link>
								</td>
								<td>{program.description}</td>
								<td>{new Date(program.createdAt).toLocaleDateString()}</td>
								<td><Button onClick={() => setEditProgramModalOpen(true)}>Edit</Button></td>
								<td><Button onClick={() => setDeleteProgramModalOpen(true)}>Delete</Button></td>
							</tr>
						))}
				</tbody>
			</Table>
			<JwPagination items={programs} onChangePage={onChangePage} />
		</div>
    )
}