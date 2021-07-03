import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { IconButton } from "@material-ui/core";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";

import { useAuthState } from "../context/auth";
import { gql, useMutation } from "@apollo/client";

const useStyles = makeStyles((theme) => ({
  cardWrapper: {
    position: "relative",
  },
  received: {
    width: "50%",
    margin: "25px 8px 8px 8px",
    padding: "0px 0px 0px 10px",
    borderRadius: 25,
    backgroundColor: "#808080",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      width: "70%",
    },
  },
  sent: {
    width: "50%",
    margin: "25px 8px 8px 8px",
    padding: "0px 0px 0px 10px",
    borderRadius: 25,
    backgroundColor: "#e6e6e6",
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("xs")]: {
      width: "70%",
    },
  },
  date: {
    color: "#5a5a5a",
    fontSize: "70%",
    marginLeft: 15,
  },
  dateSent: {
    marginLeft: "auto",
    marginRight: 15,
    float: "right",
  },
  reactionSent: {
    position: "absolute",
    bottom: -23,
    right: 15,
    backgroundColor: "#FFC9B3",
    borderRadius: 5,
  },
  reactionReceived: {
    position: "absolute",
    bottom: 2,
    right: "49%",
    backgroundColor: "#FFC9B3",
    borderRadius: 5,
  },
  reactionButton: {
    backgroundColor: "transparent",
    border: 0,
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.2)",
    },
  },
  icon: {
    marginLeft: "auto",
    padding: 0,
    height: 48,
    "& svg": {
      padding: 12,
    },
  },
  customWidth: {
    maxWidth: 500,
  },
  reactionsSent: {
    position: "absolute",
    bottom: -15,
  },
  reactionsReceived: {
    position: "absolute",
    bottom: 15,
  },
}));

const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($uuid: String!, $content: String!) {
    reactToMessage(uuid: $uuid, content: $content) {
      uuid
    }
  }
`;

export default function SingleMessage({ message }) {
  const classes = useStyles();
  const { user } = useAuthState();
  const sent = message.from === user.username;


  const reactions = ["❤️", "😆", "😡", "👍", "👎"];

  const [open, setOpen] = React.useState(false);
  const handleEmojiOpen = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE, {
    onError: (err) => console.log(err),
    onCompleted: (data) => console.log(data),
  });

  const react = (reaction) => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
    reactToMessage({ variables: { uuid: message.uuid, content: reaction } });
  };
  return (
    <div className={classes.cardWrapper}>
      <Card className={sent ? classes.sent : classes.received}>
        {message.reactions && message.reactions.length > 0 && (
          <div
            className={sent ? classes.reactionsSent : classes.reactionsReceived}
          >
            {[...new Set(message.reactions.map((r) => r.content))]}
          </div>
        )}
        <CardContent>
          <p>{message.content}</p>
        </CardContent>

        <IconButton className={classes.icon}>
          <InsertEmoticonIcon onClick={handleEmojiOpen} />
        </IconButton>
        <div className={sent ? classes.reactionSent : classes.reactionReceived}>
          {open
            ? reactions.map((reaction) => (
                <button
                  className={classes.reactionButton}
                  key={reaction}
                  onClick={() => react(reaction)}
                >
                  {" "}
                  {reaction}
                </button>
              ))
            : ""}
        </div>
      </Card>
      <small className={`${classes.date} ${sent && classes.dateSent} `}>
        {moment(message.createdAt).format("MMMM DD, YYYY @ h:mm a")}
      </small>
    </div>
  );
}
