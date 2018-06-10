window.addEventListener('load', function() {
let account;
// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
// Use Mist/MetaMask's provider
web3 = new Web3(web3.currentProvider);
account = web3.eth.accounts[0];
} else {
console.log('No web3? You should consider trying MetaMask!');

// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/qEAHzug5r6MNM4dPN0N9"));
}

var accountInterval = setInterval(function() {
if (web3.eth.accounts[0] !== account) {
account = web3.eth.accounts[0];
console.log(account);
//updateInterface(account);


}
}, 100);
// Now you can start your app & access web3 freely:
let conAdd = "0xa1c20ba6a6e57669e454f3dce1e9d806b05f9eaf";
let conABI = [{"constant":true,"inputs":[],"name":"numTkn","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"createdProducts","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"valuePerTKN","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"buyProduct","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_numOfPart","type":"uint256"},{"name":"_valuePerTKN","type":"uint256"}],"name":"createProduct","outputs":[{"name":"","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"productsByCreator","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
startApp(conAdd,conABI);
});


function startApp(a,b){
web3.version.getNetwork((err, netId) => {
  if(netId != 42){
    alert('Switch to Kovan Network');
    $('#meta').hide();
    //$('#no-meta').show();
  }
});

initContract(a,b);
}

function initContract(cAdd,cABI){
  //Constant variables


  const contractAddress = cAdd;
  console.log(contractAddress);
  const contractABI = cABI;

  const contractInstance = web3.eth.contract(contractABI).at(contractAddress);
  console.log(contractInstance);




  //Bid function
  var txnHash;

  //withdraw
  // Check WD Txn Receipt
  document.getElementById("Buy").addEventListener("click", function(){
      var TKNnum = $('input[name=TokenNum]').val();
    //  var t_value = $('input[name=tokenValue]').val();
      console.log(TKNnum+ ' ');

      if(TKNnum > 0 ){
        var fee_value = web3.toWei(0.01, 'ether');
        contractInstance.buyProduct(TKNnum,{from: web3.eth.accounts[0], gas: 3000000, value: fee_value}, function(error,result){
          if(!error){
            console.log(result);
            txnHash = result;


            //$('#bid').hide();
            //$('.txn').show();
            //$('.loading').show();
            //$('.txnHash')[0].href ="https://kovan.etherscan.io/tx/"+txnHash;
            //start checkTxnReceipt
            checkTxnBidReceipt(txnHash);
            //End checkTxnReceipt

          }else{
            console.log(error);
          }
        });
      }

      });
//Check Bid Txn
  function checkTxnBidReceipt(txn){


    web3.eth.getTransactionReceipt(txnHash,function(error,result){
         console.info(result);

         if(!error){
           console.log(result);
           if(result !== null && typeof result === 'object'){
             status = result.status;
             if(status !== '0x0'){

               notifySuccess();
             }else{notifyFail();}
             clearInterval(txn);
           }else{
             var sT = setTimeout(function(){

             checkTxnBidReceipt(txn);

           }, 2000);
           }
         }else console.log(error);
       });

}

  //notifySuccess
  function notifySuccess(){

    $('#infoSuccess').show();
    setTimeout(function(){
       $('#infoSuccess').hide();
     }, 5000);

  }
  //notifyFail
  function notifyFail(){

    $('#infoError').show();
    setTimeout(function(){
       $('#infoError').hide();
     }, 5000);

  }
  //reset book
  function resetBook(){
    $('.default').show();
    $('#bid').show();
    $('.txn').hide();
    $('.loading').hide();
    $('.betPlaced').hide();
  }
  //withdraw
  function txnSuccess(){
    $('.default').hide();
    $('#bid').hide();
    //$('.payInfo').show();
    $('.loading').hide();
    $('.betPlaced').show();

  }


}
