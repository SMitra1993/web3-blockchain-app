import "./Event.scss";

import jwtDecode from "jwt-decode";
//akash
import React, { useState, useEffect } from "react";
// import Blockies from "react-blockies";
import { Auth } from "../../Interface/auth-interface";
import SmartContractAPIService from "../../Services/smart-contract-api";
import PakImage from "../../Assets/Images/Country/PAK.png";
import IndImage from "../../Assets/Images/Country/IND.png";
import eventBanner from "../../Assets/Images/eventBanner.png";
import { countryListConstants } from "../../Constants/country-list";
import { Link, Route, Routes } from "react-router-dom";
import { EventTransaction } from "../Event-Transaction/Event-Transaction";

interface State {
  value: string;
}

export const Event = (): JSX.Element => {
  const [state, setState] = useState<State>({
    value: "",
  });

  useEffect(() => {}, []);

  return (
    <div style={{ display: "inline-flex" }}>
      <br />
      <Link to="/eventTransaction">
        <div className="flip-box">
          <div className="flip-box-inner">
            <div className="flip-box-front">
              <img
                src={eventBanner}
                className="Event-Banner"
                alt="event-banner"
              />
              <div className="text-block">
                <p>Welcome to the event</p>
              </div>
            </div>
            <div className="flip-box-back">
              <img
                src={eventBanner}
                className="Event-Banner"
                alt="event-banner"
              />
              {/* <div className="country-A-flag-block"> */}
              <img
                src={IndImage}
                className="country-A-flag-block"
                alt="Team-A"
              />
              {/* </div> */}
              <div className="country-A-text-block">
                <p>{countryListConstants.IND}</p>
              </div>
              <div className="text-block">
                <p>Vs</p>
              </div>
              {/* <div className="country-B-flag-block"> */}
              <img
                src={PakImage}
                className="country-B-flag-block"
                alt="Team-B"
              />
              {/* </div> */}
              <div className="country-B-text-block">
                <p>{countryListConstants.PAK}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
