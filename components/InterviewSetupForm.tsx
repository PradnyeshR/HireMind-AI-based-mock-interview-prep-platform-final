"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    role: z.string().min(2, {
        message: "Role must be at least 2 characters.",
    }),
    type: z.string().min(1, {
        message: "Please select an interview type.",
    }),
    level: z.string().min(1, {
        message: "Please select an experience level.",
    }),
    techstack: z.string().min(2, {
        message: "Tech stack must be at least 2 characters.",
    }),
    amount: z.coerce.number().min(1).max(15),
});

interface InterviewSetupFormProps {
    userId: string;
}

export default function InterviewSetupForm({ userId }: InterviewSetupFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: "",
            type: "technical",
            level: "mid",
            techstack: "",
            amount: 5,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            const response = await fetch("/api/vapi/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...values,
                    userid: userId,
                }),
            });

            const data = await response.json();

            if (data.success && data.id) {
                toast.success("Interview generated successfully!");
                router.push(`/interview/${data.id}`);
            } else {
                toast.error("Failed to generate interview. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="card-border w-full max-w-md mx-auto">
            <div className="dark-gradient p-6 rounded-2xl">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Starting Your Interview</h2>
                    <p className="text-light-100 text-sm">
                        Customize your mock interview to suit your needs.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-light-100 font-normal">
                                        What type of interview would you like to practice?
                                    </FormLabel>
                                    <FormControl>
                                        <select
                                            className="flex h-12 w-full rounded-lg border-none bg-dark-200 px-4 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                                            {...field}
                                        >
                                            <option value="technical">Technical</option>
                                            <option value="behavioral">Behavioral</option>
                                            <option value="mixed">Mixed</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-light-100 font-normal">
                                        What role are you focusing on?
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Select your role"
                                            className="bg-dark-200 border-none h-12 rounded-lg text-white placeholder:text-gray-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="techstack"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-light-100 font-normal">
                                        Which tech stack would you like to focus on?
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Select your preferred tech stack"
                                            className="bg-dark-200 border-none h-12 rounded-lg text-white placeholder:text-gray-500"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-light-100 font-normal">
                                        How long would you like the interview to be?
                                    </FormLabel>
                                    <FormControl>
                                        <select
                                            className="flex h-12 w-full rounded-lg border-none bg-dark-200 px-4 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            value={field.value}
                                        >
                                            <option value={5}>Short (5 Questions)</option>
                                            <option value={10}>Medium (10 Questions)</option>
                                            <option value={15}>Long (15 Questions)</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-light-100 font-normal">
                                        What is your experience level?
                                    </FormLabel>
                                    <FormControl>
                                        <select
                                            className="flex h-12 w-full rounded-lg border-none bg-dark-200 px-4 py-2 text-sm text-white ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200"
                                            {...field}
                                        >
                                            <option value="junior">Junior</option>
                                            <option value="mid">Mid-Level</option>
                                            <option value="senior">Senior</option>
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full bg-primary-200 text-dark-100 hover:bg-primary-200/90 font-bold h-12 rounded-full mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Starting Interview...
                                </>
                            ) : (
                                "Start Interview"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
