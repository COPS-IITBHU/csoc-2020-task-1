function getTasks() {
  /***
   * @todo Fetch the tasks created by the user and display them in the dom.
   */

  console.log("getTasks is called");
  console;
  $.ajax({
    url: API_BASE_URL + "todo/",
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    method: "GET",
    success: function (data, status, xhr) {
      var att = document.createAttribute("class");
      var span = document.getElementById("AvailableTask");
      att.value = "badge badge-primary badge-pill todo-available-tasks-text";
      span.setAttributeNode(att);
      span.innerHTML = "Available Tasks";

      displayInfoToast("please wait....");
      //*****************************************************************
      let n = data.length;
      console.log(n);
      for (let i = 0; i < n; i++) {
        var id = data[i].id;
        var title = data[i].title;
        //***************************************************************
        console.log(id, title);
        //*************************************************************
        addTask(id, title);
      }
      function addTask(id, title) {
        var ul = document.getElementById("toDoTasks");

        template =
          '<li class="list-group-item d-flex justify-content-between align-items-center"><input id="input-button-' +
          id +
          '" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task"><div id="done-button-' +
          id +
          '" class="input-group-append hideme"><button class="btn btn-outline-secondary todo-update-task" type="button" onclick="updateTask(' +
          id +
          ')">Done</button></div><div id="task-' +
          id +
          '"class="todo-task">' +
          title +
          '</div> <span id="task-actions-' +
          id +
          '"><button style="margin-right:5px;" type="button" onclick="editTask(' +
          id +
          ')"class="btn btn-outline-warning"><img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png" width="18px" height="20px"></button><button type="button" class="btn btn-outline-danger" onclick="deleteTask(' +
          id +
          ')"> <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg" width="18px" height="22px"> </button></span></li>';
        $(template).appendTo(ul).hide().fadeIn();
      }
    },
    error: function (xhr, status, data) {
      console.log("Token " + localStorage.getItem("token"));
      console.log(xhr);
      console.log("errr.........");
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
  error: function (xhr, status, data) {
    console.log(xhr);
  },
});
