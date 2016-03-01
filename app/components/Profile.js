var React = require('react');
var Router = require('react-router');
var ReactFireMixin = require('reactfire');
var Firebase = require('firebase')

var Repos = require('./GitHub/Repos');
var UserProfile = require('./GitHub/UserProfile');
var Notes = require('./Notes/Notes');

var Profile = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function(){
    return {
      notes: [1,2,3],
      bio: {
        name: 'Sylvester'
      },
      repos: ['a', 'b', 'c']
    }
  },
  componentDidMount: function(){
    //Will be called right after the component mounts the view
    this.ref = new Firebase('https://app-note-taker.firebaseio.com/');
    this.childRef = this.ref.child(this.props.params.username);
    this.bindAsArray(this.childRef, 'notes');
  },
  componentWillUNmount: function(){
    this.unbind('notes');
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
          <Notes username={this.props.params.username} notes={this.state.notes} />
        </div>
      </div>

    )
  }
});

module.exports = Profile;
