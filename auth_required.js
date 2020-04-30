async function isLogin(){
    const key = localStorage.getItem('token')
    if (!key)
    {
       window.location.href = '/login'; 
    }
}
/***
 
 * @todo Redirect the user to login page if token is not present.
 */