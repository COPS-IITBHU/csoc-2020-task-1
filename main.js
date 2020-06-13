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
    const dataForApiRequest =  {
        username: document.getElementById('inputUsername').value,
        password: document.getElementById('inputPassword').value
    };
    $.ajax({
        url: API_BASE_URL + 'auth/login/',
        method: "POST",
        data: dataForApiRequest,
        success: function(data, status, xhr) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
            displaySuccessToast('Welcome back');
        },
        error: function(data, status, xhr) {
            displayErrorToast('Invalid credentials, try again');
        }
    });
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const dataForApiRequest = {
        title: document.getElementById('addTask').value
    };
    $.ajax({
        headers: {
            Authorization: "Token " + localStorage.getItem('token')
        },
        url: API_BASE_URL + 'todo/create/',
        method: "POST",
        data: dataForApiRequest,
        success: function(data, status, xhr) {
            $('#addTask').val('');
            displaySuccessToast("Task added");
            getTasks();
        },
        error: function(data, status, xhr) {
            displayErrorToast('Task could not be added, please try again');
        }
    });
}

function editTask(id) {
    // Text field by default now retains the unaltered task
    $('#input-button-'+id).val($('#task-'+id).text());
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
        headers: {
            Authorization: "Token " + localStorage.getItem('token')
        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: "DELETE",
        success: function(data, status, xhr) {
            console.log(id);
            displaySuccessToast('Task deleted');
            $('#'+id).remove();
        },
        error: function(data, status, xhr) {
            displayErrorToast('Task could not be deleted, please try again');
        }
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const dataForApiRequest = {
        title: document.getElementById('input-button-'+id).value
    };
    $.ajax({
        headers: {
            Authorization: "Token " + localStorage.getItem('token')
        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: "PATCH",
        data: dataForApiRequest,
        success: function(data, status, xhr) {
            $('#task-'+id).text(document.getElementById('input-button-'+id).value);
            $('#task-'+id).toggleClass('hideme');
            $('#input-button-'+id).toggleClass('hideme');
            $('#done-button-'+id).toggleClass('hideme');
            $('#task-actions-'+id).removeClass('hideme');
            displaySuccessToast('Updated Task');
        },
        error: function(data, status, xhr) {
            displayErrorToast('Task could not be updated');
        }
    })
}
