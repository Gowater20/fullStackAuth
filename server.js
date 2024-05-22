const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

mongoose.connect("mongodb://localhost:27017/fullStack");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
	console.log("Database connected");
});

const userSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

let intialPath = path.join(__dirname, "public");

app.use(bodyParser.json());
app.use(express.static(intialPath));

app.get("/", (req, res) => {
	res.sendFile(path.join(intialPath, "index.html"));
});

app.get("/login", (req, res) => {
	res.sendFile(path.join(intialPath, "login.html"));
});

app.get("/register", (req, res) => {
	res.sendFile(path.join(intialPath, "register.html"));
});


app.post("/register-user", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name.length || !email.length || !password.length) {
        res.json("fill all the fields");
        return;
    }

    try {
        // Controlla se l'email è già presente nel database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.json("email already exists");
            return;
        }

        // Cripta la password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea il nuovo utente con la password criptata
        const newUser = new User({ name, email, password: hashedPassword });
        const data = await newUser.save();

        res.json(data);
    } catch (err) {
        res.status(500).json("internal server error");
    }
});

app.post("/login-user", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Trova l'utente per email
        const user = await User.findOne({ email });

        if (!user) {
            res.json("email or password is incorrect");
            return;
        }

        // Confronta la password fornita con quella salvata
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json(user);
        } else {
            res.json("email or password is incorrect");
        }
    } catch (err) {
        res.status(500).json("internal server error");
    }
});

app.listen(3000, (req, res) => {
	console.log("listening on port 3000......");
});
