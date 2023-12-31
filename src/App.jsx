import { useState, useEffect } from "react";

const App = () => {
  const [movies, setMovies] = useState([])
  const [inputSearch, setInputSearch] = useState("")
  const [searchedMovies, setSearchedMovies] = useState([])
  const [clickedMovie, setClickedMovie] = useState([])
  
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
          {clickedMovie.length === 0 && <div className="summary">
            <h2>filmes assistidos</h2>
            <div>
              <p>#️⃣ 0 filmes</p>
              <p>⏳ 0 minutos</p>
            </div>
          </div>}
          
          {clickedMovie.length !== 0 &&<div className="details">
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
                <div className="rating"></div>
                <p>{clickedMovie.Plot}</p>
                <p>Elenco: {clickedMovie.Actors}</p>
                <p>Direcao: {clickedMovie.Director}</p>
            </section>
          </div>}
          
          <div className="list list-watched">
          </div>
        </div>
      </main>
    </>
  )
};

export default App;
