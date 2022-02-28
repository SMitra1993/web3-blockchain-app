import { FaAngleLeft } from "react-icons/fa";
import "./Event-Transaction.scss";

import React, { useState, useEffect } from "react";
// import Blockies from "react-blockies";
import SmartContractAPIService from "../../Services/smart-contract-api";
import { Link } from "react-router-dom";

interface State {
  value: string;
}

export const EventTransaction = (): JSX.Element => {
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
    <div>
      <br />
      <Link to="/">
        <FaAngleLeft className="icon-format" />
      </Link>
      <div style={{ display: "inline-flex" }}>
        <br />
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
    </div>
  );
};
