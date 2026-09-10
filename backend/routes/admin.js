let express = require("express");

let router = express.Router();

let db = require("../db");

router.get("/student", (req, res) => {
  db.query("SELECT * FROM student", (err, result) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(result);
  });
});

router.post("/student/post", (req, res) => {
  let { Roll_No, name, reg_no, class_group } = req.body;
  console.log(req.body);
  let check =
    "SELECT Roll_No, reg_no from student where Roll_No =? || reg_no =?";

  db.query(check, [Roll_No, reg_no], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
    console.log(result);

    if (result.length > 0) {
      if (result[0].Roll_No == Roll_No) {
        return res.status(500).json({
          error: "Roll Nmber already exist!!",
        });
      }

      if (result[0].reg_no == reg_no) {
        return res.status(500).json({
          error: "Register Nmber already exist!!",
        });
      }
    }

    db.query(
      "INSERT INTO student (Roll_No, name, reg_no, class_group)VALUES (?, ?, ?, ?)",
      [Roll_No, name, reg_no, class_group],
      (err, resu) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: err.message,
          });
        }
        console.log(resu);
        res.send(resu);
      },
    );
  });
});

router.post("/attendance/update", (req, res) => {

    let { student_id, status } = req.body;

    let sql = `INSERT INTO attendance (student_id, status)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        status = VALUES(status)`;

    db.query(sql, [student_id, status], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json({
            message: "Attendance updated successfully",
            data: result
        });

    });

});

router.put("/attendance/:id", (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ error: "Attendance status is required" });
  }

  db.query(
    "UPDATE attendance SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Attendance record not found" });
      }

      res.json({ message: "Attendance edited successfully" });
    },
  );
});

router.delete("/attendance/:id", (req, res) => {
  db.query("DELETE FROM attendance WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Attendance record not found" });
    }

    res.json({ message: "Attendance deleted successfully" });
  });
});


router.get('/student/attendance',(req,res)=>{
    db.query('SELECT * FROM student s JOIN attendance a ON s.id = a.student_id',(err,resu)=>{
        if(err){
            return err
        }

        res.send(resu)
    })
})

router.get('/student/attendance/search/:name',(req,res)=>{
    const searchName = `%${req.params.name}%`;
    db.query('SELECT * FROM student s JOIN attendance a ON s.id = a.student_id WHERE s.name LIKE ?',[searchName],(err,resu)=>{
        if(err){
            return res.status(500).json({error: err.message})
        }

        res.send(resu)
    })
})

router.get('/dashboard/stats',(req,res)=>{
    const totalQuery = 'SELECT COUNT(*) as total FROM student';
    const presentQuery = 'SELECT COUNT(*) as present FROM attendance WHERE status = "CHECK IN"';
    const absentQuery = 'SELECT COUNT(*) as absent FROM attendance WHERE status = "CHECK OUT"';

    Promise.all([
        new Promise((resolve, reject) => {
            db.query(totalQuery, (err, result) => {
                if (err) reject(err);
                else resolve(result[0].total);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(presentQuery, (err, result) => {
                if (err) reject(err);
                else resolve(result[0].present);
            });
        }),
        new Promise((resolve, reject) => {
            db.query(absentQuery, (err, result) => {
                if (err) reject(err);
                else resolve(result[0].absent);
            });
        })
    ])
    .then(([total, present, absent]) => {
        res.json({
            totalStudents: total,
            presentCount: present,
            absentCount: absent
        });
    })
    .catch(err => {
        res.status(500).json({ error: err.message });
    });
})

module.exports = router;
