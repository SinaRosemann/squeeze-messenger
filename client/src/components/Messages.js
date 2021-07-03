import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";

import { gql, useLazyQuery, useMutation } from "@apollo/client";

import { useMessageDispatch, useMessageState } from "../context/message";
import SingleMessage from "../components/SingleMessage";

const SEND_MESSAGE = gql`
  mutation sendMessage($to: String!, $content: String!) {
    sendMessage(to: $to, content: $content) {
      uuid
      from
      to
      content
      createdAt
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
      reactions {
        uuid
        content
      }
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "calc(100% - 16px)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline ": {
      borderColor: "#554a8e",
    },
  },
  markupDiv: {
    flexDirection: "column-reverse",
    display: "flex",
    overflowY: "scroll",
    maxHeight: "54vh",
    paddingBottom: "5px",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "65vh",
    },
  },
  infoText: {
    backgroundColor: "#FFC9B3",
    padding: 10,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#fff",
  },
  textField: {
    width: "100%",
  },
  button: {
    backgroundColor: "#FFC9B3",
    color: "#fff",
    border: 0,
    marginTop: 8,
  },
}));

export default function Messages() {
  const classes = useStyles();

  const { users } = useMessageState();
  const dispatch = useMessageDispatch();
  const [content, setContent] = useState("");

  const selectedUser = users?.find((u) => u.selected === true);
  const messages = selectedUser?.messages;

  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (selectedUser && !selectedUser.messages) {
      getMessages({ variables: { from: selectedUser.username } });
    }
  }, [selectedUser]);

  
  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: "SET_USER_MESSAGES",
        payload: {
          username: selectedUser.username,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);

  const submitMessage = (e) => {
    e.preventDefault();

    console.log("submitMessage");
    if (content.trim() === "" || !selectedUser) return;

    setContent("");

    // Mutation for sending message
    sendMessage({ variables: { to: selectedUser.username, content } });
  };

  let selectedChatMarkup;
  let sendMarkup;
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className={classes.infoText}>Select a friend</p>;

    sendMarkup = <p></p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p className={classes.infoText}>Loading..</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message) => {
      return (
        <div>
          <SingleMessage key={message.uuid} message={message} />
        </div>
      );
    });

    sendMarkup = (
      <FormControl>
        <TextField
          id="outlined-basic"
          variant="outlined"
          placeholder="Write your message"
          onChange={(e) => setContent(e.target.value)}
          className={classes.textField}
          value={content}
        />
        <Button
          variant="contained"
          className={classes.button}
          endIcon={<SendIcon />}
          onClick={submitMessage}
        >
          Send
        </Button>
      </FormControl>
    );
  } else if (messages.length === 0) {
    selectedChatMarkup = (
      <p className={classes.infoText}>
        You are now connected! send your first message!
      </p>
    );

    sendMarkup = (
      <FormControl>
        <TextField
          id="outlined-basic"
          variant="outlined"
          placeholder="Write your message"
          onChange={(e) => setContent(e.target.value)}
          className={classes.textField}
          value={content}
        />
        <Button
          variant="contained"
          className={classes.button}
          endIcon={<SendIcon />}
          onClick={submitMessage}
        >
          Send
        </Button>
      </FormControl>
    );
  }

  return (
    <>
      <Grid item xs={9} sm={8} style={{ alignSelf: "flex-end" }}>
        <br />
        <div className={classes.markupDiv}>{selectedChatMarkup}</div>

        <div>
          <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={submitMessage}
          >
            {sendMarkup}
          </form>
        </div>
      </Grid>
    </>
  );
}
