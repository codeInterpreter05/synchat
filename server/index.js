import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route.js';
import contactsRoutes from './routes/contact.route.js';
import setUpSocket from './socket.js';
import messagesRoutes from './routes/messages.route.js';
import groupRoutes from './routes/groups.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;
 
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', "PATCH", 'DELETE'],
    credentials: true,
})); 

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());  
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/groups", groupRoutes)

//database connection

mongoose.connect(databaseURL)
 .then(() => console.log('Connected to MongoDB'))
 .catch((err) => console.error(err));


const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

setUpSocket(server)
