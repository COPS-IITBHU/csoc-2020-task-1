async function isLogin1() {
    const key1 = localStorage.getItem('token')
    if (key1)
    {
        window.location.href = '/'; 
    }
}/***
 * @todo Redirect the user to main page if token is present.
 */
