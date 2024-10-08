import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    7
); // 7-character random string

export async function fetcher<JSON = any>(
    input: RequestInfo,
    init?: RequestInit
): Promise<JSON> {
    const res = await fetch(input, init);

    if (!res.ok) {
        const json = await res.json();
        if (json.error) {
            const error = new Error(json.error) as Error & {
                status: number;
            };
            error.status = res.status;
            throw error;
        } else {
            throw new Error("An unexpected error occurred");
        }
    }

    return res.json();
}

export function formatDate(input: string | number | Date): string {
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

export const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);

export const runAsyncFnWithoutBlocking = (
    fn: (...args: any) => Promise<any>
) => {
    fn();
};

export const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export const getStringFromBuffer = (buffer: ArrayBuffer) =>
    Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

export enum ResultCode {
    InvalidCredentials = "INVALID_CREDENTIALS",
    InvalidSubmission = "INVALID_SUBMISSION",
    UserAlreadyExists = "USER_ALREADY_EXISTS",
    UnknownError = "UNKNOWN_ERROR",
    UserCreated = "USER_CREATED",
    UserLoggedIn = "USER_LOGGED_IN",
}

export const getMessageFromCode = (resultCode: string) => {
    switch (resultCode) {
        case ResultCode.InvalidCredentials:
            return "Invalid credentials!";
        case ResultCode.InvalidSubmission:
            return "Invalid submission, please try again!";
        case ResultCode.UserAlreadyExists:
            return "User already exists, please log in!";
        case ResultCode.UserCreated:
            return "User created, welcome!";
        case ResultCode.UnknownError:
            return "Something went wrong, please try again!";
        case ResultCode.UserLoggedIn:
            return "Logged in!";
    }
};

export const parseCodeBlocks = (text: string): { type: 'text' | 'code'; content: string; language: string }[] => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: { type: 'text' | 'code'; content: string; language: string }[] = [];
    let lastIndex = 0;

    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
        const [fullMatch, language, code] = match;
        const textBeforeCode = text.slice(lastIndex, match.index);

        if (textBeforeCode.trim() !== '') {
            parts.push({ type: 'text', content: textBeforeCode, language: '' });
        }

        parts.push({ type: 'code', content: code, language });
        lastIndex = match.index + fullMatch.length;
    }

    const textAfterCode = text.slice(lastIndex);
    if (textAfterCode.trim() !== '') {
        parts.push({ type: 'text', content: textAfterCode, language: '' });
    }

    return parts;
};

export function safeJSONParse<T>(input: string | object): T {
    if (typeof input === "object") {
        return input as T
    }

    try {
        let parsed = JSON.parse(input);
        while (typeof parsed === "string") {
            parsed = JSON.parse(parsed);
        }
        return parsed as T;
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return {} as T;
    }
}


export class UniqueIdGenerator {
    private static instance: UniqueIdGenerator;
    private counter: number = 0;
    private lastTimestamp: number = 0;
    private readonly chars: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    private constructor() { }

    public static getInstance(): UniqueIdGenerator {
        if (!UniqueIdGenerator.instance) {
            UniqueIdGenerator.instance = new UniqueIdGenerator();
        }
        return UniqueIdGenerator.instance;
    }

    /**
     * Generates a unique ID.
     * @param {Object} options - Configuration options for ID generation.
     * @param {number} [options.timeComponent=6] - Length of the time component.
     * @param {number} [options.randomComponent=8] - Length of the random component.
     * @param {boolean} [options.addCounter=true] - Whether to include a counter component.
     * @returns {string} A unique ID string.
     */
    public generate(options: {
        timeComponent?: number;
        randomComponent?: number;
        addCounter?: boolean;
    } = {}): string {
        const {
            timeComponent = 6,
            randomComponent = 8,
            addCounter = true
        } = options;

        const timestamp = this.getTimestamp();
        const random = this.getRandomComponent(randomComponent);
        const counterStr = addCounter ? this.getCounterComponent() : '';

        return `${this.encodeTimestamp(timestamp, timeComponent)}${counterStr}${random}`;
    }

    private getTimestamp(): number {
        const now = Date.now();
        if (now === this.lastTimestamp) {
            this.counter++;
        } else {
            this.counter = 0;
            this.lastTimestamp = now;
        }
        return now;
    }

    private encodeTimestamp(timestamp: number, length: number): string {
        return this.encodeNumber(timestamp, length);
    }

    private getCounterComponent(): string {
        return this.encodeNumber(this.counter, 2);
    }

    private getRandomComponent(length: number): string {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.chars[Math.floor(Math.random() * this.chars.length)];
        }
        return result;
    }

    private encodeNumber(num: number, length: number): string {
        const encoded = num.toString(this.chars.length > 36 ? this.chars.length % 36 : this.chars.length).padStart(length, '0');
        return encoded.split('').map(char => this.chars[parseInt(char, this.chars.length)]).join('');
    }
}
