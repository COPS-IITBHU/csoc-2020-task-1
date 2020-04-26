function getTasks() {
    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'GET',
        success: function(data, status, xhr) {
            document.getElementsByClassName('list-group todo-available-tasks')[0].innerHTML = '<span class="badge badge-primary badge-pill todo-available-tasks-text">Available Tasks</span>'
            for (let i in data) {
                additinDOM(data[i].title,data[i].id);
            }
        },
        error: function(xhr, status, err) {
            if (xhr.status == 0) displayErrorToast('Intenet Connectivity Lost!');
            else displayErrorToast('Some Error Occurred');
        }
    })
}

$.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'GET',
    success: function(data, status, xhr) {
        document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
        document.getElementById('profile-name').innerHTML = data.name;
        getTasks();
    }

})
