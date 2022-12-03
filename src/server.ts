import express from 'express'

const app = express()
const port = 8080

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.use('*', (req, res) => {
  res.sendStatus(404)
})

app.listen(port, () => {
  console.log(`budget-server listening on port ${port}`)
})