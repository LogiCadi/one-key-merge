function getCommand() {
  const args = process.argv.slice(2);
  const res = { content: [], operate: {} };
  for (const v of args) {
    if (v.indexOf("=") !== -1) {
      res.operate[v.split("=")[0]] = v.split("=")[1];
    } else {
      res.content.push(v);
    }
  }
  return res;
}

module.exports = {
  getCommand,
};
