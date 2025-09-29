import app from "./app.js";

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Port is listening on ${port}`);
});
