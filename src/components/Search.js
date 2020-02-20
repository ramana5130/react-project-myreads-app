import React, { Component } from 'react';
import * as BooksAPI from '../BooksAPI';
import { Link } from 'react-router-dom';
import Book from './Book';

class Search extends Component {
  state = {
    books: [],
    booksOnDisplay: [],
    query: ''
  };

  componentDidMount() {
    BooksAPI.getAll().then(books => {
      this.setState({
        booksOnDisplay: books.filter(book => book.shelf !== 'none')
      });
    });
  }

  updateQuery(value) {
    this.setState({
      query: value
    });
  }

  onShelfUpdate = (book, shelfName) => {
    BooksAPI.update(book, shelfName);
    const { books } = this.state;
    const updateIndex = books.findIndex(b => b.id === book.id);
    const updateBook = books[updateIndex];
    updateBook.shelf = shelfName;

    this.setState({
      books: [
        ...books.slice(0, updateIndex),
        updateBook,
        ...books.slice(updateIndex + 1)
      ]
    });
  };

  SearchBooks(event) {
    const query = event.target.value;
    const { booksOnDisplay } = this.state;
    this.updateQuery(query);

    if (query) {
      BooksAPI.search(query, 20).then(results => {
        if (results && results.length > 0) {
          let searchResults = results;
          searchResults.map(book => (book.shelf = 'none'));
          booksOnDisplay.map(book => {
            const updateIndex = searchResults.findIndex(s => s.id === book.id);
            if (searchResults[updateIndex]) {
              searchResults[updateIndex].shelf = book.shelf;
            }
          });
          this.setState({ books: searchResults });
        } else {
          this.setState({ books: [] });
        }
      });
    } else {
      this.setState({ books: [] });
    }
  }

  render() {
    const { books, query } = this.state;

    return (
      <div className='search-books'>
        <div className='search-books-bar'>
          <Link to='/' className='close-search' />
          <input
            type='text'
            className='search-books-input-wrapper'
            onChange={event => this.SearchBooks(event)}
          />
        </div>
        <div className='search-books-results'>
          <ul className='books-grid'>
            {books.length > 0 ? (
              books.map((book, index) => (
                <Book
                  key={index}
                  book={book}
                  onShelfUpdate={this.onShelfUpdate}
                />
              ))
            ) : query.length === 0 ? (
              <p>No query Entered</p>
            ) : (
              <p>No query Entered</p>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
export default Search;
