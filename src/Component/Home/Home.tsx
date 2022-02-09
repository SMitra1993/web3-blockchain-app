import React from "react";
import "./Home.scss";

class Home extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Home Page</h1>
        </header>
        {/* <div className="App-intro">
				{auth ? (
					<Profile auth={auth} onLoggedOut={handleLoggedOut} />
				) : (
					<Login onLoggedIn={handleLoggedIn} />
				)}
			</div> */}
      </div>
    );
  }
}

export default Home;
