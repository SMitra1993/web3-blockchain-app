import "./Profile.scss";

import jwtDecode from "jwt-decode";
//akash
import React, { useState, useEffect } from "react";
// import Blockies from "react-blockies";
import { Auth } from "../../Interface/auth-interface";
import SmartContractAPIService from "../../Services/smart-contract-api";
import { Event } from "../Event/Event";
import { Route, Routes } from "react-router-dom";
import Home from "../Home/Home";
import { EventTransaction } from "../Event-Transaction/Event-Transaction";

interface Props {
  auth: Auth;
  onLoggedOut: () => void;
}

interface State {
  loading: boolean;
  user?: {
    id: number;
    username: string;
  };
  username: string;
}

interface JwtDecoded {
  payload: {
    id: string;
    publicAddress: string;
  };
}

export const Profile = ({ auth, onLoggedOut }: Props): JSX.Element => {
  const [state, setState] = useState<State>({
    loading: false,
    user: undefined,
    username: "",
  });

  useEffect(() => {
    const { accessToken }: any = auth;
    const {
      payload: { id },
    } = jwtDecode<JwtDecoded>(accessToken);

    fetch(`http://localhost:8006/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((user) => setState({ ...state, user }))
      .catch(window.alert);
  }, []);

  const { accessToken }: any = auth;

  const {
    payload: { publicAddress },
  } = jwtDecode<JwtDecoded>(accessToken);

  const { loading, user } = state;

  const username = user && user.username;
  console.log(user);

  const handleSignup = async (publicAddress: string) =>
    await SmartContractAPIService.sendTransaction(publicAddress).then(
      (response) => response
    );

  return (
    <div style={{ display: "contents" }}>
      <div className="profile-information-box-format">
        <div className="profile-infromation-format">
          {/* <p>Logged in as {publicAddress}</p> */}
          {/* My username is {username ? <pre>{username}</pre> : "not set."} My */}
          <h2>
            Connected to{" "}
            {`${publicAddress.substring(0, 2)} ... ${publicAddress.substring(
              publicAddress.length - 4,
              publicAddress.length
            )}`}
          </h2>
        </div>
      </div>
      <Routes>
        <Route path="/">
          <Route index element={<Event />} />
          <Route path="/eventTransaction" element={<EventTransaction />} />
        </Route>
      </Routes>
    </div>
  );
};
