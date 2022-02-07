import React, { FunctionComponent, useEffect, useState } from "react";
import { ConfirmationModalProps } from "../../../Interface/confirm-modal-props";
import { Message } from "./connect-wallet-modal-style";
import metmaskLogo from "../../../Assets/Images/metamask.png";
import "./connect-wallet-modal.css";
import Web3 from "web3";
import { Auth } from "../../../Interface/auth-interface";
import APIService from "../../../Services/api-service";
import { State } from "../../../Interface/state-interface";

const LS_KEY = "login-with-metamask:auth";

interface Props {
  onLoggedIn: (auth: Auth) => void;
}

let web3: Web3 | undefined = undefined;
export const ConnectWalletModal = ({ onLoggedIn }: Props): JSX.Element => {
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState<State>();

  useEffect(() => {});

  const handleClick = async () => {
    // Check if MetaMask is installed
    if (!(window as any).ethereum) {
      window.alert("Please install MetaMask first.");
      return;
    }

    if (!web3) {
      try {
        // Request account access if needed
        await (window as any).ethereum.enable();

        // We don"t know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        web3 = new Web3((window as any).ethereum);

        // const provider = new Web3.providers.HttpProvider(
        // 	`https://rpcapi.fantom.network/`
        // );
        // web3 = new Web3(provider);
        // web3 = new Web3(`https://rpc.fantom.network/`);
      } catch (error) {
        window.alert("You need to allow MetaMask.");
        return;
      }
    }

    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert("Please activate MetaMask first.");
      return;
    }

    const publicAddress = coinbase.toLowerCase();
    setLoading(true);
    // const blockNumber = await web3.eth.getBlockNumber();
    // const balance = await web3.eth.getBalance(publicAddress, blockNumber);
    // console.log(balance);
    // Look if user with current publicAddress is already present on backend
    await APIService.getCurrentUser(publicAddress)
      .then((response) => response)
      // If yes, retrieve it. If no, create it.
      .then((users) => (users.length ? users[0] : handleSignup(publicAddress)))
      // Popup MetaMask confirmation modal to sign message
      .then(handleSignMessage)
      // Send signature to backend on the /auth route
      .then(handleAuthenticate)
      // Pass accessToken back to parent component (to save it in localStorage)
      .then(onLoggedIn)
      // .then(changeNetwork)
      .catch((err) => {
        window.alert(err);
        setLoading(false);
      });
  };

  const handleSignup = async (publicAddress: string) =>
    await APIService.signUpUser(publicAddress).then((response) => response);

  const handleSignMessage = async ({
    publicAddress,
    nonce,
  }: {
    publicAddress: string;
    nonce: string;
  }) => {
    let signature: any = null;
    try {
      await web3!.eth.personal
        .sign(
          `I am signing my one-time nonce: ${nonce}`,
          publicAddress,
          "" // MetaMask will ignore the password argument here
        )
        .then((res) => {
          if (res) {
            signature = res;
          }

          return { publicAddress, signature };
        });
      return { publicAddress, signature };
    } catch (err) {
      throw new Error("You need to sign the message to be able to log in.");
    }
  };

  const handleAuthenticate = async ({
    publicAddress,
    signature,
  }: {
    publicAddress: string;
    signature: string;
  }) =>
    await APIService.authenticateUser(publicAddress, signature).then(
      async (response) => {
        if (response) {
          await changeNetwork();
          return response.json();
        }
      }
    );

  // const handleClick = async () => {
  //   // Check if MetaMask is installed
  //   if (!(window as any).ethereum) {
  //     window.alert("Please install MetaMask first.");
  //     return;
  //   }

  //   if (!web3) {
  //     try {
  //       // Request account access if needed
  //       await (window as any).ethereum.enable();

  //       // We don"t know window.web3 version, so we use our own instance of Web3
  //       // with the injected provider given by MetaMask
  //       web3 = new Web3((window as any).ethereum);

  //       // const provider = new Web3.providers.HttpProvider(
  //       // 	`https://rpcapi.fantom.network/`
  //       // );
  //       // web3 = new Web3(provider);
  //       // web3 = new Web3(`https://rpc.fantom.network/`);
  //     } catch (error) {
  //       window.alert("You need to allow MetaMask.");
  //       return;
  //     }
  //   }

  //   const coinbase = await web3.eth.getCoinbase();
  //   if (!coinbase) {
  //     window.alert("Please activate MetaMask first.");
  //     return;
  //   }

  //   const publicAddress = coinbase.toLowerCase();
  //   setLoading(true);
  //   const blockNumber = await web3.eth.getBlockNumber();
  //   const balance = await web3.eth.getBalance(publicAddress, blockNumber);
  //   console.log(balance);
  //   await APIService.getCurrentUser(publicAddress).then(async (data: any) => {
  //     try {
  //       if (data?.length === 0) {
  //         // console.log(data);
  //         setTimeout(async () => {
  //           await APIService.signUpUser(publicAddress).then(
  //             async (data: any) => {
  //               if (data?.length > 0) {
  //                 try {
  //                   await web3!.eth.personal
  //                     .sign(
  //                       `I am signing my one-time nonce: ${data[0].nonce}`,
  //                       data[0].publicAddress,
  //                       "" // MetaMask will ignore the password argument here
  //                     )
  //                     .then(async (signature) => {
  //                       if (signature) {
  //                         await APIService.authenticateUser(
  //                           data[0].publicAddress,
  //                           signature
  //                         )
  //                           .then(async (response: any) => {
  //                             if (response) {
  //                               await changeNetwork();
  //                               console.log(response);
  //                               setLoading(false);
  //                               onLoggedIn(response);
  //                               return response;
  //                             }
  //                           })
  //                           // .then(onLoggedIn)
  //                           .catch((err) => {
  //                             window.alert(err);
  //                             setLoading(false);
  //                           });
  //                         // return { publicAddress, signature };
  //                       }
  //                     });
  //                 } catch (error) {
  //                   throw new Error(
  //                     "You need to sign the message to be able to log in."
  //                   );
  //                 }
  //               }
  //             }
  //           );
  //         }, 1000);
  //       } else {
  //         setTimeout(async () => {
  //           try {
  //             await web3!.eth.personal
  //               .sign(
  //                 `I am signing my one-time nonce: ${data[0].nonce}`,
  //                 data[0].publicAddress,
  //                 "" // MetaMask will ignore the password argument here
  //               )
  //               .then(async (signature) => {
  //                 if (signature) {
  //                   await APIService.authenticateUser(
  //                     data[0].publicAddress,
  //                     signature
  //                   )
  //                     .then(async (response: any) => {
  //                       if (response) {
  //                         setTimeout(async () => {
  //                           await changeNetwork();
  //                           setLoading(false);
  //                           onLoggedIn(response);
  //                           return response;
  //                         }, 200);
  //                       }
  //                     })
  //                     // .then(onLoggedIn)
  //                     .catch((err) => {
  //                       window.alert(err);
  //                       setLoading(false);
  //                     });
  //                 }
  //               });
  //           } catch (error) {
  //             throw new Error(
  //               "You need to sign the message to be able to log in."
  //             );
  //           }
  //         }, 1000);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // };

  const changeNetwork = async (): Promise<void> => {
    const chainId = web3?.utils.toHex("250");
    try {
      if (!(window as any).ethereum) throw new Error("No crypto wallet found");

      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainId }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum
            .request({
              id: 1,
              jsonrpc: "2.0",
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainId,
                  chainName: `Fantom Opera`,
                  nativeCurrency: {
                    name: `Fantom`,
                    symbol: `FTM`,
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc.ftm.tools/"],
                  blockExplorerUrls: ["https://ftmscan.com/"],
                },
              ],
            })
            .then((result: any) => {
              if (result) {
                console.log(result);
              }
              // The result varies by RPC method.
              // For example, this method will return a transaction hash hexadecimal string on success.
            })
            .catch((error: any) => {
              throw new Error("Internet issue");
              // If the request fails, the Promise will reject with an error.
            });
        } catch (addError) {
          console.log(addError);
        }
      }
    }
  };

  (window as any).ethereum.on("disconnect", async () => {
    localStorage.removeItem(LS_KEY);
    setState({ auth: undefined });
    window.location.reload();
  });

  (window as any).ethereum.on("chainChanged", async (chainId: string) => {
    if (isNaN(+chainId)) {
      if (chainId !== "250") {
        localStorage.removeItem(LS_KEY);
        setState({ auth: undefined });
        window.location.reload();
      }
    } else {
      if (web3?.utils.toHex("250") !== chainId) {
        localStorage.removeItem(LS_KEY);
        setState({ auth: undefined });
        window.location.reload();
      }
    }
  });

  useEffect(() => {
    // Access token is stored in localstorage
    let el: any = document.getElementById("tilt");
    const height = el.clientHeight;
    const width = el.clientWidth;
    const handleMove = (e: any) => {
      /*
       * Get position of mouse cursor
       * With respect to the element
       * On mouseover
       */
      /* Store the x position */
      const xVal = 80;
      /* Store the y position */
      const yVal = 80;
      /*
       * Calculate rotation valuee along the Y-axis
       * Here the multiplier 20 is to
       * Control the rotation
       * You can change the value and see the results
       */
      const yRotation = 20 * ((xVal - width / 2) / width);

      /* Calculate the rotation along the X-axis */
      const xRotation = -20 * ((yVal - height / 2) / height);

      /* Generate string for CSS transform property */
      const string =
        "perspective(500px) scale(1.1) rotateX(" +
        xRotation +
        "deg) rotateY(" +
        yRotation +
        "deg)";

      /* Apply the calculated transformation */
      el.style.transform = string;
    };

    /* Add listener for mouseout event, remove the rotation */
    el.addEventListener("mouseout", function () {
      el.style.transform = "perspective(500px) scale(1) rotateX(0) rotateY(0)";
    });

    /* Add listener for mousedown event, to simulate click */
    el.addEventListener("mousedown", function () {
      el.style.transform =
        "perspective(500px) scale(0.9) rotateX(0) rotateY(0)";
    });

    /* Add listener for mouseup, simulate release of mouse click */
    el.addEventListener("mouseup", function () {
      el.style.transform =
        "perspective(500px) scale(1.1) rotateX(0) rotateY(0)";
    });

    el.addEventListener("mousemove", handleMove);
  }, []);

  return (
    <React.Fragment>
      <div onClick={handleClick}>
        {/* <Message> */}
        <img
          src={metmaskLogo}
          id="tilt"
          className="Connect-Wallet-logo"
          alt="metamask-logo"
        />
        {/* {props.message} */}
        {/* </Message> */}
        <br />
        {/* {loading ? "Loading..." : ""} */}
      </div>
    </React.Fragment>
  );
};
