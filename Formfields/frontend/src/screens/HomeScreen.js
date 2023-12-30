import React, { useState, useRef, useMemo, useContext } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const HomeScreen = (props) => {
  //dialog
  const [open, setOpen] = React.useState(false);

  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

  const [updateData, setUpdateData] = useState({
    firstName: "",
    email: "",
    lastName: "",
    gender: "",
    role: "",
    age: "",
    active: false,
  });
  const handleClickOpen = (params) => {
    setUpdateData(params.data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
    }),
    []
  );

  const { loggedIn } = useContext(AuthContext);

  const URL = "http://localhost:4000";
  const userData = async () => {
    try {
      const response = await axios.get(`${URL}/getuser`);
      const { db } = response.data || {};
      setRowData(db);
    } catch (err) {
      console.log(err.message);
    }
  };

  React.useEffect(() => {
    if (loggedIn === true) {
      userData();
    }
  }, [loggedIn]);

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    age: "",
  });

  //delete render
  function deleteRenderer(params) {
    return (
      <div>
        <IconButton
          aria-label="delete"
          className="p-3"
          color="error"
          onClick={() => handleDelete(params.data, params.data.id)}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }

  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEdit = (data) => {
    axios.patch(`${URL}/updateuser/:${data._id}`, data).then((res) => {
      const { data = null } = res?.data || {};
      if (data) {
        setUpdateData((prev) => {
          const arr = [...prev];
          const index = arr.findIndex((x) => x._id === data?._id);
          if (index !== -1) {
            arr[index] = data;
          }
          return arr;
        });
      }
      handleClose();
      userData();
    });
  };

  const handleDelete = (data) => {
    axios
      .delete(`${URL}/deleteuser/${data._id}`, data)
      .then((res) => {
        console.log(data);
        setRowData((prevRowData) =>
          prevRowData.filter((user) => user._id !== data._id)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Each Column Definition results in one Column.
  const columnDefs = [
    { field: "firstName", filter: true },
    { field: "lastName", filter: true },
    { field: "email", filter: true },
    { field: "gender", filter: true },
    { field: "role", filter: true },
    { field: "age", filter: true },
    { field: "active", filter: true },
    { field: "Edit", headerName: "Edit", cellRenderer: editRenderer },
    {
      field: "delete",
      headerName: "Delete",
      cellRenderer: deleteRenderer,
    },
  ];

  //delete render
  function editRenderer(params) {
    return (
      <div>
        <IconButton
          aria-label="delete"
          className="p-3"
          color="primary"
          onClick={() => handleClickOpen(params)}
        >
          <EditIcon />
        </IconButton>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end m-5">
        <Button variant="contained" LinkComponent={Link} to="/addforms">
          Add Forms
        </Button>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ width: "max-width", height: 800, margin: "10px" }}
      >
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To edit the user you should be owner to it or super admin
            </DialogContentText>
            <TextField
              margin="dense"
              label="First Name"
              name="firstName"
              variant="outlined"
              value={updateData.firstName}
              onChange={handleOnChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="LastName"
              variant="outlined"
              name="lastName"
              type="text"
              value={updateData.lastName}
              onChange={handleOnChange}
              fullWidth
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={updateData.email}
              onChange={handleOnChange}
              type="email"
              variant="outlined"
              fullWidth
            />

            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                label="Active"
                value={updateData.role}
                onChange={handleOnChange}
              >
                <MenuItem value="Owner">Owner</MenuItem>
                <MenuItem value="Super Admin">Super Admin</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Manager">Manager</MenuItem>
              </Select>
            </FormControl>

            <div className="my-2">
              <InputLabel>Active status</InputLabel>
              <div>
                <Checkbox
                  name="active"
                  checked={updateData.active}
                  onChange={handleOnChange}
                  color="success"
                />
                <label>Active</label>
              </div>
            </div>
            <TextField
              margin="dense"
              label="Age"
              type="number"
              name="age"
              value={updateData.age}
              onChange={handleOnChange}
              variant="outlined"
              fullWidth
            />
            <FormControl margin="dense">
              <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="male"
                value={updateData.gender}
                onChange={handleOnChange}
                name="gender"
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="error">
              Cancel
            </Button>
            <Button onClick={() => handleEdit(updateData)} variant="contained">
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
        />
        <p className="p-10 text-2xl font-semibold">Form Table</p>
      </div>
    </div>
  );
};

export default HomeScreen;
