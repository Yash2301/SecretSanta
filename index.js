import Game from "./src/Game.js";

const main = new Game();
console.log("Game is started");
console.time("Game Time");
main
  .init()
  .then(() => {
    console.log("Game is completed");
    console.timeEnd("Game Time");
    process.exit(1);
  })
  .catch((err) => {
    console.log("Error in game", err?.message);
    console.timeEnd("Game Time");
    process.exit(1);
  });
