import { UserJSON } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { UserModel } from '../models/user';

interface JasmynUser {
    assistant_ids?: string[]
    age?: number;
    gender?: string;
    pronouns?: string;
    nickname?: string;
    model_ids?: string[];
}

export class UserService {
    createUser = async (id: string, params: UserJSON, customOptions: JasmynUser | undefined) => {
        const res = await UserModel.findById(id);

        if (res) {
            return NextResponse.json(
                {
                    message: 'user not created due to user already existing in the database',
                    success: false,
                },
                { status: 200 },
            );
        }

        const email = params.email_addresses.find((e) => e.id === params.primary_email_address_id);
        const phone = params.phone_numbers.find((e) => e.id === params.primary_phone_number_id);

        try {
            // TODO update this function to set defaults for assistant_ids
            const { data } = await UserModel.createUser({
                avatar: params.image_url,
                email: email ? email.email_address : null,
                first_name: params.first_name,
                user_id: id,
                last_name: params.last_name ? params.last_name : null,
                phone: phone ? phone.phone_number : null,
                username: params.username,
                assistant_ids: customOptions?.assistant_ids ? customOptions?.assistant_ids : null,
                age: customOptions?.age ? customOptions?.age : null,
                gender: customOptions?.gender ? customOptions?.gender : null,
                pronouns: customOptions?.pronouns ? customOptions?.pronouns : null,
                nickname: customOptions?.nickname ? customOptions?.nickname : null,
                model_ids: customOptions?.model_ids ? customOptions?.model_ids : null
            });

            return NextResponse.json({ message: 'user created', success: true, user: data }, { status: 200 });
        } catch (error) {
            console.error("Error creating user in db from clerk", error);
            return error;
        }
    }

    deleteUser = async (id?: string) => {
        if (id) {
            try {
                console.log('delete user due to clerk webhook');
                await UserModel.deleteUser(id);
                return NextResponse.json({ message: 'user deleted' }, { status: 200 });
            } catch (error) {
                console.error("Error deleting user", error);
                return error;
            }
        } else {
            console.warn('clerk sent a delete user request, but no user ID was included in the payload');
            return NextResponse.json({ message: 'ok' }, { status: 200 });
        }
    };

    updateUser = async (id: string, params: UserJSON, customOptions: JasmynUser | {}) => {
        console.log('updating user due to clerk webhook');
        const res = await UserModel.findById(id);
        if (!res) {
            return NextResponse.json(
                {
                    message: "user not updated due to the user not existing in db",
                    success: false,
                },
                { status: 200 },
            );
        }

        const email = params.email_addresses.find((e) => e.id === params.primary_email_address_id);
        const phone = params.phone_numbers.find((e) => e.id === params.primary_phone_number_id);

        try {

            const { data } = await UserModel.updateUser(id, {
                avatar: params.image_url,
                email: email?.email_address,
                first_name: params.first_name,
                last_name: params.last_name,
                phone: phone?.phone_number,
                username: params.username,
                ...customOptions
            });
            return NextResponse.json({ message: 'user updated', success: true, user: data }, { status: 200 });
        } catch (error) {
            console.error("Error updating user", error);
            return error;
        }
    };


}
