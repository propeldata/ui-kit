curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

export AWS_ACCESS_KEY_ID=$BUILD_AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$BUILD_AWS_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION=$BUILD_AWS_DEFAULT_REGION
export CODEARTIFACT_REPO=$(aws codeartifact get-repository-endpoint --domain propel --repository propel --format npm --output text)
export CODEARTIFACT_AUTH_TOKEN=$(aws codeartifact get-authorization-token --domain propel --query authorizationToken --output text)
yarn config set -H npmRegistryServer "$CODEARTIFACT_REPO"
yarn config set -H "npmRegistries[\"$CODEARTIFACT_REPO\"].npmAuthToken" $CODEARTIFACT_AUTH_TOKEN
yarn config set -H "npmRegistries[\"$CODEARTIFACT_REPO\"].npmAlwaysAuth" true