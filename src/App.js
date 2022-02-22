import { useEffect, useState } from "react";
import axios from 'axios';
import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieCard from "./component/MovieCard.component";
import YouTube from 'react-youtube';



function App() {
  const BACKDROP_PATH = "https://image.tmdb.org/t/p/original/"
  const API_URL = "https://api.themoviedb.org/3"
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState({})
  const [searchKey, setSearchKey] = useState("")
  const [playTrailer, setPlayTrailer] = useState(false)
  const [hasTrailer, setHasTrailer] = useState(false)
  const [sortBy, setSortBy] = useState("")
  const [contentType, setContentType] = useState("movie")
  const [searchType, setSearchType] = useState("")

  const fetchMovies = async (searchKey) => {
    console.log(contentType)
    const type = searchKey ? "/search" : sortBy === 'trending' ? '/trending' : !sortBy ? "/discover" : ''
    const movieStatus = sortBy === 'trending' ? 'week' : sortBy === 'now_playing' ? contentType === 'tv' ? 'airing_today' : sortBy : sortBy === 'upcoming' ? contentType === 'tv' ? 'on_the_air' : sortBy : ''
    const {data: {results}} = await axios.get( `${API_URL}${type}/${searchType ? searchType : contentType}${searchType ? '' : '/'+movieStatus}`,
    {
        params: {
            api_key: process.env.REACT_APP_MOVIE_API_KEY,
            query: searchKey

        }
    })
    console.log(results)
    setMovies(results)
    await selectMovie(results[0])
  }

  const fetchMovie = async (id) => {
    const mediaType = searchType ? searchType : contentType
    const {data} = await axios.get(`${API_URL}/${mediaType}/${id}`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY,
        append_to_response: "videos"
      }
    })

    console.log(data)
    return data
  }

  const selectMovie = async (movie) => {
    setPlayTrailer(false)
    const data = await fetchMovie(movie.id)
    setSelectedMovie(data)
    countTrailer(data)
  }

  useEffect( () => {
    fetchMovies()
  }, [])

  const renderMovies = () => (
    movies.map(movie => (
      <MovieCard
        key={movie.id}
        movie={movie}
        selectMovie={selectMovie}
        contentType={contentType}
      />
    ))
  )

  const searchMovies = (e) => {
    e.preventDefault()
    fetchMovies(searchKey, contentType)
  }

  const countTrailer = (data) => {
    const count = data.videos.results.length > 0
    count ? setHasTrailer(true) : setHasTrailer(false)
  }

  const resetSearch = () => {
    setSearchKey("")
    document.getElementById('searchBox').value = ''
    resetSearchType()
  }

  const resetSearchType = () => {
    setSearchType("")
    document.getElementById('searchBy').value = ''
  }

  const renderTrailer = () => {
    const trailer = selectedMovie.videos.results.find(vid => vid.name === 'Official Trailer')
    const partial = selectedMovie.videos.results.find(vid => vid.type === 'Trailer')
    const key = trailer ? trailer.key : partial ? partial.key : selectedMovie.videos.results[0].key

    return (
      <YouTube
        videoId = {key}
        containerClassName = {"youtube-container"}
        opts = {{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 0
          }
        }}
      />
    )
  }

  return (
    <div className="App">

    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
      <div className="nav-container">
        <a className="navbar-brand" href='https://michaelsault.ca/'>michaelsault.ca</a> 
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
        </div>
      </div>
    </nav>

      <div className="auth-wrapper">
        <div className="auth-inner">
          <header className={"header"}>
            <div className={"header-content max-center col-xlg-2"}>
              <div className="filter-buttons">
                <form className="button-form" onSubmit={searchMovies}>
                  {contentType === 'movie' ? <button className={"hero-button sort-button"} type={"submit"} onClick = {() => {setContentType('tv'); resetSearchType();}}>TV Shows</button> : <button className={"hero-button sort-button"} type={"submit"} onClick = {() => {setContentType('movie'); resetSearchType();}}>Movies</button>}
                  <button className={"hero-button sort-button"} onClick = {() => {setSortBy(''); resetSearch();} }>Discover</button>
                  <button className={"hero-button sort-button"} onClick = {() => {setSortBy('upcoming'); resetSearch();}}>{contentType === 'movie' ? 'Upcoming' : 'On the Air'}</button>
                  <button className={"hero-button sort-button"} onClick = {() => {setSortBy('now_playing'); resetSearch();}}>{contentType === 'movie' ? 'Out Now' : 'On Today'}</button>
                  <button className={"hero-button sort-button"} type={"submit"} onClick = {() => {setSortBy('trending'); resetSearch();}}>Trending</button>
                </form>
              </div>
              
              <form className="search-form" onSubmit={searchMovies}>
                <select className="searchBy" id='searchBy' name='searchBy' onChange={(e) => {setSearchType(e.target.value)}}>
                  <option value="">Title</option>
                  <option value="person">Actor</option>
                  <option value="company">Studio</option>
                  <option value="keyword">Keyword</option>
                </select>
                <input id='searchBox' className="small" type ='text' onChange={(e) => {setSearchKey(e.target.value); setSortBy("");}}/>
                <button className={"hero-button search-button"} type={"submit"}>Search!</button>
              </form>
            </div>
          </header>


          <div className="hero" style={{backgroundImage: `URL('${BACKDROP_PATH}${selectedMovie.backdrop_path || selectedMovie.profile_path || selectedMovie.logo_path}')`}}>
            <div className="hero-content max-center" >
              {playTrailer ? <button className={"hero-button button-close"} onClick = {() => setPlayTrailer(false)}>Close</button> : null}
              {selectedMovie.videos && playTrailer ? renderTrailer() : null}
              <h1 className={"hero-title"}>{selectedMovie.title||selectedMovie.name}</h1>
              {selectedMovie.overview||selectedMovie.biography ? <p className={"hero-overview"}>{selectedMovie.overview||selectedMovie.biography}</p> : null}
              <p>{selectedMovie.headquarters}{selectedMovie.birthday ? 'DOB: ' + selectedMovie.birthday : null}</p><p>{selectedMovie.place_of_birth ? 'Hometown: ' + selectedMovie.place_of_birth : null}</p>
              
              {!selectedMovie.videos  && selectedMovie.homepage ? <a href={selectedMovie.homepage} target='blank'><button className="actor-website-button">Official Website</button></a>:null} 
              
              {hasTrailer && !playTrailer && selectedMovie.videos?
                <button className={"hero-button trailer-button"} onClick = {() => setPlayTrailer(true)}>Trailer</button>
              : null }
    
              <div className="hero-buttons">
                
              </div>
            </div>
          </div>


          <div className="container max-center">
            {renderMovies()}
          </div>
          <br/><br/>
          <div className='align_right'><b><i><a href='https://www.themoviedb.org/' target='_blank' rel="noreferrer" className="moviedb">This product uses the TMDB API but is not endorsed or certified by TMDB.</a></i></b></div>
        </div>
      </div>
    </div>
  );
}

export default App;
