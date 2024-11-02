
const dissapointmentSoundEffect = document.createElement('audio')

dissapointmentSoundEffect.src = 'public/music/dissapointment.mp3'
dissapointmentSoundEffect.volume = 0.7

export const checkFailedAttempt = (failed_attempt) => {
    
    if(failed_attempt === 3) dissapointmentSoundEffect.play()
}


export const checkIfAnswerHasMatch = (answerString, game_progression) => {
    
    let matchFound = false
    let point = 0
    let answer = ''
    game_progression.current_level.array_of_answer_and_points.find( option => {
        
        if(option.answer === answerString) {
            //there is a match increase score
            matchFound = true
            point = option.point
            answer = option.answer
            
        }
    })

    return { matchFound, point, answer }
}