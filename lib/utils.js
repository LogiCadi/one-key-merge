var os = require("os");
var interfaces = os.networkInterfaces();
var hostIp = function () {
  let netDict = os.networkInterfaces();
  for (const devName in netDict) {
    let netList = netDict[devName];
    for (var i = 0; i < netList.length; i++) {
      let { address, family, internal, mac } = netList[i];
      let isvm = isVmNetwork(mac);
      if (family === "IPv4" && address !== "127.0.0.1" && !internal && !isvm) {
        return address;
      }
    }
  }
};

module.exports = {
  hostIp,
};
