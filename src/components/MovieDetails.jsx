import { Star } from "./Star"
import { getMoviePoster } from "../utils/getMoviePoster";

const MovieDetails = ({onButtonBackClick, clickedMovie, onClickRating, onClickAddFilm, rating, onMouseEnter, onMouseLeave, tempRating}) => (
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
          <button className="btn-add" onClick={onClickAddFilm}>+ Adicionar à lista</button>
        <p>{clickedMovie.Plot}</p>
        <p>Elenco: {clickedMovie.Actors}</p>
        <p>Direcao: {clickedMovie.Director}</p>
    </section>
  </div>
)

export { MovieDetails }