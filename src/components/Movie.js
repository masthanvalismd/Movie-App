import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Counter } from "./Counter";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export function Movie({ poster, name, rating, summary, deleteButton,editButton, id }) {
  const styles = {
    color: rating >= 8.5 ? "green" : "crimson",
  };
  const [show, setShow] = useState(true);
  const history = useHistory();
 
  return (
    <div className="movie-container">
      <img className="pic" src={poster} alt="img" />
      <Counter />
      
      <div className="btn-grp">
        <div className="delBtn">{deleteButton}</div>
        <div className="editBtn">{editButton}</div>
      </div>
      <div className="det">
        <h2>{name}</h2>
        <IconButton
          onClick={() => history.push(`/movies/${id}`)}
          color="primary"
          aria-label="aboutMovies"
        >
          <InfoIcon />
        </IconButton>
       
        <IconButton onClick={() => setShow(!show)}>
          {show ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <p style={styles} className="rating">
          {rating}⭐
        </p>
      </div>
      {show ? <p className="movie-summary">{summary}</p> : ""}
    </div>
  );
}
