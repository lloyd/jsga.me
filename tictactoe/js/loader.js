var chan = Channel.build({
    window: window.parent,
    origin: "*",
    scope: "jsga.me"
});

chan.bind("load", function(trans, s) {
    console.log("loader.js: I'm supposed to load " + s);
    $("<script/>").attr("src", "contestants/" + s).
        appendTo($("body")).load(function() {
            console.log(loaded);
        });

    return "loaded";
});

chan.bind("makemove", function(trans, board) {
    return makemove(board);;
});
