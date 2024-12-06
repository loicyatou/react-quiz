export default function FinishedScreen({ points, maxPossiblePoints, percentages, highScore, dispatch }) {
    const percentage = (points / maxPossiblePoints) * 100;

    let emoji;
    if (percentage === 100) emoji = '🏆'; // Perfect score - Trophy

    if (percentage >= 90) emoji = '🌟'; // Excellent - Shining star

    if (percentage >= 70) emoji = '👍'; // Good - Thumbs up

    if (percentage >= 50) emoji = '😐'; // Average - Neutral face

    if (percentage > 0 && percentage < 50) emoji = '😢'; // Poor - Sad/Crying face

    if (percentage === 0) emoji = '💀'; // Zero score - Skull

    return (
        <>
            <p className="result">
                {emoji}
                You scored <strong>{points} out of {maxPossiblePoints} {" "}
                    ({Math.ceil(percentages)}%)
                </strong>
            </p>

            <p className="highscore">
                (High Score: {highScore} points)
            </p>

            <button className="btn btn-ui" onClick={() => dispatch({type: 'restartQuiz'})}>Restart Quiz</button>
            
        </>
    )
};