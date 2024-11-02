export const checkFailedAttempt = (failed_attempt) => {
    
    if(failed_attempt === 3) {
        alert(`sorry you lose with score of: ${score}\n\ngame will restart`)

        //restart the game
        location.reload()
    }
}