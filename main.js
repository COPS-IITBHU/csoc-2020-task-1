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
        const dataForApiRequest = {
            username: username,
            password: password
        }
        $.ajax(
        {
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data:dataForApiRequest,
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
function additinDOM(title, id) {
    folder = document.getElementsByClassName("list-group todo-available-tasks")[0];
    folder.innerHTML += '<li class="list-group-item d-flex justify-content-between align-items-center" id="' + id + '">\n' +
                    '<input id="input-button-' + id + '" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">\n' +
                    '<div id="done-button-' + id + '"  class="input-group-append hideme">\n' + 
                    '   <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(' + id + ')">Done</button>\n</div>' +
                    '<div id="task-'+ id + '" class="todo-task">' + title + '</div>\n' + 
                    '<span id="task-actions-' + id + '">\n' +
                    '    <button style="margin-right:5px;" type="button" onclick="editTask(' + id + ')"' + 
                    '        class="btn btn-outline-warning">\n' + 
                    '        <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px">\n' +
                    '    </button>\n'+
                    '    <button type="button" class="btn btn-outline-danger" onclick="deleteTask(' + id + ')">\n' +
                    '        <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px">' +
                    '   </button>\n</span>\n</li>\n';
}


function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    displayInfoToast("Adding Task...");
    const task = document.getElementById('add_task').value.trim();
    const dataForApiRequest = {
        title: task
    }  
      $.ajax({
            method: 'POST',
            url: API_BASE_URL + 'todo/create/',
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token')
            },
            data :dataForApiRequest,
            success: function(data, status, xhr){
                displaySuccessToast('Task Added');
                getTasks();
                document.getElementById('Add_Task').value="";
            },
            error: function(xhr, status, err){
                displayErrorToast("Cannot add task");
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
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + `todo/${id}/`,
        method: 'DELETE',
        success: function(data, status, xhr) {
            displaySuccessToast('Task Deleted Successfully');
            getTasks();
        },
        error: function(xhr, status, err) {
            displayErrorToast('Problem in reaching Server. Please try again later.');
        }
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const tupdated = document.getElementById(`input-button-${id}`).value.trim();
    const dataForApiRequest = {
        title: tupdated
    }

    if(tupdated){
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + `todo/${id}/`,
        method: 'PATCH',
        data: dataForApiRequest,
        success: function(data, status, xhr) {
            displaySuccessToast('Task Updated Successfully');
            getTasks();
        },
        error: function(xhr, status, err) {
            displayErrorToast('Problem in reaching Server. Please try again later.');
        }
    })
}else{
    displayErrorToast('Please fill the field before updating.');

}
    
}
