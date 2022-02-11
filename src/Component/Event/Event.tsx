// import "./Profile.scss";

import jwtDecode from "jwt-decode";
//akash
import React, { useState, useEffect } from "react";
// import Blockies from "react-blockies";
import { Auth } from "../../Interface/auth-interface";
import SmartContractAPIService from "../../Services/smart-contract-api";

interface State {
  value: string;
}

export const Event = (): JSX.Element => {
  const [state, setState] = useState<State>({
    value: "",
  });

  useEffect(() => {}, []);

  const handleSubmit = async (event: any) => {
    let obj = {
      from: "0x24fef0F61161969054478a765B67C4d017729FB8",
      to: "0x2d8608bD7363a09C8f85ecEe70145419AB2c7Af9",
      value: state.value,
    };
    await SmartContractAPIService.sendTransaction(obj).then((response) =>
      console.log(response)
    );
    // event.preventDefault();
  };

  const handleChange = (event: any) => {
    setState({ value: event.target.value });
  };

  return (
    <div style={{ display: "inline-flex" }}>
      <form>
        <label>
          <input
            className="form-control"
            type="text"
            value={state.value}
            onChange={handleChange}
          />
        </label>
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};
