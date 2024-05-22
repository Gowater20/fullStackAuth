const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

app.post("/register-user", (req, res) => {
	const { name, email, password } = req.body;

	if (!name.length || !email.length || !password.length) {
		res.json("fill all the fields");
	} else {
		const newUser = new User({ name: name, email: email, password: password });
		newUser
			.save()
			.then((data) => {
				res.json(data);
			})
			.catch((err) => {
				if (err.code === 11000) {
					res.json("email already exists");
				}
			});
	}
});

app.post("/login-user", (req, res) => {
	const { email, password } = req.body;

	User.findOne({ email: email, password: password }).then((data) => {
		if (data) {
			res.json(data);
		} else {
			res.json("email or password is incorrect");
		}
	});
});

app.listen(3000, (req, res) => {
	console.log("listening on port 3000......");
});
