import mongoose, { Schema, Document, Model } from 'mongoose';
import { IBook } from './book';

// Define an interface for the BookInstance document
export interface IBookInstance extends Document {
  book: IBook;
  imprint: string;
  status: 'Available' | 'Maintenance' | 'Loaned' | 'Reserved';
  due_back: Date;
}

var BookInstanceSchema: Schema<IBookInstance> = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

// Export the model
const BookInstance: Model<IBookInstance> = mongoose.model<IBookInstance>('BookInstance', BookInstanceSchema);
export default BookInstance;