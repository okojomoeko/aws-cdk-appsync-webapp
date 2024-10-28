import * as cdk from "aws-cdk-lib";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cognito from "aws-cdk-lib/aws-cognito";
import type { Construct } from "constructs";
export class AwsCdkAppsyncWebappStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const userPool = new cognito.UserPool(this, "CognitoUserPool", {});
		const userPoolClient = new cognito.UserPoolClient(this, "CognitoUserPoolClient", {
			userPool,
		});

		// バックエンドのGraphQL APIを作成
		const api = new appsync.GraphqlApi(this, "SnsSapmleApi", {
			name: "appsync-webapp-api",
			definition: appsync.Definition.fromFile("schema/schema.graphql"),
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: appsync.AuthorizationType.USER_POOL,
					userPoolConfig: {
						userPool: userPool,
					},
				},
			},
		});
		//DynamoDBテーブルを作成
		const add_ddb_table = new dynamodb.Table(this, "SnsSapmleTable", {
			partitionKey: {
				name: "id",
				type: dynamodb.AttributeType.STRING,
			},
		});
		add_ddb_table.addGlobalSecondaryIndex({
			indexName: "gsi-userId",
			partitionKey: {
				name: "userId",
				type: dynamodb.AttributeType.STRING,
			},
		});
		const snsSampleTableDs = api.addDynamoDbDataSource("SnsSapmleTableDS", add_ddb_table);
		// Creates a function for query
		const add_func = new appsync.AppsyncFunction(this, "FuncGetPost", {
      name: "get_posts_func_1",
      api,
      dataSource: snsSampleTableDs,
      code: appsync.Code.fromInline(`
          export function request(ctx) {
          return { operation: 'Scan' };
          }

          export function response(ctx) {
          return ctx.result.items;
          }
      `),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

		// Creates a function for mutation
		const add_func_2 = new appsync.AppsyncFunction(this, "FuncAddPost", {
      name: "add_posts_func_1",
      api,
      dataSource: snsSampleTableDs,
      code: appsync.Code.fromInline(`
          export function request(ctx) {
            return {
            operation: 'PutItem',
            key: util.dynamodb.toMapValues({id: util.autoId()}),
            attributeValues: util.dynamodb.toMapValues(ctx.args.input),
            };
          }

          export function response(ctx) {
            return ctx.result;
          }
      `),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

		// Adds a pipeline resolver with the get function
		new appsync.Resolver(this, "PipelineResolverGetPosts", {
			api,
			typeName: "Query",
			fieldName: "getPost",
			code: appsync.Code.fromInline(`
          export function request(ctx) {
          return {};
          }

          export function response(ctx) {
          return ctx.prev.result;
          }
      `),
			runtime: appsync.FunctionRuntime.JS_1_0_0,
			pipelineConfig: [add_func],
		});

		// Adds a pipeline resolver with the create function
		new appsync.Resolver(this, "PipelineResolverCreatePosts", {
			api,
			typeName: "Mutation",
			fieldName: "createPost",
			code: appsync.Code.fromInline(`
          export function request(ctx) {
          return {};
          }

          export function response(ctx) {
          return ctx.prev.result;
          }
  `),
			runtime: appsync.FunctionRuntime.JS_1_0_0,
			pipelineConfig: [add_func_2],
		});

		new appsync.Resolver(this, "UnitResolverListPostsByUserId", {
      api,
      typeName: "Query",
      fieldName: "listPostsByUserId",
      dataSource: snsSampleTableDs,
      code: appsync.AssetCode.fromAsset("resolvers/listPostsByUserId.js"),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

		// Prints out URL
		new cdk.CfnOutput(this, "GraphQLAPIURL", {
			value: api.graphqlUrl,
		});

		// Prints out the AppSync GraphQL API key to the terminal
		new cdk.CfnOutput(this, "GraphQLAPIKey", {
			value: api.apiKey || "",
		});

		// Prints out the stack region to the terminal
		new cdk.CfnOutput(this, "Stack Region", {
			value: this.region,
		});

		new cdk.CfnOutput(this, "CognitoUserPoolId", {
			value: userPool.userPoolId,
		});

		new cdk.CfnOutput(this, "CognitoUserPoolClientId", {
			value: userPoolClient.userPoolClientId,
		});
	}
}
