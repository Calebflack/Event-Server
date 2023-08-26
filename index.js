require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const Event = require("./models/Events");
const User = require("./models/Users");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const generateToken = require("./generateToken");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/uploadProfil", express.static("uploadProfil"));

// Get All Events

app.get("/api/events", async (req, res) => {
  try {
    const category = req.query.categorie;
    //const stars = req.query.stars;

    const filter = {};
    if (category) {
      filter.categorie = category;
    }

    const data = await Event.find(filter);

    if (!data) {
      throw new Error("An error occurred while fetching events.");
    }

    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
});

// GET A SINGLE EVENT

app.get("/api/events/:_id", async (req, res) => {
  try {
    const idParam = req.params._id;
    const data = await Event.findOne({ _id: idParam });
    if (!data) {
      throw new Error("An error occurred while fetching events.");
    }
    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
});

// CREATE AN EVENT

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/events", upload.single("thumbnail"), async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const newEvent = new Event({
      code: req.body.code,
      titre: req.body.titre,
      pays: req.body.pays,
      ville: req.body.ville,
      description: req.body.description,
      thumbnail: req.file.filename,
      prix: req.body.prix,
      adresse: req.body.adresse,
      seatNum: req.body.seatNum,
      categorie: req.body.categorie,
      keyword: req.body.keyword,
      debut: req.body.debut,
      fin: req.body.fin,
    });

    await Event.create(newEvent);
    res.json("Data Submitted");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
});

// Update A Book
app.put("/api/events", upload.single("thumbnail"), async (req, res) => {
  try {
    const eventId = req.body.eventId;

    const updateBook = {
      code: req.body.code,
      titre: req.body.titre,
      pays: req.body.pays,
      ville: req.body.ville,
      adresse: req.body.adresse,
      description: req.body.description,
      prix: req.body.prix,
      seatNum: req.body.seatNum,
      categorie: req.body.categorie,
      keyword: req.body.keyword,
      debut: req.body.debut,
      fin: req.body.fin,
    };

    if (req.file) {
      updateBook.thumbnail = req.file.filename;
    }

    await Event.findByIdAndUpdate(eventId, updateBook);
    res.json("Data Submitted");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
});

// DELETE

app.delete("/api/events/:_id/:code", async (req, res) => {
  const eventId = req.params._id;

  try {
    await Event.deleteOne({ _id: eventId });
    res.json("How dare you!" + req.body._Id);
  } catch (error) {
    res.json(error);
  }
});

// *********************** USER LOGIN AND LOGOUT  ****************************

// Get All Events

app.get("/api/auth/users", async (req, res) => {
  try {
    const filter = {};
    const data = await User.find(filter);
    if (!data) {
      throw new Error("An error occurred while fetching events.");
    }
    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
});

// LOGIN USER

app.get("/api/auth/users/:email", async (req, res) => {
  try {
    const emailParam = req.params.email;
    const data = await User.findOne({ email: emailParam });
    if (!data) {
      throw new Error("An error occurred while fetching events.");
    }
    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: "An error occurred while fetching events." });
  }
});

// CREATE USER

const storageProfil = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadProfil/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const uploadProfil = multer({ storage: storageProfil });

app.post(
  "/api/auth/users",
  uploadProfil.single("profilImage"),
  async (req, res) => {
    try {
      const email = req.body.email

      const userExists = await User.findOne({ email });

      if (userExists) {
        res.status(400);
        throw new Error("User already exists");
      }else {
      const newUser = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        pays: req.body.pays,
        ville: req.body.ville,
        telephone: req.body.telephone,
        email: req.body.email,
        mdp: req.body.mdp,
        profilImage: req.file.filename,
      });
      const userCreated = await User.create(newUser);
      if (userCreated) {
        generateToken(res, userCreated._id);

        res.status(201).json({
          _id: userCreated._id,
          nom: userCreated.nom,
          prenom: userCreated.prenom,
          pays: userCreated.pays,
          ville: userCreated.ville,
          telephone: userCreated.telephone,
          email: userCreated.email,
          mdp: userCreated.mdp,
          profilImage: userCreated.profilImage,
        });
        console.log("eumm blsksjfku")
      } else {
        res.status(400);
        throw new Error("Invalid user data");
      }
    }
    } catch (error) {
      console.log(error);
    }
  }
);

//DONTKNOW   WHY DO YOU HAVE TO BE LAST ???????????

app.get("/", (req, res) => {
  res.json("Hello mate!");
});

app.get("*", (req, res) => {
  res.sendStatus("404");
});

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
