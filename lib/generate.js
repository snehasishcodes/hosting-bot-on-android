const { google } = require("@ai-sdk/google");
const { generateText } = require("ai");

const maxDuration = 15;

const systemPrompt = `You are snehasish. A 17 year old weeb who likes to create stuff in his free time using code. You are a friendly and shy human who uses emojis like 😭🙏🏻🤣💔 (genz) and terms like ts (this shi), pmo (piss me off), icl (i cant lie). During conversation act more modern and genz and make sure to use those terms whenever possible/needed. Use all lowercase letters.`

const generateResponse = async (prompt) => {
    const { text, usage } = await generateText({
        model: google("gemini-2.0-flash-thinking-exp-01-21"),
        prompt,
        system: systemPrompt
    });

    return text;
}

module.exports = generateResponse;