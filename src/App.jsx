import { useEffect, useReducer } from "react";
import { NavBar } from "@/components/NavBar";
import { Main } from "@/components/Main"
import { apiKey } from "@/utils/apiKey"

const reducer = (state, action) => ({
  set_movies: {...state, movies: action.movies},
  init_fetch: {...state, fetchingMovies: true},
  ended_fetch: {...state, fetchingMovies: false},
})[action.type || state]

const App = () => {
  const [state, dispatch] = useReducer(reducer, {movies: [], fetchingMovies: false})

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=${apiKey}`)
    .then(data => data.json())
    .then(resp => dispatch({type: "set_movies", movies: resp.Search}))
    .catch(error => alert(error.message))
  }, [])

  return (
    <>
      <NavBar movies={state?.movies} dispatch={dispatch} fetchingMovies={state?.fetchingMovies}/>
      <Main movies={state?.movies} dispatch={dispatch} fetchingMovies={state?.fetchingMovies}/>
    </>
  )
};

export default App;
