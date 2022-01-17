import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

import ExerciseDataService from '../services/exercise.service';

var exercises = {};

const setExercises = () => {
    ExerciseDataService.getAll()
        .then(response => {
            exercises = response.data;
        })
        .catch(e => {
            console.log(e);
        });
};

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength < 2 ? [] : exercises.filter(exercise =>
    exercise.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion, query, isHighlighted) => (
    <div>
        <label>
        {suggestion.name}
        </label>
    </div>
);

export class ExerciseSelector extends Component {
  constructor(props) {
    super(props);

    setExercises();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
        value: '',
        suggestions: []
    };

    if (this.props.defaultExerciseId !== -1) {
        this.setExerciseName(this.props.defaultExerciseId);
    }

    }

    componentDidUpdate(prevProps) {
        if (this.props.defaultExerciseId !== prevProps.defaultExerciseId && this.props.defaultExerciseId !== -1 && prevProps.defaultExerciseId !== -1) {
            this.setExerciseName(this.props.defaultExerciseId);
        }
    }

  setExerciseName = (id) => {
    ExerciseDataService.get(id)
      .then(response => {
        this.setState({ value: response.data.name})
      })
      .catch(e => {
        console.log(e);
      });
  }

  onValueChanged = (event, { newValue }) => {
    this.setState({
      value: newValue
    });

    const found = exercises.find(ex => ex.name.toLowerCase() === newValue.toLowerCase());

    this.props.getInputData(found ? found.id : -1);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Select an exercise...',
      value,
      onChange: this.onValueChanged
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}