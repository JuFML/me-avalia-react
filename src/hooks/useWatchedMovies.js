import { useEffect, useState } from "react"

const useWatchedMovie = () => {
  const [watchedMovies, setWatchedMovies] = useState([])
  const [minutesWatched, setMinutesWatched] = useState(0)

  useEffect(() => {
    setMinutesWatched(watchedMovies.reduce((acc, film) => {
      return acc += Number(film.Runtime.replace(" min", ""))
    }, 0))
  }, [watchedMovies])

  const handleDeleteClick = (e) => {
    const filmIdToDelete = e.currentTarget.id
    setWatchedMovies(watchedMovies.filter(film => film.imdbID != filmIdToDelete))
  }

  return { watchedMovies, setWatchedMovies, minutesWatched, handleDeleteClick }
}

export { useWatchedMovie }