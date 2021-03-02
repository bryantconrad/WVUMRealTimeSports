$(document).ready(function(){

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBBRbDBUBO_eDzpnMKgf8JtK1S1_76zlmw",
    authDomain: "wvum-real-time-sports.firebaseapp.com",
    databaseURL: "https://wvum-real-time-sports.firebaseio.com",
    projectId: "wvum-real-time-sports",
    storageBucket: "",
    messagingSenderId: "560038150781"
  };
firebase.initializeApp(config);

var dbActive = firebase.database().ref('active');

// Show active game info on page
dbActive.once('value').then(function(snapshot){
  currentOpponent = snapshot.child("team").val();
  umScore = snapshot.child("umScore").val();
  opponentScore = snapshot.child("opponentScore").val();
  isHome = snapshot.child("home").val();
  isActive = snapshot.child("isActive").val();
  logoCode = snapshot.child("code").val();

  if (isActive == true){
    if (isHome == "true"){
      $("#homeDisplay").html("vs");  
    } else {
      $("#homeDisplay").html("@");
    }

    $(".sportsinfo").show();
    $("#umLogo").attr("src", "https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png");
    $("#umScoreDisplay").html("UM" + "<br>" + umScore);
    $("#opponentLogo").attr("src", "https://a.espncdn.com/i/teamlogos/ncaa/500/" + logoCode + ".png");
    $("#opponentScoreDisplay").html(currentOpponent + "<br>" + opponentScore);
  }
})

// ------ Events when active game values change ------
dbActive.on('value', (snapshot) => {

  const isActive = snapshot.child("isActive").val();
  const currentOpponentActive = snapshot.child("team").val();
  const umScoreActive = snapshot.child("umScore").val();
  const opponentScoreActive = snapshot.child("opponentScore").val();
  const logoCodeActive = snapshot.child("code").val();
  const isHomeActive = snapshot.child("home").val();
  
  if (isActive == true){
    
    if (isHomeActive == "true"){
      $("#homeDisplay").html("vs");  
    } else {
      $("#homeDisplay").html("@");
    }
    
    $(".sportsinfo").show();
    $("#umScoreDisplay").html("UM" + "<br>" + umScoreActive);
    $("#opponentScoreDisplay").html(currentOpponentActive + "<br>" + opponentScoreActive);
    $("#umLogo").attr("src", "https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png");
    $("#opponentLogo").attr("src", "https://a.espncdn.com/i/teamlogos/ncaa/500/" + logoCodeActive + ".png");

  } else {
    $(".sportsinfo").hide();
    /*
    $("#umScoreDisplay").html("");
    $("#homeDisplay").html("");
    $("#opponentScoreDisplay").html("");
    $("#umLogo").attr("src", "data:,");
    $("#opponentLogo").attr("src", "data:,");
    */
  }
})

// --------------------------------------------------

})