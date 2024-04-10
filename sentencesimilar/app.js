const https = require('https');
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

const API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2";
const API_TOKEN = "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"; 

app.post("/api/get_similarity_scores", async (req, res) => {
    try {
        const { answers } = req.body;
        const source_sentence = answers.map(({ desired_answer }) => desired_answer).join("");
        const sentences = answers.map(({ answer }) => answer);
        
     
        const headers = {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        };
        const payload = JSON.stringify({ inputs: { source_sentence, sentences } });

        const options = {
            method: "POST",
            headers: headers,
            body: payload
        };

        const request = https.request(API_URL, options, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const similarityScores = JSON.parse(data);
                console.log(similarityScores)

                // const responsedata = answers.map((item, index) => ({
                //     question: item.Question,
                //     desired_answer: item.Desired_Answer,
                //     actual_answer: item.Answer,
                //     score: similarityScores[index]
                // }));
                //console.log(responsedata)

                res.json(similarityScores);
            });
        });

        request.on('error', (error) => {
            console.error("Error:", error);
            res.status(500).json({ error: "An error occurred" });
        });

        request.write(payload);
        request.end();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
