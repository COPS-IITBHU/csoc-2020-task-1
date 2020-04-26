/***
 * @todo Redirect the user to login page if token is not present.
 */
token = localStorage.token;
console.log(token);
if(token == undefined){
    window.location.href = '/login';
}