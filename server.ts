import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

import * as Home from './pages/home';
import * as Books from './pages/books';
import * as BooksStatus from './pages/books_status';
import * as Authors from './pages/authors';
import * as BookDetails from './pages/book_details';
import * as CreateBook from './pages/create_book';

const app = express();
const port = 8000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mongoDB = 'mongodb://127.0.0.1:27017/my_library_db';
mongoose.connect(mongoDB);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', () => {
  console.log('Connected to database');
});

app.use(cors());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/home', (_, res: Response) => {
  Home.show_home(res);
});

app.get('/available', (_, res: Response) => {
  BooksStatus.showAllBooksStatus(res);
});

app.get('/books', async (_, res: Response) => {
  try {
    const data = await Books.showBooks();
    res.send(data);
  } catch {
    res.send('No books found');
  }
});

app.get('/authors', (_, res: Response) => {
  Authors.showAllAuthors(res);
});

app.get('/book_dtls', (req: Request, res: Response) => {
  BookDetails.showBookDtls(res, req.query.id as string);
});

app.post('/newbook', (req: Request, res: Response) => {
  const { familyName, firstName, genreName, bookTitle } = req.body;
  if (familyName && firstName && genreName && bookTitle) {
    CreateBook.new_book(res, familyName, firstName, genreName, bookTitle).catch(err => {
      res.send('Failed to create new book ' + err);
    });
  } else {
    res.send('Invalid Inputs');
  }
});
