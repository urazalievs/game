// Кнопки
const gameBtn = document.getElementById('gameBtn')


// Слушетели событий
gameBtn.addEventListener("click", activeArea)

function activeArea(){
    const field = document.getElementsByClassName("field");
    gameBtn.innerHTML= "Завершить игру"
    for(let i = 0; i<field.length;i++){
        setInterval(()=>{
            field[i].classList.add("activ");
        }, 100*i)
    }
}
