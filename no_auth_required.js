/***
 * @todo Redirect the user to main page if token is present.
 */
const UR = 'https://todo-app-csoc.herokuapp.com/';
$.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: UR + 'auth/profile/',
    method: 'GET',
    success: function(data, status, xhr) {
        window.location.href='/';
    }
})