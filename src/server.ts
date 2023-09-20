import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";
import morgan from "morgan";

dotenv.config();

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

interface Recipe {
    title: string;
    meal_type: string;
    cuisine: string;
    video_url: string;
}

app.get("/", async (_req, res) => {
    res.json({
        msg: "Hello! There's nothing interesting for GET / from this recipe backend server",
    });
});

app.get("/recipes", async (_req, res) => {
    try {
        const response = await client.query("select * from recipes");
        res.status(200).json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

app.post<{}, {}, Recipe>("/recipes", async (req, res) => {
    try {
        const { title, meal_type, cuisine, video_url } = req.body;
        const insertQuery =
            "INSERT INTO RECIPES (title, meal_type, cuisine, video_url) VALUES ($1,$2,$3,$4) RETURNING * ";
        const values = [title, meal_type, cuisine, video_url];
        const response = await client.query(insertQuery, values);

        res.status(201).json(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

app.delete<{ id: number }>("/recipes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const deleteQuery = "DELETE FROM RECIPES WHERE  id = $1 RETURNING *";
        const value = [id];
        const response = await client.query(deleteQuery, value);
        res.status(200).json({
            deletedRecipe: response.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

app.get("/health-check", async (_req, res) => {
    try {
        //For this to be successful, must connect to db
        await client.query("select now()");
        res.status(200).send("system ok");
    } catch (error) {
        //Recover from error rather than letting system halt
        console.error(error);
        res.status(500).send("An error occurred. Check server logs.");
    }
});

connectToDBAndStartListening();

async function connectToDBAndStartListening() {
    console.log("Attempting to connect to db");
    await client.connect();
    console.log("Connected to db!");

    const port = getEnvVarOrFail("PORT");
    app.listen(port, () => {
        console.log(
            `Server started listening for HTTP requests on port ${port}.  Let's go!`
        );
    });
}
