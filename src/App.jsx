import { useState, useEffect, useRef } from "react";
import localForage from "localforage"

const apiKey = import.meta.env.VITE_API_KEY

const getMoviePoster = (poster) => poster === "N/A" ? "images/404-img.jpg" : poster

const NavBar = ({movies, setMovies}) => {
  const formRef = useRef(null)

  useEffect(() => {
    if(formRef.current.inputFilm.value.length > 0) {
      formRef.current.reset()
    }
  }, [movies])

  const handleSearchSubmit = (e) => {
    e.preventDefault()    
    const {inputFilm} = e.target.elements

    if(inputFilm.value.length < 2) {
      return
    }

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${inputFilm.value}`)
      .then(data => data.json())
      .then(resp => {
        setMovies(resp.Search)
      })
      .catch(error => alert(error.message))
  }

  return (
  <nav className="nav-bar">
        <img className="logo" src="/images/logo-me-avalia.png" alt="" />
        <form ref={formRef} className="form-search" onSubmit={handleSearchSubmit}>
          <input name="inputFilm" className="search" type="text" placeholder="Buscar filmes..." />
          <button className="btn-search">Buscar</button>
        </form>
        <p className="num-results"><strong>{movies?.length || 0}</strong> Resultados</p>
      </nav>
)}

const ListBox = ({children}) => <div className="box">{children}</div>

const Sumary = ({watchedMovies, minutesWatched}) => (
  <div className="summary">
            <h2>filmes assistidos</h2>
            <div>
              <p>
                <span>#️⃣</span>{" "}
                <span>{watchedMovies?.length} {watchedMovies?.length === 1 ? "filme" : "filmes"}</span>
              </p>
              <p>
                <span>⏳</span>{" "}
                <span>{minutesWatched} minutos</span>
              </p>
            </div>
          </div>
)

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
                    <span>{movie.rate}</span>
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

const MovieDetails = ({onButtonBackClick, clickedMovie, onClickRating, onClickAddFilm, rating}) => (
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
        <form id="form" className="rating" onClick={onClickRating} onSubmit={onClickAddFilm}>
          <div className="rating-radios">
            {Array.from({length: 10}, (_, i) => (
              <div key={i}><input type="radio" value={i + 1} name="rating" /><br/>{i + 1}</div>
            ))}
          </div>
          {rating && <button className="btn-add">+ Adicionar à lista</button>}
        </form>
        <p>{clickedMovie.Plot}</p>
        <p>Elenco: {clickedMovie.Actors}</p>
        <p>Direcao: {clickedMovie.Director}</p>
    </section>
  </div>
)

const useClickedMovie = (watchedMovies, setWatchedMovies) => {
  const [clickedMovie, setClickedMovie] = useState([])
  const [rating, setRating] = useState("")

  const handleBackClick = () => setClickedMovie([])
  const handleRatingClick = () => setRating(form.rating.value)
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
  const handleAddFilm = (e) => {
    e.preventDefault()
    setWatchedMovies(prev => [...prev, {...clickedMovie, rate: rating}])
    setClickedMovie([])
    setRating("")
  }

  return {clickedMovie, setClickedMovie, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating}
}

const useWatchedMovie = () => {
  const [watchedMovies, setWatchedMovies] = useState([])
  const [minutesWatched, setMinutesWatched] = useState(0)

  useEffect(() => {
    setMinutesWatched(watchedMovies.reduce((acc, film) => {
      return acc += Number(film.Runtime.replace(" min", ""))
    }, 0))
  }, [watchedMovies])

  const handleDeleteClick = (e) => {
    const filmIdToDelete = e.currentTarget.id
    setWatchedMovies(watchedMovies.filter(film => film.imdbID != filmIdToDelete))
  }

  return {watchedMovies, setWatchedMovies, minutesWatched, handleDeleteClick}
}

const Main = ({movies}) => {
  const {watchedMovies, setWatchedMovies, minutesWatched, handleDeleteClick} = useWatchedMovie()
  const {clickedMovie, setClickedMovie, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating} = useClickedMovie(watchedMovies, setWatchedMovies)

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
          <MovieDetails onButtonBackClick={handleBackClick} clickedMovie={clickedMovie} onClickRating={handleRatingClick} onClickAddFilm={handleAddFilm} rating={rating}/>
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
