import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import userRoutes from './routes/users';
import groupRoutes from './routes/groups';
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

app.get('')

// not found
app.use((req, res, next) => {
	const err = new Error(`url: ${req.url} not found`);
    // adding new error property status
	err.status = 404;
    // calling next middleware function
	next(err);
});

//other stuff
app.use((err, req, res) => {
	res.status(err.status || 500).json({
		error: err.message
	})
});

app.listen(port, () => console.log(`Server started on port ${port}`));
