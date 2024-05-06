import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import formattedDate from "../../../server/utils/formattedDate";
import formattedTime from "../../../server/utils/formattedTime";
import calculateDurations from "../utils/calcudura";
import formatRates from "../utils/formattedRupiah";
import EditForm from "./EditForm";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Modal,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [employee, setEmployee] = useState(null);
  const [activities, setActivities] = useState(null);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [error, setError] = useState(null);
  const [inputForm, setInputForm] = useState({
    activityTitle: "",
    projectName: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    duration: "",
    employeeId: "",
  });
  const [projectNames, setProjectNames] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const navigate = useNavigate();

  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
          const userData = jwtDecode(access_token);
          setEmployee(userData);
        } else {
          console.log("Token not found");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();

    const fetchActivities = async () => {
      try {
        const data = await axios.get(`http://localhost:3000/activity`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const formattedActivities = data.data.map((activity) => ({
          ...activity,
          formattedStartDate: formattedDate(activity.startDate),
          formattedEndDate: formattedDate(activity.endDate),
          formattedStartTime: formattedTime(activity.startTime),
          formattedEndTime: formattedTime(activity.endTime),
          duration: calculateDurations(activity.startTime, activity.endTime),
        }));

        setActivities(formattedActivities);

        const uniqueProjectNames = [
          ...new Set(
            formattedActivities.map((activity) => activity.projectName)
          ),
        ];
        setProjectNames(uniqueProjectNames);
      } catch (error) {
        console.log(error);
      }
    };
    fetchActivities();
  }, []);

  const onChange = (e) => {
    setInputForm({
      ...inputForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/activity`,
        {
          ...inputForm,
          duration: calculateDurations(inputForm.startTime, inputForm.endTime),
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      navigate("/");
      setOpen(false);
      const newActivity = {
        ...response.data,
        formattedStartDate: formattedDate(response.data.startDate),
        formattedEndDate: formattedDate(response.data.endDate),
        formattedStartTime: formattedTime(response.data.startTime),
        formattedEndTime: formattedTime(response.data.endTime),
        duration: calculateDurations(
          response.data.startTime,
          response.data.endTime
        ),
      };
      setActivities([...activities, newActivity]);
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/activity/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      setActivities(activities.filter((activity) => activity.id !== id));
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filterActivitiesByProject = () => {
    if (selectedProjects.length === 0) {
      return activities;
    } else {
      return activities.filter((activity) =>
        selectedProjects.includes(activity.projectName)
      );
    }
  };

  const calculateTotalDuration = () => {
    let totalDuration = 0;
    filterActivitiesByProject().forEach((activity) => {
      if (typeof activity.duration === "string") {
        const durationParts = activity.duration.split(" ");
        const hours = parseInt(durationParts[0]);
        let minutes = 0;
        if (durationParts.length > 2) {
          minutes = parseInt(durationParts[2]);
        }
        totalDuration += hours * 60 + minutes;
      }
    });
    return totalDuration;
  };

  const calculateTotalIncome = () => {
    const totalDuration = calculateTotalDuration();
    const ratePerHour = employee.rate;
    const totalHours = Math.floor(totalDuration / 60);
    const totalIncome = totalHours * ratePerHour;
    return totalIncome;
  };

  if (!employee || !activities) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="min-h-screen bg-[#F7F8FB] text-gray-900 flex justify-center ">
          <div className="max-w-screen-xl m-7 bg-white shadow sm:rounded-lg flex justify-center flex-1">
            <div>
              <div className="flex flex-row gap-[5rem] m-4">
                <div>
                  <p className="text-sm">Nama Karyawan</p>
                  <p className="text-lg">{employee.name}</p>
                </div>
                <div>
                  <p className="text-sm">Rate</p>
                  <p>{formatRates(employee.rate)}/jam</p>
                </div>
              </div>
              <div>
                <hr className="border-b-2 border-gray-400 w-[75rem]" />
              </div>
              <div className="flex flex-row justify-between gap-[2rem] m-4 my-[3rem]">
                <div className="flex flex-row gap-3">
                  <p className="text-xl font-bold">Daftar Kegiatan</p>
                  <div>
                    <Button
                      variant="contained"
                      className="text-sm"
                      onClick={handleOpen}
                    >
                      <span>
                        <AddCircleOutlineIcon />
                      </span>
                      <span>Tambah Kegiatan</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center">
                  <label htmlFor="" className="mr-2">
                    Filter
                  </label>
                  <Select
                    multiple
                    value={selectedProjects}
                    onChange={(e) => setSelectedProjects(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {projectNames.map((projectName) => (
                      <MenuItem key={projectName} value={projectName}>
                        {projectName}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
              <div>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Judul Kegiatan
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Nama Proyek
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Tanggal Mulai
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Tanggal Berakhir
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Waktu Mulai
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Waktu Berakhir
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Durasi
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          Aksi
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterActivitiesByProject().length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center">
                            Belum ada kegiatan
                          </TableCell>
                        </TableRow>
                      ) : (
                        filterActivitiesByProject().map((activity) => (
                          <TableRow
                            key={activity.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="activity">
                              {activity.activityTitle}
                            </TableCell>
                            <TableCell align="right">
                              {activity.projectName}
                            </TableCell>
                            <TableCell align="right">
                              {activity.formattedStartDate}
                            </TableCell>
                            <TableCell align="right">
                              {activity.formattedEndDate}
                            </TableCell>
                            <TableCell align="right">
                              {activity.formattedStartTime}
                            </TableCell>
                            <TableCell align="right">
                              {activity.formattedEndTime}
                            </TableCell>
                            <TableCell align="right">
                              {activity.duration}
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                variant="outlined"
                                sx={{ color: "red", borderColor: "red" }}
                                onClick={() => {
                                  setSelectedActivityId(activity.id);
                                  setOpen1(true);
                                }}
                              >
                                <EditNoteIcon />
                              </Button>

                              <Button
                                variant="outlined"
                                sx={{ color: "red", borderColor: "red" }}
                                key={activity.id}
                                onClick={() => handleDelete(activity.id)}
                              >
                                <DeleteIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          <Typography variant="h6">Total Durasi:</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6">
                            {Math.floor(calculateTotalDuration() / 60)} jam{" "}
                            {calculateTotalDuration() % 60} menit
                          </Typography>
                        </TableCell>
                        <TableCell colSpan={2} align="right">
                          <Typography variant="h6">
                            Total Pendapatan:
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6">
                            {formatRates(calculateTotalIncome())}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <div className="flex justify-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Tambah Kegiatan Baru
            </Typography>
            <Button onClick={handleClose} sx={{ color: "black" }}>
              <CloseIcon />
            </Button>
          </div>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <form className="flex flex-col gap-4" onSubmit={onSubmitForm}>
              <div>
                <label htmlFor="activityTitle">Activity Title:</label>
                <input
                  type="text"
                  id="activityTitle"
                  name="activityTitle"
                  placeholder="______________________"
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="projectName">Project Name:</label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  placeholder="______________________"
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="startDate">Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="endDate">End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="startTime">Start Time:</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  onChange={onChange}
                />
              </div>
              <div>
                <label htmlFor="endTime">End Time:</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  onChange={onChange}
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Typography>
        </Box>
      </Modal>
      <Modal
        open={open1}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <EditForm
          id={selectedActivityId}
          navigate={navigate}
          setOpen={setOpen1}
          activities={activities}
          setActivities={setActivities}
        />
      </Modal>
    </>
  );
};

export default HomePage;
