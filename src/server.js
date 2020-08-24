const knex = require('knex');
const app = require('./app')
const { PORT, DB_URL } = require('./config')

const notefulDB = knex({
  client: 'pg',
  connection: DB_URL
})

app.set('notefulDB', notefulDB);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})