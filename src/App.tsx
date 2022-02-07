import React, { FunctionComponent, useEffect, useState } from "react";
import "./App.css";
import wallet from "./Assets/Images/wallet.svg";
import downArrow from "./Assets/Images/down-arrow.svg";
import logOut from "./Assets/Images/log-out.svg";
import "./Assets/Styles/component-styles.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Component/Home/Home";
import { useModal } from "./Hook/useModal";
import { Modal } from "./Component/Modal/modal";
// import { ConfirmationModal } from "./Component/Confirmation-Modal/confirmation-modal";
import { ConnectWalletModal } from "./Component/Modal-Content/Connect-Wallet/connect-wallet-modal";
import { State } from "./Interface/state-interface";
import { Auth } from "./Interface/auth-interface";
import { Profile } from "./Component/Profile/Profile";
import jwtDecode from "jwt-decode";

const LS_KEY = "login-with-metamask:auth";
interface JwtDecoded {
  payload: {
    id: string;
    publicAddress: string;
  };
}

const App: FunctionComponent = (): JSX.Element => {
  const [state, setState] = useState<State>({ isActive: false });

  useEffect(() => {
    // Access token is stored in localstorage
    const ls = localStorage.getItem(LS_KEY);
    const auth = ls && JSON.parse(ls);
    setState({ auth });
  }, []);

  const handleLoggedIn = (auth: Auth) => {
    localStorage.setItem(LS_KEY, JSON.stringify(auth));
    setState({ auth });
    toggle();
  };

  // (window as any).ethereum.on("accountsChanged", async (accounts: any) => {
  //   if (accounts.length > 0) {
  //     // const { accessToken }: any = auth;
  //     // console.log(accessToken);
  //     payload = jwtDecode<JwtDecoded>(accessToken);
  //     // payload.payload.publicAddress = accounts[0];
  //     // setState({ auth: { accessToken: accounts[0] } });
  //     // window.location.reload();
  //     console.log(accounts);
  //   } else {
  //     localStorage.removeItem(LS_KEY);
  //     setState({ auth: undefined });
  //     window.location.reload();
  //   }
  //   // const accessToken: any = auth?.accessToken;

  //   // if (accessToken) {
  //   //   payload.payload.publicAddress = accounts[0];
  //   //   // payload = jwtDecode<JwtDecoded>(accessToken);
  //   // }
  // });

  const showDetails = () => {
    setState({ isActive: !isActive, auth: auth });
    // isActive = !isActive;
  };

  const handleLoggedOut = () => {
    localStorage.removeItem(LS_KEY);
    setState({ auth: undefined });
  };

  const { auth, isActive } = state;
  const { isShown, toggle } = useModal();

  const accessToken: any = auth?.accessToken;
  let payload: any = null;
  if (accessToken) {
    payload = jwtDecode<JwtDecoded>(accessToken);
  }

  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <div className="navigation-header-format">
              {/* <div className="col-lg-3 col-md-3 col-sm-3"></div> */}
              <div className="navigation-section-one">
                <h1>Welcome to Blockchain World</h1>
              </div>
              {/* <div className="col-lg-2 col-md-2 col-sm-2"></div> */}
              <div
                className="navigation-section-two"
                style={{ padding: "20px" }}
                onMouseEnter={showDetails}
              >
                {/* {auth ? null : ( */}
                <React.Fragment>
                  {auth ? (
                    <div className="wallet-format" style={{ height: "100%" }}>
                      <div className="sub-wallet-format">
                        <div className="wallet-icon-format">
                          <img src={wallet} alt="wallet" />
                          {/* {wallet} */}
                        </div>
                        <div className="transaction-format">{`${payload?.payload?.publicAddress?.substring(
                          0,
                          2
                        )} ... ${payload?.payload?.publicAddress?.substring(
                          payload?.payload?.publicAddress?.length - 4,
                          payload?.payload?.publicAddress?.length
                        )}`}</div>
                        <img src={downArrow} alt="downArrow" />
                      </div>
                      <div
                        className={`show-detail-format ${
                          isActive
                            ? `show-detail-format-active`
                            : `show-detail-format-static`
                        }`}
                      >
                        {/* <button
                          className="show-details-button-format show-details-button-first-child"
                          onClick={toggle}
                        >
                          Wallet
                        </button>
                        <button
                          className="show-details-button-format show-details-button-first-child"
                          onClick={toggle}
                        >
                          Transaction
                        </button>
                        <hr
                          style={{
                            borderColor: "rgb(231, 227, 235)",
                            borderStyle: "solid",
                            borderWidth: "1px 0px 0px;",
                            margin: "4px 0px;",
                          }}
                        />
                        <button
                          className="show-details-button-format show-details-button-first-child"
                          onClick={toggle}
                        >
                          NFTs
                        </button> */}
                        <button
                          className="show-details-button-format show-details-button-first-child"
                          onClick={handleLoggedOut}
                        >
                          <div
                            style={{ width: "100%" }}
                            className="disconnect-button-format"
                          >
                            Disconnect
                            <img src={logOut} alt="logOut" />
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // <button
                    //   onClick={handleLoggedOut}
                    //   className="connect-wallet-button-format pushable"
                    // >
                    //   <span className="shadow"></span>
                    //   <span className="edge"></span>
                    //   <span className="front">Log Out</span>
                    // </button>
                    <button
                      onClick={toggle}
                      className="connect-wallet-button-format pushable"
                    >
                      <span className="shadow"></span>
                      <span className="edge"></span>
                      <span className="front">Connect Wallet</span>
                    </button>
                  )}

                  {/* <button onClick={toggle}>Open modal</button> */}
                  <Modal
                    isShown={isShown}
                    hide={toggle}
                    modalContent={
                      <ConnectWalletModal onLoggedIn={handleLoggedIn} />
                    }
                    headerText={"Connect Wallet"}
                  />
                </React.Fragment>
                {/* )} */}
              </div>
            </div>

            {/* <Link to="/home">Home</Link>
              <Link to="/foo">Foo</Link>
              <Link to="/bar">Bar</Link> */}
          </nav>
          <div className="App-intro">
            {auth ? (
              <Profile auth={auth} onLoggedOut={handleLoggedOut} />
            ) : null}
          </div>
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
      </Router>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to Web3 Blockchain Application</h1>
      </header> */}

      {/* <div className="App-intro">
				{auth ? (
					<Profile auth={auth} onLoggedOut={handleLoggedOut} />
				) : (
					<Login onLoggedIn={handleLoggedIn} />
				)}
			</div> */}
    </div>
  );
  //   }
};

export default App;
