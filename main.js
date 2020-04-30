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
function credentialFieldsAreValid(Username,Password){
    if(Username === ''||Password === ''){
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
}
function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    user_name=document.getElementById('inputUsername').value;
    pass_word=document.getElementById('inputPassword').value;

    if(credentialFieldsAreValid(user_name,pass_word)){
        displayInfoToast("Please wait...");
        const logindata={
            username: user_name,
            password: pass_word
        }
    

    $.ajax({

        url: API_BASE_URL +'auth/login/',
        method: 'POST',
        data: logindata,
        success: function(data,status,xhr){
            localStorage.setItem("token" , data.token);
            window.location.href='/';
            },
        error: function(xhr,status,err){
            displayErrorToast("Recheck the credentials. If not registered,Plz register your account ")           
        }
        })
    }
    else{
        displayInfoToast("Enter valid credentials ")
    }
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const tasktitle=document.getElementById('addtaskname').value;
if(tasktitle!==''&& tasktitle.length<256){
    $.ajax({
        headers: {Authorization: 'Token '+ localStorage.getItem('token') },
        url: API_BASE_URL + '/todo/create/',
        method: 'POST',
        data: {
            title: tasktitle,
        },
        success: function( data ,status,xhr){
            displaySuccessToast("Todo added succesfully");
            document.getElementById('addtaskname').value = '';
            getTasks();
        },
        error: function(xhr,status,err){
            displayErrorToast('Plz Try Again!!');
        }
    })    
}
else{
    displayInfoToast("Enter a title of length between 1 to 255")
}
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
        headers: {Authorization: 'Token '+ localStorage.getItem('token')},
        url: API_BASE_URL + '/todo/'+id+'/',
        method: 'DELETE',
        success: function(status,xhr){
            displaySuccessToast("Task deleted succesfully");
            document.getElementById(id).remove();
        },
        error: function(xhr,status,err){
            displayErrorToast('Not Deleted, Plz Try Again!!');
        }

    })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    const newtitle = document.getElementById("input-button"+id).value;
    if(newtitle!==""&&newtitle.length<256){
    $.ajax({
        headers: {Authorization: 'Token '+ localStorage.getItem('token')},
        url: API_BASE_URL + '/todo/'+id+'/',
        method: 'PUT',
        data: {
            title: newtitle,
        },
        success: function(data ,status,xhr){
            displaySuccessToast("Todo Updated succesfully");
            
            document.getElementById("input-button-"+id).classList.add('hideme');
            document.getElementById("done-button-"+id).classList.add('hideme');
            document.getElementById("task-"+id).innerHTML= data.title;
            document.getElementById("task-"+id).classList.remove('hideme');
            document.getElementById("task-actions-"+id).classList.remove('hideme');
            
            displaySuccessToast("Todo Updated succesfully");
        },
        error: function(xhr,status,err){
            displayErrorToast('Not Updated, Plz Try Again!!');
        }

    })
    }
    else{
        displayInfoToast("Enter a string of length between 1-255")
    }
}
