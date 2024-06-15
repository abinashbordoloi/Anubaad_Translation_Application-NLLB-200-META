import express from 'express';
import  {client}  from "@gradio/client";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Parse incoming request bodies as JSON

app.post('/translate', async (req, res) => {
  try {
    const { sourceLanguage, targetLanguage, inputText } = req.body;
    console.log("sourceLanguage: ", sourceLanguage)
    console.log("targetLanguage: ", targetLanguage)
    console.log("inputText: ", inputText)
    
    
    // Assuming your Gradio client and prediction logic are correctly set up
    const gradioApp = await client('https://debanga-lang-app.hf.space/--replicas/hn5zg/');
 
    console.log("gradioApp: ")
    const result = await gradioApp.predict('/predict', [sourceLanguage, targetLanguage, inputText]);

    res.json({ translation: result.data });
  } catch (error) {
    console.error('Error in translation:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});


