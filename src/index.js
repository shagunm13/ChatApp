import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider, connect } from 'react-redux'

import App from './components/App';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import firebase from './firebase'
import configureStore from './store'
import { setUser, clearUser } from './actions/index';
import Spinner from './Spinner'

class Root extends React.Component {
    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log("user details" + user)
                this.props.setUser(user)
                this.props.history.push('/')
            }
            else {
                this.props.history.push('/login');
                this.props.clearUser();
            }
        })
    }

    render() {

        return this.props.isLoading ? <Spinner /> : (
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
            </Switch>
        );
    }
}


const mapStateFromProps = (state) => ({
    isLoading: state.user.isLoading
})

const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser, clearUser })(Root))
const store = configureStore();
ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>

    , document.getElementById('root'));
registerServiceWorker();
