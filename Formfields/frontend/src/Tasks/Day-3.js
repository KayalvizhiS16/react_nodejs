import React, { useState, useRef, useMemo } from "react";

//material ui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

//ag grid
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import axios from "axios";

const App3 = () => {
  //
  const gridRef = useRef();
  const [rowData, setRowData] = useState();

  // Each Column Definition results in one Column.
  const columnDefs = [
    { field: "id" },
    { field: "firstname" },
    { field: "lastname" },
    { field: "gender" },
    { field: "email" },
    { field: "age" },
    { field: "active" },
    { field: "delete", headerName: "Delete", cellRenderer: deleteRenderer },
  ];

  //delete render
  function deleteRenderer(params) {
    return (
      <div>
        <IconButton
          aria-label="delete"
          className="p-3"
          onClick={() => handleDelete(params.data.id)}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }
  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    []
  );

  //dialog open
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //useState
  const [data, setData] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
    age: "",
    active: "",
  });
  // const [rowData, setRowData] = React.useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnClick = () => {
    if (!data) {
    }
    //post
    else {
      axios
        .post("http://localhost:4000/postData", {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          gender: data.gender,
          age: data.age,
          active: data.active,
        })
        .then((res) => {
          setRowData((prev) => {
            const arr = [...prev];
            arr.push({
              firstname: data.firstname,
              lastname: data.lastname,
              email: data.email,
              gender: data.gender,
              age: data.age,
              active: data.active,
            });
            return arr;
          });
          setData({
            firstname: "",
            lastname: "",
            email: "",
            gender: "",
            age: "",
            active: "",
          });
          console.log(res.data);

          if (res.data.message) {
            alert(res.data.message);
          }
        })
        .catch((err) => {
          if (err.response && err.response.data && err.response.data.message) {
            alert(err.response.data.message);
          }
        });
      handleClose();
    }
  };

  //get

  React.useEffect(() => {
    axios
      .get("http://localhost:4000/getData")
      .then((res) => {
        console.log(res);
        const { data = [] } = res?.data || {};
        setRowData(data);
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          alert(err.response.data.message);
        }
      });
  }, []);

  //delete

  const handleDelete = (id) => {
    console.log(id);
    axios
      .delete(`http://localhost:4000/deleteData/${id}`)
      .then((response) => {
        console.log(`Deleted post with ID ${id}`);
        const data = [...response.data.Data];
        setRowData(data);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  console.log(rowData);
  return (
    <div>
      <Button
        variant="contained"
        style={{ margin: "10px" }}
        onClick={handleClickOpen}
      >
        Add
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="firstname"
            label="First Name"
            type="text"
            value={data.firstname}
            onChange={(e) => handleChange(e)}
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            name="lastname"
            label="Last name"
            type="text"
            value={data.lastname}
            onChange={(e) => handleChange(e)}
            fullWidth
            required={true}
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange(e)}
            fullWidth
            variant="standard"
          />
          <FormControl margin="dense">
            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="Male"
              value={data.gender}
              onChange={(e) => handleChange(e)}
              name="gender"
            >
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>
          <TextField
            autoFocus
            margin="dense"
            name="age"
            label="Age"
            type="number"
            value={data.age}
            onChange={(e) => handleChange(e)}
            fullWidth
            variant="standard"
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="Active">Active</InputLabel>
            <Select
              name="active"
              value={data.active}
              label="Active"
              onChange={(e) => handleChange(e)}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Not Active</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button onClick={() => handleOnClick()} type="submit">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      {/*    {rowData.length ? (
          rowData.map((x, index) => (
            <div style={{ margin: "10px", display: "flex" }}>
              <div key={index} style={{ margin: "10px" }}>
                {x.id}||{x.firstname}||{x.lastname}||{x.email}||{x.gender}||
                {x.age}||{x.active ? <div>Active</div> : <div> Not active</div>}
              </div>
              <button
                style={{ margin: "10px" }}
                onClick={() => handleDelete(rowData[index].id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <h4>No data found</h4>
        )}
   */}

      <div
        className="ag-theme-alpine-dark"
        style={{ width: 1500, height: 600 }}
      >
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
        />
      </div>
    </div>
  );
};

export default App3;
