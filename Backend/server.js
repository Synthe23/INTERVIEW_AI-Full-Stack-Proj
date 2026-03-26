import app from "./src/app.js";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
// import invokeGeminiAiModel from "./src/services/ai.service.js";


dotenv.config();
connectDB();
// invokeGeminiAiModel();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is listening on the port ${PORT}`);
});

