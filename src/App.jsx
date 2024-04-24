import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";
import { Main } from "@/components/Main"
import { apiKey } from "@/utils/apiKey"

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
