/***
 * @todo Redirect the user to login page if token is not present.
 */
const U = 'https://todo-app-csoc.herokuapp.com/';
$.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: U + 'auth/profile/',
    method: 'GET',
    error: function(data, status, xhr) {
       window.location.href='/login';
    }
})