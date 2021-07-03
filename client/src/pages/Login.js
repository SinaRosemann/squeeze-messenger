import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

import { useAuthDispatch } from '../context/auth'


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

const LOGIN_USER = gql`
  query login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

export default function Login(props) {
  const classes = useStyles();

  const [variables, setVariables] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch()

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError(err) {
      console.log(err);
             setErrors(err.graphQLErrors[0].extensions.errors);
      
    },
    onCompleted(data) {
        dispatch({ type: 'LOGIN', payload: data.login })
        window.location.href = '/'
      },
  });

  const submitLoginForm = (e) => {
    e.preventDefault();

    loginUser({ variables });
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
          onSubmit={submitLoginForm}
        >
          <h1>Login</h1>
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

          <Button variant="contained" className={classes.button} type="submit">
            Login
          </Button>
          <br />
          <small>
            Not registered yet? <Link to="/register">Go to Register</Link>
          </small>
        </form>
      </Grid>
    </div>
  );
}
