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
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if(username === '' || password === ''){
    	displayErrorToast('Please try again');
    }
    else{
    	const dataForApiRequest = {
            username: username,
            password: password
        } 
        $.ajax({
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: dataForApiRequest,
            success: function(data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
                displaySuccessToast('Logged in Successfully');
            },
            error: function(xhr, status, err) {
                displayErrorToast('Invalid username or password');
            }
        })
       }
}

function addTask() {
    const task = document.getElementById('add_task').value.trim();
    if (task === "") {
        displayErrorToast('Task cannot be empty');
        return;
    }
    const dataForApiRequest = {
        title: task
    }
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/create/',
        method: 'POST',
        data: dataForApiRequest,
        success: function(data, status, xhr) {
            displaySuccessToast('Task Added');
            getTasks()
            document.getElementById('add_task').value ="";
        },
        error: function(xhr, status, err) {
            displayErrorToast('Some Error Occurred');
        }
    })
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
      const dataForApiRequest = {
        id: id
    }
     $.ajax({
     	headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/'+id+'/',
        method: 'DELETE',
        data: dataForApiRequest,
        success: function(data, status, xhr) {
            displaySuccessToast('Task Deleted');
            getTasks();
        },
        error: function(xhr, status, err) {
            displayErrorToast('Try again');
        }
     })
     
}

function updateTask(id) {
     const task = document.getElementById("input-button-" + id).value.trim()
    if (task == '')
    {
        displayErrorToast("Please Enter a value")
        return
    }
    displayInfoToast("Please Wait");
    const dataForApiRequest =
    {
        title : task,
        id : id
    }
    $.ajax({
        url : API_BASE_URL + 'todo/' + id + '/',
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token')
        },
        method: 'PUT',
        data: dataForApiRequest,
        success: function(data, status, xhr)
        {
            displaySuccessToast("Task Successfully Updated");
            getTasks()
        },
        error: function(data, status, xhr)
        {
            displayErrorToast("Error Occured")
        }
    })
    document.getElementById('task-' + id).classList.remove('hideme');
    document.getElementById('task-actions-' + id).classList.remove('hideme');
    document.getElementById('input-button-' + id).classList.add('hideme');
    document.getElementById('done-button-' + id).classList.add('hideme');
}
