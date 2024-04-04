import { useState, useEffect } from "react";

const apiKey = import.meta.env.VITE_API_KEY

const NavBar = ({movies, inputSearch, onSearchMovie, onChangeMovie}) => (
  <nav className="nav-bar">
        <img className="logo" src="/images/logo-me-avalia.png" alt="" />
        <form className="form-search" onSubmit={onSearchMovie}>
          <input value={inputSearch} className="search" type="text" placeholder="Buscar filmes..." onChange={onChangeMovie}/>
          <button className="btn-search">Buscar</button>
        </form>
        <p className="num-results"><strong>{movies?.length || 0}</strong> Resultados</p>
      </nav>
)

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

const Movies = ({getMoviePoster, movies, onMovieClick}) => (
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

const WatchedMovies = ({getMoviePoster, watchedMovies, onDeleteClick}) => (
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

const MovieDetails = ({ getMoviePoster, onButtonBackClick, clickedMovie, onClickRating, onClickAddFilm, rating}) => (
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

const App = () => {
  const [movies, setMovies] = useState([])
  const [inputSearch, setInputSearch] = useState("")
  const [clickedMovie, setClickedMovie] = useState([])
  const [watchedMovies, setWatchedMovies] = useState([])
  const [rating, setRating] = useState("")
  const [minutesWatched, setMinutesWatched] = useState(0)

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=lake`)
    .then(data => data.json())
    .then(resp => {
      setMovies(resp.Search)
    })
    .catch(console.log)
  }, [])

  useEffect(() => {
    setMinutesWatched(watchedMovies.reduce((acc, film) => {
      return acc += Number(film.Runtime.replace(" min", ""))
    }, 0))
  }, [watchedMovies])


  const handleSearchChange = (e) => setInputSearch(e.target.value)
  const handleBackClick = () => setClickedMovie([])
  const handleRatingClick = () => setRating(form.rating.value)

  const handleSearchSubmit = (e) => {
    e.preventDefault()

    if(inputSearch.length < 2) {
      return
    }

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${inputSearch}`)
      .then(data => data.json())
      .then(resp => {
        setMovies(resp.Search)
      })
      .catch(console.log)
  }

  const handleMovieClick = (movie) => {
    const isFilmOnList = watchedMovies.find(film => film.imdbID == movie.imdbID)
    const isTheSameFilm = movie.imdbID == clickedMovie.imdbID
    if(isFilmOnList || isTheSameFilm) {
      return
    }

    const idMovieCicked = (movie.imdbID);

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${idMovieCicked}`)
      .then(data => data.json())
      .then(resp => {
        if(resp.Runtime === "N/A") {
          setClickedMovie({...resp, Runtime: "0 min"})
          return
        }
        setClickedMovie(resp)
      })
      .catch(console.log)
  }

  const handleAddFilm = (e) => {
    e.preventDefault()
    setWatchedMovies(prev => [...prev, {...clickedMovie, rate: rating}])
    setClickedMovie([])
    setRating("")
  }

  const handleDeleteClick = (e) => {
    const filmIdToDelete = e.currentTarget.id
    setWatchedMovies(watchedMovies.filter(film => film.imdbID != filmIdToDelete))
  }

  const getMoviePoster = (poster) => poster === "N/A" ? "images/404-img.jpg" : poster

  return (
    <>
    <NavBar movies={movies} inputSearch={inputSearch} onSearchMovie={handleSearchSubmit} onChangeMovie={handleSearchChange}/>

      <main className="main">
        <ListBox>
          <Movies getMoviePoster={getMoviePoster} movies={movies} onMovieClick={handleMovieClick}/>
        </ListBox>

        <ListBox>
          {clickedMovie?.length === 0 && <Sumary watchedMovies={watchedMovies} minutesWatched={minutesWatched}/>}

          {clickedMovie?.length !== 0 &&
          <MovieDetails getMoviePoster={getMoviePoster} onButtonBackClick={handleBackClick} clickedMovie={clickedMovie} onClickRating={handleRatingClick} onClickAddFilm={handleAddFilm} rating={rating}/>
          }

          {clickedMovie?.length === 0 && <WatchedMovies getMoviePoster={getMoviePoster} watchedMovies={watchedMovies} onDeleteClick={handleDeleteClick}/>}          
        </ListBox>
      </main>
    </>
  )
};

export default App;
