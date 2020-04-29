/***
 * @todo Redirect the user to main page if token is present.
 */
 if (localStorage.getItem('token') != null){
 	window.location.href = '/';
 }