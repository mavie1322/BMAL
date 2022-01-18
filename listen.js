const app = require("./app");

const port = 8080;

app.listen(port, (err) => {
  if (err) return err;
  console.log(`Listening to port ${port}....`);
});
