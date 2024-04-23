import { useState, useEffect } from "react";
import localForage from "localforage"
import { Sumary } from "./components/Sumary";
import { NavBar } from "./components/NavBar";
import { useWatchedMovie } from "./hooks/useWatchedMovies";
import { Movies } from "./components/Movies";
import { getMoviePoster } from "./utils/getMoviePoster";
import { apiKey } from "./utils/apiKey"

const ListBox = ({children}) => <div className="box">{children}</div>



const WatchedMovies = ({watchedMovies, onDeleteClick}) => (
  <ul className="list list-watched">
            {watchedMovies.map(movie => (
              <li key={movie.imdbID}>
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
                <div className="btn-delete" id={movie.imdbID} onClick={onDeleteClick}>X</div>
            </li>
            ))}
          </ul>
)

const Star = ({tempRating, rating, i, onClickRating, onMouseEnter, onMouseLeave}) => (
  <div onClick={() => onClickRating(i + 1)} onMouseOver={() => onMouseEnter(i + 1)} onMouseOut={() => onMouseLeave()}>
    {i < tempRating || i < rating ? <img className="rating-star" src="images/star-filled.svg" alt="star"/> : <img className="rating-star" src="images/star-empty.svg" alt="star"/>}
  </div>
)

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
        {/* <form id="form" className="rating"  onSubmit={onClickAddFilm}> */}
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

const useClickedMovie = (watchedMovies, setWatchedMovies) => {
  const [clickedMovie, setClickedMovie] = useState([])
  const [rating, setRating] = useState("")
  const [tempRating, setTempRating] = useState("")

  const handleBackClick = () => {
    setClickedMovie([])
    setRating()
  }
  const handleRatingClick = (rating) => setRating(rating)
  const handleMovieClick = (movie) => {
    const isFilmOnList = watchedMovies.find(film => film.imdbID == movie.imdbID)
    const isTheSameFilm = movie.imdbID == clickedMovie.imdbID
    if(isFilmOnList || isTheSameFilm) {
      return
    }

    const idMovieClicked = (movie.imdbID);

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${idMovieClicked}`)
      .then(data => data.json())
      .then(resp => {
        if(resp.Runtime === "N/A") {
          setClickedMovie({...resp, Runtime: "0 min"})
          return
        }
        setClickedMovie(resp)
      })
      .catch(error => alert(error.message))
  }
  const handleAddFilm = () => {
    setWatchedMovies(prev => [...prev, {...clickedMovie, rate: rating}])
    setClickedMovie([])
    setRating("")
  }
  const handleMouseEnter = (rating) => {setTempRating(rating)}
  const handleMouseLeave = () => {setTempRating("")}

  return {clickedMovie, setClickedMovie, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating, handleMouseEnter, handleMouseLeave, tempRating}
}

const Main = ({movies}) => {
  const {watchedMovies, setWatchedMovies, minutesWatched, handleDeleteClick} = useWatchedMovie()
  const {clickedMovie, setClickedMovie, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating, handleMouseEnter, handleMouseLeave, tempRating} = useClickedMovie(watchedMovies, setWatchedMovies)

  useEffect(() => {
    setClickedMovie([])
  }, [movies])

  useEffect(() => {
    localForage.setItem("watchedMovies", watchedMovies)
      .catch(error => alert(error.message))
  }, [watchedMovies])

  useEffect(() => {
    localForage.getItem("watchedMovies")
      .then(movies => movies && setWatchedMovies(movies))
      .catch(error => alert(error.message))
  }, [])

  return (
    <main className="main">
        <ListBox>
          <Movies movies={movies} onMovieClick={handleMovieClick}/>
        </ListBox>

        <ListBox>
          {clickedMovie?.length === 0 && <Sumary watchedMovies={watchedMovies} minutesWatched={minutesWatched}/>}

          {clickedMovie?.length !== 0 &&
          <MovieDetails onButtonBackClick={handleBackClick} clickedMovie={clickedMovie} onClickRating={handleRatingClick} onClickAddFilm={handleAddFilm} rating={rating} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} tempRating={tempRating}/>
          }

          {clickedMovie?.length === 0 && <WatchedMovies watchedMovies={watchedMovies} onDeleteClick={handleDeleteClick}/>}
        </ListBox>
      </main>
  )
}

const App = () => {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=lake`)
    .then(data => data.json())
    .then(resp => {
      setMovies(resp.Search)
    })
    .catch(error => alert(error.message))
  }, [])

  return (
    <>
      <NavBar movies={movies} setMovies={setMovies}/>
      <Main movies={movies}/>
    </>
  )
};

export default App;
