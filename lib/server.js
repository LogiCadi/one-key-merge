const Main = require("./main");
const http = require("http");
const url = require("url");
const { Base64 } = require("js-base64");
const config = require("../config");

http
  .createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/html;charset=UTF-8" });

    // let target = decodeURIComponent(url.parse(request.url, true).pathname.slice(1));
    // if (target === "favicon.ico") return;
    // if (config.encode) {
    //   target = Base64.decode(Base64.decode(target));
    // }

    const main = new Main(config);

    main.run().then((res) => {
      if (res.length) {
        response.end("<h2>merge done.</h2>" + res.map((r) => r.subject).join("<br>"));
      } else {
        response.end("<h2>no merge.</h2>");
      }
    });
  })
  .listen(8881);

// 终端打印如下信息
console.log("Server running at http://127.0.0.1:8881/");
