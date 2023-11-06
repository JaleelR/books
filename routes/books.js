const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const Book = require("../models/book");
const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/book.json")




/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    //validates if req.body follows schema rules

    const result = jsonschema.validate(req.body, bookSchema);

    //if so continue on with code 
    if (result.valid) {
      const book = await Book.create(req.body);
      return res.status(201).json({ book });
    } else {
      const listOfErrors = result.errors.map(e => e.stack);
      const err = new ExpressError(listOfErrors, 400);
      return next(err);
    }

  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    console.log(req.body)
    const result = jsonschema.validate(res.body, bookSchema);
    console.log("@@@@@@@@@@@@@@@", result.valid)
    if (result.valid) {
      const book = await Book.update(req.params.isbn, req.body);
      return res.json({ book });
    } else {
      const listOfErrors = result.errors.map(e => e.stack);
      const err = new ExpressError(listOfErrors, 400);
      return next(err);
    }

  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
