import React, { useEffect, useState } from "react";
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
  ThemeProvider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/AuthContext";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "@firebase/auth";
import theme from "../theme";

function LoginView() {
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    if (email === "") {
      setEmailError(true);
    }
    if (password === "") {
      setPasswordError(true);
    }

    if (email && password) {
      console.log(email, password);
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (user != null) {
      navigate("/mainscreen");
    }
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <div className="login_base">
        <div className="login_container">
          <h1 className="login_heading">AI-Blaze</h1>
          <h2 className="login_subheading">Login</h2>
          <form
            autoComplete="off"
            onSubmit={handleLogin}
            className="login_formContainer"
          >
            <TextField
              className="login_textField"
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
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                error={passwordError}
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
              className="loginButton"
              type="submit"
            >
              Login
            </Button>
          </form>
        </div>
        <div className="login_container2">
          <GoogleButton className="login_google" onClick={handleGoogleSignIn} />
          <Link to="/signupview">
            <Button>Sign up manually</Button>
          </Link>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default LoginView;
