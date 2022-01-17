import React, { Component } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';

import { LiftModal } from './lift-modal.component';
import { DeleteLiftModal } from './delete-lift-modal.component';

export class LiftOptionsModal extends Component 
{
    constructor(props) 
    {
        super(props);

		this.toggleCopyLiftModal = this.toggleCopyLiftModal.bind(this);
		this.toggleEditLiftModal = this.toggleEditLiftModal.bind(this);
		this.toggleDeleteLiftModal = this.toggleDeleteLiftModal.bind(this);
        this.setWorkoutId = this.setWorkoutId.bind(this);
        this.setLift = this.setLift.bind(this);

		this.state = {
			workoutId: this.props.workoutId,
            lift: this.props.lift,
			showCopyLiftModal: false,
			showEditLiftModal: false,
			showDeleteLiftModal: false,
			expandedRows: []
		};
    }

    setWorkoutId(value) { this.setState({workoutId: value}); }
    setLift(value) { this.setState({lift: value}); }

    componentDidMount() { 
        this.setLift(this.props.lift); 
        this.setWorkoutId(this.props.workoutId);
    }

	toggleCopyLiftModal() {
		this.setState({
			showCopyLiftModal: !this.state.showCopyLiftModal
		});
	}

	toggleEditLiftModal() {
		this.setState({
			showEditLiftModal: !this.state.showEditLiftModal
		});
	}

	toggleDeleteLiftModal() {
		this.setState({
			showDeleteLiftModal: !this.state.showDeleteLiftModal
		});
	}

    render() 
    {		
        return (
            <div>
            <LiftModal 
                isModalOpen={this.state.showCopyLiftModal} 
                modalPrompt="Copy Lift"
                toggle={this.toggleCopyLiftModal} 
                workoutId={this.state.workoutId}
                onComplete={this.props.onComplete}
                key={"copy" + (this.state.lift ? this.state.lift.id : 0)} 
                liftToCopy={this.state.lift} />		
            <LiftModal 
                isModalOpen={this.state.showEditLiftModal} 
                modalPrompt="Edit Lift"
                toggle={this.toggleEditLiftModal} 
                workoutId={this.state.workoutId}
                onComplete={this.props.onComplete}
                key={"edit" + (this.state.lift ? this.state.lift.id : 0)} 
                liftToEdit={this.state.lift} />			
            <DeleteLiftModal
                isModalOpen={this.state.showDeleteLiftModal}
                toggle={this.toggleDeleteLiftModal}
                liftId={this.state.lift ? this.state.lift.id : 0}
                onComplete={this.props.onComplete}
                key={"delete" + (this.state.liftId ? this.state.liftId : 0)} />
			<Modal
				isOpen={this.props.isModalOpen}
				toggle={this.props.toggle}>
				<ModalBody>
                    <Button color='primary' onClick={() => this.toggleEditLiftModal()}>Edit Lift</Button>{' '}
                    <Button color='secondary' onClick={() => this.toggleCopyLiftModal()}>Copy Lift</Button>{' '}
                    <Button color='danger' onClick={() => this.toggleDeleteLiftModal()}>Delete Lift</Button>{' '}
				</ModalBody>
			</Modal>
            </div>
		);
	}
}