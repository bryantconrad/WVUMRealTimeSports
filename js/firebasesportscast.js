$(document).ready(function () {

  // Create SlimSelect dropdown menu 
  var select = new SlimSelect({
    select: '#single',
    placeholder: 'Select a game to be active'
  });


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

  var dbTeams = firebase.database().ref('games').orderByKey();
  var dbActive = firebase.database().ref('active');


  // Append teams to dropdown
  dbTeams.once('value').then(function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var key = childSnapshot.key;
      $("#single").append('<option value="' + key + '">' + key + '</option>');
    })
  });


  // Add more games to database
  $("#submit2").click(function () {
    var addTeam = $("#teamInput").val();
    var addDate = $("#dateInput").val();
    var addSport = $("#sportInput").val();
    var addHome = $('input[name="location"]:checked').val();
    var addCode = $("#codeInput").val();

    if (addTeam !== "") {
      firebase.database().ref('games/' + addTeam).set({
        date: addDate,
        opponentScore: 0,
        umScore: 0,
        sport: addSport,
        code: addCode,
        home: addHome
      })
    }
  });


  // Show active game and score section on page
  dbActive.once('value').then(function (snapshot) {
    var currentOpponent = snapshot.child("team").val();
    var isActive = snapshot.child("isActive").val();
    var isHome = snapshot.child("home").val();
    var sportActive = snapshot.child("sport").val();

    if (isActive == true) {
      if (isHome == "true") {
        $("#activeGame").html("UM vs " + currentOpponent);
      } else {
        $("#activeGame").html("UM @ " + currentOpponent);
      }

      // Change score buttons based on sport
      if (sportActive == "Football") {
        $(".addHome, .addOpponent").hide();
        $(".jsFootball").show();
        $(".jsButtonGrids").addClass("buttonGrid1");
        $(".jsButtonGrids").removeClass("buttonGrid2 buttonGrid3");
        $("#periodType").html("Quarter");
      } else if ((sportActive == "Men's Basketball") || (sportActive == "Women's Basketball")) {
        $(".addHome, .addOpponent").hide();
        $(".jsBasketball").show();
        $(".jsButtonGrids").addClass("buttonGrid2");
        $(".jsButtonGrids").removeClass("buttonGrid1 buttonGrid3");
        $("#periodType").html("Half");
      } else {
        $(".addHome, .addOpponent").hide();
        $(".jsOtherSports").show();
        $(".jsButtonGrids").addClass("buttonGrid3");
        $(".jsButtonGrids").removeClass("buttonGrid1 buttonGrid2");
      }

      // Additional conditions to set period type
      if (sportActive == "Baseball") {
        $("#periodType").html("Inning");
      } else if (sportActive == "Volleyball") {
        $("#periodType").html("Set");
      }
      if ((sportActive == "Men's Soccer") || (sportActive == "Women's Soccer")) {
        $("#periodType").html("Half");
      }

    } else {
      $("#activeGame").html("No active game" + "#scoreSection");
      $("#periodSection, #scoreSection").hide();
    }
  })


  // Choose active game
  $("#submit1").click(function () {
    if (select.selected() !== "") {

      // Read games data so that scores are not overwritten when setting active
      var oldInfo = firebase.database().ref('games/' + select.selected());
      oldInfo.once('value').then(function (snapshot) {

        var currentOpponent = select.selected();
        var isHome = snapshot.child("home").val();
        var umScoreOld = snapshot.child("umScore").val();
        var opponentScoreOld = snapshot.child("opponentScore").val();
        var sportActive = snapshot.child("sport").val();
        var logoCode = snapshot.child("code").val();

        // Set active game message
        if (isHome == "true") {
          $("#activeGame").html("UM vs " + currentOpponent);
        } else {
          $("#activeGame").html("UM @ " + currentOpponent);
        }






        // Set active game values
        dbActive.set({
          team: currentOpponent,
          home: isHome,
          isActive: true,
          umScore: umScoreOld,
          opponentScore: opponentScoreOld,
          sport: sportActive,
          code: logoCode
        })

      })
    }
  })


  // Clear active game
  $("#clear").click(function () {
    dbActive.set({
      isActive: false
    })
    $("#activeGame").html("Active game cleared");
  })


  // Delete game from list
  $("#delete").click(function () {
    var selectForDelete = firebase.database().ref('games/' + select.selected());
    selectForDelete.remove();
  })


  // Update active game scores with text input
  $("#umScoreInput").on('input', function () {
    var umScoreUpdate = parseInt($("#umScoreInput").val());
    dbActive.update({
      umScore: umScoreUpdate
    })
  });

  $("#opponentScoreInput").on('input', function () {
    var opponentScoreUpdate = parseInt($("#opponentScoreInput").val());
    dbActive.update({
      opponentScore: opponentScoreUpdate
    })
  });

  $("#periodInput").on('input', function () {
    var periodUpdate = parseInt($("#periodInput").val());
    dbActive.update({
      period: periodUpdate
    })
  });

  // Update active game scores with buttons
  $(".addHome").click(function () {
    var scoreChange = parseInt(this.value);
    var score = dbActive.child("umScore");
    score.transaction(function (umScore) {
      umScore = umScore + scoreChange;
      return umScore;
    });
  })

  $(".addOpponent").click(function () {
    var scoreChange = parseInt(this.value);
    var score = dbActive.child("opponentScore");
    score.transaction(function (opponentScore) {
      opponentScore = opponentScore + scoreChange;
      return opponentScore;
    });
  })


  // ------ Events when active game values change ------
  dbActive.on('value', (snapshot) => {

    // Populate inputs with current scores
    const umScoreActive = snapshot.child("umScore").val();
    const opponentScoreActive = snapshot.child("opponentScore").val();

    $("#umScoreInput").val(umScoreActive);
    $("#opponentScoreInput").val(opponentScoreActive);

    // Update active game score in "games" branch
    const currentOpponentActive = snapshot.child("team").val();
    const isActive = snapshot.child("isActive").val();

    if (isActive == true) {
      var gamesUpdate = firebase.database().ref('games/' + currentOpponentActive);
      gamesUpdate.update({
        umScore: umScoreActive,
        opponentScore: opponentScoreActive
      })

      $("#periodSection, #scoreSection").show();

    } else {
      $("#periodSection, #scoreSection").hide();
    }
  });

  // --------------------------------------------------

})