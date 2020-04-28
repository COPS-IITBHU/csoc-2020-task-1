/***
 *  Redirect the user to main page if token is present.
 */
if (localStorage.getItem("token")) {
  window.location.href = "/";
}
