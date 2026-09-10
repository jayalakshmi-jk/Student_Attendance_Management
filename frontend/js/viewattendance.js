let tbody = document.querySelector(".table tbody");
let edit_form = document.getElementById('edit-form');
let edit_status = document.getElementById('status');
let cancel_edit = document.getElementById('cancel-edit');
let editing_attendance_id = null;


let search = document.getElementById('search')

document.addEventListener("DOMContentLoaded", get_attendance);
edit_form.addEventListener('submit', edit_data);
cancel_edit.addEventListener('click', close_edit_form);
search.addEventListener('input',search_data)


async function get_attendance() {

    try{

        let response = await fetch('https://student-attendance-management-qo5t.onrender.com/student/attendance')
        let data = await response.json()
        console.log(data);
    tbody.innerHTML = data.map((i) => {
        return `
                <tr>

                    <td>${i.reg_no}</td>

                    <td>${i.Roll_No}</td>

                    <td>${i.name}</td>

                    <td>
                        ${i.class_group}
                    </td>

                    <td>
                        ${i.status}
                    </td>
                    <td>
                        <button type="button" onclick='edit_attendance(${i.id},${JSON.stringify(i.status)})'>Edit</button>
                        <button type="button" onclick='delete_attendance(${i.id})'>Delete</button>

                    </td>
                </tr>
              
            `;
      })
      .join("");
    }catch(err){
        console.log(err);
        
    }
    
}


async function edit_attendance(id,status) {
    editing_attendance_id = id;
    edit_status.value = status;
    edit_form.style.display = 'block';
}

async function edit_data(e) {
    e.preventDefault();

    try {
        let response = await fetch(`https://student-attendance-management-qo5t.onrender.com/attendance/${editing_attendance_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: edit_status.value })
        });

        if (!response.ok) {
            let error = await response.json();
            throw new Error(error.error || 'Unable to edit attendance');
        }

        close_edit_form();
        await get_attendance();
    } catch (err) {
        alert(err.message);
    }
}

async function delete_attendance(id) {
    if (!confirm('Delete this attendance record?')) {
        return;
    }

    try {
        let response = await fetch(`https://student-attendance-management-qo5t.onrender.com/attendance/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            let error = await response.json();
            throw new Error(error.error || 'Unable to delete attendance');
        }

        await get_attendance();
    } catch (err) {
        alert(err.message);
    }
}

function close_edit_form() {
    editing_attendance_id = null;
    edit_form.style.display = 'none';
}

async function search_data() {
    const searchValue = search.value.trim();
    
    if (searchValue === '') {
        await get_attendance();
        return;
    }

    try {
        let response = await fetch(`https://student-attendance-management-qo5t.onrender.com/student/attendance/search/${encodeURIComponent(searchValue)}`)
        let data = await response.json()
        
        if (!response.ok) {
            throw new Error(data.error || 'Search failed');
        }
        
        tbody.innerHTML = data.map((i) => {
            return `
                <tr>
                    <td>${i.reg_no}</td>
                    <td>${i.Roll_No}</td>
                    <td>${i.name}</td>
                    <td>${i.class_group}</td>
                    <td>${i.status}</td>
                    <td>
                        <button type="button" onclick='edit_attendance(${i.id},${JSON.stringify(i.status)})'>Edit</button>
                        <button type="button" onclick='delete_attendance(${i.id})'>Delete</button>
                    </td>
                </tr>
            `;
        }).join("");
    } catch(err) {
        console.log(err);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No results found</td></tr>';
    }
}

