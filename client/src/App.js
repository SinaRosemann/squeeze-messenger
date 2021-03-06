import "./App.css";
import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";

import ApolloProvider from "./ApolloProvider";

import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/message";
import DynamicRoute from './util/DynamicRoute'
//Pages
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
      <MessageProvider>
        <Router>
          <Switch>
            <DynamicRoute exact path="/" component={Home} authenticated />
            <DynamicRoute path="/register" component={Register} guest />
            <DynamicRoute path="/login" component={Login} guest/>
          </Switch>
        </Router>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
