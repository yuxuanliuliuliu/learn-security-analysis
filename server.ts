import express, { Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import * as Home from './pages/home';
import * as Books from './pages/books';
import * as BooksStatus from './pages/books_status';
import * as Authors from './pages/authors';
import * as BookDetails from './pages/book_details';
import * as CreateBook from './pages/create_book';

import { validateIdMiddleware, RequestWithSanitizedId } from './sanitizers/idSanitizer';
import { validateBookDetailsMiddleware, RequestWithSanitizedBookDetails } from './sanitizers/bookSanitizer';
import { appRateLimiter } from './sanitizers/rateLimiter';

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



// CORS policy: Allow requests from http://localhost:3000
app.use(cors(
  {
    origin: 'http://localhost:3000'
  }
));
app.use(appRateLimiter);
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

app.get('/book_dtls', validateIdMiddleware, (req: RequestWithSanitizedId, res: Response) => {
  if(req.sanitizedId)
    BookDetails.showBookDtls(res, req.sanitizedId);
  else 
    res.status(404).send('Invalid ID');
});

app.post('/newbook', validateBookDetailsMiddleware, (req: RequestWithSanitizedBookDetails, res: Response) => {
  const { familyName, firstName, genreName, bookTitle } = req;
  if (familyName && firstName && genreName && bookTitle) {
    CreateBook.new_book(res, familyName, firstName, genreName, bookTitle).catch(err => {
      res.send('Failed to create new book ' + err);
    });
  } else {
    res.send('Invalid Inputs');
  }
});
