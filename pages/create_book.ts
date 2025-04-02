import { Request, Response } from 'express';
import Book from '../models/book';
import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';


const router = express.Router();

const limiter = rateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 1, // Limit each IP to 1 request per `windowMs`
  message: 'Server is busy, please try again later.',
});

router.use(limiter);
/**
 * Middleware specific to this router
 * The function is called for every request to this router
 * It parses the body and makes it available under req.body
 */
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());
/**
 * @route POST /newbook
 * @returns a newly created book for an existing author and genre in the database
 * @returns 500 error if book creation failed
 */
router.post('/', async (req: Request, res: Response) => {
  const { familyName, firstName, genreName, bookTitle } = req.body;
  if (familyName && firstName && genreName && bookTitle) {
    try {
      const book = new Book({});
      const savedBook = await book.saveBookOfExistingAuthorAndGenre(familyName, firstName, genreName, bookTitle);
      res.status(200).send(savedBook);
    } catch (err: unknown) {
      const message = (err as Error).message.replace(/[^\w\s]/gi, '');
      res.status(500).send('Error creating book: ' + message);
    }
  } else {
    res.send('Invalid Inputs');
  }
});

export default router;