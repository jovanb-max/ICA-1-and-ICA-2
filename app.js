function libraryApp() {
    return {
      search: '',
      books: [],
      fetchBooks() {
        fetch(`/books?search=${this.search}`)
          .then(response => response.json())
          .then(data => {
            this.books = data;
          });
      }
    }
  }