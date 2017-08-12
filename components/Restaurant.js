// @flow

import React from 'react';
import styled from 'styled-components';

const Container = styled.article`
  margin: 1em;
  min-width: 200px;
  text-align: center;
  border: 1px solid #eee;
  padding: 1em;
`;

type Props = {
  name: string,
  votes: Object,
  user: FirebaseUser,
  handleSelect: Function,
  handleDeselect: Function,
  id: string
};

const Restaurant = ({ name, handleSelect, handleDeselect, votes, user, id }: Props) => {
  const voteKeys = votes && Object.keys(votes);
  const userHasVoted = votes && voteKeys.includes(user.uid);

  return (
    <Container>
      <h3>
        {name}
      </h3>
      <ul>
        {userHasVoted &&
          voteKeys.map(voteKey =>
            <li key={voteKey}>
              {votes[voteKey]}
            </li>
          )}
      </ul>
      {userHasVoted
        ? <button className="destructive" onClick={() => handleDeselect(id)}>
            Nope!
          </button>
        : <button onClick={() => handleSelect(id)}>Sure!</button>}
    </Container>
  );
};

export default Restaurant;
