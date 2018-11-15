import React, { Component } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { testAction } from './actions';
import FirstForm from './containers/FirstForm';

import './App.css';

const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

class App extends Component {
  render() {
    return (
      <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">FirstForm</Link>
          </li>
          <li>
            <Link to="/about/">About</Link>
          </li>
        </ul>
      </nav>

      <Route path="/" exact component={FirstForm} />
      <Route path="/about/" component={About} />
    </div>
  </Router>
    );
  }
}

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
