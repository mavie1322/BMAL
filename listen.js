const app = require("./app");

const { PORT = 8080 } = process.env;

app.listen(PORT, (err) => {
  if (err) return err;
  console.log(`Listening to port ${PORT}....`);
});
