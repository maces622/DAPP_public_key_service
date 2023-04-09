// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract AsymmetricEncryption {
    
    struct KeyPair {
        string publicKey;//公钥
        bool active;//是否生成了公钥
    }
    //单条信息的存储
    struct message_temp{
        string content;//密文内容
        address sender;//信息发送者的地址
    }
    
    struct messageDB{
        uint size_of_msg;//该接受者总接收的信息数量
        message_temp[] message;//每一条信息
    }

    //event可以先不看，是我调试的时候使用的.
    event showKP(bytes32 a, bytes32 b);
    event showpair(bytes x);
    event showmsg(string message);
    event showbt(bytes1 x);


    mapping(address => KeyPair) public keyPairs;//通过地址映射公钥
    // mapping(address => bytes) public messages;
    mapping(address => messageDB) public messageS;//接收信息的映射
    // mapping(address => int ) message
    
    function getCMessage() public view returns (messageDB memory) {
        //取出密文
        return  messageS[msg.sender];
    }
    

    function bindPublicKey(string memory publicKey) public {
        keyPairs[msg.sender]=KeyPair(publicKey, true);
        //emit showpair(keyPairs[msg.sender][0].publicKey);
    }
    function getPublicKeys(address requ) public  view  returns (string memory  ) {
        string memory pbk= keyPairs[requ].publicKey;
        return pbk;
    }


    //bytes32->bytes
    function toBytes(bytes32 x) public pure returns (bytes memory b) {
        b = new bytes(32);
        assembly { mstore(add(b, 32), x) }
    }

    event MessageSent(address receiver,bytes message);
    //信息发送
    //sender是发送者地址、recipient是接受者地址、cont是密文内容
    function sendMessage(address recipient, string memory message) public {
        //信息数量++
        messageS[recipient].size_of_msg=messageS[recipient].size_of_msg+1;
        //存入新的信息
        messageS[recipient].message.push(message_temp(message,msg.sender));
    }


    function test() public
    {
        sendMessage(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4,"hello");
    }

}
