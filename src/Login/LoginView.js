import React, {useEffect, useState} from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
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
import { GoogleButton } from 'react-google-button';
import { UserAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from "@firebase/auth";

function LoginView() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const {googleSignIn, user} = UserAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)

  const handleLogin = (event) => {
    event.preventDefault()
    setEmailError(false)
    setPasswordError(false)

    if (email === '') {
        setEmailError(true)
    }
    if (password === '') {
        setPasswordError(true)
    }

    if (email && password) {
        console.log(email, password)
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
}

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (user != null) {
      navigate("/mainscreen")
    }
  }, [user]);

  return (
    <div>
      <div className="container">
        <h1 className="heading">AI-Blaze</h1>
        <form 
          autoComplete="off" 
          onSubmit={handleLogin}
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
          <Button
            sx={{ margin: 5 }}
            size="large"
            variant="contained"
            className="loginButton"
            type="submit"
          >
            Login
          </Button>
        </form>
        <GoogleButton onClick={handleGoogleSignIn} />
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
