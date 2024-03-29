import express from 'express'

import cors from 'cors'
import helmet from 'helmet';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import cron from 'node-cron'


import router from './router.js'
import connectDB from './utils/connectDB.js';
import bodyParser from 'body-parser';
import { checkAllUsersNamesForBeingFreelanceInProject } from './reward/rewardController.js';
import Settings from './settings/settings.js';
import axios from 'axios';
import HttpsProxyAgent from 'https-proxy-agent'

process.setMaxListeners(0)

dotenv.config()

await connectDB()


// const port = process.env.PORT || 8080
const port = process.env.NODE_ENV == 'production' ? 8080 : 5000

const app = express()

app.use(cors({
    origin: ["https://usedideas.netlify.app", "http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    credentials: true
}))

//wayforpay sends wrong headers... raw body is needed to fix that
var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawrawBody = buf.toString(encoding || 'utf8');
  }
}
app.use(express.json())
app.use(express.urlencoded({
  verify: rawBodySaver, 
  extended:true}))





app.use(cookieParser())
// app.use(bodyParser.json({ verify: rawBodySaver, limit: '50mb' }));
// app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true, limit: '50mb'  }));
// app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*', limit: '50mb'  }));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: 50 * 1024 * 1024
}))
app.use(helmet())
app.get('/', (req, res) => {
  console.log('get root');
  res.send('123')
})

app.head('/ping', (req, res) => {
  console.log('ping');
  res.send()
})

app.use('/', router)




app.listen(port, () => console.log(`Listening on port ${port}`))

cron.schedule('*/5 * * * *', async () => await checkAllUsersNamesForBeingFreelanceInProject())
const localSettings = await Settings.find({})

if (!localSettings || localSettings.length == 0) {
  await Settings.create({
    spinPrice: 2.5,
    whitelistedUsers: [],
    receivedRewardUsers: []
  })
}



