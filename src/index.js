import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { combineReducers, createStore, bindActionCreators } from 'redux';
import { connect, Provider } from 'react-redux';
import { createAction, handleActions } from 'redux-actions';
import { IndexRoute, Route, Redirect, Link } from 'react-router';
import {
  reduxReactRouter,
  routerStateReducer,
  ReduxRouter,
  pushState
} from 'redux-router';
import createHistory from 'history/lib/createHashHistory';

const INCR_COUNTER = 'INCR_COUNTER';
const incrCounter = createAction(INCR_COUNTER);
const DECR_COUNTER = 'DECR_COUNTER';
const decrCounter = createAction(DECR_COUNTER);

const handleCounter = handleActions({
  INCR_COUNTER: (counter = 0, action) => {
    return counter + 1;
  },
  DECR_COUNTER: (counter = 0, action) => {
    return counter - 1;
  }
}, 0);

const reducer = combineReducers({
  router: routerStateReducer,
  counter: handleCounter
});

@connect(state => {
  return {
    counter: state.counter
  };
})
class App extends Component {
  render() {
    const { counter } = this.props;
    return (
      <div>
        <p>{`COUNTER: ${counter}`}</p>
        {this.props.children}
      </div>
    );
  }
}

@connect(state => {
  return {
    location: state.router.location
  }
})
class CounterButton extends Component {
  render() {
    const { dispatch } = this.props;

    return (
      <button
        onClick={() => {
          if(this.props.location.pathname === '/incr') {
            dispatch(incrCounter());
          } else {
            dispatch(decrCounter());
          }
        }} >
        {this.props.children}
      </button>
    );
  }
}

class Increment extends Component {
  render() {
    return (
      <div>
        <CounterButton>INCREMENT</CounterButton>
        <Link to='/decr'>
          TO DECREMENT
        </Link>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    pushState: bindActionCreators(pushState, dispatch)
  };
}

@connect(null, mapDispatchToProps)
class Decrement extends Component {
  componentDidMount() {
    const { pushState } = this.props;

    setTimeout(() => {
      pushState(null, '/incr');
    }, 1000)
  }

  render() {
    const { dispatch } = this.props;
    return (
      <div>
        <CounterButton>DECREMENT</CounterButton>
        <Link to='/'>
          TO INCREMENT
        </Link>
      </div>
    );
  }
}

const routes = (
  <Route>
    <Redirect from="/" to="incr" />
    <Route path="/" component={App}>
      <Route path="incr" component={Increment} />
      <Route path="decr" component={Decrement} />
    </Route>
  </Route>
);

const store = reduxReactRouter({routes, createHistory})(createStore)(reducer);

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <ReduxRouter />
      </Provider>
    );
  }
}

render(<Root />, document.getElementById('app'));
