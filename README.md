# aws-cdk-appsync-webapp

## 概要

このリポジトリは [zenn] の記事のサンプルコードです。

AWS CDK を利用して AppSync で GraphQL API を使う Web アプリケーションを構築する。

- `frontend` ... web app
- `frontend_infra` ... AWS CDK

## 前提条件

- AWS アカウントがあること

## 使い方

`frontend_infra` から AWS CDK でリソースをデプロイする。

```bash
cd frontend_infra
npm install
npx cdk deploy
```

デプロイが完了したら、フロントエンドで Cognito や AppSync を利用するための設定を`aws-exports.ts` として追加する。

``` typescript:frontend/aws-exports.ts
const config = {
  Auth: {
    Cognito: {
      userPoolId: <userPoolId>,
      userPoolClientId: <userPoolClientId>,
    },
  },
  API: {
    GraphQL: {
      endpoint: <GraphQLAPIURL>,
      region: <region>,
      defaultAuthMode: "userPool",
    },
  },
};

export default config;
```

続いて、デプロイされた Cognito の User Pool にユーザーを作成する。

`frontend` で web アプリを起動して、作成したユーザーでログインする。

```bash
cd ../frontend
npm install
npm run dev
```
