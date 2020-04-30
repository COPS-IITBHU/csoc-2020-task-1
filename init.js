function appendTask(id,name){
    ul = $('#taskList');
    template = `
    <li class="list-group-item d-flex justify-content-between align-items-center" id="li-` + id + `">
        <input id="input-button-`+id+ `" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task" value="` + name + `">
        <div id="done-button-`+id+`"  class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(`+id+`)">Done</button>
        </div>
        <div id="task-`+id+`" class="todo-task">
        `+name+`
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


function getTasks() {
    console.log("gettask is running");
    
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     * 
     */
    const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';
    
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url:'https://todo-app-csoc.herokuapp.com/' + 'todo/',
        method :'GET',
        success: function (data) {
            todotask=data;
            todotask.forEach(task => {
                id=task.id;
                name=task.title;
                appendTask(id,name)
                
            });



          },
          error:function(){
              displayErrorToast("ni ho payega uper se bt he");

          }
          
    })
    
}

$.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: 'https://todo-app-csoc.herokuapp.com/' + 'auth/profile/',
    method: 'GET',
    success: function(data, status, xhr) {
        document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
        document.getElementById('profile-name').innerHTML = data.name;
        getTasks();
    }
})
