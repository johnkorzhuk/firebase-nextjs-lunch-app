// @flow

import React, { Component } from 'react';
import withRedux from 'next-redux-wrapper';
import styled from 'styled-components';
import axios from 'axios';

import SignIn from '../components/SignIn';
import CurrentUser from '../components/CurrentUser';
import NewRestaurant from '../components/NewRestaurant';
import Restaurants from '../components/Restaurants';

import { auth, database } from '../firebase';
import initStore from '../store/store';

const Container = styled.div`
  margin: auto;
  width: 800px;
`;

const Header = styled.header``;

declare type Restuarant = {
  [string]: {
    name: string
  }
};

type Props = {
  origUser: null | FirebaseUser,
  origRestaurants: Restuarant
};

class Index extends Component {
  static async getInitialProps({ req }) {
    const origUser = req && req.session ? req.session.decodedToken : null;
    const origRestaurants: ?Restuarant = req && req.session ? req.session.restaurants : null;
    return { origUser, origRestaurants };
  }

  state = {
    user: this.props.origUser,
    restaurants: this.props.origRestaurants
  };

  componentDidMount() {
    auth.onAuthStateChanged(async user => {
      if (user) {
        // this.setState({ user });
        const token = await user.getIdToken();
        await axios.post('/api/login', {
          token
        });

        // the user from getInitialProps (firebase-admin) is differeht than this user (firebase)
        this.setState({ user });

        this.restaurantsRef.on('value', snap => {
          this.setState({ restaurants: snap.val() });
        });
      } else {
        this.setState({ user: null });
        // eslint-disable-next-line no-undef
        await axios.post('/api/logout');
      }
    });
  }

  restaurantsRef = database.ref('/restaurants');

  props: Props;

  render() {
    const { user, restaurants } = this.state;

    return (
      <Container>
        <Header>
          <h1>Lunch Rush</h1>
          <div>
            {!user && <SignIn />}
            {user &&
              <div>
                <NewRestaurant />
                {restaurants &&
                  <Restaurants restaurants={restaurants} restaurantsRef={this.restaurantsRef} user={user} />}
                <CurrentUser user={user} />
              </div>}
          </div>
        </Header>
      </Container>
    );
  }
}

export default withRedux(initStore)(Index);
