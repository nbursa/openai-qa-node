import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  try {
    const config = {
      qa: {
        model: "text-davinci-003",
        prompt: generateQaPrompt(req.body.value),
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["\n"],
      },
      codeCompletion: {
        model: "code-davinci-002",
        prompt: `<|endoftext|>${generateCodePrompt(
          req.body.value
        )}\n--\nLabel:`,
        temperature: 0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["\n"],
      },
      imageGeneration: {
        prompt: req.body.value,
        n: 1,
        size: "1024x1024",
      },
    };
    const type = config[req.body.type];
    if (req.body.type === "imageGeneration") {
      const imageCompletion = await openai.createImage(type);
      res.status(200).json({ imageUrl: imageCompletion.data.data[0].url });
    } else {
      const completion = await openai.createCompletion(type);
      res.status(200).json({ result: completion.data.choices[0].text });
    }
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generateCodePrompt(question) {
  return `# ${question}`;
}

function generateQaPrompt(question) {
  return `I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with \"Unknown\".
    
    Q: What is human life expectancy in the United States?
    A: Human life expectancy in the United States is 78 years.
    
    Q: Who was president of the United States in 1955?
    A: Dwight D. Eisenhower was president of the United States in 1955.
    
    Q: Which party did he belong to?
    A: He belonged to the Republican Party.
    
    Q: What is the square root of banana?
    A: Unknown
    
    Q: How does a telescope work?
    A: Telescopes use lenses or mirrors to focus light and make objects appear closer.
    
    Q: Where were the 1992 Olympics held?
    A: The 1992 Olympics were held in Barcelona, Spain.
    
    Q: How many squigs are in a bonk?
    A: Unknown
    
    Q: ${question}
    A: `;
}
