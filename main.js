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
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if( username === "" || password === "" ){
        displayErrorToast("Enter both username and password");
        return;
    } else {
        displayInfoToast("Please wait...");
        const dataForApiRequest = {
            username: username,
            password: password,
        }
        $.ajax({
            url: API_BASE_URL + "auth/login/",
            method: 'POST',
            data: dataForApiRequest,
            success: function(data){
                localStorage.token = data['token'];
                displaySuccessToast("Login Successfull")
                setTimeout(function(){window.location.href = '/';} , 400)
            },
            error: function(data){
                displayErrorToast("Login Failed, invalid credentials.");
            }
        })
    }
}

function addTask() {
    task = document.getElementById('newTask').value;
    if(task === ""){
        displayErrorToast("No task to add.");
        return;
    } else {
        const authHeader = {
            Authorization: "Token " + localStorage.token
        }
        const dataForApiRequest = {
            title:task
        }
        $.ajax({
            url: API_BASE_URL + "todo/create/",
            method: 'POST',
            headers: authHeader,
            data: dataForApiRequest,
            success: function(data){
                document.getElementById('newTask').value = "";
                displaySuccessToast("Task succesfully added.");
            },
            error: function(data){
                displayErrorToast("Unable to add task.");
            }
        })
        $.ajax({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/',
            method: 'GET',
            success: function(data, status, xhr) {
                appendTask(data[data.length - 1].id, data[data.length - 1].title);
            },
            error: function(data){
                setTimeout(function(){
                    displayErrorToast("Unable to fetch data, reloading page....");
                }, 300);
                window.location.href = "/";
            }
        })
    }
}

function editTask(id) {
    document.getElementById('task-' + id).classList.toggle('hideme');
    document.getElementById('task-actions-' + id).classList.toggle('hideme');
    document.getElementById('input-button-' + id).classList.toggle('hideme');
    document.getElementById('done-button-' + id).classList.toggle('hideme');
}

function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    const authHeader = {
        Authorization: "Token " + localStorage.token
    }
    $.ajax({
        url: API_BASE_URL + "todo/" + id + "/",
        method: "DELETE",
        headers: authHeader,
        success: function(data){
            document.getElementById("li-"+id).remove();
            displaySuccessToast("Task succesfully Deleted.");
        },
        error: function(data){
            displayErrorToast("Unable to delete task, please try again.");
        }
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    var new_title = document.getElementById("input-button-" + id).value;
    const authHeader = {
        Authorization: "Token " + localStorage.token
    }
    const dataForApiRequest = {
        title:new_title
    }
    $.ajax({
        url: API_BASE_URL + "todo/" + id + "/",
        method: "PATCH",
        headers: authHeader,
        data: dataForApiRequest,
        success: function(data){
            displaySuccessToast("Task succesfully updated.");
            document.getElementById('task-'+id).innerHTML = new_title;
            editTask(id);
        },
        error: function(data){
            displayErrorToast("Unable to update task, please try again.");
        }
    })
}
