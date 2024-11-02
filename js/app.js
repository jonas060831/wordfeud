//data
import {level_1, levels} from "./data/game.js";
import { checkFailedAttempt, checkIfAnswerHasMatch } from './logic/index.js'
import { clearInputTextAnswer, updateWrongAnswerLabel, showLeaderBoard } from './ui/index.js'

//index.html elements
const gameAndInputScreen= document.querySelector('.game_and_input_container')
const startButton = document.querySelector('#start_button')
const backgroundMusic = document.createElement('audio')
backgroundMusic.src = './public/music/familyfeud_background_music.mp3'
backgroundMusic.loop = true;
const submitButton = document.querySelector('#submit_button')
const pointContainer = document.querySelector('#point_container')
const questionContainer = document.querySelector('#question_container')
const list_of_answers_container = document.querySelector('#list_of_answers_container')

//the screen when the game loads
let introScreen = document.querySelector('.intro_container')

let leaderBoardScreen = document.querySelector('.leader_board_container')

//screen 0 is introScreen, 1 is the gameAndInputScreen, leaderBoardScreen, goodByeScreen
let screen = 0

//user score across all levels
let score = 0
//this variable should reset on each level but once 3 failed attempt is reach it will reset the game
let failed_attempt = 0
//array of correct answer provided by the user on each level this resets as well
let accepted_answer = []


//event listener for the start button
startButton.addEventListener('click', handleStartGameScreen)

//event listener for button clicks
submitButton.addEventListener('click', handleSubmit)

//this event listener is a better approach compared to the one where i attach on the whole document
input_text_answer.addEventListener('keydown', (event) => event.key === 'Enter' ? handleSubmit() : null)



function handleStartGameScreen() {
    backgroundMusic.play()
    screen = 1
    gameProgressionUI()
}

function handleSubmit() {
    //play the music
    backgroundMusic.play()

    //get the value and then make it lowercase then remove whitespace on the front and end part of the string
    const inputValue = input_text_answer.value.toLowerCase().trim()

    if (inputValue === '') {
        //update the ui and remove the value if its empty string
        clearInputTextAnswer()
        alert('input cannot be empty')
    } else {
        //input is not empty check the array of valid answers

        //game logic
        checkValidAnswerOnSpecificLevel()
        //clear the input field
        clearInputTextAnswer()
    }

    
    //each submit i check how many mistakes the user have
    checkFailedAttempt(failed_attempt)

    if(failed_attempt === 3) {
        screen = 2
        setTimeout(() => {
            gameProgressionUI()
        },4000)
    }
}

function checkValidAnswerOnSpecificLevel() {
    
    //get the value and then make it lowercase then remove whitespace on the string
    const inputValue = input_text_answer.value.toLowerCase().trim()
    //game level
    const level = game_progression.level


    //this will return true or false
    //if it exist inside accepted_array then this will return true
    const isAlreadyInAcceptedAnswerArray = !isNotInAcceptedAnswerArray(inputValue)

    //game level with type number inside game_progression object
    if(level <= levels.length) levelGameMechanics(inputValue, isAlreadyInAcceptedAnswerArray)
    
}

const isNotInAcceptedAnswerArray = (answerString) => {
    let isNotInArray = true

    accepted_answer.find( answer => {
        if(answerString === answer) isNotInArray = false
    })

    return isNotInArray

}



// ********************* GAME PROGRESSION START ********************* 
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
// ********************* GAME PROGRESSION END ********************* 


export const levelGameMechanics = (inputValue, isAlreadyInAcceptedAnswerArray) => {
    //i want to check if the user input matches correct answer inside the array
    const result = checkIfAnswerHasMatch(inputValue, game_progression)
    const correctAnswerSound = document.createElement('audio')
    const incorrectAnswerSound = document.createElement('audio')

    correctAnswerSound.src = './public/music/correct_answer_sound.mp3'
    incorrectAnswerSound.src = './public/music/incorrect_answer_sound.mp3'
    
    //if its in a correct answer
    //and it does not exist inside accepted_answer array
    if(result.matchFound && isNotInAcceptedAnswerArray(inputValue)) {


        correctAnswerSound.play()
        //push it to answered array
        accepted_answer.push(inputValue)

        //update score
        updateUIScore(result.point)

        //update the ui so the correct answer will reveal by changing the text color
        let liCorrectAnswer = document.querySelector(`.${result.answer}`)
        // liCorrectAnswer.style.color = 'white'
        liCorrectAnswer.style


        liCorrectAnswer.innerHTML = `${result.answer.toUpperCase()} <span id='point_bubble'>${result.point}</span>`

        //after correct answer go and focus the cursor to the input
        //https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
        input_text_answer.focus()
        
        
        if(game_progression.current_level.required_number_of_correct_answer === accepted_answer.length) {
            alert(`Congratulations You pass Level: ${game_progression.level}`)

            
            //finish the game in line 162
            const currentLevelRequiredCorrectAnswer = game_progression.current_level.required_number_of_correct_answer
            if(
                currentLevelRequiredCorrectAnswer === accepted_answer.length
                &&
                game_progression.level === levels.length
            ) {
                alert(`Congratulations You finished with a score of : ${score}`)

                //go to leaderboard screen
                screen = 2
                //location.reload()
            }
            
            //reset accepted answer array
            accepted_answer = []

            failed_attempt = 0;

            updateWrongAnswerLabel(failed_attempt)

            //go to next level
            game_progression.goToNextLevel()
        }

    }  else if (isAlreadyInAcceptedAnswerArray) { 
        //there is a match but it already exist inside accepted_answer_array
        //so we cannot increase the score
        alert('you cannot repeat your answer')
    } else {

        //clear the input text
        clearInputTextAnswer()

        //play incorrect sound
        incorrectAnswerSound.play()

        //increase the failed attempt
        failed_attempt++
        //executes after 2 seconds
        setTimeout(() => updateWrongAnswerLabel(failed_attempt) ,2000)

        
        
    }
}

//all about ui
function gameProgressionUI() {

    //gameAndInputContainer
    if(screen === 0) {
        //show intro screen
        introScreen.style.display = 'flex'
        //and hide all other screen
        gameAndInputScreen.style.display = 'none'
    }else if(screen === 1) {
        //intro screen
        introScreen.style.display = 'none'
        //gameScreen
        gameAndInputScreen.style.display = 'flex'
    } else if(screen === 2){
        //leaderBoardScreen
        introScreen.style.display = 'none'
        gameAndInputScreen.style.display = 'none'
        leaderBoardScreen.style.display = 'flex'
        showLeaderBoard(score)
    } else {
        //goodbye screen
    }

    updateQuestionUI()
    updateUIListOfAnswers()
    
}

function updateQuestionUI() {
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

        li.classList.add(`${option.answer}`)

        const stringSpan = `<span id="point_bubble" >${option.point}</span>`
        //i need the empty space &nbsp because im using float
        li.innerHTML = `&nbsp; ${stringSpan}`
        ol.appendChild(li)
    })
    list_of_answers_container.appendChild(ol)
}