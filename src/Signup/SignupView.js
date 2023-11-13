import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import "../Login/Login.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { auth } from '../firebaseConfig';

const SignupView = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleSignUp = (event) => {
    event.preventDefault();

    if (email === '') {
      setEmailError(true)
    }
    if (password === '') {
      setPasswordError(true)
    }

    if (email && password) {
      console.log(email, password)
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential)
      }).catch((error) => {
        console.log(error)
      })
}

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className="container_s">
        <h1 className="heading">AI-Blaze</h1>
        <form 
          autoComplete="off" 
          onSubmit={handleSignUp}
          className="formContainer"
          >
          <TextField 
            label="Email"
            onChange={e => setEmail(e.target.value)}
            required
            variant="outlined"
            type="email"
            sx={{mb: 3}}
            fullWidth
            value={email}
            error={emailError}
          />
          <FormControl fullWidth variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            onChange={e => setPassword(e.target.value)}
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
          <InputLabel htmlFor="outlined-adornment-password">
            Repeat Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            onChange={e => setPassword(e.target.value)}
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
            sx={{ margin: 5 }}
            size="large"
            variant="contained"
            className="loginButton"
            type="submit"
          >
            Sign Up
          </Button>
        </form>
      </div>
      <div>
        <hr></hr>
        <Link to="/">
          <Button sx={{ marginTop: 10 }} variant="contained">Back</Button>
        </Link>
      </div>
    </div>
  );
};

export default SignupView;
