/***
 * @todo Redirect the user to login page if token is not present.
 */
var aValue = localStorage.getItem('token');

if(aValue==null)
window.location.href = '/login';