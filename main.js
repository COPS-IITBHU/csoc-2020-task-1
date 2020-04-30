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

        const registrationData = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        $.ajax({
            url: API_BASE_URL + 'auth/register/',
            method: 'POST',
            data: registrationData,
            success: function(data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            },
            error: function(xhr, status, err) {
                displayErrorToast('Account already exists');
            }
        })
    }
}

function login() {
    
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;
    if (username ==='' || password ==='')
    { displayErrorToast('Please fill the required fields');
    	return;
    }
    else {
    	const loginData={
     "username":username,
     "password":password
      }
      $.ajax({
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: loginData,
            success: function(data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/';
                displaySuccessToast('Login successfull');
            },
            error: function(xhr, status, err) {
                displayErrorToast('Error occured, please try again');
          }
          })
    
      }
    
}


function addTask() {
    
    var taskInput= document.getElementById("add_new_task").value.trim();
    
    if(taskInput === ''){
        displayErrorToast('Please add some task!');
        
    }
    else {
        const taskData = {
            "title":taskInput
        }
        $.ajax({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/create/',
            method: 'POST',
            data: taskData,
            success: function(data, status, xhr){
                displaySuccessToast('New task added!');
                getTasks();
            },
            error: function(xhr, status, err){
                displayErrorToast('Error occured, please try again');
            }
        })
    }
    document.getElementById("add_new_task").value=' ';
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
        url: API_BASE_URL + 'todo/' + id + '/',
        method: 'DELETE' ,
	    data:dataForApiRequest,
        success: function(data, status, xhr) {
            displaySuccessToast('Task deleted successfully');
            getTasks();
        },
        error: function(xhr, status, err){
            displayErrorToast('Error occured, please try again');
        }
    })
}

function updateTask(id) {
    
    const updatedTask = document.getElementById('input-button-' + id ).value.trim();
    if(updatedTask === ''){
            displayErrorToast('Please give valid input!');
	    return 0;
    }
    else{
        updatedData = {
            "title": updatedTask
        }
        $.ajax({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/' + id + '/',
            method: 'PATCH',
            data:updatedData,
            success: function(data, status, xhr) {
                displaySuccessToast('Task updated successfully');
		      editTask(id);
              getTasks();
                
            },
            error: function(xhr, status, err){
                displayErrorToast('Error occured, please try again');
                
            }
        })
    }
}
