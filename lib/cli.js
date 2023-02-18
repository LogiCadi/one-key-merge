const { getCommand } = require("./utils");
const Main = require("./main");

let config = require("./config.json");
const fs = require("fs");
const path = require("path");

const cmd = getCommand();

config = { ...config, ...cmd.operate };

fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(config));

const main = new Main(config);

main.run().then((res) => {
  if (res.length) {
    res.map((r) => console.log(r.subject));
    console.log("merge done.");
  } else {
    console.log("no merge.");
  }
});