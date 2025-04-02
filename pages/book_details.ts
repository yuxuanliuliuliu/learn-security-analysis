import Book  from '../models/book';
import BookInstance, { IBookInstance }  from '../models/bookinstance';
import express from 'express';
import sanitizeHtml from 'sanitize-html';

const router = express.Router();


/**
 * @route GET /book_dtls
 * @group resource - the details of a book
 * @param {string} id.query - the book id
 * @returns an object with the book title string, author name string, and an array of bookInstances
 * @returns 404 - if the book is not found
 * @returns 500 - if there is an error in the database
 */


router.get('/', async (req, res) => {
  const id = sanitizeHtml(req.query.id) as string
  try {
    const [book, copies] = await Promise.all([
      Book.getBook(id),
      BookInstance.getBookDetails(id)
    ]);

    if (!book) {
      res.status(404).send(`Book ${id} not found`);
      return;
    }

    res.send({
      title: sanitizeHtml(book.title),
      author: sanitizeHtml(book.author.name),
      copies: sanitizeHtml(copies)
    });
  } catch (err) {
    console.error('Error fetching book:', err);
    res.status(500).send(`Error fetching book ${id}`);
  }
});

export default router;