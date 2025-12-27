const express = require("express")
const cors = require("cors")
const port = 3000

const app = express()
app.use(express.json)
app.use(cors)

async function hello() {
    return 'Welcome to asynchronus'
}

hello().then((result) => {
    console.log(result)
})

async function getData() {
    console.log("loading data...")
    const result = await new Promise((resolve) => {
        setTimeout(() => resolve("Data get success!"), 12000)
    })
    console.log(result)
}
getData()

app.listen(port, () => {
    console.log("Server has started!")
})