function taskToListItem(task_id, task_input) {
    return `
                <li
                    class="list-group-item d-flex justify-content-between align-items-center"
                >
                    <input
                        id="input-button-${task_id}"
                        type="text"
                        class="form-control todo-edit-task-input hideme"
                        placeholder="Edit The Task"
                    />
                    <div id="done-button-${task_id}" class="input-group-append hideme">
                        <button
                            class="btn btn-outline-secondary todo-update-task"
                            type="button"
                            onclick="updateTask(${task_id})"
                        >
                            Done
                        </button>
                    </div>
                    <div id="task-${task_id}" class="todo-task">
                        ${task_input}
                    </div>

                    <span id="task-actions-${task_id}">
                        <button
                            style="margin-right: 5px;"
                            type="button"
                            onclick="editTask(${task_id})"
                            class="btn btn-outline-warning"
                        >
                            <img
                                src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                                width="18px"
                                height="20px"
                            />
                        </button>
                        <button
                            type="button"
                            class="btn btn-outline-danger"
                            onclick="deleteTask(${task_id})"
                        >
                            <img
                                src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                                width="18px"
                                height="22px"
                            />
                        </button>
                    </span>
                </li>
    `
};

function getTasks() {
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'GET',
        success: function (data, status, xhr) {
            $('#task-list').empty();
            for (let i = 0; i < data.length; i++) {
                $('#task-list').append(taskToListItem(data[i].id, data[i].title)).hide().show('fast');
            }
        },
        error: (xhr, status, err) => {
            if (xhr.status == 0) {
                displayErrorToast("Connection failure. Please check your internet connection...");
            } else {
                displayErrorToast("Unknown error occured");
            }
        }
    })
}

$.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'GET',
    success: function (data, status, xhr) {
        document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
        document.getElementById('profile-name').innerHTML = data.name;
        getTasks();
    }
})
