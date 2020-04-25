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
    user = document.getElementById("inputUsername").value;
    pass = document.getElementById("inputPassword").value;

    if (user == "" || pass == "") {
        displayErrorToast("Please fill all the fields");
        return;
    }
    displayInfoToast("Please wait...")
    $.ajax({
        url: API_BASE_URL + "auth/login/",
        method: "POST",
        data: {
            username: user,
            password: pass,
        },
        success: (data) => {
            localStorage.setItem("token", data.token);
            window.location.href = "/";
        },
        error: (data, status, error) => {
            document.getElementById("inputPassword").value = "";
            displayErrorToast(`${data.status}: ${data.statusText}`);
        },
    });
}

function addTask() {
    inputText = document.getElementById("addTask");
    task = inputText.value;
    $.ajax({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + "todo/create/",
        method: "POST",
        data: {
            title: task,
        },
        success: () => {
            inputText.value = ""
            fetchTask(inputText.value)
            displaySuccessToast("Todo Added")
        },
        error: (data) => {
            displayErrorToast(`${data.status}: ${data.statusText}`);
        }
    });
}

function editTask(id) {
    document.getElementById("task-" + id).classList.toggle("hideme");
    document.getElementById("task-actions-" + id).classList.toggle("hideme");
    document.getElementById("input-button-" + id).classList.toggle("hideme");
    document.getElementById("done-button-" + id).classList.toggle("hideme");
}

function deleteTask(id) {
    $.ajax({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + `todo/${id}/`,
        method: "DELETE",
        success: () => {
            document.getElementById("task-" + id).parentElement.remove();
            displaySuccessToast("Todo Deleted")
        },
        error: (data) => {
            displayErrorToast(`${data.status}: ${data.statusText}`);
        },
    });
}

function updateTask(id) {
    updateText = document.getElementById(`input-button-${id}`);
    taskBody = document.getElementById("task-" + id);
    taskButton = document.getElementById("task-actions-" + id);
    updateButton = document.getElementById("done-button-" + id);

    if (updateText.value == "") {
        editTask(id);
        return;
    }

    $.ajax({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + `todo/${id}/`,
        method: "PUT",
        data: {
            title: updateText.value,
        },
        success: (data) => {
            editTask(id);

            taskBody.id = `task-${data.id}`;
            taskBody.textContent = data.title;

            updateButton.id = "done-button-" + data.id;

            updateText.value = "";
            updateText.id = `input-button-${data.id}`;
            taskButton.id = "task-actions-" + data.id;
            displaySuccessToast("Todo Updated")
        },
        error: (data, status, error) => {
            displayErrorToast(`${data.status} ${data.statusText}`);
            editTask(id)
        },
    });
}

function fetchTask(task) {
    $.ajax({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + "todo/",
        method: "GET",
        dataType: "json",
        success: (data) => {
            createCard(data[data.length - 1])
        },
    });
}