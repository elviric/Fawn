window.addEventListener('load', function() {

// Checking if Web3 has been injected by the browser (Mist/MetaMask)
if (typeof web3 !== 'undefined') {
// Use Mist/MetaMask's provider
web3 = new Web3(web3.currentProvider);
} else {
console.log('No web3? You should consider trying MetaMask!')
// fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
var account = web3.eth.accounts[0];
var accountInterval = setInterval(function() {
if (web3.eth.accounts[0] !== account) {
account = web3.eth.accounts[0];
console.log(account);
updateInterface(account);


}
}, 100);
// Now you can start your app & access web3 freely:
startApp();
});


function startApp(){
web3.version.getNetwork((err, netId) => {
  if(netId != 42){
    alert('Switch to Kovan Network');
    $('#bid').hide();
    
  }
});


initContract();
updateInterface(web3.eth.accounts[0]);
}
function updateInterface(address){
    var icon = document.getElementById('EthAddicon');
    icon.style.backgroundImage = 'url(' + blockies.create({ seed:address ,size: 8,scale: 16}).toDataURL()+')'
    const aEthAdd = document.getElementById('EthAdd');
    aEthAdd.innerText = address;
    aEthAdd.href = 'https://etherscan.io/address/'+address;
  }
function initContract(){
  //Constant variables
  let tA, tB, totalBet, cA, cB, matchData,betState,didIWin;
  let bStatus = ['LIVE','CLOSED'];


  //init Contract
  const contractABI =[{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"biddersInfo","outputs":[{"name":"amountBet","type":"uint256"},{"name":"teamSelected","type":"uint256"},{"name":"betPlaced","type":"bool"},{"name":"withDrew","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"maximumBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_winner","type":"uint256"}],"name":"setMatchResult","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"didIBid","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"iniMatch","outputs":[{"name":"matchId","type":"bytes32"},{"name":"matchEndTime","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalTeamBBets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"betStatus","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"level","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"didIWin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalTeamABets","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_team","type":"uint256"}],"name":"bidderBet","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"countTeamA","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minimumBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"countTeamB","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalBet","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
  const contractAddress = '0x487417555d2b4f2dd44583c93355ed070ebe39d0';

  const contractInstance = web3.eth.contract(contractABI).at(contractAddress);
  console.log(contractInstance);

  contractInstance.totalTeamABets(function(error,result){
    if(!error){ tA=web3.fromWei(result,'ether');

    }
    else console.log(error);});
  contractInstance.totalTeamBBets(function(error,result){
      if(!error){tB=web3.fromWei(result,'ether');
      //$('#ctb')[0].textContent = "B : "+tB+"Ξ";
    }
      else console.log(error);});
      //Get bid status:
  contractInstance.betStatus(function(error,result){
          if(!error){ betState = result;

          }
          else console.log(error);});

  contractInstance.totalBet(function(error,result){
      if(!error){ //$('#Total')[0].textContent = "T(A+B)="+web3.fromWei(result,'ether');
      totalBet = web3.fromWei(result,'ether');
    }
      else console.log(error);});

  contractInstance.didIWin(function(error,result){
      if(!error){
      didIWin = result;
      }
      else console.log(error);});
  contractInstance.countTeamA(function(error,result){
      if(!error){ cA = result;}
      else console.log(error);});
  contractInstance.countTeamB(function(error,result){
      if(!error){cB = result;}
      else console.log(error);});
  //get Match details
  contractInstance.iniMatch(function(error,result){
      if(!error){matchData = result;

      }
      else console.log(error);});

  //biddersInfo
  //Compute possible payout
  function teamAPayout(amt){
    var pout =  amt + (amt/(parseFloat(tA)+amt))*parseFloat(tB);
    $('#proPay')[0].innerText = pout.toFixed(4) +'Ξ';
    $('.payInfo').show();
    console.log(pout);
  }
  function teamBPayout(amt){
    var pout =  amt + (amt/(parseFloat(tB)+amt))*parseFloat(tA);
    $('#proPay')[0].innerText = pout.toFixed(4) +'Ξ';
    $('.payInfo').show();
    console.log(pout);
  }
  document.getElementById("amt").addEventListener("change",function(e){
    //console.log(this.value);
    var team = $('input[name=pickTeam]:checked').val();
    var amt = parseFloat(this.value);

    if(team == 0) {
      teamAPayout(amt);
    }else if(team == 1){
      teamBPayout(amt);
    }else{
      $('.payInfo').hide();
    }
  });
  //Bid function
  var txnHash;
  document.getElementById("bid").addEventListener("click", function(){
      var ethAmount = $('input[name=bidAmount]').val();
      var team = $('input[name=pickTeam]:checked').val();

      console.log(ethAmount+' '+team);
      if(ethAmount >= 0.1 && ethAmount <= 1 && (team == 0 || team == 1)){
        var bidAmt = web3.toWei(ethAmount, 'ether');
        contractInstance.bidderBet(team,{from: web3.eth.accounts[0], gas: 3000000, value: bidAmt}, function(error,result){
          if(!error){
            console.log(result);
            txnHash = result;


            $('#bid').hide();
            $('.txn').show();
            $('.loading').show();
            $('.txnHash')[0].href ="https://kovan.etherscan.io/tx/"+txnHash;
            //start checkTxnReceipt
            checkTxnBidReceipt(txnHash);
            //End checkTxnReceipt

          }else{
            console.log(error);
          }
        });
      }

      });
  //withdraw
  document.getElementById("wdraw").addEventListener("click", function(){


        contractInstance.withdraw({gas: 300000, value: 0},function(error,result){
          if(!error){
            console.log(result);
            txnHash = result;

            $('#bid').hide();
            $('.txn').show();
            $('.loading').show();
            $('.txnHash')[0].href ="https://kovan.etherscan.io/tx/"+txnHash;

            //var status = checkTxnReceipt(txnHash);
            //start checkTxnReceipt
            checkTxnWDReceipt(txnHash);
            //End checkTxnReceipt

          }else{

            console.log(error);
          }
        });


      });
  // Check WD Txn Receipt

  function checkTxnWDReceipt(txn){

    web3.eth.getTransactionReceipt(txnHash,function(error,result){
         console.info(result);

         if(!error){
           console.log(result);
           if(result !== null && typeof result === 'object'){
             status = result.status;
             if(status !== '0x0'){
               txnSuccess();
               bidderData();
               notifySuccess();
             }else{notifyFail();}
             clearInterval(txn);
           }else{
             var sT = setTimeout(function(){

             checkTxnWDReceipt(txn);

           }, 2000);
           }
         }else console.log(error);
       });

}
//Check Bid Txn
  function checkTxnBidReceipt(txn){


    web3.eth.getTransactionReceipt(txnHash,function(error,result){
         console.info(result);

         if(!error){
           console.log(result);
           if(result !== null && typeof result === 'object'){
             status = result.status;
             if(status !== '0x0'){
               txnSuccess();
               bidderData();
               notifySuccess();
             }else{notifyFail(); resetBook();}
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
  //hex2str
  function updateFrame(){
    console.log('frame');
    $('#cta')[0].textContent = "A : "+tA+"Ξ";
    $('#ctb')[0].textContent = "B : "+tB+"Ξ";
    //console.log(hex2str(matchData[0])+' '+matchData[1].toNumber());
    $('#Mid')[0].textContent = hex2str(matchData[0]);
    $('#teamA-txt')[0].textContent = hex2str(matchData[0]).substring(3).split('v')[0];
    $('#teamB-txt')[0].textContent = hex2str(matchData[0]).substring(3).split('v')[1];
    console.log(betState.toNumber());
    $('#bidStatus')[0].textContent = "BID: "+bStatus[betState.toNumber()];


    counterTime();

  }
  function counterTime(){
    var time = matchData[1].toNumber();
    var d = new Date();

    var count=setInterval(function(){
      nowEpoc = (d.getTime()-d.getMilliseconds())/1000
      timestamp = time - nowEpoc;
      if(timestamp > 0){


       $('#lockTime')[0].textContent = SecondsTohhmmss(timestamp);
       d = new Date();
      }else{
       $('#lockTime')[0].textContent = "00:00:00";
       clearInterval(count);
       $('#bidStatus')[0].textContent = "BID: "+bStatus[1];
     }},5000);

  }
  function SecondsTohhmmss(totalSeconds) {
  var hours   = Math.floor(totalSeconds / 3600);
  var minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  var seconds = totalSeconds - (hours * 3600) - (minutes * 60);

  // round seconds
  seconds = Math.round(seconds * 100) / 100

  var result = (hours < 10 ? "0" + hours : hours);
      result += ":" + (minutes < 10 ? "0" + minutes : minutes);
      result += ":" + (seconds  < 10 ? "0" + seconds : seconds);
  return result;
}
  function hex2str(str1){
	var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
  }

  function bidderData() {
    //console.log(accounts);
    accounts = web3.eth.accounts[0];
    console.log(web3.eth.accounts[0]+' ok');
    contractInstance.biddersInfo(accounts,function(error,result){
      var T = ["Team A", "Team B"];
      if(!error){
        var boolBid = result[2];
        console.log(boolBid);
        var boolWD = result[3];
        var bidETH = web3.fromWei(result[0].toNumber(),'ether');
        var team = result[1].toNumber();
        if(boolWD){
          $('.withdraw').hide();
        }
        if( boolBid ){
        $('#bookRept')[0].innerText="Bet Slip";
        if (team == 0 || team == 1){ $('#selectedTeam')[0].innerText = hex2str(matchData[0]).substring(3).split('v')[team];
        //if(team == 0) teamAPayout(parseFloat(bidETH));
        //else teamBPayout(parseFloat(bidETH));
        if(betState.toNumber()){
          if(didIWin){ console.log(didIWin+'<--didIWin'); $('#whoWon')[0].textContent = "You WON!"; $('.withdraw').show();}
          else $('#whoWon')[0].textContent = "You Lost! :/";

        }
      }
        $('#amtBet')[0].innerText = bidETH+"Ξ";
        txnSuccess();
      }else if(betState.toNumber()){
         $('#bookRept')[0].innerText="Bidding closed";
         $('.default').hide();
         $('#bid').hide();}


      }
      else console.log(error);});

    }
    setTimeout(function(){
       bidderData();
       console.log('??');
       updateFrame();


     }, 5000);


}
