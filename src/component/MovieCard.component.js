import React from "react";

const MovieCard = ({movie, selectMovie}) => {
    
    const IMAGE_PATH = "https://image.tmdb.org/t/p/w500/"

    return (
        <div className={"movie-card"} onClick={() => {selectMovie(movie); window.scrollTo(0,0);}}>
            {movie.poster_path ? <img className= {"movie-cover"} src={`${IMAGE_PATH}${movie.poster_path}`} alt={movie.title}/>
                : 
            <div className={"movie-placeholder"}>No Image Found</div>
            }
            
            <h5 className={"movie-title"}>{movie.title}</h5>{movie.release_date}
            
        </div>
    );
};

export default MovieCard;