const express = require("express");
const path = require("path");
const { open} = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPth = path.join(__dirname, "moviesData.db");
let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000/")
        });
    }
    cache(e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }

};
initializeDBAndServer();

//API 1 Returns a list of all movie names in the movie table
const convertDbObjectToResponseObject = (dbObject) => {
    return {
        movieName: dbObject.movie_name;
    };
};


app.get("/movies/", async (request, response) => {
    const getMoviesQuery = `
    SELECT movie_name FROM movie;`;
    const moviesArray = await db.all(getMoviesQuery);
    response.send(
        moviesArray.map((eachMovie) =>
            convertDbObjectToResponseObject(eachMovie))

    );
});

//API 3 Returns a movie based on the movie ID
const ConvertMovieDbAPI3 = (objectItem) => {
    return {
        movieId: objectItem.movie_id,
        directorId: objectItem.director_id,
        movieName: objectItem.movie_name,
        leadActor: objectItem.lead_actor,
    };
};
app.get("/movies/:movieId/", (request, response) => {
    const {
        movieId
    } = request.params;
    const getMovieQuery = `
    SELECT * FROM movie WHERE movie_id = ${movieId};`;
    const movie = await db.get(getMovieQuery);
    response.send(ConvertMovieDbAPI3(movie));
})

//API 2 Creates a new movie in the movie table. movie_id is auto-incremented
app.post("/movies/", async (request, response) => {
    const {
        directorId,
        movieName,
        leadActor
    } = request.body;
    const postMovieQuery = `
    INSERT INTO movie(director_id,movie_name,lead_actor)
    VALUES
    (${directorId},`${movieName}`,`${leadActor}`);`;
    const movie = await db.run(postMovieQuery);
    response.send("Movie Successfully Added");

});

//API 4 Updates the details of a movie in the movie table based on the movie ID
add.put("/movies/:movieId/", async (request, response) => {
    const {directorId,movieName,leadActor} = request.body;
    const {movieId} = request.params;
    const updateMovieQuery = `
    UPDATE movie 
    SET 
    director_iD=${directorId},
    movie_name=`${movieName}`,lead_actor=`${leadActor}`
    WHERE 
    movie_iD=${movieId};`;

    const updateMovie = await db.run(updateMovieQuery);
    response.send("Movie Details Updated")

});

//API 5 Deletes a movie from the movie table based on the movie ID
app.delete("/movies/:movieId/", async (request, response) => {
    const {
        movieId
    } = request.params;
    const deleteMovieQuery = `
    DELETE FROM movie
    WHERE 
    movie_id=${movieId};`;
    const deleteMovie = await db.run(deleteMovieQuery);
    response.send("Movie Removed");
});

//API 6 Returns a list of all directors in the director table
const convertDbObjectToResponseObject1 = (dbObject1) => {
    return {
        directorId: dbObject1.director_id,
        directorName: dbObject1.director_name,
    };
};

app.get("/directors/", async (request, response) => {
    const getDirectorQuery = `
    SELECT * FROM director;`;
    const directorArray = await db.all(getDirectorQuery);
    response.send(
        directorArray.map((eachDirector) => {
                convertDbObjectToResponseObject1(eachDirector))
        }
    );
});

//API 7 Returns a list of all movie names directed by a specific director
app.get("/directors/:directorId/movies/", async (request, response) => {
    const {
        directorId
    } = request.params;

    const getDirectorQuery = `
    SELECT movie_name as movieName FROM movie WHERE director_id=${directorId};`;

    const movie = await db.all(getDirectorQuery);
    response.send(movie)
});

module.exports = app;