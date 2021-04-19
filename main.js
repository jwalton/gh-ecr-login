const { execSync } = require('child_process');
const { parse: parseUrl } = require('url');
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

const authJson = run(`aws ecr get-authorization-token --region ${awsRegion}`);
const auth = JSON.parse(authJson);

if (!auth.authorizationData || !auth.authorizationData[0]) {
    throw new Error('Missing authorizationData in value returned by `aws ecr get-authorization-token`.');
}
const authToken = auth.authorizationData[0].authorizationToken;
const [username, password] = new Buffer(authToken, 'base64').toString('ascii').split(':');
const parsedProxyEndpoint = parseUrl(auth.authorizationData[0].proxyEndpoint);
const registry = parsedProxyEndpoint.host;

run(`docker login -u ${username} -p ${password} ${auth.authorizationData[0].proxyEndpoint}`);

core.setOutput('username', username);
core.setOutput('password', password);
core.setOutput('registry', registry);

const accountData = run(`aws sts get-caller-identity --output json --region ${awsRegion}`);
const awsAccountId = JSON.parse(accountData).Account;

core.setOutput('account', awsAccountId);
