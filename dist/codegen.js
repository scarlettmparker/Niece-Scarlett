const config = {
    overwrite: true,
    schema: "graphql/schemas/**/*.graphqls",
    documents: "graphql/operations/**/*.graphql",
    generates: {
        "src/generated/": {
            preset: "client",
            plugins: [],
        },
    },
};
export default config;
