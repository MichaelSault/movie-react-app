import React from "react";

const MovieCard = ({movie, selectMovie, contentType}) => {
    
    const IMAGE_PATH = "https://image.tmdb.org/t/p/original"
    
    return (
        <div className={"movie-card"} onClick={() => {selectMovie(movie); window.scrollTo(0,0); console.log(`${movie}`);}}>
            {movie.profile_path || movie.logo_path || movie.poster_path ? <img className= {"movie-cover"} src={`${IMAGE_PATH}${movie.profile_path || movie.logo_path || movie.poster_path}`} alt={movie.title}/>
                : 
            <div className={"movie-placeholder"}>No Image Found </div>
            }
            
            <h5 className={"movie-title"}>{movie.title || movie.name}</h5>{contentType === 'movie' ? movie.release_date : movie.first_air_date}{movie.known_for_department}{movie.headquarters}
            
        </div>
    );
};

export default MovieCard;