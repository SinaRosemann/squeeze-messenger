import React, { useState } from "react";
import { Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  grid: {
    minHeight: "100vh",
  },
  form: {
    width: "300px",
    padding: "50px",
    "& > *": {
      margin: theme.spacing(1),
      display: "block",
    },
    "& label.Mui-focused": {
      color: "#403A89",
      fontWeight: "bold",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#FFC9B3",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#FFC9B3",
      },
    },
    "& .MuiFormHelperText-root": {
      color: "red",
    },
  },
  button: {
    backgroundColor: "#403A89",
    color: "#fff",
  },
}));

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      username: $username
      email: $email
      password: $password
      confirmPassword: $confirmPassword
    ) {
      username
      email
      createdAt
    }
  }
`;

function Register(props) {
  const classes = useStyles();

  const [variables, setVariables] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, __) {
      props.history.push("/login");
    },
    onError(err) {
      console.log(err)

      setErrors(err.graphQLErrors[0].extensions.errors);
    },
  });

  const submitRegisterForm = (e) => {
    e.preventDefault();

    registerUser({ variables });
  };

  return (
    <div className="container">
      <Grid
        className={classes.grid}
        container
        direction="row"
        alignItems="center"
      >
        <form
          className={classes.form}
          noValidate
          autoComplete="off"
          onSubmit={submitRegisterForm}
        >
          <h1>Register</h1>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            size="small"
            type="text"
            fullWidth
            value={variables.username}
            onChange={(e) =>
              setVariables({ ...variables, username: e.target.value })
            }
            helperText={errors.username}
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            size="small"
            type="email"
            fullWidth
            value={variables.email}
            onChange={(e) =>
              setVariables({ ...variables, email: e.target.value })
            }
            helperText={errors.email}
          />
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            size="small"
            type="password"
            fullWidth
            value={variables.password}
            onChange={(e) =>
              setVariables({ ...variables, password: e.target.value })
            }
            helperText={errors.password}
          />
          <TextField
            id="outlined-basic"
            label="Confirm Password"
            variant="outlined"
            size="small"
            type="password"
            fullWidth
            value={variables.confirmPassword}
            onChange={(e) =>
              setVariables({ ...variables, confirmPassword: e.target.value })
            }
            helperText={errors.confirmPassword}
          />
          <Button
            variant="contained"
            className={classes.button}
            type="submit"
            disabled={loading}
          >
            {loading ? "laoding.." : "register"}
          </Button>
          <br />
          <small>
            Already registered? <Link to="/login">Go to Login</Link>
          </small>
        </form>
      </Grid>
    </div>
  );
}

export default Register;
