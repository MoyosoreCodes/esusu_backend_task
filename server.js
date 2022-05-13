import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import userRoutes from './routes/users.js';
import groupRoutes from './routes/groups.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// db connection
connectDB();

// middleware 
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//api routes
app.use('/api/users', userRoutes); //users
app.use('/api/groups', groupRoutes); //profile
app.get('/', (req, res) => { 
    res.send(`esusu Api running, click <a href='https://documenter.getpostman.com/view/12993294/UyxhmmyR'> here for documentation </a> `)
 })

// not found
app.use((req, res, next) => {
	if (req.accepts('json')) {
		res.status(404).send({ status: 404, error: `${req.hostname + req.url} Not found`});
		return;
	}
});

//other stuff
app.use((err, req, res) => {
	res.status(500).json({
		status: 500, 
		error: err.message
	})
});

app.listen(port, () => console.log(`Server started on port ${port}`));
