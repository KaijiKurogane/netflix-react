import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Pagination from 'react-paginate'
import './App.css'
const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8'
const BASE_URL = 'https://api.themoviedb.org/3'
// const FULL_MOVIE_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY
const Navigation = ({ genres, onGenreChange }) => {
  return (
    <div
      className='component'
    >
      <button 
        onClick={() => onGenreChange(null)}
        className='tag'
      >
        All
      </button>
      {genres.map((genre) => (
        <button 
          className='tag'
          key={genre.id} 
          onClick={() => onGenreChange(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}
const  Search = ({ onSearchChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearchChange(searchTerm)
  }
  return (
    <>
      <div className='Header'>
        <form 
          id='form' 
          onSubmit={handleSubmit}
          className='searchBody'
        >
          <input 
            className='searchContent' 
            type="text" 
            value={searchTerm} 
            onChange={handleChange} 
          />
          <button 
            className='search-btn' 
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
    </>
  )
}
const MovieList = ({ movies }) => {
  const [genres, setGenres] = useState({})
  const fetchGenres = async () => {
    const response = await fetch(`${BASE_URL}/genre/movie/list?${API_KEY}`)
    const data = await response.json()
    return data.genres
  }
  useEffect(() => {
    fetchGenres().then((genreList) => {
      const genreMap = {}
      genreList.forEach((genre) => {
        genreMap[genre.id] = genre.name
      });
      setGenres(genreMap)
    })
  }, [])
  const getRatingColor = (rating) => {
    if (rating >= 8) {
      return 'green';
    } else if (rating >= 5) {
      return 'orange';
    } else {
      return 'red';
    }
  }
  return (
    <>
      <div className='card'>
        {movies.map((movie) => (
          <div className='movie' key={movie.id}>
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title}
              className='image' 
            />
            <div className='movieContent'>
              <p>Title: {movie.title}</p>
              <p>
                Rating: <span style={{ color: getRatingColor(movie.vote_average) }}>{movie.vote_average}</span>
              </p>
              <p>Overview: {movie.overview}</p>
              <p>Release Date: {movie.release_date}</p>
              <p>Genre: {movie.genre_ids.map((id) => genres[id]).join(', ')}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
const Page = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <>
      <Pagination
        pageCount={totalPages}
        forcePage={currentPage - 1}
        onPageChange={page => onPageChange(page.selected + 1)}
        containerClassName="pagination"
        previousLabel="Prev"
        nextLabel="Next"
        className="pagination-custom"
      />
    </>
  )
}
export default function App() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      let result
      if (searchTerm) {
        // use the search endpoint if searchTerm is not empty
        // search endpoint doesn't allow pagination
        result = await axios(
          `${BASE_URL}/search/movie?${API_KEY}&query=${searchTerm}&with_genres=${selectedGenre}`
        )
      }
      else {
        // use the discover endpoint if searchTerm is empty
        // discover endpoint doesn't allow search function
        result = await axios(
          `${BASE_URL}/discover/movie?${API_KEY}&language=en-US&sort_by=popularity.desc&page=${currentPage}&with_genres=${selectedGenre}`
        )
      }
      setMovies(result.data.results)
      setTotalPages(result.data.total_pages)
    }
    fetchData()
  }, [currentPage, selectedGenre, searchTerm])
  useEffect(() => {
    const fetchGenres = async () => {
      const result = await axios(
        `${BASE_URL}/genre/movie/list?${API_KEY}&language=en-US`
      )
      setGenres(result.data.genres);
    }
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
        <Search 
          onSearchChange={handleSearchChange} 
        />
        <Navigation 
          genres={genres} 
          onGenreChange={handleGenreChange} 
        />
        <MovieList 
          movies={movies} 
        />
        <Page
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  )
}