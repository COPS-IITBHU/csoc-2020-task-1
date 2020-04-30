/***
 * @todo Redirect the user to main page if token is present.
 */
 var aValue = localStorage.getItem('token');

if(aValue!=null)
window.location.href = '/';