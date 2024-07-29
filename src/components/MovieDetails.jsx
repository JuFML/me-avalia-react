import { Star } from "@/components/Star"
import { getMoviePoster } from "@/utils/getMoviePoster";
import { useEffect, useState } from "react";

const MovieDetails = ({watchedMovies, onButtonBackClick, clickedMovie, onClickRating, onClickAddFilm, rating, onMouseEnter, onMouseLeave, tempRating}) => {
  const [ratingChanged, setRatingChanged] = useState({rating, status: false})

  useEffect(() => {
    const isAlreadyOnList = watchedMovies.filter(movie => movie.imdbID === clickedMovie.imdbID)
    isAlreadyOnList.length > 0 && ratingChanged.rating != rating ? setRatingChanged(prev => ({...prev, status: true})) : setRatingChanged(prev => ({...prev, status: false}))
  }, [rating, ratingChanged.rating, clickedMovie.imdbID, watchedMovies])

  return (
  <div className="details">
    <header className="details-header">
      <button className="btn-back" onClick={onButtonBackClick}>&larr;</button>
      <img src={getMoviePoster(clickedMovie.Poster)} alt={clickedMovie.Title} />
      <div className="details-overview">
        <h2>{clickedMovie.Title}</h2>
        <p>{clickedMovie.Released} &bull; {clickedMovie.Runtime}</p>
        <p>{clickedMovie.Genre}</p>
        <p><span>⭐</span> {clickedMovie.imdbRating} IMDB rating</p>
      </div>
    </header>
    <section className="details-section">
          <div className="rating-container">
            {Array.from({length: 10}, (_, i) => (
              <Star key={i} tempRating={tempRating} rating={rating} i={i} onClickRating={onClickRating} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}/>
            ))}
          </div>
          <button className="btn-add" onClick={onClickAddFilm}>{!ratingChanged.status ? "+ Adicionar à lista" : "Alterar nota"}</button>
        <p>{clickedMovie.Plot}</p>
        <p>Elenco: {clickedMovie.Actors}</p>
        <p>Direcao: {clickedMovie.Director}</p>
    </section>
  </div>
)}

export { MovieDetails }