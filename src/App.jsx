import { useState, useEffect } from "react";

const App = () => {
  const [movies, setMovies] = useState([])
  const [inputSearch, setInputSearch] = useState("")
  const [searchedMovies, setSearchedMovies] = useState([])
  const [clickedMovie, setClickedMovie] = useState([])
  const [watchedMovies, setWatchedMovies] = useState([])
  const [rating, setRating] = useState("")
  const [minutesWatched, setMinutesWatched] = useState(0)
  console.log(watchedMovies);
  
  useEffect(() => {
    fetch("./src/a.json")
      .then(data => data.json())
      .then(resp => {
        setMovies(resp)
        setSearchedMovies(resp)
      })
      .catch(console.log)
  }, [])

  useEffect(() => {
    if(inputSearch === "") {
      setSearchedMovies([...movies])
    }
  }, [inputSearch])
  

  useEffect(() => {
    setMinutesWatched(watchedMovies.reduce((acc, film) => {
      return acc += Number(film.Runtime.replace(" min", ""))      
    }, 0))
  }, [watchedMovies])
 

  const handleSearchChange = (e) => {
    setInputSearch(e.target.value.toLowerCase())
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchedMovies(movies.filter(movie => {
      return movie.Title.toLowerCase().includes(inputSearch)
    }))
  }

  const handleMovieClick = (e) => {
    const idMovieCicked = (e.currentTarget.id);
    setClickedMovie(...movies.filter(movie => movie.imdbID === idMovieCicked))
  }

  const handleBackClick = () => setClickedMovie([])
  const handleRatingClick = (e) => setRating(form.rating.value)
  const handleAddFilm = (e) => {
    e.preventDefault()
    setWatchedMovies(prev => [...prev, {...clickedMovie, rate: rating}])
    setClickedMovie([])
    setRating("")
  }

  return (
    <>
      <section className="nav-bar">
        <img className="logo" src="/images/logo-me-avalia.png" alt="" />
        <form className="form-search" onSubmit={handleSearchSubmit}>
          <input value={inputSearch} className="search" type="text" placeholder="Buscar filmes..." onChange={handleSearchChange}/>
          <button className="btn-search">Buscar</button>
        </form>
        <div className="num-results"><strong>{movies.length}</strong> Resultados</div>
      </section>
      <main className="main">
        <div className="box">
          <ul className="list list-movies">
            {searchedMovies.map(movie => (
              <li key={movie.imdbID} onClick={handleMovieClick} id={movie.imdbID}>
                <img src={movie.Poster} alt="" />
                <h3>{movie.Title}</h3>
                <p>📅 {movie.Year}</p>
            </li>
            ))}
          </ul>
        </div>
        <div className="box">
          {clickedMovie.length === 0 &&
           <div className="summary">
            <h2>filmes assistidos</h2>
            <div>
              <p>#️⃣ {watchedMovies.length} filmes</p>
              <p>⏳ {minutesWatched} minutos</p>
            </div>
          </div>}          
          
          {clickedMovie.length !== 0 &&  <div className="details">
            <header className="details-header">
              <div className="btn-back" onClick={handleBackClick}>←</div>
              <img src={clickedMovie.Poster} alt={clickedMovie.Title} />
              <div className="details-overview">
                <h2>{clickedMovie.Title}</h2>
                <p>{clickedMovie.Released} • {clickedMovie.Runtime}</p>
                <p>{clickedMovie.Genre}</p>
                <p>⭐ {clickedMovie.imdbRating} IMDB rating</p>
              </div>
            </header>            
            <section className="details-section">
                <form id="form" className="rating" onClick={handleRatingClick} onSubmit={handleAddFilm}>
                  <div className="rating-radios">
                    <div><input type="radio" value="1" name="rating" /><br/>1</div>
                    <div><input type="radio" value="2" name="rating" /><br/>2</div>
                    <div><input type="radio" value="3" name="rating" /><br/>3</div>
                    <div><input type="radio" value="4" name="rating" /><br/>4</div>
                    <div><input type="radio" value="5" name="rating" /><br/>5</div>
                    <div><input type="radio" value="6" name="rating" /><br/>6</div>
                    <div><input type="radio" value="7" name="rating" /><br/>7</div>
                    <div><input type="radio" value="8" name="rating" /><br/>8</div>
                    <div><input type="radio" value="9" name="rating" /><br/>9</div>
                    <div><input type="radio" value="10" name="rating" /><br/>10</div>
                  </div>
                  {rating && <button className="btn-add">+ Adicionar `a lista</button>}
                </form>
                <p>{clickedMovie.Plot}</p>
                <p>Elenco: {clickedMovie.Actors}</p>
                <p>Direcao: {clickedMovie.Director}</p>
            </section>
          </div>}
          
          <ul className="list list-watched">
            {clickedMovie.length === 0 && watchedMovies.map(movie => (
              <li key={movie.imdbID} onClick={handleMovieClick} id={movie.imdbID}>
                <img src={movie.Poster} alt="" />
                <h3>{movie.Title}</h3>
                <div>
                  <p>⭐ {movie.imdbRating}</p>
                  <p>🌟 {movie.rate}</p>
                  <p>⏳ {movie.Runtime}</p>
                </div>
                <div className="btn-delete">X</div>

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
