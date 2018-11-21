import React, { Component } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from "react-router-dom";
import { testAction } from './actions';
import FirstForm from './containers/FirstForm';
import SecondForm from './containers/SecondForm';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
    <div>
      <Route path="/" exact component={FirstForm} />
      <Route path="/second-form/" component={SecondForm} />
    </div>
  </Router>
    );
  }
}

/*
  TODO: Have different reducer for app and forms. But here there is no global app state to main to used.
*/
const mapStateToProps = state => ({
  appReducer: state.appReducer,
})

const mapDispatchToProps = dispatch => ({
  testAction: (id) => dispatch(testAction(id))
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)

// export default App;
