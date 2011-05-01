$(document).ready(function() {
    var contestants = [];

    $.get("contestants/all.txt", function (data) {
        var contestantFiles = data.split("\n");
        for (var i = 0; i < contestantFiles.length; i++) {
            alert(c);
            var c = $.trim(contestantFiles[i]);
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

            contestants.push({
                name: c,
                chan: chan,
                iframe: iframe
            });
        };
    }, "text" );

    // checks board state and returns 'x', 'o', 'tie', or null
    function winner() {
        var board = [];
        $("#board > div.square").each(function(i, e) {
            var v = $(e).text();
            if (v != "X" && v != 'O') v = null;
            board.push(v);
        });

        // check horizontals
        if (board[0] && (board[0] == board[1]) && (board[1] == board[2])) return board[0];
        if (board[3] && (board[3] == board[4]) && (board[4] == board[5])) return board[3];
        if (board[6] && (board[6] == board[7]) && (board[7] == board[8])) return board[6];

        // check verticals
        if (board[0] && (board[0] == board[3]) && (board[3] == board[6])) return board[0];
        if (board[1] && (board[1] == board[4]) && (board[4] == board[7])) return board[1];
        if (board[2] && (board[2] == board[5]) && (board[5] == board[8])) return board[2];

        // check diagonals
        if (board[0] && (board[0] == board[4]) && (board[4] == board[8])) return board[0];
        if (board[2] && (board[2] == board[4]) && (board[4] == board[6])) return board[2];

        // tie check
        var i;
        for (i = 0; i < 9; i++) if (board[i] === null) break;
        if (i == 9) return 'tie'; 

        return null;
    }
    
    $("#startButton").click(function() {
        // let's just run a tourney between the first two contestants as a proof of
        // concept

        // clear board
        $("#board > div.square").text("");

        var players = {
            "X": contestants[2],
            "O": contestants[0]
        };

        var curPlayer = "X";

        function nextTurn() {
            var w = winner();
            if (w) {
                if (w === 'tie') alert("Game over!  It's a tie!");
                else alert("Game over!  " + players[w].name + " wins!");
            } else {
                var board = [];
                var map = {
                    "X": (curPlayer == "X" ? "us" : "them"),
                    "O": (curPlayer == "O" ? "us" : "them"),
                    "": null
                };
                $("#board > div.square").each(function(i,e) {
                    board.push(map[$.trim($(e).text())]);
                });
                players[curPlayer].chan.call({
                    method: "makemove",
                    params: board,
                    success: function(v) {
                        $("#board > div.square:nth-child("+(v+1)+")").text(curPlayer);
                        setTimeout(nextTurn, 1000);
                    }
                });

                curPlayer = (curPlayer === "X") ? "O" : "X";
            }
        }

        nextTurn();
    });

});
