import { useReducer } from "react"
import { apiKey } from "@/utils/apiKey"

const reducer = (state, action) => ({
  set_clickedMovie: {...state, clickedMovie: action.clickedMovie},
  set_rating: {...state, rating: action.rating},
  set_tempRating: {...state, tempRating: action.tempRating},
  init_fetch: {...state, fetchingMovieDetails: true},
  ended_fetch: {...state, fetchingMovieDetails: false}
})[action.type] || state

const useClickedMovie = (watchedMovies, setWatchedMovies) => {
  const [state, dispatch] = useReducer(reducer, {clickedMovie: [], rating: "", tempRating: "", fetchingMovieDetails: false})

  const handleBackClick = () => {
    dispatch({type: "set_clickedMovie", clickedMovie: []})
    dispatch({type: "set_rating", rating: ""})
  }
  const handleRatingClick = (rating) => dispatch({type: "set_rating", rating})
  const handleMovieClick = (movie) => {
    const isFilmOnList = watchedMovies.find(film => film.imdbID == movie.imdbID)
    const isTheSameFilm = movie.imdbID == state.clickedMovie.imdbID
    if (isFilmOnList || isTheSameFilm) {
      return
    }
    dispatch({type: "init_fetch"})

    const idMovieClicked = (movie.imdbID);

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${idMovieClicked}`)
      .then(data => data.json())
      .then(resp => {
        if (resp.Runtime === "N/A") {
          dispatch({type: "set_clickedMovie", clickedMovie: { ...resp, Runtime: "0 min" }})
          return
        }
        dispatch({type: "set_clickedMovie", clickedMovie: resp})
      })
      .catch(error => alert(error.message))
      .finally(() => dispatch({type: "ended_fetch"}))
  }

  const handleAddFilm = () => {
    setWatchedMovies(prev => [...prev, { ...state.clickedMovie, rate: state.rating }])
    dispatch({type: "set_clickedMovie", clickedMovie: []})
    dispatch({type: "set_rating", rating: ""})
  }

  const handleMouseEnter = (rating) => { dispatch({type: "set_tempRating", tempRating: rating})}
  const handleMouseLeave = () => { dispatch({type: "set_tempRating", tempRating: ""})}

  return { clickedMovie: state.clickedMovie, dispatchClickedMovie: dispatch, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating: state.rating, handleMouseEnter, handleMouseLeave, tempRating: state.tempRating, fetchingMovieDetails: state.fetchingMovieDetails }
}

export { useClickedMovie }