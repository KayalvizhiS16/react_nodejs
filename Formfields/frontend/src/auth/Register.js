import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Register = () => {
  const { getLoggedIn } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const intialState = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    role: "",
    age: "",
    active: false,
  };
  const [formData, setFormData] = React.useState(intialState);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [rowData, setRowData] = React.useState();

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    age: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleOnChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate each field and update the errors state
    if (formData.firstName.trim() === "") {
      newErrors.firstName = "First Name is required";
      isValid = false;
    }

    if (formData.lastName.trim() === "") {
      newErrors.lastName = "Last Name is required";
      isValid = false;
    }

    if (formData.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (formData.password.trim() === "") {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (formData.role.trim() === "") {
      newErrors.role = "Role is required";
      isValid = false;
    }

    if (formData.age.trim() === "") {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (isNaN(formData.age) || formData.age <= 0) {
      newErrors.age = "Invalid age";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const SERVER_PORT = "http://localhost:4000";
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    console.log(formData);
    axios
      .post(`${SERVER_PORT}/createuser`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        gender: formData.gender,
        role: formData.role,
        age: formData.age,
        active: formData.active,
      })
      .then((response) => {
        const { data = null } = response?.data || {};
        if (data) {
          setRowData((prev) => {
            const arr = [...prev];
            arr.push({
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              gender: formData.gender,
              role: formData.role,
              age: formData.age,
              password: formData.password,
              active: formData.active,
            });
            return arr;
          });
        }

        setFormData(intialState);
        if (response.data.message) {
          console.log(response.data.message);
          enqueueSnackbar(response.data.message, { variant: "success" });
          getLoggedIn();
          navigate("/userData");
        }
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          console.log(err.response.data.message);
          enqueueSnackbar(err.response.data.message, { variant: "error" });
        }
      });
  };

  return (
    <div>
      <div className="shadow-md p-5 md:w-96 w-fit mx-auto mt-10 flex items-center justify-center h-full">
        <form method="post" onSubmit={(e) => handleOnSubmit(e)}>
          <h1 className="text-center font-semibold text-blue-800 text-2xl">
            Sign up
          </h1>
          <TextField
            margin="dense"
            value={formData.firstName}
            onChange={(e) => handleOnChange(e)}
            label="First Name"
            name="firstName"
            variant="outlined"
            fullWidth
            error={errors.firstName}
            helperText={errors.firstName}
          />
          <TextField
            margin="dense"
            label="Last Name"
            value={formData.lastName}
            variant="outlined"
            name="lastName"
            onChange={(e) => handleOnChange(e)}
            fullWidth
            error={errors.lastName}
            helperText={errors.lastName}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleOnChange(e)}
            variant="outlined"
            fullWidth
            error={errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            value={formData.password}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            onChange={(e) => handleOnChange(e)}
            fullWidth
            error={errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            type={showPassword ? "text" : "password"}
            variant="outlined"
            onChange={(e) => handleOnChange(e)}
            fullWidth
            error={errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={toggleConfirmPasswordVisibility}
                    edge="end"
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              name="role"
              onChange={(e) => handleOnChange(e)}
              label="Active"
              error={errors.role}
            >
              <MenuItem value="Owner">Owner</MenuItem>
              <MenuItem value="Super Admin">Super Admin</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
            </Select>
            {errors.role && (
              <span style={{ color: "red", fontSize: "0.75rem" }}>
                {errors.role}
              </span>
            )}
          </FormControl>

          <div className="my-2">
            <InputLabel>Active status</InputLabel>
            <div>
              <Checkbox
                name="active"
                checked={formData.active}
                onChange={(e) => handleOnChange(e)}
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
            value={formData.age}
            onChange={(e) => handleOnChange(e)}
            variant="outlined"
            fullWidth
            error={errors.age}
            helperText={errors.age}
          />
          <FormControl margin="dense">
            <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="male"
              name="gender"
              onChange={(e) => handleOnChange(e)}
              value={formData.gender}
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>

          <div className="my-5">
            <Button variant="contained" color="primary" fullWidth type="submit">
              Register
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
