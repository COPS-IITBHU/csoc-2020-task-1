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
    const dataForApiLogin = {
        username: username,
        password: password
    }
    displayErrorToast('1');
    $.ajax({
        url: API_BASE_URL + 'auth/login/',
        method: 'POST',
        data: dataForApiLogin,

        success: function(data, status, xhr) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
            displayErrorToast('2');
        },   
        error: function(xhr, status, err) {
            displayErrorToast('3');
             displayErrorToast('The entered username or password is incorrect');    
        }
    })  
}   
    /***
     *
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
}

function addTask() {
    var a=1;
    var taskName= "task-" + a;
    var taskName = document.getElementById('addName').value.trim();
    if(localStorage.getItem('token') 
     const dataForCreate = {
         title: taskName,
     }

       $.ajax({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
         url: API_BASE_URL + 'todo/create/',
         method: 'POST',
         data: dataForCreate, 
         success: function(data, status, xhr) {
            displaySuccessToast('New task has been created successfully '); 
            window.location.href = '/'; 
         },   
         error: function(xhr, status, err) {
            displayErrorToast('Sorry new task is not created');    
         } 
        })   

     generate(a);

    }  
}
function generate(num){
    id=num;
    document.getElementById("gen").innerHTML =
            `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <input id="input-button-id" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
                    <div id="done-button-id"  class="input-group-append hideme">
                        <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(id)">Done</button>
                    </div>
                    <div id="task-id" class="todo-task"> 
                        Sample Task id
                    </div>

                    <span id="task-actions-id">
                        <button style="margin-right:5px;" type="button" onclick="editTask(id)"
                            class="btn btn-outline-warning">
                            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                                width="18px" height="20px">
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="deleteTask(id)">
                            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                                width="18px" height="22px">
                        </button>
                    </span>
            </li> `
    

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
        method: 'DELETE',
        success: function(){
            $('#'+id).remove();
            displaySuccessToast('Your task has been deleted successfully');
        },
        error: function(xhr, status, err) {
            
            displayErrorToast('Please Try Again , Task Not Found');
        }
    })
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
}
