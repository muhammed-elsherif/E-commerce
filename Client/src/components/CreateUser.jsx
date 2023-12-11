import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  });
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // axios
    //   .post("http://localhost:80/api/user/save", inputs)
    //   .then(function (response) {
    //     console.log(response.data);
    //     navigate("/");
    //   });
    console.warn(inputs);
    let result;
    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "post",
        body: JSON.stringify(inputs),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error registering user");
      }
      result = await response.json();
      console.log(response.json());
      localStorage.setItem("user", JSON.stringify(result));
      navigate("/");
    } catch (error) {
      console.error(error);
      // Handle the error, such as displaying an error message to the user
    }
  };

  return (
    <div>
      <h1>Create User</h1>
      <form action="" onSubmit={handleSubmit}>
        <table cellSpacing="10">
          <tbody>
            <tr>
              <th>
                <label>Name :</label>
              </th>
              <td>
                <input type="text" name="name" onChange={handleChange} />
              </td>
            </tr>
            <tr>
              <th>
                <label>Email :</label>
              </th>
              <td>
                <input type="text" name="email" onChange={handleChange} />
              </td>
            </tr>
            <tr>
              <th>
                <label>Password:</label>
              </th>
              <td>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" align="right">
                <button>Save</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}
