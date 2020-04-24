function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method:'GET',
        success: function (data,status,xhr) {
            $("#mainlist").html("<span class='badge badge-primary badge-pill todo-available-tasks-text'>Available Tasks</span>");
            for(let i=0;i<data.length;i++){
                $('#mainlist').append(appendlist(data,i));
            }
        }
    })
}

function appendlist(data,i){
    let listofitems = "<li class='list-group-item d-flex justify-content-between align-items-center'><input id='input-button-"+data[i].id+"' type='text' class='form-control todo-edit-task-input hideme' placeholder='Edit The Task'><div id='done-button-"+data[i].id+"'  class='input-group-append hideme'><button class='btn btn-outline-secondary todo-update-task' type='button' onclick='updateTask("+data[i].id+")'>Done</button></div><div id='task-"+data[i].id+"' class='todo-task'>"+data[i].title+"</div><span id='task-actions-"+data[i].id+"'><button style='margin-right:5px;' type='button' onclick='editTask("+data[i].id+")'class='btn btn-outline-warning'><img src='https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png' width='18px' height='20px'></button><button type='button' class='btn btn-outline-danger' onclick='deleteTask("+data[i].id+")'><img src='https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg' width='18px' height='22px'></button></span></li>";
    return listofitems;
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
