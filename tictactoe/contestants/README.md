Each contestant in this directory is a guesstimation of what
a player of the tictactoe game might author.  The interface
between the harness code and the player's code is just
an agreement on a function name and function signature:

    function makemove(board) {
      // board is a 2d array containing 'null', 'us', or 'them' in
      // each square.  board is left to right, top to bottom:
      //
      //    0 | 1 | 2
      //   ---|---|---
      //    3 | 4 | 5
      //   ---|---|---
      //    6 | 7 | 8
      //
      // the function should return an integer of where it would
      // like to move
      // if the function misbehaves, it'll be disqualified.
      for (var i = 0; i < 9; i++) {
        if (null === board[i]) {
          return i;
        }
      }
      throw "this should *never* happen!  the harness is broke!";
    }
