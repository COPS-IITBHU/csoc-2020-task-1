function getTasks() {
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'GET',
        success: function(data,status,xhr){
            $(".list-group").html("<span class='badge badge-primary badge-pill todo-available-tasks-text'>Available Tasks</span>");
            for(var i=0;i<data.length;i++){
                $('.list-group').append('<li class="list-group-item d-flex justify-content-between align-items-center"><input id="input-button-'+task.id+'" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task"><div id="done-button-'+task.id+'"  class="input-group-append hideme"><button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask('+task.id+')">Done</button></div><div id="task-'+task.id+'" class="todo-task">'+task.title+'</div><span id="task-actions-'+task.id+'"><button style="margin-right:5px;" type="button" onclick="editTask('+task.id+')"class="btn btn-outline-warning"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px"></button><button type="button" class="btn btn-outline-danger" onclick="deleteTask('+task.id+')"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px"></button></span></li>');
            }
        },
        error: function(xhr,status,err){
            alert("ERROR!");
        }
    });
  }
  
  $.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'GET',
    success: function(data, status, xhr) {
        document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
        document.getElementById('profile-name').innerHTML = data.name;
        getTasks();
    }
  })