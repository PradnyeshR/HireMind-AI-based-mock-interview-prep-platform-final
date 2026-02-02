"use client";

import { useState } from "react";
import Agent from "@/components/Agent";
import InterviewSetupForm from "@/components/InterviewSetupForm";
import { cn } from "@/lib/utils";

interface InterviewGeneratorProps {
    user: {
        id: string;
        name: string;
    };
}

export default function InterviewGenerator({ user }: InterviewGeneratorProps) {
    const [mode, setMode] = useState<"voice" | "form">("voice");

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto gap-8">
            {/* Toggle Switch */}
            <div className="flex p-1 bg-dark-200 rounded-full border border-gray-800">
                <button
                    onClick={() => setMode("voice")}
                    className={cn(
                        "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                        mode === "voice"
                            ? "bg-primary-200 text-dark-100 shadow-lg"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    Voice Agent
                </button>
                <button
                    onClick={() => setMode("form")}
                    className={cn(
                        "px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                        mode === "form"
                            ? "bg-primary-200 text-dark-100 shadow-lg"
                            : "text-gray-400 hover:text-white"
                    )}
                >
                    Manual Form
                </button>
            </div>

            {/* Content Area */}
            <div className="w-full flex justify-center animate-fadeIn">
                {mode === "voice" ? (
                    <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
                        <div className="text-center mb-4">
                            <h3 className="text-xl font-semibold text-white">Talk to AI Agent</h3>
                            <p className="text-light-100 text-sm">
                                Have a natural conversation to set up your interview.
                            </p>
                        </div>
                        <Agent
                            userName={user.name}
                            userId={user.id}
                            type="generate"
                        />
                    </div>
                ) : (
                    <div className="w-full">
                        <InterviewSetupForm userId={user.id} />
                    </div>
                )}
            </div>
        </div>
    );
}
