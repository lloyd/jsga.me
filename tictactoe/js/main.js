$(document).ready(function() {
    // contestants have ids to be cross referenced in various places.
    var curid = 0;

    var contestants = {
    };

    function addPlayer(file) {
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
            params: file,
            success: function(v) {
                var player_id = "player_" + (curid++).toString();
                contestants[player_id] = {
                    name: file,
                    chan: chan,
                    iframe: iframe,
                    id: player_id
                };
                updateContestantsInDOM();
            }
        });
    }
    
    $.get("contestants/all.txt", function (data) {

        var contestantFiles = data.split("\n");
        for (var i = 0; i < contestantFiles.length; i++) {
            var c = $.trim(contestantFiles[i]);
            // ignore blank contestants
            if (c.length == 0) continue;

            addPlayer(c);
        };
    }, "text" );

    function updateContestantsInDOM() {
        $("#contestants").empty();
        for (var id in contestants) {
            var cn = $("#templates > div.contestant").clone();
            cn.find(".name").text(contestants[id].name);
            cn.find("input").attr("player_id", id);
            cn.appendTo($("#contestants"));
        }
    }

    // results is player_id to [wins,losses,ties]
    function updateResultsInDOM(results) {
        $("#results").empty();
        for (var pid in results) {
            var c = contestants[pid];
            var r = $("#templates > div.result").clone();
            r.find("div.name").text(c.name);
            r.find("div.wins").text(results[pid][0]);
            r.find("div.losses").text(results[pid][1]);
            r.find("div.ties").text(results[pid][2]);
            $("#results").append(r);
        }
    }

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

    // run a single game with the players as specified in the players map, who has
    // two interesting keys, 'X' and 'O'
    function runOneGame(players, turnDelay, cb) {
        var curPlayer = "X";

        function nextTurn() {
            var w = winner();
            if (w) {
                cb(w); // either X, O, or tie
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
                        curPlayer = (curPlayer === "X") ? "O" : "X";
                        setTimeout(nextTurn, turnDelay);
                    }
                });
            }
        }

        nextTurn();
    }

    function getSelectedPlayers() {
        var players = [];
        $("#contestants input:checked").each(function(i, e) {
            players.push(contestants[$(e).attr('player_id')]);
        });
        return players;
    }
    
    $("#startButton").click(function() {
        // let's just run a tourney between the first two contestants as a proof of
        // concept

        // clear board
        $("#board > div.square").text("");

        var players = getSelectedPlayers();

        var results = {};
        players.forEach(function(x) {
            results[x.id] = [0,0,0]; // wins, losses, ties
        });

        var NUM_ROUNDS = 100;
        var round = 0;
        var i = 0;
        var j = 0;

        // async round robin tourney logic.
        function runTourney() {
            j++;
            if (j >= players.length) {
                i++;
                j = i + 1;
            }
            if (j >= players.length) {
                round++;
                i = 0;
                j = i+1;
            }
            if (round >= NUM_ROUNDS) {
                updateResultsInDOM(results);
                alert("tourney complete!");
                return 0;
            }
            // clear board
            $("#board > div.square").text("");
            runOneGame({
                X: ((round % 2) == 1) ? players[j] : players[i],
                O: ((round % 2) == 1) ? players[i] : players[j] 
            }, 0, function (status) {
                var X = ((round % 2) == 1) ? players[j] : players[i];
                var O = ((round % 2) == 1) ? players[i] : players[j];
                if (status === 'tie') {
                    results[X.id][2]++;
                    results[O.id][2]++;
                } else {
                    var winner = (status == 'X') ? X : O;
                    var looser = (status == 'X') ? O : X;
                    results[winner.id][0]++;
                    results[looser.id][1]++;
                }                        
                if (0 == (round % 10)) updateResultsInDOM(results);
                runTourney();
            });
        }
        runTourney();
    });
});
