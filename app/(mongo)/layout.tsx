// import { ThemeProvider } from "next-themes";
import "./mongo.css";
import localfont from "next/font/local";
import { Metadata } from "next";
import Image from "next/image";
import NavBarWrapper from "@/components/mongo/NavBarWrapper";
import { AuthProvider } from "@/context/AuthContext";

const mazzard = localfont({
    src: [
        {
            path: "../../public/fonts/MazzardM-Light.otf",
            weight: "400",
            style: "normal",
        },

        {
            path: "../../public/fonts/MazzardM-Medium.otf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../../public/fonts/MazzardM-Regular.otf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../../public/fonts/MazzardM-SemiBold.otf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-mazzard",
});

const radis = localfont({
    src: "../../public/fonts/Radis-Sans.otf",
    variable: "--font-radis",
});

export const metadata: Metadata = {
    title: "HireMind AI Interview",
    description: "AI Powered Mock Interviews",
};

export default function MongoLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`${mazzard.variable} ${radis.variable} font-sans bg-[var(--background)] min-h-screen`}>
            <AuthProvider>
                <div className="absolute left-0 -top-30 -z-10">
                    <Image width={700} height={700} src="/images/bg-shade.png" alt="" />
                </div>
                <div className="absolute right-0 -z-10">
                    <Image
                        className="bottom-0 right-0 -z-10"
                        width={700}
                        height={700}
                        src="/images/bg-shade2.png"
                        alt=""
                    />
                </div>
                <NavBarWrapper />
                {children}
            </AuthProvider>
        </div>
    );
}
