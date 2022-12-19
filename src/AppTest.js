import React, { useState, useEffect } from 'react'
import axios from 'axios'
const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8'
const BASE_URL = 'https://api.themoviedb.org/3'
const Navigation = ({ genres, onGenreChange }) => {
  return (
    <div>
      <button onClick={() => onGenreChange(null)}>All</button>
      {genres.map((genre) => (
        <button key={genre.id} onClick={() => onGenreChange(genre.id)}>
          {genre.name}
        </button>
      ))}
    </div>
  );
}
const  Search = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchChange(searchTerm)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={searchTerm} onChange={handleChange} />
      <button type="submit">Search</button>
    </form>
  );
}
const MovieList = ({ movies }) => {
  return (
    <div>
      {movies.map((movie) => (
        <div key={movie.id}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
          <div>
            <p>{movie.title}</p>
            <p>{movie.vote_average}</p>
            <p>{movie.overview}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
const  Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div>
      {currentPage > 1 && (
        <button onClick={() => onPageChange(currentPage - 1)}>Prev</button>
      )}
      {currentPage} of {totalPages}
      {currentPage < totalPages && (
        <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
      )}
    </div>
  )
}
export default function App() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState(null)
  // search doesn't show any result
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `${BASE_URL}/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${currentPage}&with_genres=${selectedGenre}&query=${searchTerm}`
      )
      setMovies(result.data.results)
      setTotalPages(result.data.total_pages)
    };
    fetchData()
  }, [currentPage, selectedGenre, searchTerm])
  useEffect(() => {
    const fetchGenres = async () => {
      const result = await axios(
        `${BASE_URL}/genre/movie/list?${API_KEY}&language=en-US`
      );
      setGenres(result.data.genres);
    };
    fetchGenres()
  }, [])
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  const handleGenreChange = (genre) => {
    setSelectedGenre(genre)
    setCurrentPage(1)
  }
  const handleSearchChange = (term) => {
    setSearchTerm(encodeURIComponent(term))
    setCurrentPage(1)
  }
  return (
    <>
      <div>
        <Navigation genres={genres} onGenreChange={handleGenreChange} />
        <hr/>
        <Search onSearchChange={handleSearchChange} />
        <hr/>
        <MovieList movies={movies} />
        <hr/>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}