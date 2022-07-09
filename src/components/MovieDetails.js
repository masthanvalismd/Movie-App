import { useParams, useHistory } from "react-router-dom";
import{useState,useEffect} from "react";
import Button from '@mui/material/Button';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
export function MovieDetails() {
  // console.log(movies);
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  // const movie = movies[id];

  const getMovies = () => {
    fetch(`https://61c55338c003e70017b7965d.mockapi.io/movies/${id}`, {
      method: "GET",
    })
    .then((data) => data.json())
    .then((mv) => setMovie(mv));
  };
  useEffect(getMovies);
  const history= useHistory()

  return (
    <div>
      <iframe
        width="100%"
        height="500"
        src={movie.trailer}
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <div className="movie-details-container">
        <div className="det">
          <h3 className="movie-name">{movie.name}</h3>
          <p className="movie-rating">⭐ {movie.rating}</p>
        </div>
        <p className="movie-summary">{movie.summary}</p>
        <Button
        variant="outlined"
          onClick={() => history.goBack()}
          startIcon={<ArrowBackIosIcon />}
          >
          Back
        </Button>
      </div>
    </div>
  );
}
