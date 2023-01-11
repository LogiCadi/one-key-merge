const puppeteer = require("puppeteer");
const axios = require("axios");

module.exports = class {
  constructor(args) {
    console.log("args", args);
    this.args = args;
  }

  args = {
    headless: true,
  };
  browser = null;

  async login() {
    this.browser = await puppeteer.launch({ headless: this.args.headless });

    const page = await this.browser.newPage();
    await page.goto(`${this.args.host}/login/%2Fq%2Fstatus%3Aopen%2B-is%3Awip`);
    await page.type("#f_user", this.args.user);
    await page.type("#f_pass", this.args.pass);
    await page.click("#b_signin");
    await page.waitForNetworkIdle();
    const cookie = await page.evaluate(() => document.cookie);

    axios.defaults.headers.cookie = cookie;
  }

  async getList() {
    const res = await axios.get(`${this.args.host}/changes/?O=881&S=0&n=25&q=status%3Aopen%20-is%3Awip`);
    const list = JSON.parse(res.data.slice(5));
    return list
      .filter((item) => item.owner.name === this.args.target)
      .map((item) => ({ ...item, path: `c/${item.project}/+/${item._number}` }))
      .reverse();
  }

  async merge(path) {
    const page = await this.browser.newPage();

    await page.goto(`${this.args.host}/${path}`);
    await page.waitForNetworkIdle();

    try {
      const reviewBtn = await page.evaluateHandle(() =>
        document
          .querySelector("#app")
          .shadowRoot.querySelector("#app-element")
          .shadowRoot.querySelector("main > gr-change-view")
          .shadowRoot.querySelector("#actions")
          .shadowRoot.querySelector("#secondaryActions > gr-button:nth-child(1)")
      );

      reviewBtn.click();
      await page.waitForNetworkIdle();
    } catch (error) {}

    const submitBtn = await page.evaluateHandle(() =>
      document
        .querySelector("#app")
        .shadowRoot.querySelector("#app-element")
        .shadowRoot.querySelector("main > gr-change-view")
        .shadowRoot.querySelector("#actions")
        .shadowRoot.querySelector("#primaryActions > gr-button")
    );

    submitBtn.click();
    await page.waitForNetworkIdle();

    const confirmBtn = await page.evaluateHandle(() =>
      document
        .querySelector("#app")
        .shadowRoot.querySelector("#app-element")
        .shadowRoot.querySelector("main > gr-change-view")
        .shadowRoot.querySelector("#actions")
        .shadowRoot.querySelector("#confirmSubmitDialog")
        .shadowRoot.querySelector("#dialog")
        .shadowRoot.querySelector("#confirm")
    );

    confirmBtn.click();
  }

  async run() {
    await this.login();
    const list = await this.getList();

    for (const item of list) {
      await this.merge(item.path);
    }

    this.browser.close();

    return list;
  }
};
