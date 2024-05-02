import { execSync } from 'child_process';

function run(cmd: string, options: { env?: Record<string, string>; hide?: boolean } = {}): string {
    if (!options.hide) {
        console.log(`$ ${cmd}`);
    }
    return execSync(cmd, {
        shell: '/bin/bash',
        encoding: 'utf-8',
        env: {
            ...process.env,
            ...options.env,
        },
    });
}

export function loginToEcr(
    awsRegion: string,
    awsAccessKeyId: string | undefined,
    awsSecretAccessKey: string | undefined
): { awsAccountId: string } {
    const env: Record<string, string> = {
        AWS_PAGER: '', // Disable the pager.
    };

    if (awsAccessKeyId) {
        env.AWS_ACCESS_KEY_ID = awsAccessKeyId;
    }
    if (awsSecretAccessKey) {
        env.AWS_SECRET_ACCESS_KEY = awsSecretAccessKey;
    }

    const accountData = run(`aws sts get-caller-identity --output json --region ${awsRegion}`, {
        env,
    });
    const awsAccountId = JSON.parse(accountData).Account;

    const accountLoginPasswordCmd = `aws ecr get-login-password --region ${awsRegion}`;
    run(
        `${accountLoginPasswordCmd} | docker login --username AWS --password-stdin ${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com`,
        { env }
    );

    return { awsAccountId };
}
