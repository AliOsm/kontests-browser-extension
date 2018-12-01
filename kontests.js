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
          if(val["status"] === "BEFORE") {
            ++future;
            future_tbody += "<tr><td>" + val["name"] + "</td><td>" + val["start_time"] + "</td><td>" + val["duration"] + "</td></tr>";
          } else {
            ++running;
            running_tbody += "<tr><td>" + val["name"] + "</td><td>" + val["start_time"] + "</td><td>" + val["duration"] + "</td></tr>";
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
