const express = require('express')
const path = require('path')
const crawler = require('./crawler')
const { pageRankVector, transpose } = require('./linear-algebra')
const app = express()
const port = 3000
let prv = {}
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) =>{
    crawler.crawl(path.join(__dirname, 'public')).then(files => {
        crawler.generateLinkMatrix(files, res)
    })
})
app.get('/linsolve', (req, res) => {
    prv = pageRankVector(JSON.parse(req.query.matrix))
    disp_vec = []
    disp_vec_index = []
    for(let prop in prv) {
        disp_vec.push(prv[prop])
    }
    X = JSON.parse(JSON.stringify(disp_vec))
    disp_vec = disp_vec.sort()
    console.log(disp_vec)
    for(let i in disp_vec) {
        disp_vec_index.push(X.indexOf(disp_vec[i]))
    }
    console.log(disp_vec_index)
    res.json({prv:disp_vec, disp_vec_index})
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})