import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Container, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Popover, PopoverBody, PopoverHeader, Row, Table } from 'reactstrap';

import LiftDataService from '../services/lift.service';
import WorkoutDataService from '../services/workout.service';

import { LiftModal } from './lift-modal.component';
import { LiftOptionsModal } from './lift-options-modal.component';

export default function LiftCollapsible()
{
	let params = useParams();
	const [workoutId, setWorkoutId] = useState(params.id);
	const [description, setDescription] = useState('description');
	const [descriptionPopoverOpen, setDescriptionPopoverOpen] = useState(false);
	const [startTime, setStartTime] = useState('startTime');
	const [lifts, setLifts] = useState([]);
	const [activeLift, setActiveLift] = useState('activeLift');
	const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
	const [sortEnum, setSortEnum] = useState(1);
	const [addLiftModalOpen, setAddLiftModalOpen] = useState(false);
	const [liftOptionsModalOpen, setLiftOptionsModalOpen] = useState(false);
	const [expandedRows, setExpandedRows] = useState([]);

	const retrieveLifts = () =>
	{
		LiftDataService.findByWorkoutId(params.id, sortEnum < 3 ? "createdAt" : "weight", sortEnum === 1 || sortEnum === 3 ? "DESC" : "ASC")
			.then(response => {
				setLifts(response.data);
			})
			.catch(e => {
				console.log(e);
			});
    }

	useEffect(() => {
		retrieveLifts();
	}, [workoutId, sortEnum]);

	useEffect(() => {
		WorkoutDataService.get(params.id)
			.then(response => {
				setDescription(response.data.description);
				setStartTime(response.data.createdAt);
			})
			.catch(e => {
				console.log(e);
			});
	}, [workoutId]);

	const handleRowClick = (exerciseName) =>
	{
		const currentExpandedRows = expandedRows;
		const isRowCurrentlyExpanded = currentExpandedRows.includes(exerciseName);

		const newExpandedRows = isRowCurrentlyExpanded ?
			currentExpandedRows.filter(id => id !== exerciseName) :
			currentExpandedRows.concat(exerciseName);

		setExpandedRows(newExpandedRows);
	}

	const toggleLiftOptionsModal = (lift) =>
	{
		setActiveLift(lift);
		setLiftOptionsModalOpen(!liftOptionsModalOpen);
	}

	const closeAllModalsAndRefresh = () =>
	{
		setLiftOptionsModalOpen(false);
		retrieveLifts();
    }

	const renderExercise = (exercise) =>
	{
		const clickCallback = () => handleRowClick(exercise.exerciseName);
		const itemRows = [
			<tr onClick={clickCallback} key={"row-data-" + exercise.exerciseName} className="bg-light">
				<td>
					<Link className="text-dark" to={"/exercise/" + exercise.id}>
						{exercise.exerciseName}
					</Link>
				</td>
				<td></td>
			</tr>
		];

		if (expandedRows.includes(exercise.exerciseName)) {
			exercise.lifts.forEach((lift, index) => {
				itemRows.push(
					<tr
						key={"row-expanded-1-" + lift.id}
						onClick={() => toggleLiftOptionsModal(lift)}
					>
						<td>{new Date(lift.createdAt).toLocaleTimeString()}<br />{lift.description}</td>
						<td>{lift.weight} x {lift.reps}</td>
					</tr>
				);
			});
		}

		return itemRows;
	}

	const getGroupedLifts = () =>
	{
		let exerciseIds = new Set(lifts.map(lift => lift.exercise.name));
		let groupedLifts = [];
		exerciseIds.forEach(function (name, index) {
			let liftsByExercise = lifts.filter(lift => lift.exercise.name === name);
			groupedLifts.push({ "exerciseName": name, "id": liftsByExercise[0].exercise.id, "lifts": liftsByExercise });
		});

		return groupedLifts;
	}

	const renderRows = () => {
		let allExerciseRows = [];
		let groupedLifts = getGroupedLifts();
		groupedLifts.forEach(exercise => {
			const perExerciseRow = renderExercise(exercise);
			allExerciseRows = allExerciseRows.concat(perExerciseRow);
		});

		return allExerciseRows;
    }

	return (
		<div>
			<Container fluid={true}>
				<h4 id="name">{description}</h4>
				<Popover placement="auto-start" isOpen={descriptionPopoverOpen} target="name" toggle={() => setDescriptionPopoverOpen(!descriptionPopoverOpen)}>
					<PopoverHeader>{description}</PopoverHeader>
					<PopoverBody>
						{"Created on: " + new Date(startTime).toLocaleDateString()}
					</PopoverBody>
				</Popover>
				<Row>
					<Col>
						Start: {new Date(Math.min.apply(null, lifts.map(function (x) { return new Date(x.createdAt); }))).toLocaleTimeString()}
					</Col>
					<Col>
						Exercises: {new Set(lifts.map(lift => lift.exercise.id)).size}
					</Col>
				</Row>
				<Row>
					<Col>
						End: {new Date(Math.max.apply(null, lifts.map(function (x) { return new Date(x.createdAt); }))).toLocaleTimeString()}
					</Col>
					<Col>
						Sets: {lifts.length}
					</Col>
				</Row>
				<Row>
					<Col xs="auto">
						<Button color="primary" onClick={() => setAddLiftModalOpen(!addLiftModalOpen)}>
							Add
						</Button>
					</Col>
					<Col xs="auto">
						<Dropdown isOpen={sortDropdownOpen} toggle={() => setSortDropdownOpen(!sortDropdownOpen)}>
							<DropdownToggle caret>
								Sort
								</DropdownToggle>
							<DropdownMenu>
								<DropdownItem onClick={() => setSortEnum(1)}>Newest to oldest</DropdownItem>
								<DropdownItem onClick={() => setSortEnum(2)}>Oldest to newest</DropdownItem>
								<DropdownItem onClick={() => setSortEnum(3)}>Heaviest</DropdownItem>
								<DropdownItem onClick={() => setSortEnum(4)}>Lightest</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</Col>
				</Row>
			<LiftModal
				isModalOpen={addLiftModalOpen}
				modalPrompt="Add Lift"
				toggle={() => setAddLiftModalOpen(!addLiftModalOpen)}
				workoutId={workoutId}
				onComplete={() => closeAllModalsAndRefresh()}
				key={-1}
				defaultLift={null} />
			<LiftOptionsModal
				isModalOpen={liftOptionsModalOpen}
				toggle={() => setLiftOptionsModalOpen(!liftOptionsModalOpen)}
				lift={activeLift ? activeLift: null}
				workoutId={workoutId}
				onComplete={() => closeAllModalsAndRefresh()}
				key={"options" + (activeLift ? activeLift.id : 0)} />
			<Table hover>
				<tbody>
					{renderRows()}
				</tbody>
			</Table>
			</Container>
		</div>
	)
}