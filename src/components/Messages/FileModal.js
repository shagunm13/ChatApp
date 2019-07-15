import React from 'react'
import mime from 'mime-types'
import { Modal, Button, Icon, Input, ModalActions } from 'semantic-ui-react'

class FileModal extends React.Component {

    state = {
        file: null,
        authorized: ['image/jpeg', 'image/png']
    }

    addfile = (event) => {
        const file = event.target.files[0]

        if (file) {
            this.setState({ file })
        }
    }

    sendFile = () => {

        const { file } = this.state
        const { uploadFile, closeModal } = this.props

        if (this.isAuthorized(file.name)) {
            const metadata = { contentType: mime.lookup(file.name) };
            uploadFile(file, metadata);
            closeModal();
            this.clearFile();
        }
    }

    isAuthorized = filename => this.state.authorized.includes(mime.lookup(filename))

    clearFile = () => this.setState({ file: null })

    render() {
        const { modal, closeModal } = this.props;
        return (
            <Modal basic open={modal} onClose={closeModal}>
                <Modal.Header>Select an Image File</Modal.Header>
                <Modal.Content>
                    <Input
                        fluid
                        label="File type :jpg ,png"
                        name="file"
                        type="file"
                        onChange={this.addfile}
                    />
                </Modal.Content>
                <ModalActions>
                    <Button
                        color="green"
                        inverted
                        onClick={this.sendFile}
                    >
                        <Icon name="checkmark" />Send
                    </Button>

                    <Button
                        color="red"
                        inverted
                        onClick={closeModal}
                    >
                        <Icon name="remove" />Cancel
                    </Button>
                </ModalActions>
            </Modal>
        )
    }
}
export default FileModal;