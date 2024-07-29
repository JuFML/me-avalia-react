import { useReducer, useEffect, useState } from "react"
import { apiKey } from "@/utils/apiKey"

const reducer = (state, action) => ({
  set_clickedMovie: {...state, clickedMovie: action.clickedMovie},
  set_rating: {...state, rating: action.rating},
  set_tempRating: {...state, tempRating: action.tempRating},
  init_fetch: {...state, fetchingMovieDetails: true},
  ended_fetch: {...state, fetchingMovieDetails: false}
})[action.type] || state

const useMovies = () => {
  const [state, dispatch] = useReducer(reducer, {clickedMovie: [], rating: 0, tempRating: 0, fetchingMovieDetails: false})
  const [watchedMovies, setWatchedMovies] = useState([])
  const [minutesWatched, setMinutesWatched] = useState(0)

  useEffect(() => {
    setMinutesWatched(watchedMovies.reduce((acc, film) => {
      return acc += Number(film.Runtime.replace(" min", ""))
    }, 0))
  }, [watchedMovies])

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    const filmIdToDelete = e.currentTarget.id
    setWatchedMovies(watchedMovies.filter(film => film.imdbID != filmIdToDelete))
  }

  const handleBackClick = () => {
    dispatch({type: "set_clickedMovie", clickedMovie: []})
    dispatch({type: "set_rating", rating: 0})
  }
  const handleRatingClick = (rating) => {
    if(rating === state.rating) {
      dispatch({type: "set_rating", rating: 0})
      return
    }
    
    dispatch({type: "set_rating", rating})}
  const handleMovieClick = (movie) => {
    const isFilmOnList = watchedMovies.find(film => film.imdbID == movie.imdbID)
    const isTheSameFilm = movie.imdbID == state.clickedMovie.imdbID
    const isRated = movie.rate != undefined
    if (!isRated && isFilmOnList || isTheSameFilm) {
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
        dispatch({type: "set_rating", rating: movie.rate || 0})
        dispatch({type: "set_clickedMovie", clickedMovie: resp})
      })
      .catch(error => alert(error.message))
      .finally(() => dispatch({type: "ended_fetch"}))
  }

  const handleAddFilm = () => {    
    const isFilmOnList = watchedMovies.find(film => film.imdbID == state.clickedMovie.imdbID)
    if(isFilmOnList) {
      setWatchedMovies(prev => prev.map(movie => state.clickedMovie.imdbID === movie.imdbID ? {...movie, rate: state.rating} : movie))
      dispatch({type: "set_clickedMovie", clickedMovie: []})
      dispatch({type: "set_rating", rating: 0})
      return
    }
    setWatchedMovies(prev => [...prev, { ...state.clickedMovie, rate: state.rating }])
    dispatch({type: "set_clickedMovie", clickedMovie: []})
    dispatch({type: "set_rating", rating: 0})
  }

  const handleMouseEnter = (rating) => { dispatch({type: "set_tempRating", tempRating: rating})}
  const handleMouseLeave = () => { dispatch({type: "set_tempRating", tempRating: 0})}

  return { watchedMovies, setWatchedMovies, minutesWatched, handleDeleteClick, clickedMovie: state.clickedMovie, dispatchClickedMovie: dispatch, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating: state.rating, handleMouseEnter, handleMouseLeave, tempRating: state.tempRating, fetchingMovieDetails: state.fetchingMovieDetails }
}

export { useMovies }