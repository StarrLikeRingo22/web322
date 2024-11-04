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

const legoData = require('./modules/legoSets') 
const express = require('express')
const app = express()

app.set('view engine', 'ejs')

const path = require('path')
const PORT = process.env.PORT || 8080; // Vercel Link: 


app.use(express.static(path.join(__dirname, "public")))

  app.get("/", (req, res) => {
    res.render("home")
  })

  app.get("/about", (req, res) => {
    res.render("about")
  })

  app.get("/", (req, res) => {
    res.send("Assignment 4: Abdalla Abdelgadir - 113734198")
  })

  app.get("/404", (req, res) => {
    res.render("404")
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
    }).catch((error) => {
      res.status(500).render("500", { message: "Internal Server Error" })
    })
})


app.get("/lego/sets/", (req, res) => {
  const theme = req.query.theme
  legoData.initialize().then(() => {
    if (theme) {
      legoData.getSetsByTheme(theme).then((sets) => {
        if (sets.length === 0) {
          res.status(404).render("404", { message: "No Sets found for a matching theme" })
        } else {
          res.render("sets", { sets: sets })
        }
      }).catch((error) => {
        res.status(500).render("500", { message: "Internal Server Error" })
      })
    } else {
      legoData.getAllSets().then((sets) => {
        res.render("sets", { sets: sets })
      }).catch((error) => {
        res.status(500).render("500", { message: "Internal Server Error" })
      })
    }
  }).catch((error) => {
    res.status(500).render("500", { message: "Internal Server Error" })
  })
})




app.get("/lego/sets/theme-demo", (req, res) => {
    legoData.getSetsByTheme("town")
        .then(sets => res.json(sets))
        .catch(error => res.status(404).send(error))
})

app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).render("500", { message: "Internal Server Error" })
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
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
