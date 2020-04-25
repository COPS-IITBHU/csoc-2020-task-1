window.onload = () => {
  if (localStorage.getItem("token")) {
    window.location.href = "/";
  }
};
