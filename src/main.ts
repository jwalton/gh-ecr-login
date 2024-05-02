import * as core from '@actions/core';
import { loginToEcr } from './lib';
import { writeFileSync } from 'node:fs';
import { EOL } from 'node:os';

const AWS_ACCESS_KEY_ID = core.getInput('access-key-id') || undefined;
const AWS_SECRET_ACCESS_KEY = core.getInput('secret-access-key') || undefined;
const awsRegion = core.getInput('region') || process.env.AWS_DEFAULT_REGION || 'us-east-1';

const { awsAccountId } = loginToEcr(awsRegion, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);

writeFileSync(
    process.env['GITHUB_OUTPUT'],
    `registry=${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com${EOL}account=${awsAccountId}${EOL}`,
    { flag: 'a' }
);
