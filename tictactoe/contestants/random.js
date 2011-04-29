function makemove(board) {
    while(true) {
        var i = Math.floor(Math.random()*9);
        if (null === board[i]) {
            return i;
        }
    }
}

