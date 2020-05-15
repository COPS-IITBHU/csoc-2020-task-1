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

    displayInfoToast("Please wait...");
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (username == "") {
        displayErrorToast('Invalid Username');
        return;
    }
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
            displaySuccessToast('Login Successful..');
        },
        error: function(xhr, status, err) {
            if (xhr.status == 400)  displayErrorToast('Invalid Username/Password');
            else if (xhr.status == 0) displayErrorToast('Internet Connectivity Lost');
        }
    })
}

function additinDOM(title, id) {
    folder = document.getElementsByClassName("list-group todo-available-tasks")[0];
    folder.innerHTML += '<li class="list-group-item d-flex justify-content-between align-items-center" id="' + id + '">\n' +
                    '<input id="input-button-' + id + '" type="text" class="form-control todo-edit-task-input hideme" placeholder="' + title + '">\n' +
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
    const task = document.getElementById('add_task').value.trim();
    if (task == "") {
        displayErrorToast('Invalid Task');
        return;
    }
    displayInfoToast("Adding Task...");
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
            displaySuccessToast('Task Successfully Added..');
            getTasks();
            document.getElementById('add_task').value ="";
        },
        error: function(xhr, status, err) {
            if (xhr.status == 0) displayErrorToast('Intenet Connectivity Lost!');
            else displayErrorToast('Some Error Occurred');
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
    displayInfoToast("Deleting The Task...");
    const dataForApiRequest = {
        id: id
    }
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'DELETE',
        data: dataForApiRequest,
        success: function(data, status, xhr) {
            displaySuccessToast('Task Successfully Deleted..');
            let x = document.getElementById(id);
            x.parentElement.removeChild(x);
        },
        error: function(xhr, status, err) {
            if (xhr.status == 0) displayErrorToast('Intenet Connectivity Lost!');
            else displayErrorToast('Some Error Occurred');
        }
    })

}

function updateTask(id) {
    const title = document.getElementById('input-button-' + id).value.trim();
    if ((title == "") || (title == document.getElementById('task-'+id).innerText)) {
        document.getElementById('done-button-'+id).classList.add('hideme');
        document.getElementById('input-button-'+id).classList.add('hideme');
        document.getElementById('task-'+id).classList.remove('hideme');
        document.getElementById('task-actions-'+id).classList.remove('hideme');
        return 0;
    }
    displayInfoToast("Updating the Task...");
    const dataForApiRequest = {
        title: title
    }

    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'PATCH',
        data: dataForApiRequest,
        success: function(data, status, xhr) {
            displaySuccessToast('Task Successfully Changed...');

            document.getElementById('task-'+id).innerText = title;
            document.getElementById('input-button-' + id).value = "";
            document.getElementById('done-button-'+id).classList.add('hideme');
            document.getElementById('input-button-'+id).classList.add('hideme');
            document.getElementById('input-button-'+id).placeholder = title;
            document.getElementById('task-'+id).classList.remove('hideme');
            document.getElementById('task-actions-'+id).classList.remove('hideme');    
        },
        error: function(xhr, status, err) {
            if (xhr.status == 0) displayErrorToast('Intenet Connectivity Lost!');
            else displayErrorToast('Some Error Occurred');
        }
    })
}