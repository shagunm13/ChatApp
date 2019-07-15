import React from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react'
import { connect } from 'react-redux'
import firebase from '../../firebase'


class UserPanel extends React.Component {
    state = {
        user: this.props.currentUser
    }
    Dropdownoptions = () => [{
        key: "user",
        text: <span>signed in as <strong>{this.state.user.displayName}</strong></span>,
        disabled: true
    },
    {
        key: "avatar",
        text: <span>Change Avatar</span>
    },
    {
        key: "signout",
        text: <span onClick={this.handleSignOut}>Sign Out</span>
    }
    ]

    handleSignOut = () => {
        firebase
            .auth()
            .signOut()
            .then(() => console.log("signed out"))
    }

    render() {
        const { user } = this.state
        return (
            <Grid style={{ backgroud: "#4c3c4c" }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: "1.2em", margin: 0 }}>
                        {}
                        <Header inverted floated="left" as="h3">
                            <Icon name="code" />
                            <Header.Content>Chat2Explore</Header.Content>
                        </Header>
                        {/*user dropdown */}
                        <Header style={{ padding: '0.25em' }} as="h4" inverted>
                            <Dropdown trigger={
                                <span>
                                    <Image src={user.photoURL} spaced="right" avatar />
                                    {user.displayName}
                                </span>
                            }
                                options={this.Dropdownoptions()} />
                        </Header>
                    </Grid.Row>
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(UserPanel);