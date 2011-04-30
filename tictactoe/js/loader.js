var chan = Channel.build({
    window: window.parent,
    origin: "*",
    scope: "jsga.me"
});

chan.bind("load", function(trans, s) {
    console.log("loader.js: I'm supposed to load " + s);
    return "loaded";
});
