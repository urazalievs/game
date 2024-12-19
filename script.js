// Кнопки
const gameBtn = document.getElementById('gameBtn');
let USERNAME;
let points = 1000;
let game_id;
// Слушетели событий
gameBtn.addEventListener("click", startOrStopGame)
document.querySelector("#loginWrapper form").addEventListener("submit",(event)=>{
    event.preventDefault()
    auth()
});

[... document.getElementsByClassName("point")].forEach((elem)=>{
    elem.addEventListener('click', addPoint)
});

function addPoint(event){
    let target = event.target;
    points = +target.innerHTML;
    const acctiveBtn = document.querySelector(".point.activ");
    acctiveBtn.classList.remove("activ");

    target.classList.add("activ")
    console.log(points);
    
}

function startOrStopGame(){
    if(gameBtn.innerHTML == 'ИГРАТЬ'){
        gameBtn.innerHTML= "Завершить игру"
        gameBtn.style.backgroundColor="red"
        startGame()
    }
    else{
        gameBtn.innerHTML= 'ИГРАТЬ'
        gameBtn.style.backgroundColor="#66a663"
        stopGame()
    }
}

async function startGame(){
    let response  = await sendRequest("new_game","POST",{
        username: USERNAME,
        points,
    });
    if(response.error){
        gameBtn.innerHTML= 'ИГРАТЬ'
        alert(response.message)
    }else{
        game_id = response.game_id;
        updateUserBalance();    
        console.log(game_id);
        activeArea();
    }
}



function activeArea(){
    const field = document.getElementsByClassName("field");

   
    for(let i = 0; i<field.length;i++){
        
        field[i].addEventListener('contextmenu', setFlag);  
        setInterval(()=>{
            field[i].classList.add("activ");
        }, 20*i)
        let row = Math.trunc(i / 10);
        let column = (i - row * 10);
        field[i].setAttribute("data-row", row)
        field[i].setAttribute("data-column", column);
        field[i].addEventListener('click', makeStep)
    }
}

async function makeStep(event){
    let target = event.target;
    let row = +target.getAttribute("data-row");
    let column = +target.getAttribute("data-column");

    try{
        let response = await sendRequest("game_step", 'POST',{game_id, row, column});
        console.log(response);
        updateArea(response.table)
        if(response.error){
            alert(response.message)
        }else{
            if(response.status == 'Ok'){
                
            }
            else if(response.status == 'Failed'){
                alert("вы проиграли!")
                gameBtn.innerHTML= 'ИГРАТЬ'
                gameBtn.style.backgroundColor="#66a663"
                setTimeout(()=>resetField(), 2000)
            }
            else if(response.status == 'Won'){
                alert("вы выйгали!")
                updateUserBalance()
            }
        }
    }catch(error){
        console.error(`Неправильный номер ${error}`);
        
    }
} 

function updateArea(table){
    
    let field = document.querySelectorAll(".field")
    let a = 0;
    for(let i = 0; i< table.length; i++){
        let row = table[i];
        for(let j = 0; j < row.length; j++){
            let cell = row[j]
            let value = field[a]
            if(cell == ''){
            }else if(cell === 0){
                value.classList.remove("activ")
            }else if(cell == 'BOMB'){
                value.classList.remove("activ")
                value.classList.add("bomb")
            }else if(cell > 0){
                value.classList.remove("activ")
                value.innerHTML = cell
            }
            a++
        }
    }
}

async function stopGame(){
    let response  = await sendRequest("stop_game","POST",{
        username: USERNAME,
        game_id,
    });
    if(response.error){
        gameBtn.innerHTML= "Завершить игру"
        alert(response.message)
    }else{
        updateUserBalance();
        resetField()
    }
}
function setFlag(event){
    event.preventDefault()
    let target = event.target;
    target.classList.toggle("flag")
    console.log(target);
}
 function resetField(){
    const gameField = document.querySelector(".gameField");
    gameField.innerHTML= '';
    for(let i = 0; i<80; i++){
        let cell = document.createElement('div');
        cell.classList.add("field");
        gameField.appendChild(cell)
        
 }
}   
 resetField()

async function auth() {
    const loginWrapper = document.getElementById("loginWrapper");
    const login= document.getElementById("login").value;
    let response = await sendRequest('user', "GET", {
        username: login
    })
    console.log(response);
    if(response.error){
        // пользователь не зарегался
        let regist = await sendRequest("user", "POST", {username:login})
        if(regist.error ){
            alert(regist.message)
        }else{
            USERNAME = login;
            loginWrapper.style.display="none"
            updateUserBalance()
        }
    }
    else{
        USERNAME = login;
        loginWrapper.style.display="none"
        updateUserBalance()
    }
}


async function updateUserBalance(){
    let response = await sendRequest("user",'GET', {
        username : USERNAME
    })
    console.log(response);
    
        if(response.error){
            alert(response.message)
        } else{
            const user =document.querySelector("header span")
            user.innerHTML =`Пользователь ${response.username} с балансом ${response.balance}`
        }

};



async function sendRequest(url, method, data) {
    url = `https://tg-api.tehnikum.school/tehnikum_course/minesweeper/${url}`
    
    if(method == "POST") {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    
        response = await response.json()
        return response
    } else if(method == "GET") {
        url = url+"?"+ new URLSearchParams(data)
        let response = await fetch(url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        response = await response.json()
        return response
    }
}