const express = require("express");
const webpush = require('web-push');
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const db = require("./db.json");
var morgan = require('morgan')

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "client")))
var logger = morgan('combined')

//public a private vapid key
const publicVapidKey = "BKhBkYXCobj-B8mNAUR76ByQgoeL3ZE4UiDUKGe0Rp0ZXqHUrxD8InCrC8efDmBSIZWzvEvHt9VrKsAh2BHyMYg";
const privateVapidKey = "XL6oLWms1vv2YyNnu0p5LLOt9hAfaPEpgbzBt9hn3So";
webpush.setVapidDetails("mailto:zeruparkyvevelkem@example.com", publicVapidKey, privateVapidKey)

app.use(logger)

// POST /subscribe
app.post("/subscribe", (req, res) => {
    const sub = req.body;
    if(db.find(d => d.endpoint == req.body.endpoint)) {
        console.log(`Odběratel už existuje`)
        res.status(400).json({message: "Odběratel už existuje"}); 
        return;
    }
    console.log(`Nový odběratel přidán`)
    //zápis odběratele do "DB"
    db.push(sub)
    fs.writeFileSync("db.json", JSON.stringify(db))
    res.status(201).json({}); 
})

app.get("/createAlert", (req, res) => {
  const payload = JSON.stringify({ 
    title: "Intranet", 
    body: `Ahoj,\ntohle je test notifikací`,
    icon: "https://wiki.infotea.cz/logo.png",
  image: "https://media.tenor.com/Gzb1DJvEObgAAAAM/black-black-man.gif",
    requireNotification: true
  });
  //odešli na všechny odběratele notifikaci
  db.forEach((d, i) => {
    console.log(`Odesílání notifikace #${i}`)
    webpush.sendNotification(d, payload).then(() => {
        console.log(`Notifikace odeslána #${i}`)
    }).catch(console.log);
  })
  res.status(201).json({}); 
})

const PORT = 80;

app.listen(PORT, () => {
    console.log("Server běží na portu " + PORT);
});