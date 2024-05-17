import { useEffect } from "react"
import { useClickedMovie } from "@/hooks/useClickedMovie"
import { useWatchedMovie } from "@/hooks/useWatchedMovies"
import localForage from "localforage"
import { Movies } from "@/components/Movies"
import { Sumary } from "@/components/Sumary"
import { MovieDetails } from "@/components/MovieDetails"
import { WatchedMovies } from "@/components/WatchedMovies"
import { Loader } from "./Loader"

const ListBox = ({children}) => <div className="box">{children}</div>

const Main = ({movies, dispatch, fetchingMovies}) => {
  const {watchedMovies, setWatchedMovies, minutesWatched, handleDeleteClick} = useWatchedMovie()
  const {clickedMovie, setClickedMovie, handleBackClick, handleRatingClick, handleMovieClick, handleAddFilm, rating, handleMouseEnter, handleMouseLeave, tempRating, fetchingMovieDetails} = useClickedMovie(watchedMovies, setWatchedMovies)

  useEffect(() => {
    setClickedMovie([])
  }, [movies])

  useEffect(() => {
    localForage.setItem("watchedMovies", watchedMovies)
      .catch(error => alert(error.message))
  }, [watchedMovies])

  useEffect(() => {
    dispatch({type: "init_fetch"})
    localForage.getItem("watchedMovies")
      .then(movies => {
        movies && setWatchedMovies(movies)})
      .catch(error => alert(error.message))
      .finally(() => dispatch({type: "ended_fetch"}))
  }, [])

  return (
    <main className="main">
        <ListBox>
          {fetchingMovies ? <Loader /> : <Movies movies={movies} onMovieClick={handleMovieClick}/>}
        </ListBox>

        <ListBox>
          {clickedMovie?.length === 0 && <Sumary watchedMovies={watchedMovies} minutesWatched={minutesWatched}/>}

          {fetchingMovieDetails ? <Loader/> :  clickedMovie?.length !== 0 &&
          <MovieDetails onButtonBackClick={handleBackClick} clickedMovie={clickedMovie} onClickRating={handleRatingClick} onClickAddFilm={handleAddFilm} rating={rating} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} tempRating={tempRating}/>
          }

          {clickedMovie?.length === 0 && <WatchedMovies watchedMovies={watchedMovies} onDeleteClick={handleDeleteClick}/>}
        </ListBox>
      </main>
  )
}

export { Main }