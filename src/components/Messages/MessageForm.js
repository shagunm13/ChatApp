import React from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import uuidv4 from 'uuid/v4'

import firebase from '../../firebase'
import FileModal from './FileModal'
import ProgressBar from './ProgressBar'

class MessageForm extends React.Component {
    state = {
        storageRef: firebase.storage().ref(),
        uploadState: '',
        uploadTask: null,
        uploadPercentage: '',
        message: '',
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        isPrivateChannel: this.props.isPrivateChannel,
        loading: false,
        errors: [],
        modal: false,
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = (fileUrl = null) => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        };
        if (fileUrl !== null) {
            message['image'] = fileUrl
        }
        else {
            message['content'] = this.state.message
        }
        return message
    }

    sendMessage = () => {

        const { getMessagesRef } = this.props;
        const { channel, message } = this.state;

        if (message) {
            this.setState({ loading: true })

            getMessagesRef()
                .child(channel.id)
                .push()
                .set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] })
                })
                .catch((err) => {

                    this.setState({ loading: false, errors: this.state.errors.concat(err) })
                })
        }
        else {
            this.setState({ errors: this.state.errors.concat({ message: 'Add some message' }) })
        }

    }

    getPath = () => {
        if (this.state.isPrivateChannel) {
            return `chat/private-${this.state.channel.id}`
        } else {
            return 'chat/public'
        }
    }

    uploadFile = (file, metadata) => {
        const pathToUpload = this.state.channel.id;
        const ref = this.props.getMessagesRef();
        const filePath = `${this.getPath()}/${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
        },
            () => {
                this.state.uploadTask.on('state_changed', snap => {
                    const uploadPercentage = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                    this.setState({ uploadPercentage });
                },
                    (err) => {
                        console.log(err);
                        this.setState({
                            errors: this.state.errors.concat(err),
                            uploadState: 'error while uploading image',
                            uploadTask: null
                        })
                    },
                    () => {
                        this.state.uploadTask.snapshot.ref.getDownloadURL()
                            .then(downloadurl => {
                                this.sendFileMessage(downloadurl, ref, pathToUpload);
                            })
                            .catch(err => {
                                console.log(err);
                                this.setState({
                                    errors: this.state.errors.concat(err),
                                    uploadState: 'error while downloading image',
                                    uploadTask: null
                                })
                            })
                    }
                )
            }
        )
    }

    sendFileMessage = (fileurl, ref, pathToUpload) => {
        //  console.log("comming here");
        ref.child(pathToUpload)
            .push()
            .set(this.createMessage(fileurl))
            .then(() => {
                this.setState({ uploadState: 'done' })
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    uploadState: 'error while uploading image',
                    uploadTask: null
                })
            })
    }

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    render() {

        const { errors, message, loading, modal, uploadPercentage, uploadState } = this.state;

        return (
            <Segment className="message__form">
                <Input
                    fluid
                    name="message"
                    value={message}
                    onChange={this.handleChange}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    labelPosition="left"
                    placeholder="Write your message"
                    className={errors.some(error => error.message.includes('message')) ? 'error' : ''}
                />
                <Button.Group icon widths="2">
                    <Button
                        color="orange"
                        content="Add Reply"
                        onClick={this.sendMessage}
                        disabled={loading}
                        labelPosition="left"
                        icon="edit"
                    />
                    <Button
                        color="teal"
                        disabled={uploadState === 'uploading'}
                        content="Upload Media"
                        labelPosition="right"
                        icon="cloud upload"
                        onClick={this.openModal}
                    />
                </Button.Group>
                <FileModal
                    modal={modal}
                    closeModal={this.closeModal}
                    uploadFile={this.uploadFile}
                />
                <ProgressBar
                    uploadPercentage={uploadPercentage}
                    uploadState={uploadState} />
            </Segment>
        )
    }
}

export default MessageForm