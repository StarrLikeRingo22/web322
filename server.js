/********************************************************************************
* WEB322 – Assignment 04
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Abdalla Abdelgadir       Student ID: 113734198      Date: 2024-10-15
*
* Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require('express');
const path = require('path');
const legoData = require("./modules/legoSets"); 
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))

// Routes
app.get("/", (req, res) => {
  res.render("home")
})

app.get("/about", (req, res) => {
  res.render("about")
})

app.get("/lego/sets", (req, res) => {
  legoData.initialize().then(() => {
    legoData.getAllSets().then((legoSets) => {
      res.render("sets", { sets: legoSets })
    }).catch((err) => {
      res.status(500).render("500", { message: "Internal Server Error" })
    })
  }).catch((error) => {
    res.status(500).render("500", { message: "Internal Server Error" })
  })
})

app.get("/lego/sets/:set_num", (req, res) => {
    legoData.getSetByNum(req.params.set_num).then((set) => {
      if (set) {
        res.render("set", { set: set })
      } else {
        res.status(404).render("404", { message: "The requested Lego set was not found" })
      }
    }).catch((err) => {
      res.status(404).render("404", { message: "The requested Lego set was not found" })
    })
  })

  app.get("/lego/sets/:theme", (req, res) => {
    legoData.initialize()
      .then(() => legoData.getSetsByTheme(req.params.theme))
      .then((sets) => {
        if (sets && sets.length > 0) {
          res.render("sets", { sets, theme: req.params.theme })
        } else {
          // Render 404 if no sets are found for the theme
          res.status(404).render("404", { message: `No sets found for theme: ${req.params.theme}` })
        }
      })
      .catch((err) => {
        console.error("Error:", err); // Log the error for debugging
        res.status(500).render("500", { message: "Internal Server Error" })
      })
  })
  
  

// Custom 404 route
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found" })
})

// Custom error handling middleware for internal server errors
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("500", { message: "Internal Server Error" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})
/*
async function run() {
    await legoData.initialize() // testing functions

    const allSets = legoData.getAllSets()
    console.log(allSets)

    const specificSet = await legoData.getSetByNum("0003977811-1")
    console.log(specificSet)
}

run().catch(console.error)
*/