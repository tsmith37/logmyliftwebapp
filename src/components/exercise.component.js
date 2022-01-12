import React, { useState, useEffect } from 'react';
import LiftDataService from '../services/lift.service';
import ExerciseDataService from '../services/exercise.service';
import {  Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Table } from 'reactstrap';
import JwPagination from 'jw-react-pagination';
import { useParams } from "react-router-dom";

export default function Exercise()
{
	let params = useParams();
	const [exerciseId, setExerciseId] = useState(params.id);
	const [exercise, setExercise] = useState('exercise');
	const [lifts, setLifts] = useState([]);
	const [pageOfLifts, setPageOfLifts] = useState([]);
	const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
	const [sortEnum, setSortEnum] = useState(1);
		
	useEffect(() => {
		ExerciseDataService.get(params.id)
			.then(response => {
				setExercise(response.data);
			})
			.catch(e => {
				console.log(e);
			});
	}, [exerciseId]);

	const getQuerySortColumn = () => {
		switch (sortEnum) {
			case 1:
			case 2:
			case 5:
			case 6:
				return "createdAt";
				break;
			case 3:
			case 4:
				return "weight";
				break;
			default:
				return "createdAt";
        }
	}

	const getQuerySortOrder = () => {
		switch (sortEnum) {
			case 1:
			case 3:
			case 5:
				return "DESC";
				break;
			case 2:
			case 4:
			case 6:
				return "ASC";
				break;
			default:
				return "DESC";
		}
	}

	const sortByCalculatedMax = (data) => {
		if (sortEnum === 6) {
			return data.sort((a, b) => a.calculatedMax - b.calculatedMax);
		}
		else {
			return data.sort((a, b) => b.calculatedMax - a.calculatedMax);
        }
		
    }

	useEffect(() => {
		LiftDataService.findByExerciseId(params.id,	getQuerySortColumn(), getQuerySortOrder())
			.then(response => {
				if (sortEnum < 5) {
					setLifts(response.data);
					setPageOfLifts(response.data.slice(0, 10));
				}
				else {
					let sortedLifts = sortByCalculatedMax(response.data);
					setLifts(sortedLifts);
					setPageOfLifts(sortedLifts.slice(0, 10));
                }
			})
			.catch(e => {
				console.log(e);
			});
	}, [exerciseId, sortEnum]);

	return (
		<div>
			<div className="row">
				<div className="col-sm-5">
					<h4>{exercise ? exercise.name : "Name"}</h4>
				</div>
				<div className="col-sm-5">
					<h4>{exercise ? exercise.description : "Description"}</h4>
				</div>
				<div className="col-sm-1">
					<Dropdown isOpen={sortDropdownOpen} toggle={() => setSortDropdownOpen(!sortDropdownOpen)}>
						<DropdownToggle caret>
							Sort
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem onClick={() => setSortEnum(1)}>Newest to oldest</DropdownItem>
							<DropdownItem onClick={() => setSortEnum(2)}>Oldest to newest</DropdownItem>
							<DropdownItem onClick={() => setSortEnum(3)}>Heaviest</DropdownItem>
							<DropdownItem onClick={() => setSortEnum(4)}>Lightest</DropdownItem>
							<DropdownItem onClick={() => setSortEnum(5)}>Hardest</DropdownItem>
							<DropdownItem onClick={() => setSortEnum(6)}>Easiest</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</div>
			</div>
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
					{lifts &&
						pageOfLifts.map((lift, index) => (
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
			<JwPagination items={lifts} onChangePage={data => setPageOfLifts(data)} />
		</div>
	);
}