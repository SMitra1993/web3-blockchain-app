import axios from "axios";
import { httpResponseConstants } from "../Constants/http-response-constants";
// Create instance called instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "content-type": "application/octet-stream",
  },
});

export default class APIService {
  static async getCurrentUser(publicAddress: string) {
    return await instance
      .get(`/users?publicAddress=${publicAddress}`)
      .then((res) => {
        if (res?.status === httpResponseConstants.successCode) {
          return res.data;
        }
      });
  }

  static async signUpUser(publicAddress: string) {
    return await instance
      .post(`/users`, JSON.stringify({ publicAddress }))
      .then((res) => {
        if (res?.status === httpResponseConstants.successCode) {
          return res.data;
        }
      });
  }

  static async authenticateUser(publicAddress: string, signature: string) {
    return fetch(`http://localhost:8006/api/auth`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((res: any) => {
      if (res?.status === httpResponseConstants.successCode) {
        return res;
      }
    });
    // return await instance
    //   .post(`/auth`, JSON.stringify({ signature, publicAddress }))
    //   .then((res) => {
    //     if (res?.status === httpResponseConstants.successCode) {
    //       return res.data;
    //     }
    //   });
  }
}
