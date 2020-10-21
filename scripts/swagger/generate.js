const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const fs = require("fs");
const os = require('os');
const request = require("request");
const YAML = require("yamljs");
const postAsync = promisify(request.post);

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

async function generateClient() {
    // await exec('rm -rf ./scripts/swagger/dist/');
    const params = [
        "-i ~/Developer/searchapi/coveo-search-api/src/main/resources/openapi.yml",
        "-g typescript-fetch",
        "-o ./dependencies/sapi-client/",
        "-c ./scripts/swagger/config.json"
    ];
    await exec('rm -rf ./dependencies/sapi-client')
    const spec = YAML.load(os.homedir() + "/Developer/searchapi/coveo-search-api/src/main/resources/openapi.yml");
    const {body} = await postAsync({
        url: "http://api.openapi-generator.tech/api/gen/clients/typescript-fetch",
        headers: {
            'content-type': "application/json"
        },
        body: JSON.stringify({
            options: JSON.parse(await readFileAsync("./scripts/swagger/config.json", "utf8")),
            spec: spec
        })
    });
    const link = JSON.parse(body).link;

    const targetPath = "./dependencies/full.zip";
    await exec(`curl -sS ${link} > ${targetPath}`);
    await exec(`unzip ${targetPath} -d ./dependencies `);
    await exec(`mv ./dependencies/typescript-fetch-client/ ./dependencies/sapi-client/`);
}

async function buildClient() {
    const content = JSON.parse(await readFileAsync("./dependencies/sapi-client/package.json"));
    content.devDependencies.typescript = "~3.5.2";
    await writeFileAsync("./dependencies/sapi-client/package.json", JSON.stringify(content));

    await exec("cp ./scripts/swagger/FieldOperator.ts ./dependencies/sapi-client/src/models/FieldOperator.ts")
    await exec("cd ./dependencies/sapi-client/ && npm i")
}


async function main() {
    try {
        await generateClient();
        await buildClient();

    } catch (e) {
        console.error(e);
    }
}

main();