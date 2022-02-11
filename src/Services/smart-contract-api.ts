import Web3 from "web3";

const baseURL = "HTTP://127.0.0.1:7545";
let web3 = new Web3(new Web3.providers.HttpProvider(baseURL));
export default class SmartContractAPIService {
  static async sendTransaction(obj: any) {
    return await web3.eth
      .sendTransaction({
        from: obj.from,
        to: obj.to,
        value: web3.utils.toWei(obj.value, "ether"),
      })
      .then((res) => {
        if (res?.status) {
          return res;
        }
      });
  }
}
