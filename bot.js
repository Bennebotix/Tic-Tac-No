class Bot {
  constructor(
    playerId,
    scoreFunc,
    getMovesFunc,
    playFunc,
    stateFunc,
    gameState,
    maxDepth
  ) {
    this.playerId = playerId;

    this.scoreFunc = scoreFunc;
    this.getMovesFunc = getMovesFunc;
    this.stateFunc = stateFunc;
    this.playFunc = playFunc;

    this.maxDepth = maxDepth;

    this.state = class {
      constructor(id, depth, falloutScale, oldGameState, parent) {
        this.id = id;

        this.depth = depth;

        this.falloutScale = falloutScale;

        this.parent = parent;

        this.gameState = this.parent.stateFunc(oldGameState, [this.id]);

        this.optScore = this.parent.scoreFunc(
          this.gameState,
          this.parent.playerId
        );

        this.mover =
          ((this.parent.playerId + ((this.depth - 1) % 2) - 1) % 2) + 1;

        this.children = [];

        this.bud = this.optScore.state == "finalized";

        if (!this.bud && this.depth < this.parent.maxDepth) this.fill();

        this.a = this.score;
      }

      fill() {
        let moves = this.parent.getMovesFunc(
          this.gameState,
          (this.mover % 2) + 1
        );

        for (let i = 0; i < moves.length; i++) {
          this.children.push(
            new this.parent.state(
              moves[i],
              this.depth + 1,
              1.1,
              this.gameState,
              this.parent
            )
          );
        }
      }

      get score() {
        let looseNextRound = this.children.some((child) => {
          return child.optScore.name == "loss";
        });

        if (this.depth == 1 && looseNextRound) {
          return -Infinity;
        } else {
          if (!this.bud) {
            let score = this.children
              .map((c) => c.score)
              .reduce((a, c) => a + c, 0);
            return score ? score : score;
          } else {
            return this.optScore.value / this.depth ** 2;
          }
        }
      }
    };
  }

  get gameState() {
    return gameState;
  }

  play() {
    let moves = this.getMovesFunc(this.gameState, this.playerId);

    let max = -Infinity;

    let move = { id: moves[moves.length - 1] };

    for (let i = 0; i < moves.length; i++) {
      let state = new this.state(moves[i], 1, 1.1, this.gameState, this);

      console.log(state);

      if (state.score > max) {
        move = state;
        max = state.score;
      }
    }

    this.playFunc(move.id);
  }
}

var O = new Bot(2, score, getMoves, play, state, gameState, 10);
