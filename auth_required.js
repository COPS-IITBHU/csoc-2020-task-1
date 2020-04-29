/***
 * @todo Redirect the user to login page if token is not present.
 */
const token = window.localStorage.getItem("token");
//console.log(token);
if (token === null) {
  window.location = "./login";
}
