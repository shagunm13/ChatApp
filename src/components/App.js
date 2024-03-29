import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import './App.css';
import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';



const App = ({ currentUser, currentChannel, isPrivateChannel }) => (
  <Grid columns="equal" className="app" style={{ backgroud: '#eee' }}>

    <SidePanel
      key={currentUser && currentUser.uid}
      currentUser={currentUser} />

    <Grid.Column style={{ marginLeft: 320 }}>
      <Messages
        key={currentChannel && currentChannel.id}
        currentChannel={currentChannel}
        currentUser={currentUser}
        isPrivateChannel={isPrivateChannel} />
    </Grid.Column>
    <Grid.Column style={{ width: 4 }}>

    </Grid.Column>
  </Grid>
)

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel
})


export default connect(mapStateToProps)(App);
