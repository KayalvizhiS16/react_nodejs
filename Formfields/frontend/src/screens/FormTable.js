import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import {
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";

const FormTable = () => {
  const [user, setUser] = useState([]);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [open, setOpen] = useState(false);
  const [visualiseData, setVisualiseData] = useState([]);
  const [formStructure, setFormStructure] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [submissions, setSubmissions] = useState([]);
  // const [formData, setFormData] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const URI = "http://localhost:4000";

  const getFormData = async () => {
    try {
      const response = await axios.get(`${URI}/form/getform`);
      const { data } = response.data || {};
      setUser(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getFormData();
  }, []);

  const viewRenderer = (params) => (
    <div>
      <IconButton onClick={() => viewFormTable(params.data, params.rowIndex)}>
        <RemoveRedEyeIcon color="action" />
      </IconButton>
    </div>
  );

  const editRenderer = (params) => (
    <div>
      <IconButton onClick={() => handleUpdate(params.data._id)}>
        <EditIcon color="primary" />
      </IconButton>
    </div>
  );

  const deleteRenderer = (params) => (
    <div>
      <IconButton onClick={() => handleDelete(params.data._id)}>
        <DeleteIcon color="error" />
      </IconButton>
    </div>
  );

  const columnDefs = [
    { field: "formName", headerName: "Form Name" },
    { field: "userName", headerName: "User Name" },
    { field: "date", headerName: "Date" },
    { headerName: "Visualise", cellRenderer: viewRenderer },
    { headerName: "Edit", cellRenderer: editRenderer },
    { headerName: "Delete", cellRenderer: deleteRenderer },
  ];

  const viewFormTable = (data) => {
    handleClickOpen();
    const { formStructure } = data;
    const initialState = formStructure.reduce((acc, property) => {
      acc[property.label] = "";
      return acc;
    }, {});
    setVisualiseData([data]);
    setFormStructure(formStructure || []);
    setInputValues(initialState);
  };

  const handleUpdate = () => {};

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${URI}/form/deleteform/${id}`);
      console.log("Form deleted successfully");
      getFormData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleInputChange = (property, e) => {
    const { value, checked } = e.target;

    setInputValues((prevValues) => ({
      ...prevValues,
      [property.label]: property.name === "checkbox" ? checked : value,
    }));
  };

  const handleVisualiseFormSubmit = async () => {
    console.log("Entered Values:", inputValues);
    console.log(visualiseData[0]);
    const { formName, userName, formStructure, _id } = visualiseData[0];

    setSubmissions((prev) => {
      const newSubmission = {
        formName: formName,
        userName: userName,
        formStructure: formStructure,
        submissions: [{ ...inputValues }],
        formSubmissionDate: new Date().toLocaleString(),
      };
      const newData = [...prev, newSubmission];

      return newData;
    });

    // setFormData(() => {
    //   const finalSubmission = {
    //     formName: formName,
    //     userName: userName,
    //     formStructure: formStructure,
    //     submissions: [...dataSubmissions],
    //     Date: date,
    //   };
    //   return finalSubmission;
    // });

    try {
      await axios.patch(`${URI}/form/updateform/${_id}`, submissions);
      console.log("Form updated successfully");
      setSelectedFormId(null);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} className="p-3">
        {visualiseData.length > 0 ? (
          visualiseData.map((userData, index) => (
            <div key={index}>
              <DialogTitle>View Form </DialogTitle>
              <div className="m-2 font-semibold">
                Form Name:
                <span className="text-blue-500 mx-2">{userData.formName}</span>
              </div>
              <div className="m-2 font-semibold">
                Created by:
                <span className="text-blue-500 mx-2">{userData.userName}</span>
              </div>
              <DialogContent>
                {formStructure.length > 0 ? (
                  formStructure.map((property, propertyIndex) => (
                    <div key={propertyIndex}>
                      {property.name === "text" ||
                      property.name === "password" ? (
                        <div>
                          <TextField
                            label={property.label}
                            value={inputValues[property.label]}
                            margin="dense"
                            placeholder={property.placeholder}
                            onChange={(e) => handleInputChange(property, e)}
                            type={property.name}
                          />
                        </div>
                      ) : null}

                      {property.name === "radio" ? (
                        <div>
                          <FormControl>
                            <FormLabel>{property.label}</FormLabel>
                            <RadioGroup
                              value={inputValues[property.label]}
                              onChange={(e) => handleInputChange(property, e)}
                            >
                              {property.options.map((value, index) => (
                                <FormControlLabel
                                  key={index}
                                  value={value}
                                  control={<Radio />}
                                  label={value}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </div>
                      ) : null}

                      {property.name === "checkbox" ? (
                        <div className="my-2">
                          <InputLabel>Active status</InputLabel>
                          <div>
                            <Checkbox
                              checked={inputValues[property.label]}
                              onChange={(e) => handleInputChange(property, e)}
                              color="success"
                            />
                            <label>{property.label}</label>
                          </div>
                        </div>
                      ) : null}

                      {property.name === "select" ? (
                        <div>
                          <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                              {property.label}
                            </InputLabel>
                            <Select
                              label={property.label}
                              onChange={(e) => handleInputChange(property, e)}
                              value={inputValues[property.label] || ""}
                            >
                              {property.options.map((value, index) => (
                                <MenuItem key={index} value={value}>
                                  {value}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <DialogContentText>No Inputs Available</DialogContentText>
                )}
              </DialogContent>
            </div>
          ))
        ) : (
          <DialogContentText>No data available</DialogContentText>
        )}

        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="error">
            Cancel
          </Button>
          <Button
            onClick={(index) => handleVisualiseFormSubmit(index)}
            variant="contained"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <div
        className="ag-theme-alpine"
        style={{ width: "100%", height: 800, margin: "10px" }}
      >
        <AgGridReact rowData={user} columnDefs={columnDefs} />
        {selectedFormId && (
          <div>
            <h2>Edit Form</h2>
            <button onClick={() => handleUpdate(selectedFormId)}>Save</button>
            <button onClick={() => setSelectedFormId(null)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormTable;
