import { Button, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
const Admin = () => {
  const navigate = useNavigate();
  const onSubmit = async () => {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    const response = await fetch("http://localhost:4000/admin", {
      method: "put",
      body: userId,
      headers: {},
    });
    const result = await response.json();
    navigate("/");
  };
  return (
    <Container sx={{ py: 9 }}>
      <Button
        onClick={onSubmit}
        variant="contained"
        component={Link}
        to="/admin"
        color="primary"
      >
        Make me admin
      </Button>
    </Container>
  );
};
export default Admin;
