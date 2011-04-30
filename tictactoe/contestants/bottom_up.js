function makemove(board) {
    for (var i = 8; i >= 0; i--) {
        if (null === board[i]) {
            return i;
        }
    }
}
