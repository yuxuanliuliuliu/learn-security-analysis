import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the Genre document
export interface IGenre extends Document {
  name: string;
}

var GenreSchema: Schema<IGenre> = new Schema(
  {
    name: {type: String, required: true, maxLength: 100, minLength: 4}
  }
);


// Export the model
const Genre: Model<IGenre> = mongoose.model<IGenre>('Genre', GenreSchema);
export default Genre;
