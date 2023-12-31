import { useEffect } from "react";
import Navbar from "./components/Navbar";
import { useState } from "react";

const App = () => {
  const [movies, setMovies] = useState([])
  
  useEffect(() => {
    fetch("./src/a.json")
      .then(data => data.json())
      .then(resp => setMovies(resp))
      .catch(console.log)
  }, [])
  return (
    <>
      <Navbar movies={movies}/>
      <main className="main">
        <div className="box">
          <ul className="list list-movies">
            {movies.map(movie => (
              <li key={movie.imdbID}>
                <img src={movie.Poster} alt="" />
                <h3>{movie.Title}</h3>
                <p>📅 {movie.Year}</p>
            </li>
            ))}
          </ul>
        </div>
        <div className="box">
          <div className="summary">
            <h2>filmes assistidos</h2>
            <div>
              <p>#️⃣ 0 filmes</p>
              <p>⏳ 0 minutos</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
};

export default App;
