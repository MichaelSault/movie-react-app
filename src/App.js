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

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover"
    const {data: {results}} = await axios.get( `${API_URL}/${type}/movie`,
    {
        params: {
            api_key: process.env.REACT_APP_MOVIE_API_KEY,
            query: searchKey
        }
    })
    setMovies(results)
    await selectMovie(results[0])
  }

  const fetchMovie = async (id) => {
    const {data} = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY,
        append_to_response: "videos"
      }
    })
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
      />
    ))
  )

  const searchMovies = (e) => {
    e.preventDefault()
    fetchMovies(searchKey)
  }

  const countTrailer = (data) => {
    const count = data.videos.results.length > 0
    count ? setHasTrailer(true) : setHasTrailer(false)
    console.log(data.videos.results)
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
            <div className={"header-content max-center"}>
              <h5>Movie Database</h5>

              <form onSubmit={searchMovies}>
                <input className="small" type ='text' onChange={(e) => setSearchKey(e.target.value)}/>
                <button type={"submit"}>Search!</button>
              </form>
            </div>
          </header>


          <div className="hero" style={{backgroundImage: `URL('${BACKDROP_PATH}${selectedMovie.backdrop_path}')`}}>
            <div className="hero-content max-center" >
                {playTrailer ? <button className={"hero-button button-close"} onClick = {() => setPlayTrailer(false)}>Close</button> : null}
                {selectedMovie.videos && playTrailer ? renderTrailer() : null}
                {hasTrailer && !playTrailer ?
                  <button className={"hero-button trailer-button"} onClick = {() => setPlayTrailer(true)}>Trailer</button>
                : null }
              <h1 className={"hero-title"}>{selectedMovie.title}</h1>
              {selectedMovie.overview ? <p className={"hero-overview"}>{selectedMovie.overview}</p> : null}
            </div>
            

          </div>


          <div className="container max-center">
            {renderMovies()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
