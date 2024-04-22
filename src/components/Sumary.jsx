const Sumary = ({watchedMovies, minutesWatched}) => (
  <div className="summary">
    <h2>filmes assistidos</h2>
    <div>
      <p>
        <span>#️⃣</span>{" "}
        <span>{watchedMovies?.length} {watchedMovies?.length === 1 ? "filme" : "filmes"}</span>
      </p>
      <p>
        <span>⏳</span>{" "}
        <span>{minutesWatched} minutos</span>
      </p>
    </div>
  </div>
)

export { Sumary }