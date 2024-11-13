import { Response } from 'express';
import BookInstance, { IBookInstance } from '../models/bookinstance';

// Function to show all books with status "Available"
export const showAllBooksStatus = async (res: Response): Promise<void> => {
  try {
    const listBookInstances: IBookInstance[]
      = await BookInstance
        .find({ status: { $eq: 'Available' } })
        .populate('book')
    const results = listBookInstances.map((bookInstance: IBookInstance) => {
      return `${bookInstance.book.title} : ${bookInstance.status}`;
    });
    res.status(200).send(results);
  }
  catch (err) {
    res.status(500).send('Status not found');
  }
};
