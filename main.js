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
    const password = document.getElementById('inputPassword').value;
    document.getElementsByTagName('Button')[1].disabled = true;

    if(username === '')
       { displayErrorToast("Username can't be empty") ; document.getElementsByTagName('Button')[1].disabled = false;return;}; 
    if( password==='' )
       { displayErrorToast("Password can't be empty");document.getElementsByTagName('Button')[1].disabled = false; return ; };
    if( username.length >255 )
       { displayErrorToast("UserName can't be greater than 255 characters"); document.getElementsByTagName('Button')[1].disabled = false;return; };
    if( password.length >255)
       { displayErrorToast("Password can't be greater than 255 characters"); document.getElementsByTagName('Button')[1].disabled = false;return; };
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
                document.getElementsByTagName('Button')[1].disabled = false;
            },
            error: function(xhr, status, err) {
                 if (xhr.readyState == 4) {
                    console.log(xhr.statustext)
                displayErrorToast('Wrong Username or Password');
                document.getElementsByTagName('Button')[1].disabled = false;
              }
                 else if (xhr.readyState == 0 ) {
                  displayErrorToast('Network Error');
                  document.getElementsByTagName('Button')[1].disabled = false;
                  }
              else {
                  displayErrorToast('Some Unknown Error occurred');
                document.getElementsByTagName('Button')[1].disabled = false;
                    }
        
                
            }
        })
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
     var input= document.getElementsByTagName('input')[0].value
     document.getElementsByTagName('Button')[1].disabled = true;
     if(input.length==0)
        {displayErrorToast("Task can't be empty") ;document.getElementsByTagName('Button')[1].disabled = false; return;}
       if(input.length>255)
       {if( username.length >255 )
       { displayErrorToast("Task can't be greater than 255 characters"); document.getElementsByTagName('Button')[1].disabled = false;return; };}
     var token = localStorage.getItem('token')
     console.log(token);
     const dataForApiRequest = {
            title: input,
        }
     $.ajax({
            url: API_BASE_URL + 'todo/create/',
            method: 'POST',
            headers: {
                    Authorization: 'Token ' + token,
               },
            data: dataForApiRequest,
            success: function(data, status, xhr) {
               $.ajax({
            headers: {
               Authorization: 'Token ' + localStorage.getItem('token'),
                 },
                 url: API_BASE_URL + 'todo/',
                 method: 'GET',
               success: function(data, status, xhr) {
                displaySuccessToast('Task Successfully Added');
                $( ".d-flex" ).remove();
              for(var i=0;i<data.length;i++)
               {
               var id=data[i].id
               var title=data[i].title
                $(".todo-available-tasks").append('<li class="list-group-item d-flex justify-content-between align-items-center"><input id="input-button-'+id+'" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task"><div id="done-button-'+id+'" class="input-group-append hideme"><button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask('+id+')">Done</button></div><div id="task-'+id+'"class="todo-task">'+title+'</div> <span id="task-actions-'+id+'"><button style="margin-right:5px;" type="button" onclick="editTask('+id+')"class="btn btn-outline-warning"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px"></button><button type="button" class="btn btn-outline-danger" onclick="deleteTask('+id+')"> <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px"> </button></span></li>');
                }
                
                }
                 
                })
                document.getElementsByTagName('Button')[1].disabled = false;
                
            },
            error: function(xhr, status, err) {
                if (xhr.readyState == 4) {
                   
                displayErrorToast('Error in adding task');
                 document.getElementsByTagName('Button')[1].disabled = false;
              }
                 else if (xhr.readyState == 0 ) {
                  displayErrorToast('Network Error');
                  document.getElementsByTagName('Button')[1].disabled = false;
                  }
              else {
                  displayErrorToast('Some Unknown Error occurred');
                document.getElementsByTagName('Button')[1].disabled = false;
                    }
                
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
     var token = localStorage.getItem('token')
     document.getElementById('task-actions-'+id).children[1].disabled=true;
     const dataForApiRequest = {
            id: id,
        }
     $.ajax({
            url: API_BASE_URL + 'todo/'+id+'/',
            method: 'DELETE',
            headers: {
                    Authorization: 'Token ' + token,
               },
            data: dataForApiRequest,
            success: function(data, status, xhr) {
                document.getElementById('task-' + id).parentElement.remove();
               displaySuccessToast('Task Deleted Successfully');
            },
            error: function(xhr, status, err) {
                 if (xhr.readyState == 4) {
                   
                  displayErrorToast('Error in Deleting task');
                document.getElementById('task-actions-'+id).children[1].disabled=false;
              }
                 else if (xhr.readyState == 0 ) {
                  displayErrorToast('Network Error');
                  document.getElementById('task-actions-'+id).children[1].disabled=false;
                  }
              else {
                  displayErrorToast('Some Unknown Error occurred');
                document.getElementById('task-actions-'+id).children[1].disabled=false;
                    }
              
            }
        })
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
       var token = localStorage.getItem('token')
       document.getElementById('done-button-'+id).children[0].disabled=true;
       var input = document.getElementById('input-button-'+id).value
       if(input.length==0)
        {displayErrorToast("Task can't be empty") ; document.getElementById('done-button-'+id).children[0].disabled=false;return;}
       if(input.length>255)
       {if( username.length >255 )
       { displayErrorToast("Task can't be greater than 255 characters"); document.getElementById('done-button-'+id).children[0].disabled=false;return; };}
     const dataForApiRequest = {
            id: id,
            title: input,
        }
     $.ajax({
            url: API_BASE_URL + 'todo/'+id+'/',
            method: 'PUT',
            headers: {
                    Authorization: 'Token ' + token,
               },
            data: dataForApiRequest,
            success: function(data, status, xhr) {
                document.getElementById('task-'+data.id).innerHTML=data.title
                document.getElementById('task-' + data.id).classList.remove('hideme');
                document.getElementById('task-actions-' + data.id).classList.remove('hideme');
                document.getElementById('input-button-' + data.id).classList.add('hideme');
               document.getElementById('done-button-' + data.id).classList.add('hideme');
               displaySuccessToast('Task Updated Successfully');
               document.getElementById('done-button-'+id).children[0].disabled=false;
            },
            error: function(xhr, status, err) {
                 if (xhr.readyState == 4) {
                   displayErrorToast('Error in Updating task');
                document.getElementById('done-button-'+id).children[0].disabled=false;
              }
                 else if (xhr.readyState == 0 ) {
                  displayErrorToast('Network Error');
                  document.getElementById('done-button-'+id).children[0].disabled=false;
                  }
              else {
                  displayErrorToast('Some Unknown Error occurred');
               document.getElementById('done-button-'+id).children[0].disabled=false;
                    }
              
                
            }
        })
}
