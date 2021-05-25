$(document).ready(function () {

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

  // Function to write ordinal number suffixes
  function periodOrdinal(period) {
    var s = ["th", "st", "nd", "rd"],
      v = period % 100;
    $("#periodNumber").html(period + (s[(v - 20) % 10] || s[v] || s[0]) + " ");
  }


  // Function to change period type
  function changePeriodType(sport) {
    if (sport == "Football") {
      $("#periodType").html("quarter");
    } else if ((sport == "Men's Basketball") || (sport == "Women's Basketball") || (sport == "Men's Soccer") || (sport == "Women's Soccer")) {
      $("#periodType").html("half");
    } else if (sport == "Baseball") {
      $("#periodType").html("inning");
    } else if (sport == "Volleyball") {
      $("#periodType").html("set");
    }
  }


  // Function to show active game info
  function showGame(snapshot) {
    isActive = snapshot.child("isActive").val();
    currentOpponent = snapshot.child("team").val();
    umScore = snapshot.child("umScore").val();
    opponentScore = snapshot.child("opponentScore").val();
    logoCode = snapshot.child("code").val();
    isHome = snapshot.child("home").val();
    period = snapshot.child("period").val();
    sport = snapshot.child("sport").val();
    isOvertime = snapshot.child("overtime").val();
    isFinal = snapshot.child("final").val();
    inning = snapshot.child("inning").val();

    if (isActive == true) {
      if (isHome == "true") {
        $("#homeDisplay").html("vs");
      } else {
        $("#homeDisplay").html("@");
      }

      $(".sportsinfo").show();
      $("#umLogo").attr("src", "https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png");
      $("#umScoreDisplay").html("Miami" + "<br>" + umScore);
      $("#opponentLogo").attr("src", "https://a.espncdn.com/i/teamlogos/ncaa/500/" + logoCode + ".png");
      $("#opponentScoreDisplay").html(currentOpponent + "<br>" + opponentScore);

      if (sport == "Baseball" && period) {
        if (inning == "top") {
          $("#periodNumberPrefix").html("Top of the ")
        } else if (inning == "bottom") {
          $("#periodNumberPrefix").html("Bottom of the ")
        } else {
          $("#periodNumberPrefix").html("");
        }
      } else {
        $("#periodNumberPrefix").html("");
      }

      if (isOvertime && isFinal) {
        periodOrdinal(period);
        $("#periodNumber").prepend("Final in ");
        $("#periodType").html("overtime");
      } else if (isFinal) {
        $("periodNumber").html("");
        $("#periodType").html("Final");        
      }
      else if (isOvertime) {
        periodOrdinal(period);
        $("#periodType").html("overtime");
      } else {
        if (period) {
          periodOrdinal(period);
          changePeriodType(sport);
        } else {
          $("#periodNumber, #periodType").html("")
        }
      }

    } else {
      $(".sportsinfo").hide();
    }
  }


  // Show active game info on page load
  dbActive.once('value').then(function (snapshot) {
    showGame(snapshot);
  })


  // Show active game info on value change
  dbActive.on('value', (snapshot) => {
    showGame(snapshot);
  })

})