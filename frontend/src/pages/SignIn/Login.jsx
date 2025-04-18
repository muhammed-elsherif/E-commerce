import { Box, Container, Typography } from "@mui/material";
import "./index.css";
import googleImg from "./google.png";
import appleImg from "./apple.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import authService from "../../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();
    if (isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await authService.login(inputs);
      navigate("/");
    } catch (error) {
      setError(error.error || 'Login failed. Please try again.');
    }
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
        <i className="fab">
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
        <form method="post" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <br />
          <br />
          <input
            type="password"
            name="password"
            onChange={handleChange}
            placeholder="Password"
            required
          />
          {error && (
            <Typography color="error" sx={{ mt: 1, fontSize: '0.8rem' }}>
              {error}
            </Typography>
          )}
          <br />
          <br />
          <button type="submit">
            Login
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
        Don't have an account? <a href="/signup">Sign Up</a>
      </Typography>
    </Container>
  );
};

export default Login;
