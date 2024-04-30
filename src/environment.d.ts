declare global {
    namespace NodeJS {
        interface ProcessEnv {
            GITHUB_OUTPUT: string;
            [key: string]: string | undefined;
        }
    }
}

export {};
