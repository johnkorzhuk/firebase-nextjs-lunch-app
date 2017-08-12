// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import Restaurant from './Restaurant';

type Props = {
  restaurants: Object,
  user: FirebaseUser,
  restaurantsRef: Object
};

const Container = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

class Restaurants extends Component {
  props: Props;

  handleSelect = (key: string) => {
    const { user, restaurantsRef } = this.props;
    restaurantsRef.child(key).child('votes').child(user.uid).set(user.displayName);
  };

  handleDeselect = (key: string) => {
    const { user, restaurantsRef } = this.props;
    restaurantsRef.child(key).child('votes').child(user.uid).remove();
  };

  render() {
    const { restaurants, user } = this.props;
    return (
      <Container>
        {Object.keys(restaurants).map(restKey =>
          <Restaurant
            key={restKey}
            {...restaurants[restKey]}
            id={restKey}
            user={user}
            handleSelect={this.handleSelect}
            handleDeselect={this.handleDeselect}
          />
        )}
      </Container>
    );
  }
}

export default Restaurants;
