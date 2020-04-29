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

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    username = document.getElementById('inputUsername').value.trim();
    password = document.getElementById('inputPassword').value;

    if (username != '' && password != ''){
        displayInfoToast("Please wait...");
        $.ajax(
        {
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: {
                username: username,
                password: password
            },
            success : function(data, status, xhr){
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            },
            error: function(xhr, status, err){
                displayErrorToast('Invalid details!!');
            }
        })
    }
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    task = $('div.todo-add-task input.form-control').val();
    if (task != ''){
        $.ajax({
            method: 'POST',
            url: API_BASE_URL + 'todo/create/',
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token')
            },
            data : {
                title: task
            },
            success: function(data, status, xhr){
                displaySuccessToast('Task Added');
                getTasks();
            },
            error: function(xhr, status, err){
                displayErrorToast("Cannot add task");
            }
        })
    }
    $('div.todo-add-task input.form-control').val('');
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
    $.ajax({
        url: API_BASE_URL + 'todo/' + id,
        headers: {
            Authorization: "Token " + localStorage.getItem('token')
        },
        method: 'DELETE',
        success: function(data, status, xhr){
            displaySuccessToast('Task Deleted');
            getTasks();
        },
        error: function(xhr, status, err){
            displayErrorToast('Error Occured.');
        }
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    new_title = $('input#input-button-'+id).val();
    if (new_title != ''){
        $.ajax({
            url: API_BASE_URL + 'todo/' + id,
            headers: {
                Authorization: "Token " + localStorage.getItem('token')
            },
            method: 'PUT',
            data: {
                title: new_title
            },
            success: function(data, status, xhr){
                displaySuccessToast('Task Updated');
                getTasks();
            },
            error: function(xhr, status, err){
                displayErrorToast('Cannot update');
            }
        })
    }
}
