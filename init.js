function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */


    $.ajax({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'GET',
        success: function(data, status, xhr) {
            if(flag){var k=data.length-1;}
            else{var k=0;}
            for(var j=k;j<data.length;j++){
                var i=data[j].id;
                const intext=data[j].title;
                const ul=document.getElementById('AT');
            const list=document.createElement('li');
            list.id=i;
            list.setAttribute('class','list-group-item d-flex justify-content-between align-items-center');
            const inp=document.createElement('input');
            inp.id='input-button-'+i;
            inp.type='text';
            inp.setAttribute('class','form-control todo-edit-task-input hideme');
            inp.placeholder='Edit The Task';
            const d1=document.createElement('div');
            d1.id='done-button-'+i;
            d1.setAttribute('class','input-group-append hideme');
            const b1=document.createElement('button');
            b1.setAttribute('class','btn btn-outline-secondary todo-update-task');
            b1.type='button';
            b1.setAttribute('onclick','updateTask('+i+')');
            b1.innerHTML='Done';
            d1.appendChild(b1);
            const d2=document.createElement('div');
            d2.id='task-'+i;
            d2.setAttribute('class','todo-task');
            d2.innerHTML=intext;
            list.appendChild(inp);
            list.appendChild(d1);
            list.appendChild(d2);
            const sp=document.createElement('span');
            sp.id='task-actions-'+i;
            const b2=document.createElement('button');
            b2.style.marginRight='10px';
            b2.type='button';
            b2.setAttribute('onclick','editTask('+i+')');
            b2.setAttribute('class','btn btn-outline-warning');
            const i1=document.createElement('img');
            i1.setAttribute('src','https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png');
            i1.setAttribute('width','18px');
            i1.setAttribute('height','20px');
            b2.appendChild(i1);
            const b3=document.createElement('button');
            b3.type='button';
            b3.setAttribute('onclick','deleteTask('+i+')');
            b3.setAttribute('class','btn btn-outline-danger');
            const i2=document.createElement('img');
            i2.setAttribute('src','https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg');
            i2.setAttribute('width','18px');
            i2.setAttribute('height','22px');
            b3.appendChild(i2);
            sp.appendChild(b2);
            sp.appendChild(b3);
            list.appendChild(sp);
            ul.appendChild(list);
            }
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
