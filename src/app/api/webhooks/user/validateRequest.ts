import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";

export const validateRequest = async (req: Request, secret: string) => {
    const payloadString = await req.text();
    const headersList = headers();
    const svixHeaders = {
        "svix-id": headersList.get("svix-id") || "",
        "svix-timestamp": headersList.get("svix-timestamp") || "",
        "svix-signature": headersList.get("svix-signature") || "",
    }

    const wh = new Webhook(secret);
    try {
        return wh.verify(payloadString, svixHeaders) as WebhookEvent;
    } catch (error) {
        console.error("Webhook verification failed", error);
        return null;
    }
};
