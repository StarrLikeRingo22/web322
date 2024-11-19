/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
*
* Name: Abdalla Abdelgadir       Student ID: 113734198      Date: 2024-10-15
*
* Published URL: https://web322-gp99.onrender.com/
*
********************************************************************************/

const express = require('express')

const path = require('path')
const legoData = require("./modules/legoSets") 
const app = express()
const port = process.env.PORT || 8080



app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true })) // Add this line for form data parsing
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.get("/", (req, res) => {
  res.render("home")
})

app.get("/about", (req, res) => {
  res.render("about")
})

app.get("/lego/sets", async (req, res) => {
  const theme = req.query.theme

  try {
    const sets = theme ? await legoData.getSetsByTheme(theme) : await legoData.getAllSets()

    if (sets.length === 0) {
      res.status(404).render("404", { message: "No sets found for a matching theme" })
    } else {
      res.render("sets", { sets })
    }
  } catch (error) {
    res.status(500).render("500", { message: "Internal Server Error" })
  }
})

app.get('/lego/addSet', async (req, res) => {
  try {
      const themes = await legoData.getAllThemes()
      res.render('addSet', { themes })
  } catch (err) {
      res.render('500', { message: `Error loading themes: ${err.message}` })
  }
})

app.post('/lego/addSet', async (req, res) => {
  try {
      await legoData.addSet(req.body)
      res.redirect('/lego/sets')
  } catch (err) {
      res.render('500', { message: `I'm sorry, but we have encountered the following error: ${err}` })
  }
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

app.get('/lego/sets/:theme', async (req, res) => {
  try {
      const themeName = req.params.theme
      const sets = await legoData.getSetsByTheme(themeName)
      if (sets.length === 0) {
          res.status(404).render('404', { message: `No sets found for the theme "${themeName}"` })
      } else {
          res.render('sets', { sets })
      }
  } catch (err) {
      res.render('500', { message: `Error retrieving sets by theme: ${err.message}` })
  }
})

app.get('/lego/set/:setId', async (req, res) => {
  try {
      const setId = req.params.setId
      const themes = await legoData.getAllThemes()
      const set = await legoData.getSetByNum(setId)
      if (!set) {
          res.status(404).render('404', { message: `No set found with ID "${setId}"` })
      } else {
          res.render('editSet', { set, themes })
      }
  } catch (err) {
      res.render('500', { message: `Error retrieving set by ID: ${err.message}` })
  }
})

app.use((req, res) => {
  res.status(404).render('404', { message: "The page you're looking for does not exist." })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

app.get('/lego/editSet/:num', (req, res) => {
  const setNum = req.params.num

  Promise.all([legoSets.getSetByNum(setNum), legoSets.getAllThemes()])
    .then(([setData, themeData]) => {
      res.render('editSet', { set: setData, themes: themeData })
    })
    .catch((err) => {
      res.status(404).render('404', { message: `Unable to retrieve data: ${err}` })
    })
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