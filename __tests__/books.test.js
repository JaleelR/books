process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const Book = require("../models/book");
const db = require("../db");

let testbook = {
    "isbn": "0691161518",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Matthew Lane",
    "language": "english",
    "pages": 264,
    "publisher": "Princeton University Press",
    "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
    "year": 2017
}

beforeEach(async function () {
    let b = await Book.create(testbook);
    console.log(b);
});


afterEach(async function () {
    await db.query(`DELETE FROM books`);
});


describe("GET  ROUTE TEST", () => {
    test("GET: can get user", async () => {
        let resp = await request(app).get("/books");
        expect(resp.body).toEqual({
            books: [testbook]
        })
    });
    test("GET: Wrong url ", async () => {
        let resp = await request(app).get("/book");
        expect(resp.statusCode).toEqual(404);
    })
});




describe("GET :ID ROUTE TEST", () => {
    test("GET: can specific user", async () => {
        let resp = await request(app).get(`/books/${testbook.isbn}`);
        expect(resp.body).toEqual({
            book: testbook
        })
    });
    test("GET: Wrong id ", async () => {
        let resp = await request(app).get("/books/2344");
        expect(resp.statusCode).toEqual(404);
    })
});




describe("POST  ROUTE TEST", () => {
    test("POST: create", async () => {
        let resp = await request(app).post("/books").send(
            {
                "isbn": "0691161513",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        );
        expect(resp.body).toEqual({
            book:
            {
                isbn: "0691161513",
                amazon_url: "http://a.co/eobPtX2",
                author: "Matthew Lane",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
            }
        })
    });

    test("POST: Wrong page type", async () => {
        let resp = await request(app).post("/books").send(
            {
                "isbn": "0691161513",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": "264",
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
            }
        );
        expect(resp.statusCode).toEqual(400);
    });
});



describe("PUT ROUTE TEST", () => {
    test("PUT: EDIT user", async () => {
        let resp = await request(app).put(`/books/${testbook.isbn}`).send({
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Jaleel",
            "language": "english",
            "pages": 264,
            "publisher": "Princeton University Press",
            "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
            "year": 2017
        });
        expect(resp.body).toEqual({
            book: {
                isbn: "0691161518",
                amazon_url: "http://a.co/eobPtX2",
                author: "Jaleel",
                language: "english",
                pages: 264,
                publisher: "Princeton University Press",
                title: "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                year: 2017
            }
        })
    });

    test("PUT: EDIT user, wrong isbn ", async () => {
        let resp = await request(app).put(`/books/123`).send({

        });
        expect(resp.statusCode).toEqual(404)

    });

})



describe("GET  ROUTE TEST", () => {
    test("GET: can get user", async () => {
        let resp = await request(app).delete(`/books/${testbook.isbn}`);
        expect(resp.body).toEqual({
            message: "Book deleted"
        })
    });
});










afterAll(async function () {
    await db.end();
})