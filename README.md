there is nothing to see here.

## idea

jsga.me will someday be a *programming game* platform: a small
framework that you can use to develop, deploy, and/or play 
computer games where rather than rolling the dice, you write some
code.  jsga.me will both be built with and focus on teaching 
javascript.

## potential enhancements

* **better display of results** - either a table or something [protovis][]-based
* **unit tests** - perhaps it's too early for this, though the solution space seems like something that might work nicely with TDD.
* **human players** - if humans can play against an AI, it might give them a nice intuitive feel for how an AI "thinks".
* **better feedback against recalcitrants** - right now mr. grumpy appears to hang the tourney-runner; disqualifying him and continuing to run the simulation would be nice.
* **cross-origin contestants** - maybe it's too early to be doing this, but being able to just paste in a URL to a contestant could be nice. This might require hosting [loader.html][] in a separate origin, though.

  [protovis]: http://vis.stanford.edu/protovis/
  [loader.html]: https://github.com/lloyd/jsga.me/blob/master/tictactoe/loader.html
