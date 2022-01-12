import { Button, InputGroup, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React, { useState, useEffect } from 'react';
import TrainingProgramDataService from '../../services/training/training-program.service';
import { useParams } from 'react-router-dom';

export default function TrainingProgramModal(props) {
	let params = useParams();
	const [program, setProgram] = useState(props.program);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
    const [mode, setMode] = useState("create");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (props.program) { setName(program.name); setDescription(program.description ? program.description : ""); setMode("edit"); }
	}, [program]);

    const validateProgram = () =>
    {
        if (name === '')
        {
            setMessage('Name is not valid.');
            return false;
        }
        else if (mode === "edit" && program.id <= 0)
        {
            setMessage('Program not properly loaded.');
            return false;
        }
    
        return true;
    }

    const createProgram = () =>
    {
        var data =
        {
            name: name,
            description: description
        };

        TrainingProgramDataService.create(data)
            .then(response => {
                props.onComplete();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const editProgram = () =>
    {
        var data =
        {
            id: program.id,
            name: name,
            description: description
        };

        TrainingProgramDataService.update(program.id, data)
            .then(response => {
                props.onComplete();
            })
            .catch(e => {
                console.log(e);
            });
    }

	const execute = () =>
	{
		if (!validateProgram()) { return; }

		if (mode === "edit")
		{
			editProgram();
		}
		else
		{
			createProgram();
        }

        props.toggle();
    }

	return (
		<Modal
			isOpen={props.isModalOpen}
			toggle={props.toggle}>
			<ModalHeader toggle={props.toggle}>{props.modalTitle}</ModalHeader>
			<ModalBody>
				<InputGroup>
					<Input placeholder="Name" onChange={e => setName(e.target.value)} value={name} />
					<Input placeholder="Description" onChange={e => setDescription(e.target.value)} value={description} />
                </InputGroup>
                <p>{message}</p>
			</ModalBody>
			<ModalFooter>
				<Button color='primary' onClick={() => execute()}>{props.modalPrompt}</Button>{' '}
				<Button color='secondary' onClick={props.toggle}>Cancel</Button>
			</ModalFooter>
			</Modal>
	)
}