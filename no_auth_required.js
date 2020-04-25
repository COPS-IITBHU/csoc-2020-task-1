/***
 * @todo Redirect the user to main page if token is present.
 */

const token = localStorage.getItem('token');
 console.log(token);
 if(token){
    window.location.href = '/';
 }
