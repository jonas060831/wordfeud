export const modal = (title='default title', content='default content', show=false) => {
    const modalOverlayContainer = document.querySelector('.modal_overlay')
    const titleContainer = document.querySelector('#modal_title')
    const contentContainer = document.querySelector('#modal_content')


    //if show is true append it to body
    if(show) {
        
        titleContainer.innerHTML = `<h4>${title}</h4>`        
        contentContainer.innerText = content
        modalOverlayContainer.style.display = 'flex'
        document.body.appendChild(modalOverlayContainer)
    } else {
        modalOverlayContainer.style.display = 'none'
    }
}