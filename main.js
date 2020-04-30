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
    const user = document.getElementById('inputUsername').value.trim();
    const pass = document.getElementById('inputPassword').value;
    displayInfoToast("Logging In");
    if(user==""){
      displayErrorToast("Username is Required");
    }
    if(pass==""){
      displayErrorToast("Password is Required");
    }
    var reqdata={username:user,password:pass};
    $.ajax({
      url:API_BASE_URL+'auth/login/',
      method:'POST',
      data:reqdata,
      success: function(data){
        localStorage.setItem('token',data.token);
        window.location.href = '/';
      },
      error:function(xhr, status, err){
        if (status==400) displayErrorToast('Invalid credentials');
        else displayErrorToast('An Error Ocurred while Loading ! ');
      }
    })

}

function addTask() {

    const toAdd = document.getElementById('add_task').value.trim();
    if(toAdd==""){
      displayErrorToast("No Task to Add");
      return;
    }
    const reqdata = {title:toAdd}
    displayInfoToast('Task being added.');
    $.ajax({
      headers: {Authorization: 'Token '+localStorage.getItem('token')},
      url: API_BASE_URL + 'todo/create/',
      method: 'POST',
      data: reqdata,
      success: function (data){
        displaySuccessToast('Added Task Successfully');
        getTasks();
        document.getElementById('add_task').value="";
      },
      error: function(xhr,status,err){
        displayErrorToast('Unable to Add the task');
        console.log(xhr.status);
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
    displayInfoToast('Task being deleted');
    const reqdata =  { id: id }
    const authhead= { Authorization: 'Token '+localStorage.getItem('token') }
    $.ajax({
      headers: authhead,
      url: API_BASE_URL + 'todo/'+id+'/' ,
      method: 'DELETE',
      success: function(data){
          displaySuccessToast('Deleted Task Successfully');
          document.getElementById('item-'+id).remove();
      },
      error: function(xhr,status,err){
        displayErrorToast('Unable to Delete the task');
      }
    })


}

function updateTask(id) {
    const toUp = document.getElementById('input-button-'+id ).value.trim();
    if(toUp=="")
    {
      displayErrorToast('The Text is empty , Delete it instead');
      return;
    }
    const authhead= {
      Authorization: 'Token '+localStorage.getItem('token')
     }
     const reqdata={
       title:toUp
     }
     $.ajax({
       url: API_BASE_URL+'todo/'+id+'/',
       method: "PATCH",
       headers: authhead,
       data: reqdata,
       success: function(data){
         displaySuccessToast('Updated Task Successfully');
         document.getElementById('task-'+id) = toUp;
         editTask(id);
       },
       error: function(xhr,status,err){
         displayErrorToast('Unable to Update the task');
       }
     })


}
