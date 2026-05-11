const SYMBOLS = [
  "🌺",
  "🌻",
  "🌹",
  "🌷",
  "🌼",
  "🌸",
  "💮",
  "🏵️",
  "🪷",
  "💐",
  "🥀",
  "🪻",
  "🍀",
  "🌿",
  "🍃",
  "🌵",
];

const shuffleArray = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const generateBoard = (size) => {
  const pairsNeeded = size / 2;
  const deck = [
    ...SYMBOLS.slice(0, pairsNeeded),
    ...SYMBOLS.slice(0, pairsNeeded),
  ];

  return shuffleArray(deck).map((symbol, index) => ({
    id: index,
    symbol: symbol,
    isFlipped: false,
    isMatched: false,
  }));
};

const getInitialState = (settings = {}) => ({
  settings,
  status: "idle",
  board: [],
  flippedIndices: [],
  currentRound: 1,
  activePlayer: 1,
  moves: { 1: 0, 2: 0 },
  matches: { 1: 0, 2: 0 },
  timeLeft: settings.timeLimit || 0,
  roundStats: [],
});

const gameReducer = (state, action) => {
  switch (action.type) {
    case "START_GAME":
    case "RESTART_ROUND":
    case "NEXT_ROUND": {
      const isNextRound = action.type === "NEXT_ROUND";
      const isRestart = action.type === "RESTART_ROUND";
      const newRound = isNextRound
        ? state.currentRound + 1
        : isRestart
          ? state.currentRound
          : 1;

      return {
        ...state,
        status: "playing",
        board: action.payload.newBoard,
        flippedIndices: [],
        currentRound: newRound,
        activePlayer: 1,
        moves: { 1: 0, 2: 0 },
        matches: { 1: 0, 2: 0 },
        timeLeft: state.settings.timeLimit,
        roundStats: isRestart || isNextRound ? state.roundStats : [],
      };
    }

    case "FLIP_CARD": {
      if (state.status !== "playing" || state.flippedIndices.length >= 2)
        return state;
      const { index } = action.payload;
      if (state.board[index].isFlipped || state.board[index].isMatched)
        return state;

      const newBoard = [...state.board];
      newBoard[index] = { ...newBoard[index], isFlipped: true };

      return {
        ...state,
        board: newBoard,
        flippedIndices: [...state.flippedIndices, index],
        status: state.flippedIndices.length === 1 ? "matching" : "playing",
      };
    }

    case "EVALUATE_MATCH": {
      const [idx1, idx2] = state.flippedIndices;
      const isMatch = state.board[idx1].symbol === state.board[idx2].symbol;

      const newBoard = [...state.board];
      let newMatches = { ...state.matches };
      let newActivePlayer = state.activePlayer;

      if (isMatch) {
        newBoard[idx1] = { ...newBoard[idx1], isMatched: true };
        newBoard[idx2] = { ...newBoard[idx2], isMatched: true };
        newMatches[state.activePlayer] += 1;
      } else {
        newBoard[idx1] = { ...newBoard[idx1], isFlipped: false };
        newBoard[idx2] = { ...newBoard[idx2], isFlipped: false };
        if (state.settings.players === 2) {
          newActivePlayer = state.activePlayer === 1 ? 2 : 1;
        }
      }

      const isRoundOver = newBoard.every((card) => card.isMatched);

      return {
        ...state,
        board: newBoard,
        flippedIndices: [],
        status: isRoundOver ? "round_over" : "playing",
        activePlayer: newActivePlayer,
        moves: {
          ...state.moves,
          [state.activePlayer]: state.moves[state.activePlayer] + 1,
        },
        matches: newMatches,
      };
    }

    case "TICK": {
      if (state.status !== "playing" && state.status !== "matching")
        return state;
      const newTime = Math.max(0, state.timeLeft - 1);
      return {
        ...state,
        timeLeft: newTime,
        status: newTime === 0 ? "round_over" : state.status,
      };
    }

    case "SAVE_ROUND_STATS": {
      const timeTaken = state.settings.timeLimit - state.timeLeft;
      let winner = state.settings.p1Name;

      if (state.settings.players === 2) {
        if (state.matches[1] > state.matches[2]) winner = state.settings.p1Name;
        else if (state.matches[2] > state.matches[1])
          winner = state.settings.p2Name;
        else winner = "Нічия";
      }

      const stat = {
        round: state.currentRound,
        winner,
        timeTaken,
        moves1: state.moves[1],
        matches1: state.matches[1],
        moves2: state.settings.players === 2 ? state.moves[2] : null,
        matches2: state.settings.players === 2 ? state.matches[2] : null,
        isTimeOut: state.timeLeft === 0,
      };

      return {
        ...state,
        roundStats: [...state.roundStats, stat],
        status:
          state.currentRound >= state.settings.totalRounds
            ? "game_over"
            : state.status,
      };
    }
    default:
      return state;
  }
};

let appState = getInitialState();
let timerInterval = null;

const dispatch = (action) => {
  appState = gameReducer(appState, action);
  handleSideEffects(action, appState);
  render(appState);
};

const handleSideEffects = (action, state) => {
  if (action.type === "FLIP_CARD" && state.status === "matching") {
    setTimeout(() => dispatch({ type: "EVALUATE_MATCH" }), 800);
  }
  if (["START_GAME", "RESTART_ROUND", "NEXT_ROUND"].includes(action.type)) {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => dispatch({ type: "TICK" }), 1000);
  }
  if (state.status === "round_over" && action.type !== "SAVE_ROUND_STATS") {
    clearInterval(timerInterval);
    dispatch({ type: "SAVE_ROUND_STATS" });

    if (appState.status !== "game_over") {
      setTimeout(() => {
        dispatch({
          type: "NEXT_ROUND",
          payload: { newBoard: generateBoard(state.settings.size) },
        });
      }, 2500);
    }
  }
  if (state.status === "game_over") {
    document.getElementById("stats-modal").classList.remove("hidden");
  }
};

const render = (state) => {
  const DOM = {
    board: document.getElementById("board"),
    time: document.getElementById("time-remaining"),
    moves: document.getElementById("moves-count"),
    pairs: document.getElementById("pairs-count"),
    pName: document.getElementById("active-player-name"),
    roundNum: document.getElementById("current-round"),
    totalRounds: document.getElementById("total-rounds"),
    statsContainer: document.getElementById("round-stats-container"),
    winnerTitle: document.getElementById("winner-title"),
  };

  DOM.time.textContent = `${String(Math.floor(state.timeLeft / 60)).padStart(2, "0")}:${String(state.timeLeft % 60).padStart(2, "0")}`;
  DOM.moves.textContent = state.moves[state.activePlayer];
  DOM.pName.textContent =
    state.activePlayer === 1 ? state.settings.p1Name : state.settings.p2Name;
  DOM.roundNum.textContent = state.currentRound;
  DOM.totalRounds.textContent = state.settings.totalRounds;

  if (state.settings.players === 1) {
    DOM.pairs.textContent = state.matches[1];
  } else {
    DOM.pairs.textContent = `${state.matches[1]} : ${state.matches[2]}`;
  }

  const isNewBoard =
    DOM.board.dataset.round !== String(state.currentRound) ||
    DOM.board.dataset.size !== String(state.settings.size) ||
    DOM.board.children.length === 0;

  if (isNewBoard) {
    const cols =
      state.settings.size === 16 ? 4 : state.settings.size === 20 ? 5 : 6;
    const rows = state.settings.size / cols;

    DOM.board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    DOM.board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    DOM.board.innerHTML = state.board
      .map(
        (card, i) => `
            <div class="card" data-index="${i}">
                <div class="card-inner">
                    <div class="card-front" style="background-image: url('image_1b499e.png'); background-size: cover; background-position: center;"></div>
                    <div class="card-back">${card.symbol}</div>
                </div>
            </div>
        `,
      )
      .join("");

    DOM.board.dataset.round = state.currentRound;
    DOM.board.dataset.size = state.settings.size;
  }

  Array.from(DOM.board.children).forEach((cardEl, i) => {
    cardEl.querySelector(".card-back").textContent = state.board[i].symbol;
    if (state.board[i].isFlipped || state.board[i].isMatched)
      cardEl.classList.add("flipped");
    else cardEl.classList.remove("flipped");
  });

  if (state.status === "game_over") {
    let overallTitle = "🎉 Гру завершено!";

    if (state.settings.players === 2) {
      let p1Wins = 0,
        p2Wins = 0;
      state.roundStats.forEach((stat) => {
        if (stat.winner === state.settings.p1Name) p1Wins++;
        if (stat.winner === state.settings.p2Name) p2Wins++;
      });

      if (p1Wins > p2Wins)
        overallTitle = `🏆 Переміг: ${state.settings.p1Name}`;
      else if (p2Wins > p1Wins)
        overallTitle = `🏆 Переміг: ${state.settings.p2Name}`;
      else overallTitle = `🤝 Бойова нічия!`;
    }

    DOM.winnerTitle.textContent = overallTitle;

    DOM.statsContainer.innerHTML = state.roundStats
      .map(
        (stat) => `
            <div style="margin-bottom: 12px; border-bottom: 1px solid #e1ede4; padding-bottom: 10px;">
                <strong style="color: var(--primary-hover)">Раунд ${stat.round}</strong> ${stat.isTimeOut ? '<span style="color:#d66ba0; font-size:0.9em">(Час вийшов)</span>' : ""}<br>
                ${state.settings.players === 2 ? `Переможець раунду: <b>${stat.winner}</b><br>` : ""}
                <span style="font-size: 0.9em; opacity: 0.8">Витрачено часу: ${stat.timeTaken} сек.</span><br>
                <div style="margin-top: 5px;">
                    <b>${state.settings.p1Name}:</b> ${stat.matches1} пар <span style="font-size: 0.8em">(Ходів: ${stat.moves1})</span>
                    ${state.settings.players === 2 ? `<br><b>${state.settings.p2Name}:</b> ${stat.matches2} пар <span style="font-size: 0.8em">(Ходів: ${stat.moves2})</span>` : ""}
                </div>
            </div>
        `,
      )
      .join("");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("board").addEventListener("click", (e) => {
    const cardEl = e.target.closest(".card");
    if (cardEl)
      dispatch({
        type: "FLIP_CARD",
        payload: { index: parseInt(cardEl.dataset.index, 10) },
      });
  });

  const getSettings = () => {
    const diffMap = { easy: 180, normal: 120, hard: 60 };
    return {
      players: parseInt(document.getElementById("players-mode").value, 10),
      p1Name: document.getElementById("player1-name").value || "Гравець 1",
      p2Name: document.getElementById("player2-name").value || "Гравець 2",
      size: parseInt(document.getElementById("grid-size").value, 10),
      timeLimit: diffMap[document.getElementById("difficulty").value],
      totalRounds: parseInt(document.getElementById("rounds").value, 10) || 1,
    };
  };

  const startGame = () => {
    const settings = getSettings();
    appState = getInitialState(settings);
    dispatch({
      type: "START_GAME",
      payload: { newBoard: generateBoard(settings.size) },
    });
  };

  document
    .getElementById("start-game-btn")
    .addEventListener("click", startGame);

  document.getElementById("restart-btn").addEventListener("click", () => {
    dispatch({
      type: "RESTART_ROUND",
      payload: { newBoard: generateBoard(appState.settings.size) },
    });
  });

  document
    .getElementById("reset-settings-btn")
    .addEventListener("click", () => {
      document.getElementById("players-mode").value = "1";
      document.getElementById("player1-name").value = "Гравець 1";
      document.getElementById("player2-name").value = "Гравець 2";
      document.getElementById("grid-size").value = "16";
      document.getElementById("difficulty").value = "easy";
      document.getElementById("rounds").value = "1";
      toggleP2();
    });

  document.getElementById("close-modal-btn").addEventListener("click", () => {
    document.getElementById("stats-modal").classList.add("hidden");
    startGame();
  });

  const toggleP2 = () =>
    (document.getElementById("player2-group").style.display =
      document.getElementById("players-mode").value === "1" ? "none" : "flex");
  document.getElementById("players-mode").addEventListener("change", toggleP2);

  toggleP2();
  render(appState);
});
