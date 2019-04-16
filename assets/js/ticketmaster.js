// keywords extracted from spotify API 
// for now, the elements are placeholders until linked with spotify API

uniqueArtistArray;




// set state
var stateCode = 'NY'


//// METHOD B: to avoid "Too Many Requests" 429 error
//// on click button trigger ajax request at a given interval looping through KeywordArray

// timer id
var timer;

// On click event to retrive event data from TicketMaster API
$("#buttons-area").on("click", function () {
  // settimeout to run at 2 sec interval
  timer = setTimeout(runAjax, 500);
})


// index counter for array
var j = 0;

function runAjax() {
  $.ajax({
    type: "GET",
    url: `https://app.ticketmaster.com/discovery/v2/events.json?apikey=GUyA0G4teAjiouvRwk3D2sDwgEHUAaa6&size=1&keyword=${uniqueArtistArray[j]}&stateCode=${stateCode}`,
    async: true,
    dataType: "json",
    success: function (json) {
      console.log(json);


      //url working?
      console.log("artists in tm " + uniqueArtistArray)
      //console.log("URL: " + url);


      // checking if ticketmaster API has event information for the artist
      if (json.hasOwnProperty('_embedded')) {
        var TMresponse = json._embedded.events

        console.log(TMresponse)


        //loop through TMresponse array and write each concert on page
        for (var i = 0; i < TMresponse.length; i++) {
          var $name;
          var $venue;
          var $date;
          var $time;
          var $priceRangeMin;
          var $priceRangeMax;
          var $btnTM;

          if (TMresponse[i].hasOwnProperty('priceRanges')) {
            $priceRangeMin = TMresponse[i].priceRanges[0].min;
            $priceRangeMax = TMresponse[i].priceRanges[0].max;
          } else {
            $priceRangeMin = "NO DATA";
            $priceRangeMax = "NO DATA";
          };

          if (TMresponse[i].hasOwnProperty('name')) {
            $name = TMresponse[i].name;
          } else {
            $name = "no name"
          };

          if (TMresponse[i].hasOwnProperty('_embedded')) {
            $venue = TMresponse[i]._embedded.venues[0].name;
          } else {
            $venue = "Venue TBD"
          };

          if (TMresponse[i].hasOwnProperty('dates')) {
            $date = TMresponse[i].dates.start.localDate;
          } else {
            $date = "Date TBD"
          };

          if (TMresponse[i].hasOwnProperty('dates')) {
            $time = TMresponse[i].dates.start.localTime;
          } else {
            $time = "Time TBD"
          };

          if (TMresponse[i].hasOwnProperty('url')) {
            $btnTM = $("<a>").attr("href", TMresponse[i].url).attr("target", "_blank").text("ticketmaster").addClass("btn btn-outline-dark");
          } else {
            $btnTM = "No Event"
          }

          console.log($name);
          console.log($venue);
          console.log($date);
          console.log($time);
          console.log($priceRangeMin);
          console.log($priceRangeMax);

          // write on table
          var newRow = $("<tr>").append(
            $("<td>").text($name),
            $("<td>").text($venue),
            $("<td>").text($date),
            $("<td>").text($time),
            $("<td>").text($priceRangeMin + " - " + $priceRangeMax),
            $("<td>").append($btnTM),
          );

          $("tbody").append(newRow);
        };

        // increase index counter
        j++;
        console.log("this is counter:" + j);

      // if event does not exist, skip to next artist in array
      } else {
        console.log("no event available for this artist");
        j++;
        return runAjax();
      }
      
    },
    complete: function (json) {
      if (j === uniqueArtistArray.length) {
        return clearTimeout(timer)
      }
      timer = setTimeout(runAjax, 500);
      console.log("next iteration")
    },
    error: function (xhr, status, err) {
      // This time, we do not end up here!
    }
  })
}

