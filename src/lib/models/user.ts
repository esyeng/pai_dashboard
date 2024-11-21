import { SupabaseClient } from '@supabase/supabase-js';
import { TRPCError } from '@trpc/server';
// import { createClerkSupabaseClient } from "../../app/supabase/client";

interface NewUser { // ensure all columns initialized NULL
    avatar: string | null;
    email: string | null;
    first_name: string | null;
    user_id: string;
    last_name: string | null;
    phone: string | null;
    username: string | null;
    assistant_ids: string[] | null;
    age: number | null;
    gender: string | null
    pronouns: string | null
    nickname: string | null
    model_ids: string[] | null
}

interface UpdateUser { // only update defined values, allow set to NULL
    avatar?: string | null;
    email?: string | null;
    first_name?: string | null;
    user_id?: string;
    last_name?: string | null;
    phone?: string | null;
    username?: string | null;
    assistant_ids?: string[] | null
    age?: number | null;
    gender?: string | null
    pronouns?: string | null
    nickname?: string | null
    model_ids?: string[] | null
}

export class UserNotFoundError extends TRPCError {
    constructor() {
        super({ code: 'UNAUTHORIZED', message: 'user not found' });
    }
}

export class UserModel {
    private client: SupabaseClient;
    constructor(client: SupabaseClient) {
        this.client = client;
    }

    findById = async (id: string) => {
        return this.client.from("users").select("*").eq("user_id", id);
    };

    findByEmail = async (email: string) => {
        return this.client.from("users").select("*").eq("email", email);
    };

    createUser = async (params: NewUser) => {
        const newDbUser: NewUser = {
            avatar: params.avatar,
            email: params.email,
            first_name: params.first_name,
            user_id: params.user_id,
            last_name: params.last_name,
            phone: params.phone,
            username: params.username,
            assistant_ids: params.assistant_ids,
            age: params.age,
            gender: params.gender,
            pronouns: params.pronouns,
            nickname: params.nickname,
            model_ids: params.model_ids

        }
        return this.client.from("users").insert([newDbUser]).select();
    }

    deleteUser = async (id: string) => {
        return this.client.from("users").delete().eq("user_id", id);
    }

    updateUser = async (id: string, values: UpdateUser) => {
        return this.client.from("users").update(values).eq("user_id", id).select();
    }

    // add method getUserState to select model keys similar to https://github.com/lobehub/lobe-chat/blob/main/src/database/server/models/user.ts

    // possibly add updatePreferences, updateSetting
}
