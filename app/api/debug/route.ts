// import { db, auth } from "@/firebase/admin";
// import { getApps } from "firebase-admin/app";

// export async function GET() {
//     try {
//         const apps = getApps();
//         const app = apps[0];
//         const options = app ? app.options : null;
//         const projectId = process.env.FIREBASE_PROJECT_ID;

//         // Try to list collections to verify connection
//         const collections = await db.listCollections();
//         const collectionIds = collections.map(c => c.id);

//         const snapshot = await db.collection("interviews").get();
//         const interviews = snapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//         }));

//         return Response.json({
//             projectId,
//             appsCount: apps.length,
//             options: options ? { ...options, credential: "REDACTED" } : null,
//             collectionIds,
//             interviewsCount: interviews.length,
//             interviews
//         }, { status: 200 });
//     } catch (error) {
//         return Response.json({ error: error, message: error.message, stack: error.stack }, { status: 500 });
//     }
// }
import { db } from "@/firebase/admin";

export async function GET() {
    try {
        const snapshot = await db.collection("interviews").get();
        const interviews = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return Response.json({ count: interviews.length, interviews }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error }, { status: 500 });
    }
}