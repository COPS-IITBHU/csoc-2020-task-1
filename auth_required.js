if (localStorage.getItem('token') == undefined) {
    window.location.href = '/login';
}
else{
  console.log(localStorage.getItem('token'));
}
