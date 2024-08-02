import { Box, Container, Typography } from "@mui/material";
import "./index.css";
import googleImg from "./google.png";
import appleImg from "./apple.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.warn(inputs);
    const response = await fetch("http://localhost:4000/login", {
      method: "post",
      body: JSON.stringify(inputs),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Error Entering user");
    }
    const result = await response.json();
    console.log("Log in inf " + result);
    if (result.auth) {
      localStorage.setItem("user", JSON.stringify(result.user));
      localStorage.setItem("token", JSON.stringify(result.auth));
      navigate("/");
    } else alert("Please enter connect details");
  };
  return (
    <Container
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        background: "#fff",
        width: "500px",
        height: "550px",
        borderRadius: "50px",
        boxShadow: "10px 10px 2px 5px rgb(110, 110, 111,.2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Box className="login-form">
        <i class="fab">
          <img
            src="https://img.freepik.com/free-vector/gradient-mobile-store-logo-design_23-2149699842.jpg?w=740&t=st=1695139032~exp=1695139632~hmac=7c55fb55b160eb12c504fac8183651066c06d1c5c7235af3a0328c03c6a3643c"
            alt="ecommerce logo"
          />
        </i>
        <button>
          <img src={googleImg} alt="google logo" width="19" />
          <span>Sign in with Google</span>
        </button>
        <button>
          <img src={appleImg} alt="apple logo" width="19" />
          <span>Sign in with Apple</span>
        </button>
      </Box>
      <h5>Or</h5>
      <br />
      <Box className="inputFields box-two">
        <form method="post">
          <input
            type="text"
            name="email"
            placeholder="Phone,email, or username"
            onChange={handleChange}
          />
          <br />
          <br />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
          />
          <br />
          <br />
          <button type="submit" onClick={handleSubmit}>
            Next
          </button>
          <br />
        </form>
        <a href="forgot.php">
          <button>Forget password</button>
        </a>
        <br />
      </Box>
      <br />
      <Typography className="paragraph">
        Don't have an account <a href="signup">Sign Up</a>
      </Typography>
    </Container>
  );
};

export default Login;
