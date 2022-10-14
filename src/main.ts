import * as core from '@actions/core';
import { loginToEcr } from './lib';

const AWS_ACCESS_KEY_ID = core.getInput('access-key-id', { required: true });
const AWS_SECRET_ACCESS_KEY = core.getInput('secret-access-key', { required: true });
const awsRegion = core.getInput('region') || process.env.AWS_DEFAULT_REGION || 'us-east-1';

const { awsAccountId } = loginToEcr(awsRegion, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY);

core.setOutput('registry', `${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com`);
core.setOutput('account', awsAccountId);
