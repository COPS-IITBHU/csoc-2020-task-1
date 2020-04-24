/***
 * @todo Redirect the user to main page if token is present.
 */
$.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    type: "GET",
    url: 'https://todo-app-csoc.herokuapp.com/'+"auth/profile/",
    success: function (response,textstatus,xhr) {
        if(xhr.status==200){
            window.location = "../";
            displaySuccessToast("Already Logged in!");
        }
    }
});