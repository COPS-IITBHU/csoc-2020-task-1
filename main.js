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

    $.ajax({
        url: API_BASE_URL + "auth/login/",
        method: "POST",
        data: {
            username: `${user}`,
            password: `${pass}`,
        },
        success: (data) => {
            localStorage.setItem("token", data.token);
            window.location.href = "/";
        },
        error: (data, status, error) => {
            document.getElementById("inputPassword").value = "";
            displayErrorToast("Invalid Credentials");
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
            inputText.value = " ";
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
    $.ajax({
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        url: API_BASE_URL + `todo/${id}/`,
        method: "DELETE",
        success: () => {
            document.getElementById("task-" + id).parentElement.remove();
        },
        error: (data, status, error) => {
            displayErrorToast(`${error}`);
        },
    });
}

function updateTask(id) {
    updateText = document.getElementById(`input-button-${id}`);
    taskBody = document.getElementById("task-" + id);
    taskButton = document.getElementById("task-actions-" + id);
    updateButton = document.getElementById("done-button-" + id);

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
            document.getElementById("task-" + id).classList.remove("hideme");
            document.getElementById("task-actions-" + id).classList.remove("hideme");
            document.getElementById("input-button-" + id).classList.add("hideme");
            document.getElementById("done-button-" + id).classList.add("hideme");


            taskBody.id = `task-${data.id}`;
            taskBody.textContent = data.title;


            updateButton.id = "done-button-" + data.id;

            updateText.value = "";

            updateText.id = `input-button-${data.id}`;


            taskButton.id = "task-actions-" + data.id;
        },
        error: (data, status, error) => {
            displayErrorToast(`${error}`);
            updateButton.classList.toggle("hideme");
            updateText.classList.toggle("hideme");
            taskBody.classList.toggle("hideme");
            taskButton.classList.toggle("hideme");
        },
    });
}