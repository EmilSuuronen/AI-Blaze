import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import LoginView from "./Login/LoginView";
import NewProject from "./NewProject/NewProject";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/loginview" element={<LoginView />} />
        <Route path="/newprojectview" element={<NewProject />} />
      </Routes>
    </Router>
  );
}

function HomeScreen() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Home</h1>
      <Link to="/loginview">
        <button>Login</button>
      </Link>
      <Link to="/newprojectview">
        <button>NewProject</button>
      </Link>
    </div>
  );
}
