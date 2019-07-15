import React, { Component } from "react";
import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import md5 from "md5";

import firebase from "../../firebase";
export default class Register extends Component {
    state = {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: "",
        loading: false,
        userRef: firebase.database().ref("users")
    };
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        if (this.isValidform()) {
            event.preventDefault();
            this.setState({ errors: [], loading: true });

            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then(createdUser => {
                    console.log(createdUser);
                    createdUser.user
                        .updateProfile({
                            displayName: this.state.username,
                            photoURL: `http://gravatar.com/avatar/${md5(
                                createdUser.user.email
                            )}?d=identicon`
                        })
                        .then(() => {
                            this.saveUser(createdUser).then(() => {
                                console.log("user saved");
                                this.setState({ loading: false })
                            });
                        })
                        .catch(err => {
                            console.error(err);
                            this.state({
                                errors: this.state.errors.concat(err),
                                loading: false
                            });
                        });
                })
                .catch(err => {
                    console.log(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });
                });
        }
    };

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return (
            !username.length ||
            !email.length ||
            !password.length ||
            !passwordConfirmation.length
        );
    };

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if (password.length < 6 || password.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }
    };

    isValidform = () => {
        let errors = [];
        let error;
        if (this.isFormEmpty(this.state)) {
            error = { message: "Fill all the Fields" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else if (!this.isPasswordValid(this.state)) {
            error = { message: "Invalid password" };
            this.setState({ errors: errors.concat(error) });
            return false;
        } else {
            return true;
        }
    };

    saveUser = createdUser => {
        return this.state.userRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        });
    };

    displayError = errors =>
        errors.map((err, index) => <p key={index}>{err.message}</p>);

    inputErrorHandler = (errors, inputName) => {
        console.log(errors);
        return errors.some(err => err.message.toLowerCase().includes(inputName))
            ? "error"
            : "";
    };

    render() {
        const {
            username,
            email,
            password,
            passwordConfirmation,
            errors,
            loading
        } = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color="orange" />
                        Register for Chat2Explore
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                name="username"
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                onChange={this.handleChange}
                                type="text"
                                value={username}
                            />
                            <Form.Input
                                fluid
                                name="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email"
                                onChange={this.handleChange}
                                type="text"
                                value={email}
                            />
                            <Form.Input
                                fluid
                                name="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                onChange={this.handleChange}
                                type="password"
                                value={password}
                            />
                            <Form.Input
                                fluid
                                name="passwordConfirmation"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Password Confirmation"
                                onChange={this.handleChange}
                                type="password"
                                value={passwordConfirmation}
                            />
                            <Button
                                disabled={loading}
                                className={loading ? "loading" : ""}
                                color="orange"
                                fluid
                                size="large" >
                                Submit
                          </Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayError(errors)}
                        </Message>
                    )}
                    <Message>
                        Alreay a user ? <Link to="/login">Login</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}
