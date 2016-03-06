var React = require('react');
var Router = require('react-router');
var ReactFireMixin = require('reactfire');
var Firebase = require('firebase')

var Repos = require('./GitHub/Repos');
var UserProfile = require('./GitHub/UserProfile');
var Notes = require('./Notes/Notes');

var helpers = require('../utils/helpers');

var Profile = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function(){
    return {
      notes: [1,2,3],
      bio: {},
      repos: ['a', 'b', 'c']
    }
  },
  componentDidMount: function(){
    //Will be called right after the component mounts the view
    this.ref = new Firebase('https://app-note-taker.firebaseio.com/');

    this.init(this.props.params.username);
  },
  componentWillUNmount: function(){
    this.unbind('notes');
  },
  componentWillReceiveProps: function(nextProps){
    this.unbind('notes');
    this.init(nextProps.params.username);
  },
  init: function(username){
    var childRef = this.ref.child(username);
    this.bindAsArray(childRef, 'notes');

    helpers.getGitHubInfo(username)
      .then(function(data){
        this.setState({
          bio: data.bio,
          repos: data.repos
        })
      }.bind(this));
  },
  handleAddNode: function(newNote){
    //update firebase with the newNote
    this.ref.child(this.props.params.username).child(this.state.notes.length).set(newNote);
  },
  render: function(){
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
            addNote= {this.handleAddNode}  />
        </div>
      </div>

    )
  }
});

module.exports = Profile;
