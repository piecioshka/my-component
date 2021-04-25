import { App } from "./app.js";

function main() {
    console.log("main");
    const $app = document.querySelector("#app");

    const a = new App();
    a.render($app);
}

main();
