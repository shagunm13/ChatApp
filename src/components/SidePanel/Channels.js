import React from 'react';
import { connect } from 'react-redux'
import { Menu, Icon, Modal, Form, Input, Button, Label } from 'semantic-ui-react';
import firebase from '../../firebase';
import { setCurrentChannel, setPrivateChannel } from '../../actions/index'

class Channels extends React.Component {
    state = {
        activeChannel: '',
        user: this.props.currentUser,
        channels: [],
        channel: null,
        ChannelName: '',
        ChannelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        messageRef: firebase.database().ref('messages'),
        notifications: [],
        modal: false,
        firstLoad: true
    }

    componentDidMount() {
        this.addListeners();
    }

    addListeners = () => {
        let loadedChannels = [];

        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
            this.addNotificationlistner(snap.key);
        })

        console.log(loadedChannels);
    }

    addNotificationlistner = channelId => {

        this.state.messageRef.child(channelId).on("value", snap => {
            if (this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap)
            }
        })
    }

    handleNotifications = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;

        let index = notifications.findIndex(notification => notification.id === channelId)

        if (index !== -1) {
            if (channelId !== currentChannelId) {
                lastTotal = notifications[index].total;

                if (snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }

            notifications[index].lastKnownTotal = snap.numChildren();
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            })
        }

        this.setState({ notifications });
    }

    setFirstChannel = () => {
        const firstChannel = this.state.channels[0]
        if (this.state.firstLoad && this.state.channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel)
            this.setState({ channel: firstChannel })
        }
        this.setState({ firstLoad: false })
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    };

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    handleSubmit = event => {
        event.preventDefault();

        if (this.isValidForm(this.state)) {
            this.addChannel();
        }
    }

    isValidForm = ({ ChannelName, ChannelDetails }) => ChannelName && ChannelDetails;

    addChannel = () => {

        const { channelsRef, ChannelName, ChannelDetails, user } = this.state;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: ChannelName,
            details: ChannelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL
            }
        }

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ ChannelName: '', ChannelDetails: '' });
                this.closeModal();
                console.log("Channel Added");
            })
            .catch((err) => console.log(err));
    }

    changeChannel = channel => {
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel)   // triggering action for changes state in store
        this.props.setPrivateChannel(false)
        this.setState({ channel })
        this.clearNotifications();
    }

    clearNotifications = () => {
        const index = this.state.notifications.findIndex((notification) => notification.id === this.state.channel.id);

        if (index !== -1) {
            let updatedNotifications = [...this.state.notifications];
            updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal;
            updatedNotifications[index].count = 0;

            this.setState({ notifications: updatedNotifications })
        }
    }

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id })
    }

    getNotificationCount = channel => {
        let count = 0;

        this.state.notifications.forEach(notification => {

            if (notification.id === channel.id) {
                count = notification.count;
            }
        });

        if (count > 0) return count;
    }

    displayChannelList = channels => {
        return (
            channels.length > 0 && channels.map(channel => (
                <Menu.Item
                    key={channel.id}
                    name={channel.name}
                    style={{ opacity: 0.7 }}
                    active={channel.id === this.state.activeChannel}
                    onClick={() => this.changeChannel(channel)}
                >
                    {this.getNotificationCount(channel) && (
                        <Label color="red">{this.getNotificationCount(channel)}</Label>
                    )}
                    # {channel.name}
                </Menu.Item>
            ))
        )
    }

    render() {
        const { channels, modal } = this.state

        return (
            <React.Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" />CHANNELS
                    </span>{" "}
                        ({channels.length})<Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {this.displayChannelList(channels)}
                </Menu.Menu>

                <Modal basic open={modal} onClose={this.closeModal}>
                    <Modal.Header>Add a channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label="Name of Channel"
                                    name="ChannelName"
                                    onChange={this.handleChange}
                                />
                                <Input
                                    fluid
                                    label="About the Channel"
                                    name="ChannelDetails"
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="green" inverted onClick={this.handleSubmit} >
                            <Icon name="checkmark" />Add
                        </Button>
                        <Button color="red" inverted onClick={this.closeModal} >
                            <Icon name="remove" />cancel
                    </Button>
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);