var React = require('react');

var SearchGuthub = require('./SearchGuthub');

var Main = React.createClass({
  render: function(){
    return (
      <div className="main-container">
        <nav className="navbar navbar-default" role="navigation">
          <div className="col-sm-7 col-sm-offset-2" style={{marginTop: '15px'}}>
            <SearchGuthub />
          </div>
        </nav>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Main;

// ReactDOM.render(<Main />, document.getElementById('app'));
