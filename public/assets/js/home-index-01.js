window.addEventListener('load', function() {
var account;
let path;
// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
// Use Mist/MetaMask's provider
web3 = new Web3(web3.currentProvider);
account = web3.eth.accounts[0];
//path = "/main/index.html";
} else {
console.log('No web3? You should consider trying MetaMask!');
//path = "/app/index.html";
// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/qEAHzug5r6MNM4dPN0N9"));
}

// Now you can start your app & access web3 freely:

startApp();
});


function startApp(){
web3.version.getNetwork((err, netId) => {
  if(netId != 42){
  }
});
$("#createList").click(function(){
window.location.href = location+"register/index.html";

});
$("#joinIFoO").click(function(){
window.location.href = location+"ifoo/index.html";

});


//initContract();
//updateInterface(web3.eth.accounts[0]);
}
