let form = document.getElementById("add-form");

form.addEventListener("submit", add_student);

async function add_student(e) {
  e.preventDefault();
  try {
    let reg_no = document.getElementById("reg_no").value;

    let roll_no = document.getElementById("roll_no").value;

    let name = document.getElementById("name").value;

    let dropdown = document.getElementById("class").value;
    console.log(dropdown);

    let new_student = {
      Roll_No: roll_no,
      name: name,
      reg_no: reg_no,
      class_group: dropdown,
    };
    let response = await fetch("http://localhost:3000/student/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_student),
    });

    let data = await response.json();

    if (!response.ok) {
      alert(data.error);
      form.reset();

      return;
    }

    alert("student addedd!!");
    form.reset();
  } catch (err) {
    console.log(err);
  }
}
