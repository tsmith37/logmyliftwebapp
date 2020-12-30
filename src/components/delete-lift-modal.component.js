import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import LiftDataService from '../services/lift.service';

export class DeleteLiftModal extends Component 
{
    constructor(props) 
    {
        super(props);

        this.setLiftId = this.setLiftId.bind(this);

        this.state = 
        {
          liftId: this.props.liftId
        }
    }

    componentDidMount() { this.setLiftId(this.props.liftId); }

    setLiftId(value) { this.setState({liftId: value}); }

    execute = () =>
    {
        LiftDataService.delete(this.state.liftId)
        .then(response => {
            this.props.onComplete();
        })
        .catch(e => {
            console.log(e);
        });
    }

    render() 
    {		
        return (
			<Modal
				isOpen={this.props.isModalOpen}
				toggle={this.props.toggle}>
				<ModalHeader toggle={this.props.toggle}>Delete Lift</ModalHeader>
				<ModalBody>
                    Are you sure you want to delete this lift?
				</ModalBody>
				<ModalFooter>
					<Button color='danger' onClick={() => this.execute()}>Yes, delete</Button>{' '}
					<Button color='secondary' onClick={this.props.toggle}>Cancel</Button>
				</ModalFooter>
			</Modal>
		);
	}
}