let dummyApiUrl = 'https://reqres.in/'

let popup = document.getElementById('pop-up');
let container = document.getElementById('container');
let wrapper = document.getElementById('list-wrapper');

let nameInput = document.getElementById('name');
let emailInput = document.getElementById('email');

let users = [];
let userToUpdate = null;

main();

async function main () {
    await fetchUsers();
    getUserCards();
}

function showPopup() {
    if(userToUpdate){
        nameInput.value = userToUpdate.first_name + " " + userToUpdate.last_name;
        emailInput.value = userToUpdate.email;
    }
    
    if(popup.classList.contains('show')){
        popup.classList.remove('show')
        container.classList.remove('is-blurred');
    }else{
        popup.classList.add('show');
        container.classList.add('is-blurred');
    }
}

async function fetchUsers() {
    try{
        const response = await fetch(dummyApiUrl+"api/users");
        if(response.status >=200 && response.status < 300){
            let data = await response.json();
            users = data.data;
        }
    }catch(error){
        console.log(error);
    }
}

function getUserCards(){
    console.log(users)
    wrapper.innerHTML = '';
	users.map(d => {
		let {id, avatar, email, first_name, last_name} = d;
		wrapper.innerHTML += `
                <div class="card">
                    <img src="${avatar ? avatar : "https://picsum.photos/id/237/200/300"}" alt="" class="avatar">
                    <div class="column middle">
                        <p>${first_name} ${last_name}</p>
                        <p>${email}</p>
                    </div>
                    <div class="column buttons">
                        <button onclick="updateUser(${id})">Update</button>
                        <button onclick="deleteUser(${id})">Delete</button>
                    </div>
                </div>`
	})
}

async function addUser(){
    let [first_name, last_name] = nameInput.value.split(' ');
    let user = { first_name, last_name, email: emailInput.value };
    nameInput.value = "";
    emailInput.value = "";

    let httpMethod = userToUpdate ? "put" : "post";
    let userId = userToUpdate ? userToUpdate.id : "";
    try{
        const response = await fetch(dummyApiUrl+"api/users/"+userId, {
            method: httpMethod,
            body: {user}
        });
        let res = await response.json();
        console.log(res);
        if(userToUpdate){
            users = users.map(u => {
                if(userToUpdate.id === u.id){
                    return {...u, ...user}
                }
                return u;
            });
            userToUpdate = null;
        }else{
            users.push({...user, id: res.id});
        }
        getUserCards();
        showPopup();
    }catch(error){
        console.log(error);
    }
}

async function updateUser(id){
    userToUpdate = users.find(u => u.id === id);
    showPopup();
}

async function deleteUser(id){
    try{
        const response = await fetch(dummyApiUrl+"api/users/"+id, {
            method: 'delete'
        });
        console.log(await response.text());
        users = users.filter(u => u.id !== id);
        getUserCards();
    }catch(error){
        console.log(error);
    }
}