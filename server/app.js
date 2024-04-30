const express = require("express");
const cors = require("cors");
const app = express();
const { authentication } = require("./middleware/authentication");
const { Employee, Activity } = require("./models");
const employee = require("./models/employee");
const { generateToken, verifyToken } = require("./helpers/jwt");
const calculateDuration = require("./utils/durationCalcu");
const moment = require("moment");

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/employee", async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
        include: [[sequelize.literal(`CONCAT('Rp.', rate)`), "formattedRate"]],
      },
    });

    employees.forEach((employee) => {
      employee.formattedRate = formatRate(employee.rate);
    });

    res.status(200).json(employees);
  } catch (err) {
    console.log(err);
  }
});

app.post("/register", async (req, res) => {
  try {
    const { name, rate } = req.body;

    const employees = await Employee.create({
      name,
      rate,
    });
    res.status(201).json({
      id: employees.id,
      name: employees.name,
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { name, rate } = req.body;

    const employee = await Employee.findOne({
      where: {
        name,
        rate,
      },
    });
    if (!employee) {
      throw {
        name: "Invalid name or rate",
        message: "Invalid name or rate",
      };
    }
    let payload = {
      id: employee.id,
      name: employee.name,
      rate: employee.rate,
    };
    let access_token = generateToken(payload);
    res.status(200).json({ access_token: access_token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

app.get("/employee/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employees = await Employee.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        id,
      },
    });
    res.status(200).json(employees);
  } catch (err) {
    console.log(err);
  }
});

app.use(authentication);
app.get("/activity", async (req, res) => {
  try {
    const { id } = req.user;
    const activities = await Activity.findAll({
      where: {
        employeeId: id,
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(200).json(activities);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/activity", async (req, res) => {
  try {
    const {
      activityTitle,
      projectName,
      startDate,
      endDate,
      startTime,
      endTime,
    } = req.body;

    if (
      !activityTitle ||
      !projectName ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const startDateTime = moment(
      `${startDate} ${startTime}`,
      "YYYY-MM-DD HH:mm"
    );
    const endDateTime = moment(`${endDate} ${endTime}`, "YYYY-MM-DD HH:mm");
    if (!startDateTime.isValid() || !endDateTime.isValid()) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    if (startDateTime.isAfter(endDateTime)) {
      return res
        .status(400)
        .json({ error: "Start date must be before end date" });
    }

    const duration = moment
      .duration(endDateTime.diff(startDateTime))
      .asMinutes();

    const newActivity = await Activity.create({
      activityTitle,
      projectName,
      startDate,
      endDate,
      startTime: startDateTime,
      endTime: endDateTime,
      duration,
      employeeId: req.user.id,
    });

    res.status(201).json(newActivity);
  } catch (err) {
    if (
      err.name === "SequelizeDatabaseError" &&
      err.parent &&
      err.parent.code === "22007"
    ) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/activity/:id", async (req, res) => {
  try {
    const { id } = req.params;
    lo;
    const employees = await Activity.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        id,
      },
    });
    res.status(200).json(employees);
  } catch (err) {
    console.log(err);
  }
});
app.put("/activity/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      activityTitle,
      projectName,
      startDate,
      endDate,
      startTime,
      endTime,
      duration,
    } = req.body;
    await Activity.update(
      {
        activityTitle,
        projectName,
        startDate,
        endDate,
        startTime,
        endTime,
        duration,
      },
      {
        where: {
          id: id,
        },
      }
    );
    const employees = await Activity.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        id,
      },
    });
    res.status(200).json(employees);
  } catch (err) {
    console.log(err);
  }
});

app.delete("/activity/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const employees = await Activity.findOne({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      where: {
        id,
      },
    });
    if (!employees) {
      throw "This Activity is Not Exist";
    }

    await Activity.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({ message: "Activity Has Been Deleted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.listen(port, () => {
  console.log(`I Love U ${port}`);
});
