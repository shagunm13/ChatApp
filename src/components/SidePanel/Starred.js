import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'

import firebase from '../../firebase'
import { setCurrentChannel, setPrivateChannel } from '../../actions'



class Starred extends React.Component {
    state = {
        starredChannels: [],
        activeChannel: '',
        user: this.props.currentUser,
        userRef: firebase.database().ref('users')
    }

    componentDidMount() {
        const { user } = this.state;
        if (user) {
            this.addListners(user.uid);
        }
    }

    addListners = userId => {

        this.state.userRef
            .child(userId)
            .child('starred')
            .on('child_added', snap => {
                const starredChannel = { id: snap.key, ...snap.val() };

                this.setState({ starredChannels: [...this.state.starredChannels, starredChannel] })
            })

        this.state.userRef
            .child(userId)
            .child('starred')
            .on('child_removed', snap => {
                const channelToRemove = { id: snap.key, ...snap.val() };

                const filteredChannels = this.state.starredChannels.filter(channel => channel.id !== channelToRemove.id)

                this.setState({ starredChannels: filteredChannels })
            })
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id })
    }

    changeChannel = channel => {
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel)   // triggering action for changes state in store
        this.props.setPrivateChannel(false)
    }


    displayChannelList = starredChannels => {
        return (
            starredChannels.length > 0 && starredChannels.map(channel => (
                <Menu.Item
                    key={channel.id}
                    name={channel.name}
                    style={{ opacity: 0.7 }}
                    active={channel.id === this.state.activeChannel}
                    onClick={() => this.changeChannel(channel)}
                >

                    # {channel.name}
                </Menu.Item>
            ))
        )
    }

    render() {
        const { starredChannels } = this.state

        return (<Menu.Menu className="menu">
            <Menu.Item>
                <span>
                    <Icon name="star" />STARRED
                </span>{" "}
                ({starredChannels.length})
            </Menu.Item>
            {this.displayChannelList(starredChannels)}
        </Menu.Menu>
        )
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Starred);