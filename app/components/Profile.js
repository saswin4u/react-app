import React from 'react';
// import Firebase from 'firebase';
import Rebase from 're-base';

import Repos from './GitHub/Repos';
import UserProfile from './GitHub/UserProfile';
import Notes from './Notes/Notes';
import getGitHubInfo from '../utils/helpers';

const base = Rebase.createClass('https://app-note-taker.firebaseio.com/');

class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      notes: [1,2,3],
      bio: {},
      repos: ['a', 'b', 'c']
    }
  }

  componentDidMount(){
    //Will be called right after the component mounts the view

    this.init(this.props.params.username);
  }

  componentWillUnmount(){
    base.removeBinding(this.ref);
  }

  componentWillReceiveProps(nextProps){
    base.removeBinding(this.ref);
    this.init(nextProps.params.username);
  }

  init(username){
    this.ref = base.bindToState(username, {
      context: this,
      asArray: true,
      state: 'notes'
    });

    getGitHubInfo(username)
      .then(function(data){
        this.setState({
          bio: data.bio,
          repos: data.repos
        })
      }.bind(this));
  }

  handleAddNode(newNote){
    //update firebase with the newNote
    base.post(this.props.params.username, {
      data: this.state.notes.concat([newNote])
    })
  }

  render(){
    return (
      <div className="row">
        <div className="col-md-4">
          <UserProfile username={this.props.params.username} bio={this.state.bio} />
        </div>
        <div className="col-md-4">
          <Repos username={this.props.params.username} repos={this.state.repos} />
        </div>
        <div className="col-md-4">
          <Notes
            username={this.props.params.username}
            notes={this.state.notes}
            addNote= {(newNote) => this.handleAddNode(newNote)}  />
        </div>
      </div>

    )
  }

}

export default Profile;
