import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
// import React, { useState, useEffect, useCallback } from 'react';
import { useState, useEffect } from 'react';

import contractAbi from './contract_abi.json';
const contractAddress = '0x1173f12F8F51d98Bf04Ca8F54fBe0EB252f4ac8a';
const web3_sample = new Web3(Web3.givenProvider || "http://10.234.160.71:7545");
const myContract = new web3_sample.eth.Contract(contractAbi, contractAddress);
// const result = await myContract.methods.generateKeyPair.call();

window.ethereum.enable().then(() => {
  // Metamask is now connected and we have access to the user's accounts
  const accounts = web3_sample.eth.accounts;
  // Do something with the accounts, such as checking the user's balance
  web3_sample.eth.getBalance(accounts[0], (error, balance) => {
    console.log('Balance:', balance);
  });
});




function App() {
  
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState('');
  const [keyPair, setKeyPair] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [addr,setaddr]=useState('');
  const [message, setMessage] = useState("");
  const [revpbk,setrevpbk]= useState('');
  const [revmsg,setrevmsg]=useState("");
  const [sizeofmsg,setsize]=useState(null);
  const [newpbk,setnewpbk] = useState('');
  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (e) {
          console.error(e);
        }
      }
    }
    init();
  }, []);
  async function getKey() {
    if (!web3) {
      console.error("Web3 not initialized");
      return;
    }
    try {
      const result = await myContract.methods.getPublicKeys(account).call({ from: account });
      // console.log("Result:", result);
      setKeyPair(result);
      // console.log(typeof(account);
      // return result;
    } catch (e) {
      console.error(e);
    }
  }
  async function searchKey(){
    if(!addr){
      console.error("please input the correct target address.")
      return;
    }
    try{
      const result = await myContract.methods.getPublicKeys(addr).call({from:account});
      setrevpbk(result);
    }catch(e){
      console.error(e);
    }
  }
  async function sendMessage() {
    if (!account || !recipient || !message) {
      console.error('Please input all fields.');
      return;
    }
    try {
      const tx = await myContract.methods.sendMessage(recipient, message).send({ from: account });
      //console.log(recipient,account)
      console.log(typeof(recipient))
      console.log('Transaction:', tx);
    } catch (e) {
      console.error(e);
    }
  }
  const openLink = () => {
    window.open('https://www.gpg4win.org/index.html');
  };
  async function getMessage(){
    try {
      const tx= await myContract.methods.getCMessage().call({from:account});

      const reversedTx = tx[1].slice().reverse();
      setrevmsg(reversedTx);
      setsize(tx[0]);
      console.log(tx[1]);

    }catch(e){
      console.error(e);
    }
  }
  async function setkey(){
    try{
      myContract.methods.bindPublicKey(newpbk).send({from:account});
    }catch(e){
      console.error(e);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <p>Your account: {account}</p>
        {/* <p>Your Public Key:{web3_sample.et}</p> */}
        <p>Before using this contract to send Encrypted information and binding your PublicKey with your wallet addres,you have to download a PGP application just by clicking the button below.</p>
        <div>
          <button onClick={openLink}>Download</button>
        </div>
        <button onClick={getKey}>Display My PublicKey</button>
        {keyPair && (
          <div>
            <textarea className="keypair-textbox" value={keyPair} readOnly />

            {/* <input type="text" value={keyPair} readOnly /> */}
            {/* <p>Private Key: {keyPair[1]}</p> */}
          </div>
        )}

        <p>If you want to update or initialize your publickeys,please input your key file and click the button below</p>
        <div>
          <label>Your New PublicKey:</label>
          <input type="text" value={newpbk} onChange={(e) => setnewpbk(e.target.value)} />
          <button onClick={setkey}>Set</button>
        </div>
        <p>If you want to search publickeys owned by others,please input the target address in the text area and click the button.</p>
        

        <div>
          <label>Address:</label>
          <input type="text" value={addr} onChange={(e) => setaddr(e.target.value)} />
        </div>
        <div>
          <button onClick={searchKey}>Search</button>
          {revpbk && (
          <div>
            <textarea className="keypair-textbox" value={revpbk} readOnly />

            {/* <input type="text" value={keyPair} readOnly /> */}
            {/* <p>Private Key: {keyPair[1]}</p> */}
          </div>
        )}
        </div>
        <div>
          <label>Recipient:</label>
          <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </div>
        <div>
          <label>Message:</label>
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <button onClick={sendMessage}>SendMessage</button>
        <button onClick={getMessage}>GetMessage</button>
        {<p>数据条数: {sizeofmsg}</p>}
        {revmsg && (
          <div>
            {/* <textarea className="keypair-textbox" value={revmsg} readOnly /> */}
            <table>
              <thead>
                <tr>
                  <th>内容</th>
                  <th>发送者钱包地址</th>
                </tr>
              </thead>
              <tbody>
                {revmsg.map((item, index) => (
                  <tr key={index}>
                    <td> <textarea value={item[0]} readOnly /></td>
                    <td> <textarea value={item[1]} readOnly /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        )}

      </header>
  </div>
  );
}


export default App;
