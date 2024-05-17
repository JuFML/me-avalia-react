import { useState } from "react"
import { apiKey } from "@/utils/apiKey"

const useClickedMovie = (watchedMovies, setWatchedMovies) => {
  const [clickedMovie, setClickedMovie] = useState([])
  const [rating, setRating] = useState("")
  const [tempRating, setTempRating] = useState("")
  const [fetchingMovieDetails, setFetchingMovieDetails] = useState(false)

  const handleBackClick = () => {
    setClickedMovie([])
    setRating()
  }
  const handleRatingClick = (rating) => setRating(rating)
  const handleMovieClick = (movie) => {
    const isFilmOnList = watchedMovies.find(film => film.imdbID == movie.imdbID)
    const isTheSameFilm = movie.imdbID == clickedMovie.imdbID
    if (isFilmOnList || isTheSameFilm) {
      return
    }
    setFetchingMovieDetails(true)

    const idMovieClicked = (movie.imdbID);

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${idMovieClicked}`)
      .then(data => data.json())
      .then(resp => {
        if (resp.Runtime === "N/A") {
          setClickedMovie({ ...resp, Runtime: "0 min" })
          return
        }
        setClickedMovie(resp)
      })
      .catch(error => alert(error.message))
      .finally(() => setFetchingMovieDetails(false))
  }

  const handleAddFilm = () => {
    setWatchedMovies(prev => [...prev, { ...clickedMovie, rate: rating }])
    setClickedMovie([])
    setRating("")
  }

  const handleMouseEnter = (rating) => { setTempRating(rating) }
  const handleMouseLeave = () => { setTempRating("") }

  return { clickedMovie, setClickedMovie, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating, handleMouseEnter, handleMouseLeave, tempRating, fetchingMovieDetails }
}

export { useClickedMovie }