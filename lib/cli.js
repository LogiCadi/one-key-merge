const { getCommand } = require("./utils");
const Main = require("./main");
const { execSync } = require("child_process");

let config = require("./config.json");
const fs = require("fs");
const path = require("path");

const cmd = getCommand();

if (cmd.content.includes("config")) {
  execSync("start ./config.json");
} else {
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
}
