
import { useReducer } from "react";

import IconButton from "@mui/material/IconButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import Badge from "@mui/material/Badge";

const reducer = (state, action) => {
  switch (action.type) {
    case "likes":
      return { ...state, likes: state.likes + 1 };
    case "dislikes":
      return { ...state, dislikes: state.dislikes + 1 };

    default:
      return state;
  }
};

const initialState = { likes: 0, dislikes: 0 };
export default function App() {
  return (
    <div className="App">
      <Counter />
    </div>
  );
}
export function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="counter-Container">
      <IconButton color="primary" onClick={() => dispatch({ type: "likes" })}>
        <Badge badgeContent={state.likes} color="primary">
          <ThumbUpIcon />
        </Badge>
      </IconButton>

      <IconButton color="error" onClick={() => dispatch({ type: "dislikes" })}>
        <Badge badgeContent={state.dislikes} color="error">
          <ThumbDownIcon />
        </Badge>
      </IconButton>
    </div>
  );
}
