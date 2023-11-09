import React from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function LoginView() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className="container">
        <h1 className="heading">AI-Blaze</h1>
        <TextField
          fullWidth
          id="outlined-basic"
          label="Username"
          variant="outlined"
        />
        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Link to="/mainscreen">
          <Button
            sx={{ marginTop: 5 }}
            size="large"
            fullWidth
            variant="contained"
          >
            Login
          </Button>
        </Link>
      </div>
      <div>
        <hr></hr>
      </div>
      <div className="container2">
        <Link to="/signupview">
          <Button sx={{ marginTop: 10, marginBottom: 5 }}>
            Need an account? SIGN UP
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default LoginView;
