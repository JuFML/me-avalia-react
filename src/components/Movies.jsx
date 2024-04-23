import { getMoviePoster } from "../utils/getMoviePoster"

const Movies = ({movies, onMovieClick}) => (
  <ul className="list list-movies">
    {movies?.map(movie => (
      <li key={movie.imdbID} onClick={() => onMovieClick(movie)} id={movie.imdbID}>
        <img src={getMoviePoster(movie.Poster)} alt="" />
        <h3>{movie.Title}</h3>
        <p>
          <span>📅</span>{" "}
          <span>{movie.Year}</span>
        </p>
    </li>
    ))}
  </ul>
)

export { Movies }