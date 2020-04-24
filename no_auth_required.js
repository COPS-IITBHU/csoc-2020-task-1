/***
 * @todo Redirect the user to main page if token is present.
 */
$.ajax({
    type: "GET",
    url: API_BASE_URL+"auth/profile/",
    success: function (response,textstatus,xhr) {
        if(xhr.status==200){
            window.location = "/";
            displaySuccessToast("Already Logged in!");
        }
    }
});