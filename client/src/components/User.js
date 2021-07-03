import React from "react";
import { gql, useQuery } from "@apollo/client";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";

import { useMessageDispatch, useMessageState } from "../context/message";

const useStyles = makeStyles((theme) => ({
  userContent: {
    backgroundColor: "#bf99a538",
    height: "70vh",
    "& .MuiCardHeader-subheader": {
      cursor: "pointer",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
    "& .MuiCardHeader-title": {
      cursor: "pointer",
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
    [theme.breakpoints.down("sm")]: {
      height: "80vh",
    },
  },
  cardWrapper: {
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
  cardWrapperSelect: {
    background: "#f7f7f7",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      justifyContent: "center",
    },
  },
}));

const GET_USERS = gql`
  query getUsers {
    getUsers {
      username
      createdAt

      latestMessage {
        uuid
        from
        to
        content
        createdAt
      }
    }
  }
`;

export default function User() {
  const classes = useStyles();
  const { users } = useMessageState();
  const selectedUser = users?.find((u) => u.selected === true);

  const dispatch = useMessageDispatch();
  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) =>
      dispatch({ type: "SET_USERS", payload: data.getUsers }),
    onError: (err) => console.log(err),
  });

  let usersMarkup;
  if (!users || loading) {
    usersMarkup = <p>Loading..</p>;
  } else if (users.length === 0) {
    usersMarkup = <p>No users have joined yet</p>;
  } else if (users.length > 0) {
    usersMarkup = users.map((user) => {

      let selected = false
      if(selectedUser){
        selected = selectedUser.username === user.username;
      }

      return (
        <div
          key={user.username}
          onClick={() =>
            dispatch({ type: "SET_SELECTED_USER", payload: user.username })
          }
          className={`${
            selected ? classes.cardWrapperSelect : classes.cardWrapper
          } div--user`}
        >
          <CardHeader
            avatar={
              <Avatar aria-label="recipe" className={classes.avatar}>
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            }
            title={user.username}
            subheader={
              user.latestMessage
                ? user.latestMessage.content
                : "You are now connected"
            }
          />
        </div>
      );
    });
  }

  return (
    <>
      <Grid item xs={3} sm={4} className={classes.userContent}>
        {usersMarkup}
      </Grid>
    </>
  );
}
