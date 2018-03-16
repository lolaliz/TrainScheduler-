// Initialize Firebase
var config = {
    apiKey: "AIzaSyCakbvVzbD0yidPsADBFrFG4oyAr2YzVas",
    authDomain: "trainscheduler-e04c1.firebaseapp.com",
    databaseURL: "https://trainscheduler-e04c1.firebaseio.com",
    projectId: "trainscheduler-e04c1",
    storageBucket: "trainscheduler-e04c1.appspot.com",
    messagingSenderId: "38665567637"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#submitButton").on("click", function() {
      event.preventDefault()

      var newRoute = $("#route").val().trim();
      var newDest = $("#destination").val().trim();
      var newArrTime = moment($("#arrivalTime").val().trim(),"HH:mm").format("X");
      var newFrequency = $("#frequency").val().trim();

      var newTrip = {
          Tname: newRoute,
          Tdestination: newDest,
          Tarrival: newArrTime,
          Tfrequency: newFrequency,
      }

      database.ref().push(newTrip)

  });


  database.ref().on("child_added", function(snapshot) {
    console.log(snapshot.val());


        var route = (snapshot.val().Tname);
        var destination = (snapshot.val().Tdestination);
        var arrivalTime = (snapshot.val().Tarrival);
        var frequency = (snapshot.val().Tfrequency);


        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(arrivalTime, "HH:mm").subtract(1, "years");
        console.log("firstTimeConverted" + firstTimeConverted);

        //current time
        var currentTime = moment();

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % frequency;
        console.log( "tRemainder" + tRemainder);

        // Minute Until Train
        var minutesAway = frequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + minutesAway);

        // Next Train
        var nextArrival = moment().add(minutesAway, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm A"));

        var nextArrivalPretty = moment(nextArrival).format("hh:mm A");
        console.log("next arrival time:" + nextArrivalPretty);



// Add each new train's data into the table
$("#trainRouteTable > tbody").append("<tr><td>" + route + "</td><td>" + destination + "</td><td>" +
frequency + "</td><td>" + nextArrivalPretty + "</td><td>" + minutesAway + "</td><td>");


  });