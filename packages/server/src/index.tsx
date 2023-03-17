import express from "express";
import * as path from "node:path";
import { render, preload, imports } from "switzerland";
import App from "app";

const app = express();
const root = path.resolve("./src");
const vendor = path.resolve("..");

const options = {
  path: process.env["DOMAIN"]
    ? `https://${process.env["DOMAIN"]}/client`
    : "http://localhost:3000/client",
  root: vendor,
};

app.get("/", async (_, response) => {
  const app = await render(<App city="London" />, options);

  response.send(`<html lang="en">
      <head>
        <title>Switzerland</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />

        <style type="text/css">
          body {
            display: flex;
            align-items: center;
            justify-content: center;
          }

          x-weather::part(logo) {
            // filter: grayscale(100%);
          }
        </style>

        ${preload(app)}

        <script type="importmap">
          ${await imports(path.resolve("../app/src"))}
        </script>

        <script
          type="module"
          src="/client/app/dist/index.js"
          async
          defer
        ></script>
      </head>
      <body>
        ${app}
      </body>
    </html>`);
});

app.use("/client", express.static(vendor));
app.use(express.static(root));

app.listen(3000);
