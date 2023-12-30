import React, { useContext } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { useSnackbar } from "notistack";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { getLoggedIn } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [result, setResult] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset the error for the specific field when the user changes the input
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate each field and update the errors state
    if (loginData.email.trim() === "") {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (loginData.password.trim() === "") {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await axios
        .post("http://localhost:4000/login", loginData)
        .then((response) => {
          console.log(response.data);
          const { token } = response.data || {};
          localStorage.setItem("token", token);
        });
      getLoggedIn();
      enqueueSnackbar("Login successful", { variant: "success" });
      navigate("/userData");
      setResult(true);
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
    }
  };

  return (
    <div>
      <div className="shadow-md p-5 w-96 mx-auto mt-10 flex items-center justify-center h-full">
        <form onSubmit={handleOnSubmit}>
          <h1 className="text-center font-semibold text-blue-800 text-2xl">
            Login
          </h1>
          <TextField
            margin="dense"
            label="Email"
            name="email"
            onChange={handleChange}
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="dense"
            label="Password"
            onChange={handleChange}
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            error={!!errors.password}
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
          <div className="my-5">
            <Button variant="contained" color="primary" fullWidth type="submit">
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
