var React = require('react');

var Notes = React.createClass({
  render: function(){
      console.log(this.props.notes);
      return (
        <div>
          <p> NOTES </p>

        </div>
      );
  }
});

module.exports = Notes;
