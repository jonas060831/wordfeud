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
        //append the image to li
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