import { act, useEffect, useReducer } from 'react';
import Header from './Header'
import Main from './Main'
import DateCounter from './DateCounter'
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Questions from './Questions';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishedScreen from './FinishedScreen';
import Footer from './Footer';
import Timer from './Timer';

const initialState = {
  questions: [],

  //Statuses Application Can Be In: Loading, Error, Ready, Active, Finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null
};

const SECS_PER_QUESTION = 30;

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
        status: "ready"
      };
    case "dataFailed":
      return {
        ...state, status: "error"
      }
    case "start":
      return {
        ...state, status: "active", secondsRemaining: state.questions.length * SECS_PER_QUESTION
      }
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption ? state.points + question.points : state.points
      }
    case "nextQuestion":
      return {
        ...state, index: state.index + 1, answer: null
      };
    case "finished":
      return {
        ...state, status: "finished", highScore: state.points > state.highScore ? state.points : state.highScore
      };
    case "restartQuiz":
      return {
        ...initialState, status: "ready", questions: state.questions, highScore: state.highScore
      }
    case "tick":
      return {
        ...state, secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status
      };
    default:
      throw new Error("Action is unknown")
  }
}

export default function App() {

  const [{ questions, status, index, answer, points, highScore, secondsRemaining }, dispatch] = useReducer(reducer, initialState)
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, curr) => prev + curr.points, 0);

  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }))
  }, [])

  return (
    <div className="app">y
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {status === 'active'

          && (
            <>
              <Progress index={index} numQuestions={numQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer} />
              <Questions questions={questions[index]} dispatch={dispatch} answer={answer} />
              <Footer>
                <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
                <NextButton index={index} numQuestions={numQuestions} dispatch={dispatch} answer={answer} />
              </Footer>
            </>
          )
        }

        {status === 'finished' && <FinishedScreen points={points} maxPossiblePoints={maxPossiblePoints} percentages={(points / maxPossiblePoints) * 100} highScore={highScore} dispatch={dispatch} />}

      </Main>
    </div>
  );
}

