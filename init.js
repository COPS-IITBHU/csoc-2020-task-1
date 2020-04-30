function tasktmplt(id,tasktle){

return `<li class="list-group-item d-flex justify-content-between align-items-center" id="item-${id}">
        <input id="input-button-${id}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task" value="${tasktle}">
        <div id="done-button-${id}"  class="input-group-append hideme">
            <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(${id})">Done</button>
        </div>
        <div id="task-${id}" class="todo-task">${tasktle}</div>
        <span id="task-actions-${id}">
            <button style="margin-right:5px;" type="button" onclick="editTask(${id})"
                class="btn btn-outline-warning">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                    width="18px" height="20px">
            </button>
            <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${id})">
                <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                    width="18px" height="22px">
            </button>
        </span>
    </li>`;
  }
function getTasks() {
    let ul = document.getElementById('mainlist');
    const authhead = {Authorization: 'Token '+localStorage.getItem('token')} ;
    $.ajax({
        headers: authhead,
        url: API_BASE_URL + 'todo/',
        method: 'GET',
        success: function(data,xhr,status){
            tasks=data;
            for (const a in tasks){
                ul.innerHTML+= tasktmplt(tasks[a].id,tasks[a].title);

            }
          },
        error: function(xhr,status,err){
            displayErrorToast("Some Error Occured while Fetching tasks");
        }
    })

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
