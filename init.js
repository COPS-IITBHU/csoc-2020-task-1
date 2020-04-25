function getTasks() {
  $.ajax({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + "todo/",
    method: "GET",
    success: function (data, status, xhr) {
      data.forEach((element) => {
        createCard(element)
      });
    },
  });
}

$.ajax({
  headers: {
    Authorization: "Token " + localStorage.getItem("token"),
  },
  url: API_BASE_URL + "auth/profile/",
  method: "GET",
  success: function (data, status, xhr) {
    document.getElementById("avatar-image").src =
      "https://ui-avatars.com/api/?name=" +
      data.name +
      "&background=fff&size=33&color=007bff";
    document.getElementById("profile-name").innerHTML = data.name;
    getTasks();
  },
});

function createCard(data) {
  const containerUL = document.getElementsByClassName('todo-available-tasks')[0]
  let topContainer = document.createElement('li')
  topContainer.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
  topContainer.innerHTML = `<input id="input-button-${data.id}" type="text" class="form-control todo-edit-task-input hideme"
          placeholder="Edit The Task" />
        <div id="done-button-${data.id}" class="input-group-append hideme">
          <button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(${data.id})">
            Done
          </button>
        </div>
        <div id="task-${data.id}" class="todo-task">
          ${data.title}
        </div>

        <span id="task-actions-${data.id}">
          <button style="margin-right: 5px;" type="button" onclick="editTask(${data.id})" class="btn btn-outline-warning">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px"
              height="20px" />
          </button>
          <button type="button" class="btn btn-outline-danger" onclick="deleteTask(${data.id})">
            <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px"
              height="22px" />
          </button>
        </span>`
  containerUL.appendChild(topContainer)
}