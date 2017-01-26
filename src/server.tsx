import * as React from 'react';
import * as f from './firebase';
import {keys} from './helpers';

const AwnserView = ({awnser}: {awnser: f.Awnser}) => (
  <div>
    <hr />
    <h5>{awnser.index}</h5>
    <p>{awnser.user}</p>
  </div>
);

const UserView = ({user}: {user: f.User}) => (
  <div key={user.id}>
    <hr />
    <h5>{user.name}</h5>
  </div>
);

const beginGame = () => {
  f.users.set(null)
}

export const init = (id: string) => {
  type State = {awnsers: f.Awnser[], users: f.User[]};

  beginGame()

  return class App extends React.Component<{}, State> {
    constructor() {
      super();
      this.state = {awnsers: [], users: []};
    }

    componentDidMount() {
      f.awnsers.on('value', s => {
        const val = s.val() || {};
        const awnsers = keys(val).map(key => val[key] as f.Awnser);
        this.setState({awnsers});
      });

      f.users.on('value', usersRef => {
        const val = usersRef.val() || {};
        const users = keys(val).map(key => val[key] as f.User);
        this.setState({users});
      })
    }

    render() {
      return (
        <div>
          <h1>Hello Server!</h1>
          <div>{this.state.awnsers.map(awnser => AwnserView({ awnser }))}</div>
          <div>{this.state.users.map(user => UserView({ user }))}</div>
        </div>
      );
    }
  };
};
