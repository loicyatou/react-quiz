export default function NextButton({ dispatch, answer, index,numQuestions }) {

    //Only creating a button if an answer is selected
    if (answer === null) return null;

    if (index < numQuestions - 1) return <button className="btn btn-ui" onClick={() => dispatch({type: "nextQuestion"})}>Next</button>

    if(index === numQuestions - 1)   return <button className="btn btn-ui" onClick={() => dispatch({type: "finished"})}>Next</button>
}