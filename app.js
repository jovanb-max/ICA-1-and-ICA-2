document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
});

async function loadBooks() {
  const search = document.getElementById('search').value;
  const res = await fetch(`/books?title=${search}`);
  const books = await res.json();
  const booksDiv = document.getElementById('books');
  booksDiv.innerHTML = '';
  books.forEach(book => {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'book';
    bookDiv.innerHTML = `<strong>${book.title}</strong><br>${book.author}<br>${book.genre}`;
    booksDiv.appendChild(bookDiv);
  });
}