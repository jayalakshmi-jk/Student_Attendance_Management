let mysql = require('mysql2')

let con = mysql.createConnection({
    host:'localhost',
    user:'dckap',
    password:'Welcome@123',
    database:'Attendance_Management_System'
})


con.connect((err,res)=>{
    if(err){
        throw err
    }
    console.log('DB Connected!!!');
})

module.exports = con