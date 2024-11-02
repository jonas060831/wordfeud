import { leaderBoard } from '../data/leaderboard.js'

const inputTextAnswer = document.querySelector('#input_text_answer')
const wrongAnswerDiv = document.querySelector('#wrong_answer_indicator')


//clear the input text field
export const clearInputTextAnswer = () => inputTextAnswer.value = null


//add x mark whenever the answer is incorrect 
export const updateWrongAnswerLabel = (failed_attempt) => {

    //this will clear whatever is in the ui since updateWrongAnswerLabel gets called each time handleSubmit is called
    //wrongAnswerDiv.innerHTML = ''
    
    //i want to change the x mark text to image instead


    let ul = document.createElement('ul')
    
    //create an image element
    let x_mark_image = document.createElement('img')
    x_mark_image.src = './public/images/x_mark.png'
    x_mark_image.width = 50
    x_mark_image.height = 50
    x_mark_image.style.pointerEvents = 'none' 

    for (let index = 1; index <= failed_attempt; index++) {
        //create the li and then append the image to li
        const li = document.createElement('li')
        li.style.listStyleType = 'none'

        li.appendChild(x_mark_image)

        ul.appendChild(li)
    }
    
    wrongAnswerDiv.appendChild(ul)

    if(failed_attempt >= 1) {
        wrongAnswerDiv.style.visibility = 'visible'
    } else if (failed_attempt === 0 ){
        //remove the x mark ui
        wrongAnswerDiv.innerHTML = ''
    }

}




export const showLeaderBoard = (score) => {

    const leaderBoardContainerDiv = document.querySelector('.leader_board_container')
    
    const ul = document.createElement('ul')

    //add your data to the leaderboard
    const you = { 
        name: 'You',
        image: './public/images/programmer.jpg',
        score: score
     }
    
    leaderBoard.push(you)

    //i need to sort the array by score
    //sort descending order by putting playerY.score first before X
    const sortedLeaderBoard = leaderBoard.sort((playerX, playerY) => playerY.score - playerX.score)


    

    for (let index = 0; index < sortedLeaderBoard.length; index++) {
        
        const user = sortedLeaderBoard[index]
        const imageAndNameDiv = document.createElement('div')
        imageAndNameDiv.classList.add('player_image_and_name_container')

        const li = document.createElement('li')
        li.classList.add('player_list_item')
        li.listStyleType = 'none'
        
        const image = document.createElement('img')
        image.src = user.image
        image.id = 'player_avatar_image'
        imageAndNameDiv.appendChild(image)
        
        const h3 = document.createElement('h3')
        h3.innerText = user.name
        imageAndNameDiv.appendChild(h3)
        
        const h3S = document.createElement('h3')
        h3S.innerText = user.score

        //if its you
        if(user.name === 'You') {
            li.style.color = 'red'
            li.style.background = 'linear-gradient(gold, rgb(253, 180, 33))'
        }

        li.appendChild(imageAndNameDiv)
        li.appendChild(h3S)
        ul.appendChild(li)
    }
    //you
    leaderBoardContainerDiv.appendChild(ul)

    document.body.append(leaderBoardContainerDiv)
}