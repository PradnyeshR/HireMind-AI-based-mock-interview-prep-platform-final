"use client";

import React, { useState } from "react";
import {
    Upload,
    FileText,
    CheckCircle,
    AlertTriangle,
    Download,
    BarChart,
    Briefcase,
    User,
    Award,
    RefreshCw,
    ChevronRight,
    Search,
    ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function ATSResumePage() {
    const [activeTab, setActiveTab] = useState<"input" | "report">("input");
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const analyzeResume = async () => {
        if (!file) {
            toast.error("Please upload a resume (PDF)");
            return;
        }

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("jobDescription", jobDescription);

        try {
            const response = await fetch("/api/ats-check", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Analysis failed");
            }

            const data = await response.json();
            setAnalysisResult(data);
            setActiveTab("report");
            toast.success("Analysis complete!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to analyze resume. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const downloadReport = () => {
        if (!analysisResult) return;

        const reportContent = `
RESUME ATS ANALYSIS REPORT
Generated on: ${new Date().toLocaleString()}
----------------------------------------
OVERALL SCORE: ${analysisResult.score}/100
----------------------------------------

SUMMARY:
${analysisResult.summary}

CRITICAL SECTIONS CHECK:
[${analysisResult.sections?.contact ? "PASS" : "FAIL"}] Contact Information
[${analysisResult.sections?.education ? "PASS" : "FAIL"}] Education Section
[${analysisResult.sections?.experience ? "PASS" : "FAIL"}] Experience/Work History
[${analysisResult.sections?.skills ? "PASS" : "FAIL"}] Skills Section
[${analysisResult.sections?.projects ? "PASS" : "FAIL"}] Projects Section

CONTENT ANALYSIS:
Word Count: ~${analysisResult.wordCount || "N/A"} words
Action Verbs Found: ${analysisResult.foundVerbs?.join(", ") || "N/A"}

STRENGTHS:
${analysisResult.strengths?.map((s: string) => `- ${s}`).join("\n")}

MISSING KEYWORDS:
${analysisResult.missingKeywords?.join(", ") || "None detected"}

IMPROVEMENT SUGGESTIONS:
${analysisResult.improvements?.map((i: string) => `- ${i}`).join("\n")}

----------------------------------------
End of Report
    `;

        const blob = new Blob([reportContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "resume_ats_report.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <FileText className="w-6 h-6 text-purple-500" />
                        <h1 className="text-xl font-bold tracking-tight">ATS Resume Auditor</h1>
                    </div>
                    <div className="text-slate-400 text-sm hidden md:block">
                        Powered by Gemini 1.5 Pro
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Navigation Tabs (only if result exists) */}
                {analysisResult && (
                    <div className="flex space-x-1 mb-6 bg-slate-900 p-1 rounded-lg w-fit border border-slate-800">
                        <button
                            onClick={() => setActiveTab("input")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "input"
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            Input Data
                        </button>
                        <button
                            onClick={() => setActiveTab("report")}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "report"
                                    ? "bg-slate-800 text-white shadow-sm"
                                    : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            Analysis Report
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: Input */}
                    <div
                        className={`lg:col-span-5 ${activeTab === "report" ? "hidden lg:block" : ""
                            }`}
                    >
                        <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-slate-800">
                                <h2 className="text-lg font-semibold flex items-center text-slate-100">
                                    <User className="w-5 h-5 mr-2 text-purple-500" />
                                    Resume Content
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    Upload your resume (PDF) for analysis.
                                </p>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* File Upload Mockup */}
                                <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-900/50 hover:bg-slate-800/50 transition-colors cursor-pointer relative group">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <Upload className="w-8 h-8 text-slate-500 mb-2 group-hover:text-purple-400 transition-colors" />
                                    <span className="text-sm font-medium text-slate-300">
                                        {file ? file.name : "Click to upload PDF"}
                                    </span>
                                    <span className="text-xs text-slate-500 mt-1">
                                        (PDF files only)
                                    </span>
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <h2 className="text-lg font-semibold flex items-center text-slate-100 mb-2">
                                        <Briefcase className="w-5 h-5 mr-2 text-purple-500" />
                                        Target Job Description (Optional)
                                    </h2>
                                    <textarea
                                        className="w-full h-32 p-4 text-sm bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none text-slate-300 placeholder:text-slate-600"
                                        placeholder="Paste the job description here to check for keyword matches..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                <Button
                                    onClick={analyzeResume}
                                    disabled={!file || isAnalyzing}
                                    className={`w-full py-6 text-lg font-bold transition-all ${!file || isAnalyzing
                                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/20"
                                        }`}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Search className="w-5 h-5 mr-2" />
                                            Analyze ATS Score
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Results */}
                    <div
                        className={`lg:col-span-7 ${activeTab === "input" ? "hidden lg:block" : ""
                            }`}
                    >
                        {!analysisResult ? (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-900 rounded-xl shadow-sm border border-slate-800 border-dashed">
                                <BarChart className="w-16 h-16 text-slate-700 mb-4" />
                                <h3 className="text-xl font-medium text-slate-400">
                                    No Analysis Yet
                                </h3>
                                <p className="text-slate-500 max-w-sm mt-2">
                                    Upload your resume and a job description on the left to generate
                                    a comprehensive ATS report.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Score Card */}
                                <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
                                    <div className="p-8 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                                        <div>
                                            <h2 className="text-2xl font-bold">
                                                ATS Compatibility Score
                                            </h2>
                                            <p className="text-purple-100 mt-1">
                                                Based on AI analysis of content & keywords
                                            </p>
                                        </div>
                                        <div className="mt-6 md:mt-0 flex items-center justify-center w-24 h-24 bg-white/20 rounded-full backdrop-blur-sm border-4 border-white/30">
                                            <span className="text-3xl font-bold">
                                                {analysisResult.score}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Score Breakdown Bar */}
                                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-b border-slate-800">
                                        <div>
                                            <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                                Keywords
                                            </span>
                                            <span
                                                className={`text-lg font-bold ${(analysisResult.missingKeywords?.length || 0) === 0
                                                        ? "text-green-500"
                                                        : "text-amber-500"
                                                    }`}
                                            >
                                                {(analysisResult.missingKeywords?.length || 0) === 0
                                                    ? "Great"
                                                    : "Missing Some"}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                                Length
                                            </span>
                                            <span className="text-lg font-bold text-slate-300">
                                                ~{analysisResult.wordCount || "N/A"} words
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                                Formatting
                                            </span>
                                            <span className="text-lg font-bold text-green-500">
                                                Standard
                                            </span>
                                        </div>
                                        <div>
                                            <span className="block text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                                Sections
                                            </span>
                                            <span className="text-lg font-bold text-purple-500">
                                                Detected
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Section Analysis */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Critical Sections */}
                                    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
                                        <h3 className="font-bold text-slate-100 mb-4 flex items-center">
                                            <Award className="w-5 h-5 mr-2 text-purple-500" />
                                            Critical Sections
                                        </h3>
                                        <div className="space-y-3">
                                            {analysisResult.sections &&
                                                Object.entries(analysisResult.sections).map(
                                                    ([key, passed]) => (
                                                        <div
                                                            key={key}
                                                            className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50"
                                                        >
                                                            <span className="capitalize text-slate-300 font-medium">
                                                                {key}
                                                            </span>
                                                            {passed ? (
                                                                <span className="flex items-center text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                                                    <CheckCircle className="w-3 h-3 mr-1" /> FOUND
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                                                                    <AlertTriangle className="w-3 h-3 mr-1" />{" "}
                                                                    MISSING
                                                                </span>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                        </div>
                                    </div>

                                    {/* Improvements */}
                                    <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
                                        <h3 className="font-bold text-slate-100 mb-4 flex items-center">
                                            <RefreshCw className="w-5 h-5 mr-2 text-amber-500" />
                                            Priority Fixes
                                        </h3>
                                        <ul className="space-y-3">
                                            {analysisResult.improvements?.map(
                                                (improvement: string, i: number) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start text-sm text-slate-300"
                                                    >
                                                        <ChevronRight className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                                                        {improvement}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>

                                {/* Keyword Gap Analysis */}
                                <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
                                    <h3 className="font-bold text-slate-100 mb-4">
                                        Job Description Keyword Gap Analysis
                                    </h3>
                                    {jobDescription ? (
                                        <div className="space-y-4">
                                            <div className="border-t border-slate-800 pt-4">
                                                <span className="text-xs font-semibold text-red-400 uppercase tracking-wide">
                                                    Missing Keywords
                                                </span>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {analysisResult.missingKeywords?.length > 0 ? (
                                                        analysisResult.missingKeywords.map(
                                                            (k: string, i: number) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-sm border border-red-500/20"
                                                                >
                                                                    {k}
                                                                </span>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-slate-500 text-sm italic">
                                                            All major keywords present!
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-6 text-slate-500 bg-slate-950 rounded-lg border border-slate-800">
                                            Paste a job description to see a keyword gap analysis.
                                        </div>
                                    )}
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={downloadReport}
                                    className="w-full py-4 bg-white text-slate-900 rounded-xl font-semibold flex items-center justify-center hover:bg-slate-200 transition-colors shadow-lg"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download Full Report (.txt)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
