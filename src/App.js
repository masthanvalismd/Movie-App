import "./App.css";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { Switch, Route, useHistory } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Paper from "@mui/material/Paper";

import { MovieList } from "./components/MovieList";
import { MovieDetails } from "./components/MovieDetails";
import { NotFound } from "./components/NotFound";
import { Home } from "./components/Home";
import { AddMovie } from "./components/AddMovie";
import { EditMovie } from "./components/UpdateDetails";

export default function App() {
  const [mode, setMode] = useState("light");
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });
  const history = useHistory();

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ minHeight: "100vh", borderRadius: "0px" }} elevation={5}>
        <div className="App">
          <div className="navBar">
            <AppBar postion="static">
              <Toolbar>
                <Button color="inherit" onClick={() => history.push("/")}>
                  🏠Home
                </Button>
                <Button color="inherit" onClick={() => history.push("/movies")}>
                  🎞️AboutMovies
                </Button>
                <Button
                  color="inherit"
                  onClick={() => history.push("/movie/add")}
                >
                  📽️AddMovies
                </Button>

                <Button
                  sx={{ marginLeft: "auto" }}
                  startIcon={
                    mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />
                  }
                  color="inherit"
                  onClick={() => setMode(mode === "light" ? "dark" : "light")}
                >
                  {mode === "light" ? "dark" : "light"}mode
                </Button>
              </Toolbar>
            </AppBar>
          </div>

          <Switch>
            <Route exact path="/">
              <Home />
            </Route>

            <Route path="/movie/add">
              <AddMovie />
            </Route>
            <Route path="/movie/edit/:id">
              <EditMovie />
            </Route>
            <Route path="/movies/:id">
              <MovieDetails />
            </Route>
            <Route path="/movies">
              <div className="add-movie">
                <h2 className="slideInLeft">
                  A Small Website Created By Using "REACT"
                </h2>
              </div>
              <MovieList />
            </Route>
            <Route path="**">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </Paper>
    </ThemeProvider>
  );
}
