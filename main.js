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
            success: function (data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            },
            error: function (xhr, status, err) {
                displayErrorToast('An account using same email or username is already created');
            }
        })
    }
}

function login() {
    const username = $('#inputUsername').val();
    const password = $('#inputPassword').val();

    //checking if both username and password entered i.e length>0
    if (username.length == 0) {
        displayInfoToast("Enter username");
    } else if (password.length == 0) {
        displayInfoToast("Enter password");
    }
    else {
        //verifying credentials and fetching auth token
        displayInfoToast("Verifying credentials...");
        $.ajax({
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: {
                username: $('#inputUsername').val(),
                password: $('#inputPassword').val()
            },
            success: (data, status, xhr) => {
                displaySuccessToast('Logging in...');
                localStorage.setItem('token', data.token);
                setTimeout(() => {
                    window.location.href = '/';
                }, 500);
            },
            error: (xhr, status, err) => {
                if (400 <= xhr.status && xhr.status < 500)
                    displayErrorToast('Invalid credentials');
                else if (xhr.status == 0)
                    displayErrorToast("Connection failure. Please check your internet connection...");
                else
                    displayErrorToast("Unknown error occured");
            }
        });
    }
}

function addTask() {
    const taskInput = $('#task-input').val();
    if (taskInput.length == 0) {
        displayInfoToast("Enter a task first")
    } else if (taskInput.length > 255) {
        displayInfoToast("Task length is too large")
    }
    else {
        displayInfoToast("Adding task...")
        $.ajax({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/create/',
            method: 'POST',
            data: {
                title: taskInput
            },
            success: (data, status, xhr) => {
                getTasks();
                displaySuccessToast('Task added!');
            },
            error: (xhr, status, err) => {
                if (xhr.status == 0) {
                    displayErrorToast("Connection failure. Please check your internet connection...");
                } else {
                    displayErrorToast("Unknown error occured")
                }
            }
        });
    }
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    displayInfoToast("Deleting task...")
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'DELETE',
        success: (data, status, xhr) => {
            getTasks();
            displaySuccessToast('Task deleted!');
        },
        error: (xhr, status, err) => {
            if (xhr.status == 0) {
                displayErrorToast("Connection failure. Please check your internet connection...");
            } else {
                displayErrorToast("Unknown error occured")
            }
        }
    })
}

function updateTask(id) {
    const taskInput = $('#input-button-' + id).val();
    if (taskInput.length == 0) {
        displayInfoToast("Enter a task first")
    } else if (taskInput.length > 255) {
        displayInfoToast("Task length is too large")
    }
    else {
        displayInfoToast("Updating task...")
        $.ajax({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/' + id + '/',
            method: 'PUT',
            data: {
                title: taskInput
            },
            success: (data, status, xhr) => {
                getTasks();
                displaySuccessToast('Task updated!');
            },
            error: (xhr, status, err) => {
                if (xhr.status == 0) {
                    displayErrorToast("Connection failure. Please check your internet connection...");
                } else {
                    displayErrorToast("Unknown error occured")
                }
            }
        });
    }
}
