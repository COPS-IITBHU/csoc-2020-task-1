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
    const Password = document.getElementById("inputPassword").value;

    const userdata = {
        username : name,
        password: Password
    }
    $.ajax({
        url: API_BASE_URL + 'auth/login/',
        method : 'POST',
        data : userdata,
        success : function(data,status,xhr){
            localStorage.setItem('token',data.token);
            window.location.href = '/';
        },
        error: function(xhr,status,err){
            displayErrorToast('Invalid Username and Password');
        }
    })

}

function addTask() {
    const Taskname = document.querySelector(".form-control").value.trim();
    document.querySelector(".form-control").value="";
    const Data = {
        title: Taskname
    }
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/create/',
        method: 'POST',
        data: Data,
        success: function(status,xhr){
            displaySuccessToast("Success Add Todo");
            getTasks();
        },
        error: function(xhr,status,err){
            displayErrorToast("Error!!");
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
    const ID = {
        id: id
    }
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/'+id+'/',
        method: 'DELETE',
        data: ID,
        success: function(status,xhr){
            displaySuccessToast("Success Delete");
            getTasks();
        },
        error: function(xhr,status,err){
            displayErrorToast("Error delete!!");
        }
    })
}

function updateTask(id) {
    const newname = document.getElementById("input-button-"+id).value;
    const newdata={
        title: newname
    }
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/'+id+'/',
        method: 'PUT',
        data: newdata,
        success: function(data,status,xhr){
            if(xhr.status==200){
                displaySuccessToast("Success Update");
                getTasks();
            }    
        },
        error: function(xhr,status,err){
            displayErrorToast("Error update!");
        }

    })
}
