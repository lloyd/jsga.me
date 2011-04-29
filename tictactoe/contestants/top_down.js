function makemove(board) {
    for (var i = 0; i < 9; i++) {
        if (null === board[i]) {
            return i;
        }
    }
}
