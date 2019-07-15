import React from 'react'
import { Segment, Comment } from 'semantic-ui-react'

import MessageHeader from './MessageHeader'
import Message from './Message'
import MessageForm from './MessageForm'
import firebase from '../../firebase'


class Messages extends React.Component {
    state = {
        messagesRef: firebase.database().ref('messages'),
        isPrivateChannel: this.props.isPrivateChannel,
        privateMessageRef: firebase.database().ref('privateMessages'),
        userRef: firebase.database().ref('users'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
        numberUniqueUser: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: [],
        isChannelStarred: false
    }

    componentDidMount() {
        const { channel, user } = this.state;

        if (channel && user) {
            this.addListners(channel.id);
            this.addUserStarsListner(channel.id, user.uid)
        }

    }

    addListners = channelId => {
        this.addMessageListner(channelId);
    }

    addMessageListner = channelId => {
        let loadingMessages = [];
        const ref = this.getMessagesRef();
        ref.child(channelId).on('child_added', snap => {
            loadingMessages.push(snap.val());
            this.setState({ messages: loadingMessages, messagesLoading: true });

            this.countUniqueUsers(loadingMessages)
        })

        console.log(loadingMessages)
    }


    addUserStarsListner = (channelId, userId) => {
        this.state.userRef
            .child(userId)
            .child('starred')
            .once('value')
            .then(data => {
                if (data.val() !== null) {
                    const channelIds = Object.keys(data.val())
                    const prevStarred = channelIds.includes(channelId);
                    this.setState({ isChannelStarred: prevStarred })
                }
            })

    }

    countUniqueUsers = messages => {
        const uniqueUser = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name))
                acc.push(message.user.name)

            return acc;
        }, [])

        const pural = uniqueUser.length > 1 || uniqueUser === 0
        const numberUniqueUser = ` ${uniqueUser.length} user${pural ? 's' : ''} `;

        this.setState({ numberUniqueUser });
    }

    getMessagesRef = () => {
        const { messagesRef, privateMessageRef, isPrivateChannel } = this.state;

        return isPrivateChannel ? privateMessageRef : messagesRef;
    }

    displayMessages = messages => {
        return (
            messages.length > 0 && messages.map(message => (
                <Message
                    key={message.timestamp}
                    message={message}
                    user={this.state.user} />
            ))
        )
    }

    diplayChannelName = channel => {
        return channel ? `${this.state.isPrivateChannel ? '@' : '#'} ${channel.name}` : ''
    }

    handleSearchange = event => {
        this.setState({
            searchTerm: event.target.value,
            searchLoading: true,
        }, () => this.handleSearchMessages()
        )
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');

        const searchResults = channelMessages.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);
        this.setState({ searchResults })
        setTimeout(() => {
            this.setState({ searchLoading: false })
        }, 1000);
    }

    handleStar = () => {

        this.setState(prevState => ({
            isChannelStarred: !prevState.isChannelStarred
        }), () => this.starChannel());
    }

    starChannel = () => {
        const { channel, isChannelStarred, userRef } = this.state;
        if (isChannelStarred) {

            userRef
                .child(`${this.state.user.uid}/starred`)
                .update({
                    [channel.id]: {
                        name: channel.name,
                        details: channel.details,
                        createdBy: {
                            name: channel.createdBy.name,
                            avatar: channel.createdBy.avatar
                        }
                    }
                });
        }
        else {
            userRef.child(`${this.state.user.uid}/starred`)
                .child(channel.id)
                .remove(err => {
                    console.log(err)
                })
        }
    }

    render() {
        const { messagesRef, channel, user, messages, numberUniqueUser, searchTerm, searchResults, searchLoading, isPrivateChannel, isChannelStarred } = this.state
        return (
            <React.Fragment>
                <div style={{ width: '50em' }}>
                    <MessageHeader
                        channelName={this.diplayChannelName(channel)}
                        numberUniqueUser={numberUniqueUser}
                        handleSearchange={this.handleSearchange}
                        searchLoading={searchLoading}
                        isPrivateChannel={isPrivateChannel}
                        isChannelStarred={isChannelStarred}
                        handleStar={this.handleStar} />
                    <Segment>
                        <Comment.Group className="messages">
                            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
                        </Comment.Group>
                    </Segment>

                    <MessageForm
                        messagesRef={messagesRef}
                        currentChannel={channel}
                        currentUser={user}
                        isPrivateChannel={isPrivateChannel}
                        getMessagesRef={this.getMessagesRef}
                    />
                </div>
            </React.Fragment>
        )
    }
}

export default Messages;