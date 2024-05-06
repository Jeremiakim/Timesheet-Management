import axios from "axios";
import { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import formattedDate from "../../../server/utils/formattedDate";
import calculateDurations from "../utils/calcudura";

const EditForm = ({ id, navigate, setOpen, activities, setActivities }) => {
  const [inputFormEdit, setInputFormEdit] = useState({
    activityTitle: "",
    projectName: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    duration: "",
    employeeId: "",
  });
  //   const [open, setOpen] = useState(false);
  //   const navigate = useNavigate();
  console.log(activities);
  const access_token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/activity/${id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        const activityData = response.data;

        const formattedActivity = {
          activityTitle: activityData.activityTitle,
          projectName: activityData.projectName,
          startDate: formatDateInput(activityData.startDate),
          endDate: formatDateInput(activityData.endDate),
          startTime: formattedTime(activityData.startTime),
          endTime: formattedTime(activityData.endTime),
          employeeId: activityData.employeeId,
        };

        setInputFormEdit(formattedActivity);
      } catch (error) {
        console.log(error);
      }
    };
    fetchActivity();
  }, [id, access_token]);

  const formattedTime = (timeString) => {
    const date = new Date(timeString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDateInput = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toISOString().split("T")[0];
  };

  const onChange = (e) => {
    setInputFormEdit({
      ...inputFormEdit,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/activity/${id}`,
        inputFormEdit,
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
      console.log(activities);
      setActivities([...activities, newActivity]);
      console.log(activities);
    } catch (error) {
      console.log(error);
    }
  };

  return (
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
          Ubah Kegiatan
        </Typography>
        <Button onClick={() => setOpen(false)} sx={{ color: "black" }}>
          <CloseIcon />
        </Button>
      </div>

      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        <form className="flex flex-col gap-4" onSubmit={handleSubmitEdit}>
          <div>
            <label htmlFor="activityTitle">Activity Title:</label>
            <input
              type="text"
              id="activityTitle"
              name="activityTitle"
              placeholder="______________________"
              value={inputFormEdit.activityTitle}
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
              value={inputFormEdit.projectName}
              onChange={onChange}
            />
          </div>
          <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={inputFormEdit.startDate}
              onChange={onChange}
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={inputFormEdit.endDate}
              onChange={onChange}
            />
          </div>
          <div>
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={inputFormEdit.startTime}
              onChange={onChange}
            />
          </div>
          <div>
            <label htmlFor="endTime">End Time:</label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={inputFormEdit.endTime}
              onChange={onChange}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Typography>
    </Box>
  );
};

export default EditForm;
