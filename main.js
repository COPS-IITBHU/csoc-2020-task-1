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

function validInputs(username, password){
    if(!(username === '' || password === '')){
       return true;
    }
    else{
        displayErrorToast("Some empty feilds detected!");
        return false;
    }
}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    // console.log(username);
    //console.log(typeof(password));
    if (validInputs(username,password)){
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            username:username,
            password:password
        } 
        $.ajax({
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: dataForApiRequest,
            success: function(data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            },
            error: function(xhr, status, err) {
                displayErrorToast('Invalid Username or Password');
            }
        })
    }
}
function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add tnamehe task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    var taskField = document.getElementById('newTask');
    const title= taskField.value.trim();
    if(title === ''){
        displayErrorToast('New Task does not have a valid name!');
        return false;
    }
    else{
        const dataForApiRequest = {
            title:title
        }
        $.ajax({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/create/',
            method: 'POST',
            data: dataForApiRequest,
            success: function(data, status, xhr){
                displaySuccessToast('New task has been successfully added!');
                getTasks();
            },
            error: function(xhr, status, err){
                console.log(err);
                displayErrorToast('Some error occured, please try again!');
            }
        })
    }
    taskField.value='';
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    console.log('in delete-function');
    console.log(id);
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'DELETE',
        success: function(data, status, xhr) {
            displaySuccessToast('Task successfully deleted');
            getTasks();
        },
        error: function(xhr, status, err){
            displayErrorToast('Cannot delete the task now,please try later!')
        }
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    console.log('in update-function');
    console.log(id);
    const newName = document.getElementById('input-button-' + id ).value.trim();
    if(newName === ''){
            displayErrorToast('Invalid name provided');
    }
    else{
        dataForApiRequest = {
            "title": newName
        }
        $.ajax({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/' + id + '/',
            method: 'PUT',
            data:dataForApiRequest,
            success: function(data, status, xhr) {
                displaySuccessToast('Task successfully updated');
                getTasks();
            },
            error: function(xhr, status, err){
                displayErrorToast('Cannot change the title now, please try later!')
                getTasks();
            }
        })
    }
}
