import * as React from 'react';
import * as f from './firebase';
import {keys} from './helpers'

export const init = (id: string) => {
  type State = {question: null | f.Question, user: null | f.User, awnser: null | f.Awnser};

  return class App extends React.Component<{}, State> {
    constructor() {
      super();

      this.state = {question: null, user: null, awnser: null};
    }

    componentDidMount() {
      f.question.on('value', questionRef => {
        const question = questionRef.val();
        this.setState({question,  awnser: null});
      })
    }

    login = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const name = (e.target as any).name.value as string

      f.registerUser(f.db, name).once('value', user => {
        this.setState({user: user.val() || null})
      })

    }

    choose(i: number) {
      const awnser: f.Awnser = {
        index: i,
        user: this.state.user.id,
      }

      f.awnsers.push(awnser)

      this.setState({awnser})
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
        if (this.state.awnser) {
            return <div style={{
              backgroundImage: `url(${question.options[this.state.awnser.index]})`,
              width: '100vw',
              height: '100vh',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}></div>
        }

        let ah = [[]];

        question.options.forEach(q => {
          if (ah[ah.length - 1].length < 2) {
            ah[ah.length - 1].push(q)
          } else {
            ah.push([q])
          }
        })

        return <div>
          {ah.map((qs, j) => 
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                flexDirection: 'col',
                width: '100vw',
              }}>
                {qs.map((o, i) =>
                  <div onClick={() => this.choose(i + j * 2)} style={{
                    backgroundImage: `url(${o})`,
                    width: '50vw',
                    height: '50vw',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                  }}></div>
                )}
            </div>
          )}
        </div>;
      }

      return <h1 style={{textAlign: 'center'}}>
        Venter på flere spillere...
      </h1>;
    }
  };
};
