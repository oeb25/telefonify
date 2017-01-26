import * as React from 'react';
import * as f from './firebase';
import {keys} from './helpers';
import {questions} from './questions';

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

const resetGame = () => {
  f.users.set(null)
  f.question.set(null)
  f.awnsers.set(null)
}

class Countdown extends React.Component<{onComplete: () => any, time: number, interval: number}, {now}> {
  interval: number
  stop: boolean

  constructor() {
    super()
    this.state = {
      now: null
    }
  }

  componentDidMount() {
    this.stop = false

    this.interval = setInterval(() => {
      if (this.stop) {
        return
      }

      const now = Date.now()

      if (this.props.time - now <= 0) {
        this.props.onComplete()
        clearInterval(this.interval)

        this.setState({now: this.props.time})

        return
      }

      this.setState({ now })
    }, this.props.interval)
  }

  componentWillUnmount() {
    this.stop = true
    
    clearInterval(this.interval)
  }

  render() {
    return <span>{(this.props.time - this.state.now) / 1000}</span>
  }
}

class Questions extends React.Component<{question: f.Question, next: () => any, time: number}, any> {
  next() {
    this.props.next()
  }
  
  render() {
    return <div>
      <Countdown time={this.props.time} interval={100} onComplete={() => this.next()}/>
      <h1>{this.props.question.question}</h1>
    </div>
  }
}

export const init = (id: string) => {
  type State = {
    awnsers: f.Awnser[],
    users: f.User[],
    question: f.Question,
    hasBegin: boolean,
    start: number,
    index: number,
    showWinners: boolean
  };

  resetGame();

  const initialState = () => ({awnsers: [], users: [], question: null, hasBegin: false, start: 0, index: 0, showWinners: false});

  return class App extends React.Component<any, State> {
    constructor() {
      super();
      this.state = initialState();
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
        this.setState({users, start: Date.now() + 5 * 1000});
      })

      f.question.on('value', questionRef => {
        const question = questionRef.val() || null;
        this.setState({question});
      })
    }

    beginQuestions() {
      f.setQuestion(f.db, questions[0])
      this.setState({hasBegin: true, index: 0})
    }

    announceWinners() {
      this.setState({ showWinners: true })
      setTimeout(() => {
        resetGame()
        this.setState(initialState())
      }, 10000)
    }

    next() {
      let i = this.state.index + 1

      if (i >= questions.length) {
        return this.announceWinners()
      }

      this.setState({index: i, start: Date.now() + 10 * 1000})   
      f.setQuestion(f.db, questions[i])
    }

    render() {
      const contents = this.state.hasBegin
        ? (this.state.question ? <Questions question={this.state.question} next={() => this.next()} time={this.state.start}/> : <h2>Venter</h2>)
        : this.state.users.length > 0
        ? <div>
            <h5>Starter om <Countdown time={this.state.start} interval={100} onComplete={() => this.beginQuestions()}/></h5>
            <hr/>
            <h4>Deltagere</h4>
            {this.state.users.map(user => <UserView user={user}/>)}
          </div>
        : <div>
            <h4>Velkommen til!</h4>
            <p>En quiz til dig der vil vide mere om fotografier, og <i>battle</i> mod dine venner!</p>
            <hr/>
            <h4>Skan QR koden til højre for at deltage!</h4>
          </div>;

      return (
        <div>
          <div style={{textAlign: 'center'}}>
            <h1>Telefonify</h1>
            {contents}
          </div>
        </div>
      );
    }
  };
};
