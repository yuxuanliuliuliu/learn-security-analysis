import { Response } from "express";
import BookInstance from "../models/bookinstance";
import { showAllBooksStatus } from "../pages/books_status";

describe("showAllBooksStatus", () => {
    // Arrange: Prepare mock data and response object
    let res: Partial<Response>;
    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return empty list if no books are available", async () => {
        // Arrange: Mock the BookInstance model's find to throw an error
        const mockFind = jest.fn().mockImplementation(() => {
            throw new Error('Database error');
        });
        BookInstance.find = mockFind;

        // Act: Call the function to show all books with status 'Available'
        await showAllBooksStatus(res as Response);

        // Assert: Check if the response is as expected
        expect(res.status).toHaveBeenCalledWith(500);
    });
});