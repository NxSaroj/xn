import express from "express";
import colors from "colors";
const app = express();

app.get("/", (req, res) => res.send(`Api Is Working`));

app.listen(process.env.PORT, () => console.log(colors.green(`Api Is Working`)));
