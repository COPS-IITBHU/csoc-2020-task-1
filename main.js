function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    return true;
}

function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        $.ajax({
            url: API_BASE_URL + 'auth/register/',
            method: 'POST',
            data: dataForApiRequest,
            success: function(data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            },
            error: function(xhr, status, err) {
                displayErrorToast('An account using same email or username is already created');
            }
        })
    }
}
function verifyLogin(username, password) {

    if (username === '' || password === '') {
        displayErrorToast("please enter correct username or password!");
        return false;
    }
    return true;
}

    

function login() {

    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value.trim();
    if (verifyLogin(username, password)) {

        displayInfoToast("Please wait...");



    
        const dataForApi = {
            "username": username,
            "password": password
        }

        $.ajax({
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: dataForApi,
            success: function(data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
                displaySuccessToast('you are logged in!');
            },
            error: function(xhr, status, err) {
                displayErrorToast('incorrect username or password');
            }
        })
    }
}

function addTask() {
    
 var text= document.getElementById("addTask").value.trim();
 
 if(text===''){
     displayErrorToast('add valid task');
}
else if(text!='')
{
const task ={
    "title":text
}
$.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token')},
        url: API_BASE_URL + 'todo/create/',
            method: 'POST',
            data: task,
            success: function(data, status, xhr){
                displaySuccessToast('task added!!');
getTasks();
},
error:function(err,status,xhr){
    displayErrorToast('cannot add task');
}
})
}
          
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    const deleteRequest={
        id: id
    }
   
$.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token')},
        url: API_BASE_URL + 'todo/' + id + '/',
            method: 'DELETE',
            data: deleteTask,
            success: function(data, status, xhr){
                displaySuccessToast('taske deleted!');
getTasks();
},
error:function(err,status,xhr){
    displayErrorToast('cannot delete  task');
}
})

          
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const newtask = document.getElementById('input-button-' + id).value.trim();
    if(newtask==='')
    {
        displayErrorToast('can,t update!');
    }
    else{
       const nwtask={
            "title":newtask
        }
    
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')},
            url: API_BASE_URL + 'todo/' + id + '/',
                method: 'PATCH',
                data: nwtask,
                success: function(data, status, xhr){
                    displaySuccessToast('task added!!');
                    editTask(id);
    getTasks();
    },
    error:function(err, status, xhr){
        displayErrorToast('cannot add task');
    }
    })
     
}
}