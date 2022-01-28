const { execSync } = require('child_process');
const core = require('@actions/core');

const AWS_ACCESS_KEY_ID = core.getInput('access-key-id', { required: true });
const AWS_SECRET_ACCESS_KEY = core.getInput('secret-access-key', { required: true });
const awsRegion = core.getInput('region') || process.env.AWS_DEFAULT_REGION || 'us-east-1';

function run(cmd, options = {}) {
    if (!options.hide) {
        console.log(`$ ${cmd}`);
    }
    return execSync(cmd, {
        shell: '/bin/bash',
        encoding: 'utf-8',
        env: {
            ...process.env,
            AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY,
        },
    });
}

const accountData = run(`aws sts get-caller-identity --output json --region ${awsRegion}`);
const awsAccountId = JSON.parse(accountData).Account;

const accountLoginPassword = `aws ecr get-login-password --region ${awsRegion}`;
run(
    `${accountLoginPassword} | docker login --username AWS --password-stdin ${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com`
);

core.setOutput('registry', `${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com`);
core.setOutput('account', awsAccountId);
