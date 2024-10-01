const legoData = require('./modules/legoSets') 
const express = require('express'); 
const app = express();
const PORT = process.env.PORT || 8080; 

legoData.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch(error => {
        console.error("Initialization failed:", error)
    })

app.get("/", (req, res) => {
    res.send("Assignment 2: Abdalla Abdelgadir - 113734198")
})

app.get("/lego/sets", (req, res) => {
    legoData.getAllSets()
        .then(sets => res.json(sets))
        .catch(error => res.status(500).send(error))
})

app.get("/lego/sets/num-demo", (req, res) => {
    legoData.getSetByNum("001-1") 
        .then(set => res.json(set))
        .catch(error => res.status(404).send(error))
})

app.get("/lego/sets/theme-demo", (req, res) => {
    legoData.getSetsByTheme("town")
        .then(sets => res.json(sets))
        .catch(error => res.status(404).send(error))
})

async function run() {
    await legoData.initialize()

    const allSets = legoData.getAllSets()
    console.log(allSets)

    const specificSet = await legoData.getSetByNum("0003977811-1")
    console.log(specificSet)
}

run().catch(console.error)
