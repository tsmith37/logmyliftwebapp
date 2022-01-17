import React, { Component } from 'react';
import { Navigate } from "react-router-dom";

import WorkoutDataService from '../services/workout.service';

export default class MostRecentWorkoutRedirect extends Component
{
    constructor(props)
    {
        super(props);

        this.getMostRecentPath = this.getMostRecentPath.bind(this);

        this.state = {
            redirectPath: "/nowhere/",
            readyToRedirect: false,
            enabled: this.props.enabled ? this.props.enabled : false
        };
    }

    componentDidMount()
    {
        this.getMostRecentPath();
    }

    getMostRecentPath()
    {
        WorkoutDataService.findMostRecent()
		.then(response => {    
            this.setState({
                redirectPath: "/workout/" + response.data.id,
                readyToRedirect: true
            })
		})
		.catch(e => {
			console.log(e);
        });
    }

    render() { 
        if (this.state.readyToRedirect)
        {
            return <Navigate to={this.state.redirectPath}/>
        }
        return null;
    }
}