import {level_1, level_2, level_3} from "./data.js";

const backgroundMusic = document.querySelector('#background_music')
const submitButton = document.querySelector('#submit_button')
const pointContainer = document.querySelector('#point_container')
const questionContainer = document.querySelector('#question_container')
const list_of_answers_container = document.querySelector('#list_of_answers_container')
const input_text_answer = document.querySelector('#input_text_answer')
const wrong_answer_label = document.querySelector('#your_answer_label')



let score = 0

let failed_attempt = 0

submitButton.addEventListener('click', handleSubmit)

//when the user press the enter key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        backgroundMusic.play()
        handleSubmit()
    }
});

function handleSubmit() {

    //play the music
    backgroundMusic.play()

    //get the value and then make it lowercase then remove whitespace
    const inputValue = input_text_answer.value.toLowerCase().trim()

    //let me try guard let of input handling as a small validation check
    if (inputValue === '') {
        //update the ui and remove the value if its empty string
        clearInputTextAnswer()
        alert('input cannot be empty')
    } else {
        //input is not empty check the array of valid answers
        checkValidAnswerOnSpecificLevel()
        //clear the input field
        clearInputTextAnswer()
        
    }

    checkFailedAttempt()
}




let accepted_answer = []
function checkValidAnswerOnSpecificLevel() {
    
    //get the value and then make it lowercase then remove whitespace
    const inputValue = input_text_answer.value.toLowerCase().trim()
    //game level
    const level = game_progression.level


    //this will return true or false
    //if it exist inside accepted_array then this will return true
    const isAlreadyInAcceptedAnswerArray = !isNotInAcceptedAnswerArray(inputValue)


    //game level with type number inside game_progression object
    if(level >= 1 && level <= 3) {

        
        levelGameMechanics(inputValue, isAlreadyInAcceptedAnswerArray)

    }

    updateWrongAnswerLabel()
}

const isNotInAcceptedAnswerArray = (answerString) => {
    let isNotInArray = true

    accepted_answer.find( answer => {
        if(answerString === answer) isNotInArray = false
    })

    return isNotInArray

}

//clear the text field
const clearInputTextAnswer = () => input_text_answer.value = null

const checkIfAnswerHasMatch = answerString => {
    
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


// ********************* GAME PROGRESSION ********************* 

const levels = [level_1, level_2, level_3]

const game_progression = {
    level: 1,
    score: score,
    current_level: level_1,
    goToNextLevel: () => {
        game_progression.level = game_progression.level += 1
        game_progression.current_level = levels[game_progression.level - 1]
        //call the function below to update the question portion and the li
        gameProgressionUI()
    },  
}

// ********************* GAME PROGRESSION ********************* 





export const levelGameMechanics = (inputValue, isAlreadyInAcceptedAnswerArray) => {
    //i want to check if the user input matches correct answer inside the array
    const result = checkIfAnswerHasMatch(inputValue)

    
    //if its in a correct answer
    //and it does not exist inside accepted_answer array
    if(result.matchFound && isNotInAcceptedAnswerArray(inputValue)) {

        //push it to answered array
        accepted_answer.push(inputValue)

        //update score
        updateUIScore(result.point)

        //update the ui so the correct answer will reveal by changing the text color
        let liCorrectAnswer = document.querySelector(`.${result.answer}`)
        liCorrectAnswer.style.color = 'white'

        //after correct answer go and focus the cursor to the input
        //https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
        input_text_answer.focus()
        
        
        if(game_progression.current_level.required_number_of_correct_answer === accepted_answer.length) {
            alert(`Congratulations You pass Level: ${game_progression.level}`)
            
            //reset accepted answer array
            accepted_answer = []

            failed_attempt = 0;

            //go to next level
            game_progression.goToNextLevel()

        }

    }  else if (isAlreadyInAcceptedAnswerArray) { 
        //there is a match but it already exist inside accepted_answer_array
        //so we cannot increase the score
        alert('you cannot repeat your answer')
    } else {
        //no match add an x mark
        alert('survey says no')

        //increase the failed attempt
        failed_attempt++

        //clear the input text
        clearInputTextAnswer()

        
        
    }
}




//all about ui

const gameProgressionUI = () => {

    updateQuestionUI()
    updateUIListOfAnswers()
}

const updateQuestionUI = () => {
    questionContainer.innerText = game_progression.current_level.host_said

}

const updateUIScore = point => {
    
    score += point
    pointContainer.innerText = score
}

const updateUIListOfAnswers = () => {

    //clear first for clean slate
    list_of_answers_container.innerHTML = ''
    //create an ol and li dynamically base on the current level
    const ol = document.createElement('ol')
    
    //add each value to the ol
    game_progression.current_level.array_of_answer_and_points.forEach( (option) => {

        //i now have the value now i need to add it to li
        const li = document.createElement('li')
        //so it will blend in the background and wont be visible
        li.style.color = 'var(--game_main_color)'
        li.classList.add(`${option.answer}`)
        const stringSpan = `
        <span
         style="
         color: black;
         font-size: larger;
         float: right;
         background-color: white;
         height: 100%;
         display: flex;
         padding: 0rem 10px 0rem 10px;
         align-items: center;
         border-radius: 0px 10px 10px 0px
         "
        >
         ${option.point}
         </span>
        `
        li.innerHTML = `${option.answer.toUpperCase()} ${stringSpan}`
        ol.appendChild(li)

    })


    list_of_answers_container.appendChild(ol)
    
}

const updateWrongAnswerLabel = () => {
    wrong_answer_label.innerText = ''
    //add x mark whenever the answer is incorrect
    
    let x_mark = ''

    for (let index = 1; index <= failed_attempt; index++) {
        wrong_answer_label.style.visibility = 'visible'
        x_mark += '❌'
        
    }
    
    if(failed_attempt >= 1) {
        wrong_answer_label.innerText = `Wrong Answer: ${x_mark}`
    }
    
}

const checkFailedAttempt = () => {
    if(failed_attempt === 3) {
        alert('sorry you lose game will restart')

        //restart the game
        location.reload()
    }
}

gameProgressionUI()


