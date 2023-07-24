# Login to Amazon ECR Action

See also [Push to Amazon ECR Action](https://github.com/jwalton/gh-ecr-push).

## Setup

To set this up, create a new IAM user with access to ECR (e.g. with the
AmazonEC2ContainerRegistryFullAccess policy).  Then, add the following secrets
to your GitHub project:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`

## Usage

```yaml
- name: Login to ECR
  id: ecr
  uses: jwalton/gh-ecr-login@v1
  with:
    access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    region: us-east-1
- name: Push to ECR
  run: |
    docker tag my-image ${{ steps.ecr.outputs.account }}.dkr.ecr.us-east-1.amazonaws.com/my-image:v1
    docker push ${{ steps.ecr.outputs.account }}.dkr.ecr.us-east-1.amazonaws.com/my-image:v1
```

```yaml
# Without explicit credentials
- name: Configure AWS Credentials
  uses: aws-actions/configure-aws-credentials@v2
  with:
    role-to-assume: arn:aws:iam::1234567890:role/ecr-builder
    aws-region: us-east-1
- name: Login to ECR
  id: ecr
  uses: jwalton/gh-ecr-login@v1
  with:
    region: us-east-1
- name: Push to ECR
  run: |
    docker tag my-image ${{ steps.ecr.outputs.account }}.dkr.ecr.us-east-1.amazonaws.com/my-image:v1
    docker push ${{ steps.ecr.outputs.account }}.dkr.ecr.us-east-1.amazonaws.com/my-image:v1
```
