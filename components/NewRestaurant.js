// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import { database } from '../firebase';

const Container = styled.form`margin-bottom: 1em;`;

class NewRestaurant extends Component {
  state = {
    name: ''
  };

  restaurantsRef = database.ref('/restaurants');

  handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    const { name } = this.state;
    this.restaurantsRef.push({ name });
    this.setState({
      name: ''
    });
  };

  render() {
    const { name } = this.state;

    return (
      <Container>
        <input
          type="text"
          value={name}
          placeholder="Name of Fine Establishment"
          onChange={event => this.setState({ name: event.target.value })}
        />
        <button onClick={this.handleSubmit} disabled={!name}>
          Submit
        </button>
      </Container>
    );
  }
}

export default NewRestaurant;
