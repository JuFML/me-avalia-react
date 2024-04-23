import { useEffect } from "react"
import { useClickedMovie } from "../hooks/useClickedMovie"
import { useWatchedMovie } from "../hooks/useWatchedMovies"
import localForage from "localforage"
import { Movies } from "./Movies"
import { Sumary } from "./Sumary"
import { MovieDetails } from "./MovieDetails"
import { WatchedMovies } from "./WatchedMovies"

const ListBox = ({children}) => <div className="box">{children}</div>

const Main = ({movies}) => {
  const {watchedMovies, setWatchedMovies, minutesWatched, handleDeleteClick} = useWatchedMovie()
  const {clickedMovie, setClickedMovie, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating, handleMouseEnter, handleMouseLeave, tempRating} = useClickedMovie(watchedMovies, setWatchedMovies)

  useEffect(() => {
    setClickedMovie([])
  }, [movies])

  useEffect(() => {
    localForage.setItem("watchedMovies", watchedMovies)
      .catch(error => alert(error.message))
  }, [watchedMovies])

  useEffect(() => {
    localForage.getItem("watchedMovies")
      .then(movies => movies && setWatchedMovies(movies))
      .catch(error => alert(error.message))
  }, [])

  return (
    <main className="main">
        <ListBox>
          <Movies movies={movies} onMovieClick={handleMovieClick}/>
        </ListBox>

        <ListBox>
          {clickedMovie?.length === 0 && <Sumary watchedMovies={watchedMovies} minutesWatched={minutesWatched}/>}

          {clickedMovie?.length !== 0 &&
          <MovieDetails onButtonBackClick={handleBackClick} clickedMovie={clickedMovie} onClickRating={handleRatingClick} onClickAddFilm={handleAddFilm} rating={rating} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} tempRating={tempRating}/>
          }

          {clickedMovie?.length === 0 && <WatchedMovies watchedMovies={watchedMovies} onDeleteClick={handleDeleteClick}/>}
        </ListBox>
      </main>
  )
}

export { Main }