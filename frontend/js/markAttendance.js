let tbody = document.querySelector(".table tbody");
let savebtn  = document.getElementById('submit')

document.addEventListener("DOMContentLoaded", get_student);
savebtn.addEventListener('click',saveData)


async function get_student() {
  try {
    // 1. get student
    let studentResponse = await fetch("https://student-attendance-management-qo5t.onrender.com/student");

    let students = await studentResponse.json();

    console.log(students);

  

    tbody.innerHTML = students
      .map((student) => {
        return `
                <tr>

                    <td>${student.reg_no}</td>

                    <td>${student.Roll_No}</td>

                    <td>${student.name}</td>

                    <td>
                        ${student.class_group}
                    </td>

                    <td>
                        <select class="attendance" data-student-id="${student.id}">
                            <option value="CHECK IN">CHECK IN</option>
                            <option value="CHECK OUT">CHECK OUT</option>
                        </select>
                    </td>
                </tr>
              
            `;
      })
      .join("");
  } catch (error) {
    console.error("Error:", error);
  }
}


 
async function saveData() {

    try{


    let dropdowns = document.querySelectorAll(".attendance");

    for (let dropdown of dropdowns) {

        let student_id = dropdown.dataset.studentId;
        let status = dropdown.value;

        console.log(student_id, status);

        await fetch("https://student-attendance-management-qo5t.onrender.com/attendance/update", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                student_id: student_id,
                status: status
            })

        });
    }

    alert("Attendance saved successfully!");

    }catch(err){
        console.log(err);
        
    }

}