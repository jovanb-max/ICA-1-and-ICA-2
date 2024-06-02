function bookLibrary() {
  return {
    searchQuery: '',
    books: [],
    loading: false,

    async searchBooks() {
      this.loading = true;
      try {
        const response = await fetch(`http://localhost:3000/books?search=${this.searchQuery}`);
        const data = await response.json();
        this.books = data;
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchBooks() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/books');
        const data = await response.json();
        this.books = data;
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        this.loading = false;
      }
    }
  };
}

// Initialize and fetch books on page load
document.addEventListener('alpine:init', () => {
  Alpine.data('books', () => ({
    searchQuery: '',
    books: [],
    loading: false,

    async init() {
      this.fetchBooks();
    },

    async searchBooks() {
      this.loading = true;
      try {
        const response = await fetch(`http://localhost:3000/books?search=${this.searchQuery}`);
        const data = await response.json();
        this.books = data;
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchBooks() {
      this.loading = true;
      try {
        const response = await fetch('http://localhost:3000/books');
        const data = await response.json();
        this.books = data;
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        this.loading = false;
      }
    }
  }));
});







