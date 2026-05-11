"use strict";

const SPRITE_SCALE = 0.75;
const LEVELS = [
  {
    name: "Level 1",
    spriteKey: "r0",
    walkMs: 4500,
    waitMin: 1200,
    waitMax: 3500,
    gunSec: 1.3,
    pts: 10,
  },
  {
    name: "Level 2",
    spriteKey: "r1",
    walkMs: 3500,
    waitMin: 800,
    waitMax: 2500,
    gunSec: 1.5,
    pts: 20,
  },
  {
    name: "Level 3",
    spriteKey: "r2",
    walkMs: 2500,
    waitMin: 500,
    waitMax: 1800,
    gunSec: 1.2,
    pts: 30,
  },
  {
    name: "Level 4",
    spriteKey: "r3",
    walkMs: 2000,
    waitMin: 400,
    waitMax: 1500,
    gunSec: 0.9,
    pts: 40,
  },
  {
    name: "Level 5",
    spriteKey: "r4",
    walkMs: 1500,
    waitMin: 300,
    waitMax: 1200,
    gunSec: 0.7,
    pts: 50,
  },
];

const SPRITE_DEFS = {
  r0: {
    h: 256,
    stand: { file: "r0_stand.png", x: 0, w: 136 },
    ready: { file: "r0_ready.png", x: 0, w: 136 },
    shoot: { file: "r0_shoot.png", x: 0, w: 136 },
    walk: {
      file: "r0_walk.png",
      frames: [
        [0, 128],
        [136, 128],
        [268, 128],
      ],
    },
    die: {
      file: "r0_die.png",
      frames: [
        [0, 128],
        [136, 128],
        [272, 128],
        [408, 104],
      ],
    },
  },
  r1: {
    h: 288,
    stand: { file: "r1_stand.png", x: 0, w: 120 },
    ready: { file: "r1_ready.png", x: 0, w: 104 },
    shoot: { file: "r1_shoot.png", x: 0, w: 104 },
    walk: {
      file: "r1_walk.png",
      frames: [
        [0, 128],
        [136, 128],
        [272, 128],
      ],
    },
    die: {
      file: "r1_die.png",
      frames: [
        [0, 112],
        [120, 112],
      ],
    },
  },
  r2: {
    h: 320,
    stand: { file: "r2_stand.png", x: 0, w: 120 },
    ready: { file: "r2_ready.png", x: 0, w: 120 },
    shoot: { file: "r2_shoot.png", x: 0, w: 120 },
    walk: {
      file: "r2_walk.png",
      frames: [
        [0, 104],
        [112, 104],
        [224, 104],
      ],
    },
    die: {
      file: "r2_die.png",
      frames: [
        [0, 128],
        [136, 64],
      ],
    },
  },
  r3: {
    h: 256,
    stand: { file: "r3_stand.png", x: 0, w: 132 },
    ready: { file: "r3_ready.png", x: 0, w: 132 },
    shoot: { file: "r3_shoot.png", x: 0, w: 132 },
    walk: {
      file: "r3_walk.png",
      frames: [
        [0, 128],
        [136, 128],
        [272, 128],
      ],
    },
    die: {
      file: "r3_die.png",
      frames: [
        [0, 128],
        [136, 116],
      ],
    },
  },
  r4: {
    h: 276,
    stand: { file: "r4_stand.png", x: 0, w: 124 },
    ready: { file: "r4_ready.png", x: 0, w: 124 },
    shoot: { file: "r4_shoot.png", x: 0, w: 124 },
    walk: {
      file: "r4_walk.png",
      frames: [
        [0, 128],
        [136, 128],
        [272, 128],
      ],
    },
    die: {
      file: "r4_die.png",
      frames: [
        [0, 128],
        [136, 128],
        [272, 80],
      ],
    },
  },
};

const LOADED_IMGS = {};
const loadSpriteImage = (file) => {
  if (!LOADED_IMGS[file]) {
    const img = new Image();
    img.src = "img/sprites/" + file;
    LOADED_IMGS[file] = img;
  }
  return LOADED_IMGS[file];
};
Object.values(SPRITE_DEFS).forEach((def) => {
  ["stand", "ready", "shoot"].forEach((k) => loadSpriteImage(def[k].file));
  loadSpriteImage(def.walk.file);
  loadSpriteImage(def.die.file);
});

const SFX = {};
["intro", "wait", "fire", "shot", "shot-fall", "death", "foul", "win"].forEach(
  (n) => {
    const a = new Audio("sfx/" + n + ".m4a");
    a.preload = "auto";
    SFX[n] = a;
  },
);
function playSfx(n) {
  const s = SFX[n];
  if (!s) return;
  s.pause();
  s.currentTime = 0;
  s.play().catch(() => {});
}
function stopAllSfx() {
  Object.values(SFX).forEach((s) => {
    s.pause();
    s.currentTime = 0;
  });
}

const getInitialState = () => ({
  phase: "menu",
  levelIndex: 0,
  score: 0,
  playerTime: 0,
  gunmanX: 896,
  animFrame: 0,
  message: "",
  messageColor: "#fff",
  showFire: false,
  deathFlash: false,
});

const updateState = (state, action) => {
  switch (action.type) {
    case "SHOW_GAME":
      return { ...getInitialState(), phase: "idle" };

    case "START_WALK":
      return {
        ...state,
        phase: "walking",
        gunmanX: 896,
        animFrame: 0,
        message: "",
        deathFlash: false,
        showFire: false,
        playerTime: 0,
      };

    case "TICK_WALK":
      return {
        ...state,
        gunmanX: action.newX,
        animFrame: action.newFrame,
        phase: action.arrived ? "waiting" : "walking",
      };

    case "START_DUEL":
      return { ...state, phase: "duel", showFire: true };

    case "PLAYER_WINS":
      return {
        ...state,
        phase: "result",
        showFire: false,
        score: state.score + action.ptsAdded,
        message: "YOU WIN!",
        messageColor: "#80d010",
        playerTime: action.time,
        animFrame: 0,
      };

    case "GUNMAN_WINS":
      return {
        ...state,
        phase: "result",
        showFire: false,
        message: "YOU DIED",
        messageColor: "#ff3030",
        deathFlash: true,
      };

    case "FOUL":
      return {
        ...state,
        phase: "result",
        message: "FOUL!",
        messageColor: "#ff8800",
        showFire: false,
      };

    case "NEXT_LEVEL":
      return {
        ...state,
        levelIndex: state.levelIndex + 1,
        phase: "idle",
      };

    case "TICK_DIE":
      return { ...state, animFrame: state.animFrame + 1 };

    case "SHOW_WIN_SCREEN":
      return { ...state, phase: "win" };

    default:
      return state;
  }
};

let state = getInitialState();
let walkStartTime = null;
let duelStartTime = null;
let pendingTimers = [];
let animInterval = null;

const clearTimers = () => {
  pendingTimers.forEach(clearTimeout);
  pendingTimers = [];
};
const clearAnim = () => {
  if (animInterval) {
    clearInterval(animInterval);
    animInterval = null;
  }
};

const dispatch = (action) => {
  const previousPhase = state.phase;
  state = updateState(state, action);
  render();
  handleSideEffects(action, previousPhase);
};

const handleSideEffects = (action, previousPhase) => {
  const lvl = LEVELS[Math.min(state.levelIndex, LEVELS.length - 1)];

  if (action.type === "SHOW_GAME" || action.type === "NEXT_LEVEL") {
    clearTimers();
    clearAnim();
    stopAllSfx();
    playSfx("intro");
    walkStartTime = null;

    pendingTimers.push(
      setTimeout(() => {
        dispatch({ type: "START_WALK" });
      }, 3200),
    );
  }

  if (action.type === "START_WALK") {
    playSfx("wait");
    clearAnim();
    animInterval = setInterval(() => {
      if (state.phase === "walking") {
        const def = SPRITE_DEFS[lvl.spriteKey];
        const nextFrame = (state.animFrame + 1) % def.walk.frames.length;
        dispatch({
          type: "TICK_WALK",
          newX: state.gunmanX,
          newFrame: nextFrame,
          arrived: false,
        });
      }
    }, 120);
  }

  if (
    action.type === "TICK_WALK" &&
    state.phase === "waiting" &&
    previousPhase === "walking"
  ) {
    clearTimers();
    clearAnim();
    const waitMs = Math.random() * (lvl.waitMax - lvl.waitMin) + lvl.waitMin;
    pendingTimers.push(
      setTimeout(() => {
        dispatch({ type: "START_DUEL" });
      }, waitMs),
    );
  }

  if (action.type === "START_DUEL") {
    duelStartTime = performance.now();
    playSfx("fire");
    clearTimers();
    pendingTimers.push(
      setTimeout(() => {
        if (state.phase === "duel") dispatch({ type: "GUNMAN_WINS" });
      }, lvl.gunSec * 1000),
    );
  }

  if (action.type === "GUNMAN_WINS") {
    playSfx("shot");
    setTimeout(() => playSfx("death"), 350);
  }

  if (action.type === "PLAYER_WINS") {
    playSfx("shot-fall");
    clearAnim();
    animInterval = setInterval(() => {
      const def = SPRITE_DEFS[lvl.spriteKey];
      if (state.animFrame < def.die.frames.length - 1) {
        dispatch({ type: "TICK_DIE" });
      } else {
        clearAnim();
      }
    }, 200);
  }

  if (action.type === "FOUL") {
    playSfx("foul");
  }
};

const canvas = document.getElementById("gunman-canvas");
const ctx = canvas.getContext("2d");

const render = () => {
  if (state.phase === "menu") {
    document.getElementById("screen-menu").classList.remove("hidden");
    document.getElementById("screen-game").classList.add("hidden");
    document.getElementById("screen-win").classList.add("hidden");
    return;
  }
  if (state.phase === "win") {
    document.getElementById("screen-menu").classList.add("hidden");
    document.getElementById("screen-game").classList.add("hidden");
    document.getElementById("screen-win").classList.remove("hidden");
    document.getElementById("win-score").textContent = state.score;
    return;
  }

  document.getElementById("screen-menu").classList.add("hidden");
  document.getElementById("screen-win").classList.add("hidden");
  document.getElementById("screen-game").classList.remove("hidden");

  const lvl = LEVELS[Math.min(state.levelIndex, LEVELS.length - 1)];
  const def = SPRITE_DEFS[lvl.spriteKey];

  document.getElementById("timer-you").textContent =
    state.playerTime.toFixed(2);
  document.getElementById("timer-gunman").textContent = lvl.gunSec.toFixed(2);
  document.getElementById("score-num").textContent = state.score;
  document.getElementById("level-label").textContent = lvl.name;

  const msgEl = document.getElementById("msg");
  msgEl.textContent = state.message;
  msgEl.style.color = state.messageColor;
  msgEl.style.display = state.message ? "block" : "none";
  document.getElementById("msg-fire").style.display = state.showFire
    ? "block"
    : "none";

  document
    .getElementById("btn-restart")
    .classList.toggle(
      "hidden",
      state.phase !== "result" || state.message === "YOU WIN!",
    );
  document
    .getElementById("btn-next")
    .classList.toggle(
      "hidden",
      state.phase !== "result" || state.message !== "YOU WIN!",
    );
  document
    .getElementById("game-area")
    .classList.toggle("death-flash", state.deathFlash);

  if (state.phase === "idle") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  let img, sx, sw;
  if (state.phase === "walking") {
    const f = def.walk.frames[state.animFrame % def.walk.frames.length];
    img = loadSpriteImage(def.walk.file);
    sx = f[0];
    sw = f[1];
  } else if (state.phase === "waiting") {
    img = loadSpriteImage(def.stand.file);
    sx = def.stand.x;
    sw = def.stand.w;
  } else if (state.phase === "duel") {
    img = loadSpriteImage(def.ready.file);
    sx = def.ready.x;
    sw = def.ready.w;
  } else if (state.phase === "result" && state.message === "YOU DIED") {
    img = loadSpriteImage(def.shoot.file);
    sx = def.shoot.x;
    sw = def.shoot.w;
  } else if (state.phase === "result" && state.message === "YOU WIN!") {
    const f =
      def.die.frames[Math.min(state.animFrame, def.die.frames.length - 1)];
    img = loadSpriteImage(def.die.file);
    sx = f[0];
    sw = f[1];
  } else {
    img = loadSpriteImage(def.stand.file);
    sx = def.stand.x;
    sw = def.stand.w;
  }

  const dw = Math.round(sw * SPRITE_SCALE);
  const dh = Math.round(def.h * SPRITE_SCALE);
  canvas.width = dw;
  canvas.height = dh;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, sx, 0, sw, def.h, 0, 0, dw, dh);

  const groundY = 297;
  canvas.style.left = `${state.gunmanX}px`;
  canvas.style.bottom = `${480 - groundY}px`;
};

const loop = (now) => {
  if (state.phase === "walking") {
    if (!walkStartTime) walkStartTime = now;
    const elapsed = now - walkStartTime;
    const lvl = LEVELS[Math.min(state.levelIndex, LEVELS.length - 1)];

    const progress = Math.min(elapsed / lvl.walkMs, 1);
    const newX = 896 + (383 - 896) * progress;

    if (progress >= 1 && state.gunmanX !== 383) {
      dispatch({
        type: "TICK_WALK",
        newX: 383,
        newFrame: state.animFrame,
        arrived: true,
      });
    } else if (progress < 1) {
      dispatch({
        type: "TICK_WALK",
        newX: newX,
        newFrame: state.animFrame,
        arrived: false,
      });
    }
  }

  if (state.phase === "duel" && duelStartTime) {
    const time = (performance.now() - duelStartTime) / 1000;
    document.getElementById("timer-you").textContent = time.toFixed(2);
  }

  requestAnimationFrame(loop);
};

document.getElementById("game-area").addEventListener("mousedown", (e) => {
  if (e.target.id !== "gunman-canvas") {
    if (state.phase === "waiting") {
      clearTimers();
      dispatch({ type: "FOUL" });
    }
    return;
  }

  if (state.phase === "duel") {
    clearTimers();
    const time = (performance.now() - duelStartTime) / 1000;
    const lvl = LEVELS[Math.min(state.levelIndex, LEVELS.length - 1)];
    const pts = Math.max(1, Math.round(lvl.pts / Math.max(time, 0.01)));
    dispatch({ type: "PLAYER_WINS", time, ptsAdded: pts });
  } else if (state.phase === "waiting") {
    clearTimers();
    dispatch({ type: "FOUL" });
  }
});

document.getElementById("btn-start").addEventListener("click", () => {
  dispatch({ type: "SHOW_GAME" });
  requestAnimationFrame(loop);
});
document.getElementById("btn-restart").addEventListener("click", () => {
  dispatch({ type: "SHOW_GAME" });
});
document.getElementById("btn-play-again").addEventListener("click", () => {
  dispatch({ type: "SHOW_GAME" });
});
document.getElementById("btn-next").addEventListener("click", () => {
  if (state.levelIndex + 1 >= LEVELS.length) {
    playSfx("win");
    dispatch({ type: "SHOW_WIN_SCREEN" });
  } else {
    dispatch({ type: "NEXT_LEVEL" });
  }
});

render();
