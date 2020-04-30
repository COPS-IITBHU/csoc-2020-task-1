function displaySuccessToast(message) {
  iziToast.success({
    title: "Success",
    message: message,
  });
}

function displayErrorToast(message) {
  iziToast.error({
    title: "Error",
    message: message,
  });
}

function displayInfoToast(message) {
  iziToast.info({
    title: "Info",
    message: message,
  });
}

const API_BASE_URL = "https://todo-app-csoc.herokuapp.com/";

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

function registerFieldsAreValid(
  firstName,
  lastName,
  email,
  username,
  password
) {
  if (
    firstName === "" ||
    lastName === "" ||
    email === "" ||
    username === "" ||
    password === ""
  ) {
    displayErrorToast("Please fill all the fields correctly.");
    return false;
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    displayErrorToast("Please enter a valid email address.");
    return false;
  }
  return true;
}

function register() {
  const firstName = document.getElementById("inputFirstName").value.trim();
  console.log(firstName);
  const lastName = document.getElementById("inputLastName").value.trim();
  const email = document.getElementById("inputEmail").value.trim();
  const username = document.getElementById("inputUsername").value.trim();
  const password = document.getElementById("inputPassword").value;

  if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
    displayInfoToast("Please wait...");

    const dataForApiRequest = {
      name: firstName + " " + lastName,
      email: email,
      username: username,
      password: password,
    };

    $.ajax({
      url: API_BASE_URL + "auth/register/",
      method: "POST",
      data: dataForApiRequest,
      success: function (data, status, xhr) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      },
      error: function (xhr, status, err) {
        displayErrorToast(
          "An account using same email or username is already created"
        );
      },
    });
  }
}

function login() {
  /***
   * @todo Complete this function.
   * @todo 1. Write code for form validation.
   * @todo 2. Fetch the auth token from backend and login the user.
   */
  const user = document.getElementById("inputUsername").value.trim();
  const password = document.getElementById("inputPassword").value;
  console.log(user, password);
  if (user === " " || password === " ")
    displayErrorToast("please fill all fields");
  else {
    displayInfoToast("please wait.....");
    const dataAPI = {
      username: user,
      password: password,
    };
    $.ajax({
      url: API_BASE_URL + "auth/login/",
      data: dataAPI,
      method: "POST",
      success: function (data, status, xhr) {
        //alert(status, xhr);
        //alert(xhr);
        window.localStorage.token = data.token;
        //Console.log(window.location.href);
        window.location.href = "/";
      },
      error: function (data, status, xhr) {
        displayErrorToast("Invalid login credentials");
      },
    });
  }
}

function addTask() {
  /**
   * @todo Complete this function.
   * @todo 1. Send the request to add the task to the backend server.   Authorization:"Token "+localStorage.getItem('token')
   * @todo 2. Add the task in the dom.
   */
  //console.log("addTask");
  //console.log("Token " + localStorage.getItem("token"));
  const task = document.getElementById("addTask").value;
  //console.log(task);

  const taskData = {
    title: task,
  };
  $.ajax({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + "todo/create/",
    method: "POST",
    data: taskData,
    success: function (data, status, xhr) {
      displayInfoToast("Task Added Successfully!");
      window.location.reload();
    },
    error: function (xhr, status, data) {
      console.log(xhr);
    },
  });
}

function editTask(id) {
  document.getElementById("task-" + id).classList.add("hideme");
  document.getElementById("task-actions-" + id).classList.add("hideme");
  document.getElementById("input-button-" + id).classList.remove("hideme");
  document.getElementById("done-button-" + id).classList.remove("hideme");
}

function deleteTask(id) {
  /**
   * @todo Complete this function.
   * @todo 1. Send the request to delete the task to the backend server.
   * @todo 2. Remove the task from the dom.
   */

  $.ajax({
    url: API_BASE_URL + "todo/" + id + "/",
    method: "DELETE",
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    success: function (data, status, xhr) {
      displayInfoToast("Task deleted Successfully");
      window.location.reload();
    },
    error: function (xhr, status, data) {
      console.log(xhr);
      displayErrorToast("Some error happened");
    },
  });
}

function updateTask(id) {
  const update = document.getElementById("input-button-" + id).value;

  dataAPI = {
    title: update,
  };
  $.ajax({
    url: API_BASE_URL + "todo/" + id + "/",
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    method: "PATCH",
    data: dataAPI,
    success: function (data, status, xhr) {
      displaySuccessToast("Task updated!");
      window.location.reload();
    },
    error: function (xhr, status, data) {
      displayErrorToast("Some Error has occured");
    },
  });
}
