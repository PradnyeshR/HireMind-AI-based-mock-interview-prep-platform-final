import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
const pdf = require("pdf-parse/lib/pdf-parse.js");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const jobDescription = formData.get("jobDescription") as string;

        if (!file) {
            return NextResponse.json(
                { message: "No file uploaded" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log("Starting PDF parsing with pdf-parse (v1.1.1)...");

        // Parse PDF
        let resumeText = "";
        try {
            const pdfData = await pdf(buffer);
            resumeText = pdfData.text;
            console.log("PDF parsed successfully. Text length:", resumeText.length);
        } catch (pdfError: any) {
            console.error("PDF Parsing Error:", pdfError);
            return NextResponse.json(
                { message: "Failed to read PDF file.", error: pdfError.message },
                { status: 400 }
            );
        }

        // Analyze with Gemini (using Flash for reliability)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // ... rest of the code

        const prompt = `
      You are an expert ATS (Applicant Tracking System) Resume Analyzer.
      
      Resume Text:
      "${resumeText.slice(0, 20000)}"

      ${jobDescription ? `Job Description:\n"${jobDescription.slice(0, 5000)}"` : "Analyze against general software engineering standards."}

      Please analyze the resume and provide the following in JSON format ONLY. Do not include any markdown formatting or backticks:
      {
        "score": number (0-100),
        "summary": "Brief summary of the resume's quality and fit",
        "strengths": ["List of 3-5 strong points"],
        "missingKeywords": ["List of 5-10 important keywords missing from the resume based on the job description or general standards"],
        "improvements": ["List of 3-5 specific actionable improvements"],
        "sections": {
            "contact": boolean,
            "education": boolean,
            "experience": boolean,
            "skills": boolean,
            "projects": boolean
        },
        "wordCount": number (approximate),
        "foundVerbs": ["List of strong action verbs found"]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Raw Response:", text);

        // Clean up the response to ensure valid JSON
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let analysis;
        try {
            analysis = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Invalid JSON String:", jsonString);
            return NextResponse.json(
                { message: "AI response was not valid JSON", rawResponse: text },
                { status: 500 }
            );
        }

        return NextResponse.json(analysis);

    } catch (error: any) {
        console.error("Error in ATS check:", error);
        return NextResponse.json(
            { message: "Failed to analyze resume", error: error.message, stack: error.stack },
            { status: 500 }
        );
    }
}
