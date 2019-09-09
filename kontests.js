$(document).ready(function() {
  var sites;

  function promiseRecursive(idx) {
    if(idx == sites.length) {
      $("#circle").remove();
      $("#wait").css("display", "inline");
      return $.Deferred().resolve().promise();
    }

    return $.getJSON("https://www.kontests.net/api/v1/" + sites[idx][1])
    .done(function(data) {
      if(data.length != 0) {
        // add pill
        $("<li>", {
          "class": "nav-item",
          "html": $("<a>", {
            "class": "nav-link" + (idx == 0 ? " active" : ""),
            "id": "pills-" + sites[idx][1] + "-tab",
            "data-toggle": "pill",
            "href": "#pills-" + sites[idx][1],
            "role": "tab",
            "aria-controls": "pills-" + sites[idx][1],
            "aria-selected": "true",
            "html": sites[idx][0] + " &nbsp;<span class=\"badge badge-pill badge-secondary\">" + data.length + "</span>"
          })
        }).appendTo(".nav-pills");

        // construct table
        var future = 0;
        var future_tbody = "<tbody>";
        var running = 0;
        var running_tbody = "<tbody>";
        var table_thead = "<thead class=\"border-top border-bottom\"><tr><th>Name</th><th>Start time</th><th>Duration</th></tr></thead>"

        $.each(data, function(idx, val) {
          temp_text = ""

          if(val["in_24_hours"] === "Yes") {
            temp_text = "<tr class=\"in-24-hours\">"
          } else {
            temp_text = "<tr>"
          }

          temp_text += "<td><a href=" + val["url"] + ">" + val["name"] + "</a></td><td>" + localTimeFromUtc(val["start_time"]) + "</td><td>" + durationToText(val["duration"]) + "</td></tr>";

          if(val["status"] === "BEFORE") {
            ++future;
            future_tbody += temp_text;
          } else {
            ++running;
            running_tbody += temp_text;
          }
        });

        var future_table = $("<div>", {
          "class": "future bg-secondary",
          "html": $("<div>", {
            "class": "table-responsive",
            "html": $("<table>", {
              "class": "table table-borderless table-hover mb-0",
              "html": (future > 0 ? table_thead : "") + future_tbody
            })
          })
        });

        if(future == 0) {
          $("<p>", {
            "class": "lead text-center pt-3 pb-3 mb-0",
            "html": "There are no future contests :("
          }).prependTo(future_table);
        } else {
          $("<p>", {
            "class": "lead text-center pt-3 pb-3 mb-0",
            "html": future + " Future Contest" + (future > 1 ? "s" : "")
          }).prependTo(future_table);
        }

        var running_table = $("<div>", {
          "class": "running bg-secondary",
          "html": $("<div>", {
          "class": "table-responsive",
            "html": $("<table>", {
              "class": "table table-borderless table-hover mb-0",
              "html": (running > 0 ? table_thead : "") + running_tbody
            })
          })
        });

        if(running == 0) {
          $("<p>", {
            "class": "lead text-center pt-3 pb-3 mb-0",
            "html": "There are no running contests :)"
          }).prependTo(running_table);
        } else {
          $("<p>", {
            "class": "lead text-center pt-3 pb-3 mb-0",
            "html": running + " Running Contest" + (running > 1 ? "s" : "")
          }).prependTo(running_table);
        }

        tables = $("<div>", {
          "class": "tab-pane fade" + (idx == 0 ? " show active" : ""),
          "id": "pills-" + sites[idx][1],
          "role": "tabpanel",
          "aria-labelledby": "pills-" + sites[idx][1] + "-tab",
          "html": future_table
        });
        $("<br />").appendTo(tables);
        running_table.appendTo(tables);
        tables.appendTo(".tab-content");
      }
    })
    .fail(function(e) {
    })
    .then(function() {
      return promiseRecursive(idx + 1);
    });
  }

  $.get('https://www.kontests.net/api/v1/sites', function(data) {
    sites = data;
    promiseRecursive(0);
  });
});

function localTimeFromUtc(utcTime) {
  if(utcTime === '-') return '-';

  var givenDate = new Date(utcTime);
  var localDateString = DateFormat.format.date(givenDate, 'dd MMM yyyy HH:mm');
  return localDateString;
}

function durationToText(duration) {
  if(duration === '-') return '-';

  seconds = parseInt(duration);

  days = Math.floor(seconds / (24 * 60 * 60));
  days_s = 'days';
  if(days == 1) days_s = 'day';
  seconds %= (24 * 60 * 60);

  hours = Math.floor(seconds / (60 * 60));
  hours = ('0' + hours).slice(-2);
  seconds %= (60 * 60);

  minutes = Math.floor(seconds / 60);
  minutes = ('0' + minutes).slice(-2);

  if(days > 0)
    return `${days} ${days_s} and ${hours}:${minutes}`;
  else
    return `${hours}:${minutes}`;
}
