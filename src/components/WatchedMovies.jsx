import { getMoviePoster } from "@/utils/getMoviePoster";

const WatchedMovies = ({ onClickedMovie, watchedMovies, onDeleteClick}) => (
  <ul className="list list-movies">
    {watchedMovies.map(movie => (
      <li key={movie.imdbID} onClick={() => onClickedMovie(movie)}>
        <img src={getMoviePoster(movie.Poster)} alt="" />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>⭐</span>{" "}
            <span>{movie.imdbRating}</span>
          </p>
          <p>
            <span>🌟</span>{" "}
            <span>{movie.rate || 0}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{movie.Runtime}</span>
          </p>
        </div>
        <div className="btn-delete" id={movie.imdbID} onClick={(e) => onDeleteClick(e)}>X</div>
    </li>
    ))}
  </ul>
)

export { WatchedMovies }