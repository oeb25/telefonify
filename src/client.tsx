import * as React from 'react';
import * as f from './firebase';

export const init = (id: string) => {
  type State = {question: null | f.Question, user: null | f.User};

  return class App extends React.Component<{}, State> {
    constructor() {
      super();

      this.state = {question: null, user: null};
    }

    login = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const name = (e.target as any).name.value as string

      f.registerUser(f.db, name).once('value', user => {
        this.setState({user: user.val()})
      })

    }

    render() {
      const {question, user} = this.state;

      const isLoggedIn = !!user;

      if (!isLoggedIn) {
        return (
          <div
            style={
              {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }
            }
          >
            <h1>Login</h1>
            <form onSubmit={this.login}>
              <div>
                <label htmlFor="name">
                  Navn:
                </label>
                <input type="text" name="name" />
              </div>
              <div>
                <button>Log ind</button>
              </div>
            </form>
          </div>
        );
      }

      if (question) {
        return <div>
          <pre>{JSON.stringify(question)}</pre>
        </div>;
      }

      return <h1 style={{textAlign: 'center'}}>
        Venter på spørgsmål fra serveren...
      </h1>;
    }
  };
};
