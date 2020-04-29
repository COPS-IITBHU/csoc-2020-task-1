/***
 * @todo Redirect the user to main page if token is present.
 */
const token = window.localStorage.getItem("token");
console.log(token);
if (token != null) {
  window.location = "../";
}
