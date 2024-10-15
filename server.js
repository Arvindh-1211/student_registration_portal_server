const express = require('express');
const cors = require('cors');

const configs = require('./src/config/config');
const router = require('./src/routes/router');

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api',router)

app.listen(configs.PORT, () => {
	console.log('Server is alive and listening on port', configs.PORT);
});