import React, { useEffect } from "react";
import { gql, useSubscription } from "@apollo/client";

import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";

import LocationOnIcon from "@material-ui/icons/LocationOn";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";

import { useAuthDispatch, useAuthState } from "../context/auth";
import { useMessageDispatch } from "../context/message";

import User from "../components/User";
import Messages from "../components/Messages";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "transparent",
    position: "fixed",
    right: 0,
    top: 0,
    "& .MuiBottomNavigationAction-root.Mui-selected": {
      color: "#424242"
    },
  },

  cardBox: {
    width: "70vw",
    height: "70vh",
    margin: "100px auto 0px auto",
    backgroundColor: "#f7f7f7",
    boxShadow: "9px 8px 20px 9px rgb(138 122 118)",

    "& .MuiCardContent-root": {
      padding: 0,
    },
    "& .MuiCardHeader-title": {
      color: "#403A89",
    },
    "& .MuiAvatar-colorDefault": {
      backgroundColor: "#FFC9B3",
    },
    [theme.breakpoints.down("sm")]: {
      width: "90vw",
      height: "80vh",
    },
  },
}));

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;
const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
      uuid
      content
      message {
        uuid
        from
        to
      }
    }
  }
`;

export default function Home({ history }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();

  const { user } = useAuthState();

  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

  const { data: reactionData, error: reactionError } =
    useSubscription(NEW_REACTION);

  useEffect(() => {
    if (messageError) console.log(messageError);

    if (messageData) {
      const message = messageData.newMessage;
      const otherUser =
        user.username === message.to ? message.from : message.to;

      messageDispatch({
        type: "ADD_MESSAGE",
        payload: { username: otherUser, message: messageData.newMessage },
      });
    }
  }, [messageError, messageData]);

  useEffect(() => {
    if (reactionError) console.log(reactionError);

    if (reactionData) {
      const reaction = reactionData.newReaction;
      const otherUser =
        user.username === reaction.message.to
          ? reaction.message.from
          : reaction.message.to;

      messageDispatch({
        type: "ADD_REACTION",
        payload: {
          username: otherUser,
          reaction,
        },
      });
    }
  }, [reactionError, reactionData]);

  const logout = () => {
    authDispatch({ type: "LOGOUT" });
    window.location.href = "/login";
  };

  return (
    <div className="container">
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        showLabels
        className={classes.root}
      >

        <BottomNavigationAction
          label="Logout"
          icon={<LocationOnIcon />}
          onClick={logout}
        />
      </BottomNavigation>
      <Card className={classes.cardBox}>
        <CardContent>
          {" "}
          <Grid container justify="center" className={classes.gridBox}>
            <User />
            <Messages />
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}
