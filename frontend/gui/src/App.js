import React, { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
// import BaseRouter from "./routes";
import * as actions from "./store/actions/auth";
import "semantic-ui-css/semantic.min.css";
// import Landing from "./Components/Landing";

import { Route } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ProjectViewContainer from "./Components/ProjectViewContainer";
import ApplicantsViewContainer from "./Components/ApplicantsViewContainer";
import Landing from "./Components/Landing";


const App = props => {
  // console.log(props)

  const [user, setUser] = useState("");

  const getUser = async () => {
    // get current user id
    const url = "http://localhost:8000/rest-auth/user/";
    const token = localStorage.getItem("token");

    let resp = await fetch(url, {
      headers: {
        authorization: "Token " + token
      }
    });
    let data = await resp.json();

    // get user data from api
    let apiUrl = `http://localhost:8000/api/profile/${data.pk}/`
    let apiResp = await fetch(apiUrl)
    let apiData = await apiResp.json();
    console.log("API DATA --------->")
    console.log(apiData)
    setUser(apiData);

    console.log("USER AFTER SETUSER --------->")
    console.log(user)
  };
  

  useEffect(() => {
    getUser();
    props.onTryAutoSignup();

  }, []);

  return (
    <Router>
      
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        <Route exact path="/projects/" component={ProjectViewContainer} />

        {/* <Route exact path="/applicants/" component={ApplicantsViewContainer} />  */}
        <Route exact path="/applicants/"
              render={(routeProps) => (
                  <ApplicantsViewContainer {...routeProps} user={user} />
                )}
        />

        <Route exact path="/" component={Landing} />

      <footer className="root--body">
        &copy; Created by <a href="https://www.jessicacmoore.com/">Jessica Moore</a>, <a href="https://timkurbanov.ca/">Timur Kurbanov</a>, <a href="https://alexyang.ca/">Alexander Yang</a>
    </footer>
  
    </Router>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);