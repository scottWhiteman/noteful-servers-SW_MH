const knex = require('knex');
const app = require('./app')
const { PORT, DATABASE_URL } = require('./config')

const notefulDB = knex({
  client: 'pg',
  connection: DATABASE_URL
})

app.set('notefulDB', notefulDB);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})