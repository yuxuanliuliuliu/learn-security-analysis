import { Request, Response, NextFunction } from 'express';

export interface RequestWithSanitizedBookDetails extends Request {
    familyName?: string;
    firstName?: string;
    genreName?: string;
    bookTitle?: string;
}

export const validateBookDetailsMiddleware = (req: RequestWithSanitizedBookDetails, res: Response, next: NextFunction) => {
    const { familyName, firstName, genreName, bookTitle } = req.body;
    if (typeof familyName !== 'string' || typeof firstName !== 'string' || typeof genreName !== 'string' || typeof bookTitle !== 'string') {
        return res.status(400).send("Invalid input: All fields must be strings.");
    }

    const isValidFamilyName = /^[a-zA-Z\s]{0,100}$/.test(familyName);
    const isValidFirstName = /^[a-zA-Z\s]{0,100}$/.test(firstName);
    const isValidGenreName = /^[a-zA-Z\s]{4,100}$/.test(genreName);
    const isValidBookTitle = /^[a-zA-Z0-9\s]+$/.test(bookTitle);

    if (!isValidFamilyName || !isValidFirstName || !isValidGenreName || !isValidBookTitle) {
        return res.status(400).send("Invalid input: All fields must be alphanumericwith spaces allowed.");
    }

    req.familyName = familyName;
    req.firstName = firstName;
    req.genreName = genreName;
    req.bookTitle = bookTitle;

    next();
}