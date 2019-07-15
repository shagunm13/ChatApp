import React from 'react'
import { Header, Segment, Input, Icon } from 'semantic-ui-react'

class MessageHeader extends React.Component {


    render() {
        const { channelName, numberUniqueUser, handleSearchange, searchLoading, isPrivateChannel, handleStar, isChannelStarred } = this.props
        return (
            <Segment clearing >
                {/* Channel title */}
                <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
                    <span>
                        {channelName}
                        {!isPrivateChannel && (<Icon
                            onClick={handleStar}
                            name={isChannelStarred ? "star" : "star outline"}
                            color={isChannelStarred ? "yellow" : "black"} />)}
                    </span>

                    <Header.Subheader>
                        {numberUniqueUser}
                    </Header.Subheader>
                </Header>

                {/*Channel search input */}
                <Header floated="right">
                    <Input
                        loading={searchLoading}
                        size="mini"
                        icon="search"
                        name="searchTerm"
                        placeholder="search Messages"
                        onChange={handleSearchange}
                    />
                </Header>
            </Segment>
        )
    }
}

export default MessageHeader;