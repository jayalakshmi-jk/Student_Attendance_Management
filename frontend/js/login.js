let admin = document.getElementById("admin-login-form");



admin.addEventListener("submit", admin_login);



//admin login 
async function admin_login(e) {
  e.preventDefault();

  let a_email = document.getElementById("email").value;
  let a_password = document.getElementById("password").value;
  console.log(a_email);
  console.log(a_password);

  let login_data = {
    email: "admin@gmail.com",
    password: "admin123",
  };
  console.log(login_data);

  try {
    if (a_email !== login_data.email || a_password !== login_data.password) {
      alert("Invalid email or password");
      admin.reset();
      return;
    }
    alert("Login successful!");

    localStorage.setItem("admin", JSON.stringify(login_data));

    admin.reset();
    window.location.href = "../html/index.html";
  } catch (error) {
    console.log(error);
  }
}
