/***
 * @todo Redirect the user to login page if token is not present.
 */
$.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    type: "GET",
    url: 'https://todo-app-csoc.herokuapp.com/'+"auth/profile/",
    error:function () {
        window.location = "../login";
        displayErrorToast("Please Login First!");
    }
});