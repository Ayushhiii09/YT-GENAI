const { GoogleGenerativeAI } = require("@google/generative-ai"); // Corrected import
const puppeteer = require("puppeteer");
const { z } = require("zod");

// Fix 1: Corrected class name and initialization
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
console.log("API KEY LOADED:", process.env.GOOGLE_GENAI_API_KEY?.slice(0, 10));

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating profile match"),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    title: z.string().describe("The job title extracted from the description")
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    // Fix 2: Use stable model name (gemini-1.5-flash)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    const prompt = `
        Analyze the following candidate details against the job description.
        Resume Content: ${resume || "Not provided"}
        Self Description: ${selfDescription || "Not provided"}
        Job Description: ${jobDescription}

        Respond ONLY with a valid JSON object in this exact format, no extra text:
        {
            "title": "extracted job title from the job description",
            "matchScore": 75,
            "technicalQuestions": [{ "question": "", "intention": "", "answer": "" }],
            "behavioralQuestions": [{ "question": "", "intention": "", "answer": "" }],
            "skillGaps": [{ "skill": "", "severity": "low" }],
            "preparationPlan": [{ "day": 1, "focus": "", "tasks": [""] }]
        }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
}

async function generatePdfFromHtml(htmlContent) {
    // Optimization: Use --no-sandbox for environments like Docker/Render
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true, // Ensures colors/styles appear in PDF
        margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" }
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The full HTML string of the tailored resume")
    });

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    const prompt = `
        Analyze the candidate and return ONLY valid JSON.

        Format:
        {
            "matchScore": number,
            "technicalQuestions": [
            { "question": "", "intention": "", "answer": "" }
        ],
        "behavioralQuestions": [
        { "question": "", "intention": "", "answer": "" }
        ],
        "skillGaps": [
        { "skill": "", "severity": "low | medium | high" }
        ],
        "preparationPlan": [
        { "day": number, "focus": "", "tasks": [] }
        ],
        "title": ""
        }

    Resume: ${resume || "Not provided"}
    Self Description: ${selfDescription || "Not provided"}
    Job Description: ${jobDescription}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonContent = JSON.parse(response.text());

    return await generatePdfFromHtml(jsonContent.html);
}

module.exports = { generateInterviewReport, generateResumePdf };