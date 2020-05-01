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
    const name = document.getElementById("inputUsername").value.trim();
    const pass = document.getElementById("inputPassword").value;

    if(name==="" || pass===""){
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }

    $.ajax({
        url: API_BASE_URL + 'auth/login/',
        type: "POST",
        data : {
            username: name,
            password: pass
        },
        success : function(data,status,xhr){
            localStorage.setItem('token',data.token);
            window.location.href = '/';
        },
        error: function(xhr,status,error){
            document.getElementById('inputPassword').value='';
            displayErrorToast('Please enter correct email and password');
        }
    });
}

function addTask() {
    const Task = document.querySelector(".form-control").value.trim();

    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/create/',
        type: "POST",
        data:{
            title:Task,
        },
        success: function(status,xhr){
            displaySuccessToast("ADDED!");
            getTasks();
        },
        error: function(xhr,status,error){
            displayErrorToast("Invalid input!");
        }
    });
    document.querySelector(".form-control").value="";
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function deleteTask(id) {
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/'+id+'/',
        type: "DELETE",
        data: {
            id:id,
        },
        success: function(status,xhr){
            document.getElementById("task-" + id).parentElement.remove();
            displaySuccessToast("DELETED!");
        },
        error: function(xhr,status,err){
            displayErrorToast("ERROR!");
        }
    });
}

function updateTask(id) {
    const update = document.getElementById("input-button-"+id).value;

    if(update===""){
        displayErrorToast('Invalid input!');
        return false;
    }

    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/'+id+'/',
        type: "PUT",
        data: {
            title:update,
        },
        success: function(data,status,xhr){
                displaySuccessToast("UPDATED!");
                getTasks();
        },
        error: function(xhr,status,err){
            displayErrorToast("ERROR!");
            editTask(id);
        }

    })
}