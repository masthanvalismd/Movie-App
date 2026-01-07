#  MovieFlix - MERN Movies App

A modern, Netflix-style movie browsing application built with the MERN stack (MongoDB replaced with JSON file for simplicity). Features a sleek dark/light theme, watchlist functionality, and responsive design.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express)
![MUI](https://img.shields.io/badge/MUI-5.14.17-007FFF?logo=mui)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)

##  Features

-  **Netflix-style UI** - Modern, responsive design with hero sections and horizontal scrolling
-  **Advanced Search & Filters** - Search by name, filter by genre and rating, sort options
-  **Dark/Light Theme** - Toggle between themes with persistent preference
-  **Watchlist** - Save movies to watch later (persisted in localStorage)
-  **Recently Viewed** - Track your viewing history
-  **Lazy Loading** - Code splitting for optimal performance
-  **Skeleton Loaders** - Smooth loading states
-  **Fully Responsive** - Works on mobile, tablet, and desktop
-  **CRUD Operations** - Add, edit, delete movies
-  **Cast Information** - View cast and crew details

##  Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **React Router v6** - Client-side routing
- **Material UI (MUI)** - Component library
- **Formik + Yup** - Form handling and validation
- **Context API** - Global state management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **JSON File** - Data storage (easily replaceable with MongoDB)

##  Project Structure

```
Movies-App/
 backend/
    movies.json       # Movie data storage
    package.json
    server.js         # Express API server
 frontend/
    public/
       image.png     # Brand logo
       index.html
    src/
       components/
          AddMovie.js
          Home.js
          Movie.js
          MovieDetails.js
          MovieList.js
          NotFound.js
          Skeletons.js
          UpdateDetails.js
          Watchlist.js
       context/
          AppContext.js
       hooks/
          useMovies.js
       services/
          movieApi.js
       App.js
       App.css
       index.js
    package.json
 .gitignore
 README.md
```

##  Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Movies-App.git
   cd Movies-App
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the App

1. **Start the Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm start
   ```
   Server runs at http://localhost:5000

2. **Start the Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm start
   ```
   App opens at http://localhost:3000

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /movies | Get all movies |
| GET | /movies/:id | Get movie by ID |
| POST | /movies | Create new movie |
| PUT | /movies/:id | Update movie |
| DELETE | /movies/:id | Delete movie |

### Movie Schema

```json
{
  "id": "1767706551001",
  "name": "Movie Name",
  "poster": "https://...",
  "rating": 8.5,
  "summary": "Movie description...",
  "trailer": "https://youtube.com/embed/...",
  "year": 2024,
  "genre": "Action, Drama",
  "duration": "2h 30m",
  "cast": [
    {
      "name": "Actor Name",
      "role": "Character",
      "avatar": "https://..."
    }
  ]
}
```

##  Configuration

### Environment Variables (Optional)

Create .env file in frontend folder:
```
REACT_APP_API_URL=http://localhost:5000
```

### Switching to MongoDB

Replace the JSON file storage in backend/server.js with MongoDB:

```javascript
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/moviesdb');
```

##  Available Scripts

### Frontend
- npm start - Run development server
- npm build - Build for production
- npm test - Run tests

### Backend
- npm start - Start Express server
- npm run dev - Start with auto-reload (nodemon)

##  Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

##  License

This project is open source and available under the MIT License.

##  Author

**Mohammed Masthan Vali**

---

 Star this repo if you found it helpful!
