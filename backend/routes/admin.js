let express = require("express");

let router = express.Router();

let supabase = require("../db");

router.get("/student", async (req, res) => {
  const { data, error } = await supabase.from("student").select("*");

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

router.post("/student/post", async (req, res) => {
  let { Roll_No, name, reg_no, class_group } = req.body;
  console.log(req.body);

  const { data: existing, error: checkErr } = await supabase
    .from("student")
    .select("roll_no, reg_no")
    .or(`roll_no.eq.${Roll_No},reg_no.eq.${reg_no}`);

  if (checkErr) {
    return res.status(500).json({ error: checkErr.message });
  }

  if (existing.length > 0) {
    if (existing[0].roll_no == Roll_No) {
      return res.status(500).json({ error: "Roll Nmber already exist!!" });
    }
    if (existing[0].reg_no == reg_no) {
      return res.status(500).json({ error: "Register Nmber already exist!!" });
    }
  }

  const { data, error } = await supabase
    .from("student")
    .insert([{ roll_no: Roll_No, name, reg_no, class_group }])
    .select();

  if (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }

  console.log(data);
  res.send(data);
});

router.post("/attendance/update", async (req, res) => {
  let { student_id, status } = req.body;

  const { data, error } = await supabase
    .from("attendance")
    .insert([{ student_id, status }])
    .select();

  if (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }

  res.json({
    message: "Attendance updated successfully",
    data,
  });
});

router.put("/attendance/:id", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ error: "Attendance status is required" });
  }

  const { data, error } = await supabase
    .from("attendance")
    .update({ status })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Attendance record not found" });
  }

  res.json({ message: "Attendance edited successfully" });
});

router.delete("/attendance/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("attendance")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: "Attendance record not found" });
  }

  res.json({ message: "Attendance deleted successfully" });
});

router.get("/student/attendance", async (req, res) => {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, student:student_id(*)");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.send(data);
});

router.get("/student/attendance/search/:name", async (req, res) => {
  const searchName = `%${req.params.name}%`;

  const { data, error } = await supabase
    .from("attendance")
    .select("*, student:student_id!inner(*)")
    .ilike("student.name", searchName);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.send(data);
});

router.get("/dashboard/stats", async (req, res) => {
  const totalPromise = supabase
    .from("student")
    .select("*", { count: "exact", head: true });

  const presentPromise = supabase
    .from("attendance")
    .select("*", { count: "exact", head: true })
    .eq("status", "CHECK IN");

  const absentPromise = supabase
    .from("attendance")
    .select("*", { count: "exact", head: true })
    .eq("status", "CHECK OUT");

  const [totalRes, presentRes, absentRes] = await Promise.all([
    totalPromise,
    presentPromise,
    absentPromise,
  ]);

  if (totalRes.error || presentRes.error || absentRes.error) {
    const err = totalRes.error || presentRes.error || absentRes.error;
    return res.status(500).json({ error: err.message });
  }

  res.json({
    totalStudents: totalRes.count,
    presentCount: presentRes.count,
    absentCount: absentRes.count,
  });
});

module.exports = router;
