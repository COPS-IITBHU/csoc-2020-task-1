/***
 * @todo Redirect the user to main page if token is present.
 */
token = localStorage.token;
console.log(token);
if(token != undefined){
    window.location.href = '/';
}