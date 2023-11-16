import React, { useState } from "react";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  ThemeProvider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth } from "../firebaseConfig";
import theme from "../theme"; 
import "./Signup.css"; 

const SignupView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleSignUp = (event) => {
    event.preventDefault();

    if (email === "") {
      setEmailError(true);
    }
    if (password === "") {
      setPasswordError(true);
    }

    if (email && password) {
      console.log(email, password);
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="signup_base">
        <div className="signup_container">
          <h1 className="signup_heading">AI-Blaze</h1>
          <h2 className="signup_subheading">Sign Up</h2>
          <form autoComplete="off" onSubmit={handleSignUp} className="signup_formContainer">
            <TextField
              label="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              type="email"
              sx={{ mb: 3 }}
              fullWidth
              value={email}
              error={emailError}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                className="passwordContainer"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                fullWidth
                error={passwordError}
                label="Password"
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
              />
            </FormControl>
            <FormControl fullWidth variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">Repeat Password</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                error={passwordError}
                label="Password"
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
              />
            </FormControl>
            <Button
              style={{
                backgroundColor: "rgba(79,81,140,1)",
                color: "#fffffa",
                marginTop: "10%",
              }}
              size="large"
              variant="contained"
              className="signupButton"
              type="submit"
            >
              Sign Up
            </Button>
          </form>
        </div>
        <div className="signup_container2">
          <Link to="/loginview">
            <Button>Already have an account? Log In</Button>
          </Link>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default SignupView;
