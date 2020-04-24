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
    window.location.href = './login';
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
function checkLoginInfo(username,password) {
    if(username==''||password == ''){
        displayErrorToast("Please provide required fields!");
        return false;
    }
    return true;
}
function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    const userName = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value.trim();
    if(checkLoginInfo(userName,password)){
        displayInfoToast("please wait...");
        const apidata = {
            "username":userName,
            "password":password
        }
        $.ajax({
            url:API_BASE_URL+'auth/login/',
            method:'POST',
            data:apidata,
            success: function (data,status,xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '../';
            },
            error: function(xhr, status, err) {
                displayErrorToast('Invalid Credentials');
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
    let title = document.getElementById("addTaskText").value;
    let apidata = {"title":title}
    $.ajax({
        headers:{Authorization:"Token "+localStorage.getItem('token')},
        url:API_BASE_URL+'todo/create/',
        method:'POST',
        data:apidata,
        success:function(data,status,xhr){
            getTasks();
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
        headers:{Authorization:"Token "+localStorage.getItem('token')},
        url:API_BASE_URL+'todo/'+id+'/',
        method:'DELETE',
        data:{"id":id},
        success:function (data,status,xhr){
            if(xhr.status==204){
                displaySuccessToast("Deleated!");
                getTasks();
            }
        },
        error:function () {
            console.log("error");
        }
    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    let title = document.getElementById('input-button-' + id).value;
    $.ajax({
        headers:{Authorization:"Token "+localStorage.getItem('token')},
        url:API_BASE_URL+'todo/'+id+'/',
        method:'PATCH',
        data:{"id":id,"title":title},
        success:function (data,status,xhr){
            if(xhr.status==200){
                displaySuccessToast("Updated!");
                getTasks();
            }
        },
        error:function () {
            console.log("error");
        }
    })
}
