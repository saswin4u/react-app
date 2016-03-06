import React from 'react';

import SearchGuthub from './SearchGuthub';

const Main = ({ children }) => {
  return (
    <div className="main-container">
      <nav className="navbar navbar-default" role="navigation">
        <div className="col-sm-7 col-sm-offset-2" style={{marginTop: '15px'}}>
          <SearchGuthub />
        </div>
      </nav>
      <div className="container">
        {children}
      </div>
    </div>
  )
}

export default Main;

// ReactDOM.render(<Main />, document.getElementById('app'));
