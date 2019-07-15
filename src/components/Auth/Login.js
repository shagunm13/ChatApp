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


import firebase from "../../firebase";
export default class Login extends Component {
    state = {
        email: "",
        password: "",
        errors: "",
        loading: false,
    };
    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = event => {
        if (this.isValidform(this.state)) {
            event.preventDefault();
            this.setState({ errors: [], loading: true });

            firebase
                .auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then((signedInUser) => {
                    console.log(signedInUser)
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        errors: this.state.errors.concat(err),
                        loading: false
                    });
                })

        }
    };

    isValidform = ({ email, password }) => email && password;


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
            email,
            password,
            errors,
            loading
        } = this.state;
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as="h2" icon color="violet" textAlign="center">
                        <Icon name="code branch" color="violet" />
                        Login to Chat2Expore
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>

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

                            <Button
                                disabled={loading}
                                className={loading ? "loading" : ""}
                                color="violet"
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
                        Don't have an account ? <Link to="/register">Register</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}
