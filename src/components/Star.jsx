const Star = ({tempRating, rating, i, onClickRating, onMouseEnter, onMouseLeave}) => (
  <div onClick={() => onClickRating(i + 1)} onMouseOver={() => onMouseEnter(i + 1)} onMouseOut={() => onMouseLeave()}>
    {i < tempRating || i < rating ? <img className="rating-star" src="images/star-filled.svg" alt="star"/> : <img className="rating-star" src="images/star-empty.svg" alt="star"/>}
  </div>
)

export { Star }