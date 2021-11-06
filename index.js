import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

async function createConnection() {
  const client = new MongoClient(process.env.MONGO_URL);

  await client.connect();
  console.log("Successfully connected");
  return client;
}

createConnection();

//Get Home page
app.get("/", (request, response) => {
  response.send("Assign Mentor to Students API");
});

//Create a mentor
app.post("/mentors", async (request, response) => {
  const client = await createConnection();
  const newMentor = request.body;
  const mentors = await client
    .db("assign-mentors")
    .collection("mentors")
    .insertMany(newMentor);
  response.send(mentors);
});

//Get all mentors
app.get("/mentors", async (request, response) => {
  const client = await createConnection();

  const mentors = await client
    .db("assign-mentors")
    .collection("mentors")
    .find({})
    .toArray();
  response.send(mentors);
});

//Create a student
app.post("/students", async (request, response) => {
  const client = await createConnection();
  const newStudent = request.body;

  const student = await client
    .db("assign-mentors")
    .collection("students")
    .insertMany(newStudent);

  console.log(student);
  response.send(student);
});

//Get all students
app.get("/students", async (request, response) => {
  const client = await createConnection();

  const student = await client
    .db("assign-mentors")
    .collection("students")
    .find({})
    .toArray();

  console.log(student);
  response.send(student);
});

//Get students with no mentors
app.get("/students/free", async (request, response) => {
  const client = await createConnection();

  const student = await client
    .db("assign-mentors")
    .collection("students")
    .find({ mentorID: "" })
    .toArray();

  console.log(student);
  response.send(student);
});

//select one mentor and add multiple students
app.post("/mentors/:id", async (request, response) => {
  const client = await createConnection();
  const mentorId = request.params.id;
  const newStudents = request.body;

  const result = await newStudents.map((el) => {
    return {
      studentID: el.studentID,
      studentName: el.studentName,
      mentorID: +mentorId,
    };
  });

  const student = await client
    .db("assign-mentors")
    .collection("students")
    .insertMany(result);

  console.log(student);
  response.send(student);
});

//Get student by Mentor ID
app.get("/mentors/:id", async (request, response) => {
  const client = await createConnection();
  const mentorId = request.params.id;

  const student = await client
    .db("assign-mentors")
    .collection("students")
    .find({ mentorID: +mentorId })
    .toArray();

  console.log(student);
  response.send(student);
});

//Get student by ID
app.get("/students/:id", async (request, response) => {
  const client = await createConnection();
  const id = request.params.id;

  const student = await client
    .db("assign-mentors")
    .collection("students")
    .find({ studentID: +id })
    .toArray();

  console.log(student);
  response.send(student);
});

//Get student by ID and change mentor
app.patch("/students/:id/:mentorId", async (request, response) => {
  const client = await createConnection();
  const id = request.params.id;
  const mentorId = request.params.mentorId;

  const student = await client
    .db("assign-mentors")
    .collection("students")
    .updateOne({ studentID: +id }, { $set: { mentorID: mentorId } });

  console.log(student);
  response.send(student);
});

//Delete student by ID
app.delete("/students/:id", async (request, response) => {
  const client = await createConnection();
  const id = request.params.id;

  const student = await client
    .db("assign-mentors")
    .collection("students")
    .deleteOne({ studentID: +id });

  console.log(student);
  response.send(student);
});


app.listen(PORT, () => "Server has started at Port", PORT);