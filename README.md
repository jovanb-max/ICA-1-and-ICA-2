# ICA-1 Book library
Library application prototype.
A basic web application that serves as a book library catalog. This application will consist of a
REST API backend and a simple frontend interface. The application aims to cater to two types of
users with different levels of access and capabilities.

# User Types and Functionalities:
1. Reader (No Authentication Required):
 Public users can explore the library's collection by listing books based on genre,
author, or title. Public users do not need to logín to use the library catalogue.
Browse Books:
2. Librarian (Authentication Required):
 Librarian has the ability to perform standard book management operations. After
logging in, they can:
Manage Books:
 Introduce new books to the catalog, book information consists of title,
author and genre (choose from a list of predefined genres).
Add New Books (POST):
Update Existing Books (PATCH): Modify information about books already in the catalog.
Delete Books (DELETE): Remove books from the catalog that are no longer available or relevant.



