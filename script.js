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

function activeArea(){
    const field = document.getElementsByClassName("field");

   
    for(let i = 0; i<field.length;i++){
        
        field[i].addEventListener('click', setFlag);  
        setInterval(()=>{
            field[i].classList.add("activ");
        }, 20*i)
    }
}

function setFlag(event){
    event.preventDefault()
    let target = event.target;
    target.classList.toggle("flag")
    
}
 function resetField(){
    const gameField = document.querySelector(".gameField");
    gameField.innerHTML= '';
    for(let i = 0; i<80; i++){
        let cell = document.createElement('div');
        cell.classList.add("field");
        cell.classList.remove("activ")
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

        if(response.error){
            alert(response.message)
        } else{
            const user =document.querySelector("header span")
            user.innerHTML =`Пользователь ${response.username} с балансом ${response.balance}`
        }

}



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