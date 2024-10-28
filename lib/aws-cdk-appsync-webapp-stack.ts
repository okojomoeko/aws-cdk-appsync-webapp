import * as cdk from 'aws-cdk-lib';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
export class AwsCdkAppsyncWebappStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // バックエンドのGraphQL APIを作成
    const api = new appsync.GraphqlApi(this, "sns-sapmle-api", {
      name: "appsync-webapp-api",
      schema: appsync.SchemaFile.fromAsset("schema/schema.graphql"),
    });
    //DynamoDBテーブルを作成
    const add_ddb_table = new dynamodb.Table(this, "sns-sapmle-table", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Creates a function for query
    const add_func = new appsync.AppsyncFunction(this, "func-get-post", {
      name: "get_posts_func_1",
      api,
      dataSource: api.addDynamoDbDataSource("table-for-posts", add_ddb_table),
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
    const add_func_2 = new appsync.AppsyncFunction(this, "func-add-post", {
      name: "add_posts_func_1",
      api,
      dataSource: api.addDynamoDbDataSource("table-for-posts-2", add_ddb_table),
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
    new appsync.Resolver(this, "pipeline-resolver-get-posts", {
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
    new appsync.Resolver(this, "pipeline-resolver-create-posts", {
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
  }
}
