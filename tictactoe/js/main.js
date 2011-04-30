$(document).ready(function() {
    var contestants = {
    };

    $.get("contestants/all.txt", function (data) {
        $("#contestants").text(data);
        var contestants = data.split("\n");
        for (var i = 0; i < contestants.length; i++) {
            var c = $.trim(contestants[i]);
            // ignore blank contestants
            if (c.length == 0) continue;

            console.log("loading contestant: ", c);

            // allocate an iframe for each contestant
            var iframe = $("<iframe/>")
                .addClass("contestant")
                .attr("src", "loader.html");

            iframe.appendTo($("body"));

            // wrap the iframe in a jschannel for communication
            var chan = Channel.build({
                window: iframe.get(0).contentWindow,
                origin: "*",
                scope: "jsga.me"
            });

            // pass in the script name for the loader to load
            chan.call({
                method: "load",
                params: c,
                success: function(v) {
                    console.log("sign of life from child!");
                }
            });

            contestants[c] = {
                chan: chan,
                iframe: iframe
            };
        };
    }, "text" );
});
