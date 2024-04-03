import { useState, useEffect } from "react";

const apiKey = import.meta.env.VITE_API_KEY

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
    if(isFilmOnList) {
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

  return (
    <>
      <nav className="nav-bar">
        <img className="logo" src="/images/logo-me-avalia.png" alt="" />
        <form className="form-search" onSubmit={handleSearchSubmit}>
          <input value={inputSearch} className="search" type="text" placeholder="Buscar filmes..." onChange={handleSearchChange}/>
          <button className="btn-search">Buscar</button>
        </form>
        <p className="num-results"><strong>{movies?.length || 0}</strong> Resultados</p>
      </nav>

      <main className="main">
        <div className="box">
          <ul className="list list-movies">
            {movies?.map(movie => (
              <li key={movie.imdbID} onClick={() => handleMovieClick(movie)} id={movie.imdbID}>
                <img src={movie.Poster} alt="" />
                <h3>{movie.Title}</h3>
                <p>
                  <span>📅</span>{" "}
                  <span>{movie.Year}</span>
                </p>
            </li>
            ))}
          </ul>
        </div>

        <div className="box">
          {clickedMovie?.length === 0 &&
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
          </div>}

          {clickedMovie?.length !== 0 &&  <div className="details">
            <header className="details-header">
              <button className="btn-back" onClick={handleBackClick}>&larr;</button>
              <img src={clickedMovie.Poster} alt={clickedMovie.Title} />
              <div className="details-overview">
                <h2>{clickedMovie.Title}</h2>
                <p>{clickedMovie.Released} &bull; {clickedMovie.Runtime}</p>
                <p>{clickedMovie.Genre}</p>
                <p><span>⭐</span> {clickedMovie.imdbRating} IMDB rating</p>
              </div>
            </header>
            <section className="details-section">
                <form id="form" className="rating" onClick={handleRatingClick} onSubmit={handleAddFilm}>
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
          </div>}

          <ul className="list list-watched">
            {clickedMovie?.length === 0 && watchedMovies.map(movie => (
              <li key={movie.imdbID}>
                <img src={movie.Poster} alt="" />
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
                <div className="btn-delete" id={movie.imdbID} onClick={handleDeleteClick}>X</div>
            </li>
            ))}
          </ul>
          <div className="list list-watched">
          </div>
        </div>
      </main>
    </>
  )
};

export default App;
