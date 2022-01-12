import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import WorkoutDataService from '../services/workout.service';

export default function WorkoutSelector(props) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [allWorkouts, setAllWorkouts] = useState([]);

    useEffect(() => {
        WorkoutDataService.getAll()
            .then(response => {
                if (!allWorkouts.length) {
                    setAllWorkouts(response.data);
                    props.onSelect(response.data ? response.data[0] : "activeWorkout");
                }
            })
            .catch(e => {
                console.log(e);
            });
    }, [dropdownOpen]);

    const renderAllDropdownItems = () => {
        let dropdownItems = [];
        allWorkouts.forEach(workout => {
            const workoutDropdownItem = renderDropdownItem(workout);
            dropdownItems = dropdownItems.concat(workoutDropdownItem);
        });

        return dropdownItems;
    }

    const renderDropdownItem = (workout) => {
        return (
            <DropdownItem key = { "dropdown-" + (workout ? workout.id : 0) }>
                <div onClick={() => props.onSelect(workout)}>
                    {new Date(workout.createdAt).toLocaleDateString()} - {workout.description}
                </div>
            </DropdownItem>
        );
    }

    return (
        <Dropdown isOpen={dropdownOpen} toggle={() => setDropdownOpen(!dropdownOpen)}>
            <DropdownToggle caret>
                Select a workout to add lift to...
            </DropdownToggle>
            <DropdownMenu>
                {renderAllDropdownItems()}
            </DropdownMenu>
        </Dropdown>
    )
}