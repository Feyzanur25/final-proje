// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Library {
    struct Book {
        uint256 id;
        string title;
        string author;
        bool available;
    }

    mapping(uint256 => Book) public books;
    uint256 public bookCount;

    event BookAdded(uint256 indexed id, string title, string author);
    event BookBorrowed(uint256 indexed id);
    event BookReturned(uint256 indexed id);

    function addBook(string memory _title, string memory _author) public {
        bookCount++;
        books[bookCount] = Book(bookCount, _title, _author, true);
        emit BookAdded(bookCount, _title, _author);
    }

    function borrowBook(uint256 _id) public {
        require(_id > 0 && _id <= bookCount, "Invalid book ID");
        require(books[_id].available, "Book not available");

        books[_id].available = false;
        emit BookBorrowed(_id);
    }

    function returnBook(uint256 _id) public {
        require(_id > 0 && _id <= bookCount, "Invalid book ID");
        require(!books[_id].available, "Book already available");

        books[_id].available = true;
        emit BookReturned(_id);
    }
}
