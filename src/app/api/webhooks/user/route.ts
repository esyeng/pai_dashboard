"use client";
import { NextResponse } from "next/server";
import { validateRequest } from "./validateRequest";
import { UserService } from "@/lib/services/user";
// import dotenv from "dotenv";
// dotenv.config();

const SECRET: string = process.env.CLERK_WEBHOOK_SECRET || "";

export const POST = async (req: Request):Promise<NextResponse> => {
    const payload = await validateRequest(req, SECRET);
    const params = req.json();
    console.log("req params obj", params);

    if (!payload) {
        return NextResponse.json(
            { error: 'webhook verification failed or payload was malformed' },
            { status: 400 },
        );
    }

    const { type, data } = payload;
    const userService = new UserService();

    console.log(`clerk webhook payload: ${{ data, type }}`);
    switch (type) {
        case 'user.created': {
            console.log('creating user due to clerk webhook');
            return await userService.createUser(data.id, data, undefined); // TODO test basic user first, then add custom
        }
        case 'user.deleted': {
            return userService.deleteUser(data.id);
        }
        case 'user.updated': {
            return await userService.updateUser(data.id, data, params);
        }

        default: {
            console.log(
                `${req.url} received event type "${type}", but no handler is defined for this type`,
            );
            return NextResponse.json({ error: `unrecognised payload type: ${type}` }, { status: 400 });
        }
    }
}
