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
  displaySuccessToast("Logged Out Successfully");
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
   * Complete this function.
   * 1. Write code for form validation.
   * 2. Fetch the auth token from backend and login the user.
   */

  let userName = document.querySelector("#inputUsername").value;
  let userPassword = document.querySelector("#inputPassword").value;
  if (userName === "" || userPassword === "") {
    displayErrorToast("All the details are required");
    return;
  }
  let userDetails = {
    username: userName,
    password: userPassword,
  };
  displayInfoToast("Confirming Credentials ");
  $.ajax({
    url: API_BASE_URL + "auth/login/",
    method: "POST",
    data: userDetails,
    success: (details, status, errors) => {
      displaySuccessToast("You are now logged in");
      localStorage.setItem("token", details.token);
      window.location.href = "/";
    },
    error: (details, status, errors) => {
      document.querySelector("#inputPassword").value = "";
      displayErrorToast("Looks like the username or password is incorrect");
    },
  });
}

function addTask() {
  /**
   *  Complete this function.
   *  1. Send the request to add the task to the backend server.
   *  2. Add the task in the dom.
   */
  let inputTitle = document.querySelector(".form-control").value;
  let taskDetails = {
    title: inputTitle,
  };
  $.ajax({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + "todo/create/",
    method: "POST",
    data: taskDetails,
    success: (details, status, errors) => {
      document.querySelector(".form-control").value="";
      displaySuccessToast("Added ");
      getTasks();
    },
    error: (details, status, errors) => {
      displayErrorToast("An Error Occurred!");
    },
  });
}

function editTask(id) {
  document.getElementById("task-" + id).classList.toggle("hideme");
  document.getElementById("task-actions-" + id).classList.toggle("hideme");
  document.getElementById("input-button-" + id).classList.toggle("hideme");
  document.getElementById("done-button-" + id).classList.toggle("hideme");
}

function deleteTask(id) {
  /**
   * Complete this function.
   * 1. Send the request to delete the task to the backend server.
   * 2. Remove the task from the dom.
   */
  let deleteID = {
    identity: id,
  };
  $.ajax({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + `todo/${id}/`,
    method: "DELETE",
    data: deleteID,
    success: (details, status, error) => {
      displaySuccessToast("Todo Deleted");
      getTasks();
    },
    error: (details, status, error) => {
      displayErrorToast("Error Occurred in deletion!");
    },
  });
}

function updateTask(id) {
  /**
   * Complete this function.
   * 1. Send the request to update the task to the backend server.
   * 2. Update the task in the dom.
   */
  let newData = document.querySelector(`#input-button-${id}`).value;
  let newDetails = {
    title: newData,
  };
  if (newDetails.title === "") {
    editTask(id);
    return;
  }
  $.ajax({
    headers: {
      Authorization: "Token " + localStorage.getItem("token"),
    },
    url: API_BASE_URL + `todo/${id}/`,
    method: "PUT",
    data: newDetails,
    success: (details, status, errors) => {
      document.querySelector(`#input-button-${id}`).value = "";
      editTask(id);
      getTasks();
      displaySuccessToast("Successfully Updated Todo");
    },
    error: (details, status, errors) => {
      displayErrorToast("Cannot Update Todo");
    },
  });
}
