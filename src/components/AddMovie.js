import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useHistory } from "react-router-dom";

const movievalidationSchema = yup.object({
  name: yup
    .string()
    .required("please provide the Name 😉"),
  rating: yup
    .number()
    .min(1, "provide a better rating 😁")
    .max(10, "too much rating 😁")
    .required("please provide rating"),
  poster: yup
    .string()
    .min(5, "provide a bigger poster link 😁")
    .required("please provide poster"),
  summary: yup
    .string()
    .min(20, "provide a bigger summary 😁")
    .required("please provide summary"),
  trailer: yup
    .string()
    .min(5, "provide a bigger trailer link 😁")
    .required("please provide trailer"),
});
export function AddMovie() {
  const { handleChange, handleSubmit, handleBlur, values, touched, errors } =
    useFormik({
      initialValues: {
        name: "",
        rating: "",
        poster: "",
        summary: "",
        trailer: "",
      },
      validationSchema: movievalidationSchema,
      onSubmit: (newMovie) => {
        addMovie(newMovie);
        console.log("onSubmit", newMovie);
      },
    });
  console.log("formik.touched", touched);
  const addMovie = (newMovie) => {
    fetch("https://61c55338c003e70017b7965d.mockapi.io/movies", {
      method: "POST",
      body: JSON.stringify(newMovie),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then(() => history.push("/movies"));
  };

  const history = useHistory();
  return (
    <form onSubmit={handleSubmit} className="textField">
      <TextField
        label="Enter a Name"
        variant="standard"
        style={{ width: "90%", margin: "0px 8px", paddingLeft: "5px" }}
        id="name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name && errors.name}
        helperText={touched.name && errors.name ? errors.name : ""}
      />
      
      <TextField
        label="Enter Rating"
        variant="standard"
        style={{ width: "90%", margin: "0px 8px", paddingLeft: "5px" }}
        id="rating"
        name="rating"
        value={values.rating}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.rating && errors.rating}
        helperText={touched.rating && errors.rating ? errors.rating : ""}
      />
      <TextField
        label="Enter Poster Link"
        variant="standard"
        style={{ width: "90%", margin: "0px 8px", paddingLeft: "5px" }}
        id="poster"
        name="poster"
        value={values.poster}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.poster && errors.poster}
        helperText={touched.poster && errors.poster ? errors.poster : ""}
      />
      <TextField
        label="Enter Summary"
        variant="standard"
        style={{ width: "90%", margin: "0px 8px", paddingLeft: "5px" }}
        id="summary"
        name="summary"
        value={values.summary}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.summary && errors.summary}
        helperText={touched.summary && errors.summary ? errors.summary : ""}
      />
      <TextField
        label="Enter Trailer"
        variant="standard"
        style={{ width: "90%", margin: "0px 8px", paddingLeft: "5px" }}
        id="trailer"
        name="trailer"
        value={values.trailer}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.trailer && errors.trailer}
        helperText={touched.trailer && errors.trailer ? errors.trailer : ""}
      />
      <div className="btn">
        <Button
          variant="outlined"
          style={{ backgroundColor: "black", color: "#FFFFFF" }}
          type="submit"
        >
          AddMovie
        </Button>
      </div>
    </form>
  );
}
