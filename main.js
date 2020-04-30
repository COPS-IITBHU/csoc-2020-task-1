function appendTask(id,name){
    ul = $('#taskList');
    template = `
    <li class="list-group-item d-flex justify-content-between align-items-center" id="li-` + id + `">
        <input id="input-button-`+id+ `" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task" value="` + name + `">
        <div id="done-button-`+id+`"  class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(`+id+`)">Done</button>
        </div>
        <div id="task-`+id+`" class="todo-task">
        `+name+ task`
        </div>
        <span id="task-actions-`+id+`">
            <button style="margin-right:5px;" type="button" onclick="editTask(`+id+`)"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="deleteTask(`+id+`)">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>
    </li>
    `
    $(template).appendTo(ul).hide().fadeIn();
}
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
    
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value.trim();
    //console.log(username,password);
    
    if(username===''||password===''){
        displayErrorToast("Please fill all the fields correctly.");
        return ;
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
                localStorage.token=data['token'];
                console.log(localStorage.token,"hello");
                

                displaySuccessToast("Login Successfull");
                //console.log("hurray");
                
                
                
                window.location.href = '/';
                console.log(localStorage.token);
                
                
            },
            error: function(xhr, status, err) {
                displayErrorToast('invalid credentials');
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
    const newtask=document.getElementById('newtask').value;
    console.log("working");
    
    if(newtask===''){
        displayErrorToast('New Task is empty');
        return 0;
    }
    else{
        const authHeader = {
            Authorization: "Token " + localStorage.token
        }
        console.log("newtask:",newtask);
        
        const dataForApiRequest = {
            title:newtask
        }
        $.ajax({
            url: API_BASE_URL + "todo/create/",
            method: 'POST',
            headers: authHeader,
            data: dataForApiRequest,
            success: function(data){
                console.log("working condtioton:",data);
                
                document.getElementById('newtask').value = "";
                displaySuccessToast("Task succesfully added.");
            },
            error: function(data){
                displayErrorToast("Unable to add task.");
            }
        })
        $.ajax({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'),
            },
            url: API_BASE_URL + 'todo/',
            method: 'GET',
            success: function(data, status, xhr) {
                console.log("data is hre:",data);
                
                appendTask(data[data.length - 1].id, data[data.length - 1].title);
            },
            error: function(data){
                setTimeout(function(){
                    displayErrorToast("Unable to fetch data, reloading page....");
                }, 300);
                window.location.href = "/";
            }
        })
        
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
    const authHeader={
        Authorization: "Token " + localStorage.token
    }

    $.ajax({
        url:API_BASE_URL +'todo/'+id+'/',
        method:"DELETE",
        headers:authHeader,
        success:function(data){
            document.getElementById("li-"+id).remove();
            displaySuccessToast("Task succesfully Deleted.");
        },
        error: function(data){
            displayErrorToast("Unable to delete task, please try again.");
        }

    })


}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    var new_title = document.getElementById("input-button-" + id).value;
    const authHeader = {
        Authorization: "Token " + localStorage.token
    }
    const dataForApiRequest = {
        title:new_title
    }
    $.ajax({
        url: API_BASE_URL + "todo/" + id + "/",
        method: "PATCH",
        headers: authHeader,
        data: dataForApiRequest,
        success: function(data){
            displaySuccessToast("Task succesfully updated.");
            document.getElementById('task-'+id).innerHTML = new_title;
            editTask(id);
        },
        error: function(data){
            displayErrorToast("Unable to update task, please try again.");
        }
    })

}
