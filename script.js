// Кнопки
const gameBtn = document.getElementById('gameBtn');
document.querySelector("#loginWrapper form").addEventListener("submit",(event)=>{
    event.preventDefault()
    auth()
})


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

let USERNAME = "Sultan";

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

updateUserBalance()


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