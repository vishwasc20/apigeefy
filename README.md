# apigeefy
========

Bundle node dependencies and use them in Apigee Edge javascript policies.

## Install

```bash
npm install apigeefy
```

## Usage

### Bundle up the node module you would like to use in Apigee Edge
#### Create a apigeefy module

This is the file which will end up being bundled & exported to be used in apigee policy.

In the example below we use the graphql module (parse & Source) and export them. These will be bundled and exported as apigeefy modules to be used in Apigee Edge.

```javascript
// graphql-parser.js
const parse = require('graphql/language/parser');
const Source = require('graphql/language/source');

exports.graphql = {parse: parse.parse, Source: Source.Source};
```


#### Bundle up with apigeefy

```bash
apigeefy <input_file_path> > <output_file_path>
```

ex:
```bash
apigeefy ./graphql-parser.js > graphql-bundle-min.js
```

Note:
We can use trireme module (to check for compile errors), which runs Node.js scripts inside the JVM.
Trireme is based on Rhino engine which runs on Apigee Edge.

#### Add it to Apigee using a JS policy

```
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Javascript timeLimit="200" async="false" continueOnError="true" enabled="true" name="Add Output Validation">
  <DisplayName>Add GraphQL Validation</DisplayName>
  <IncludeURL>jsc://graphql-bundle-min.js</IncludeURL>
  <ResourceURL>jsc://graphql-validation.js</ResourceURL>
</Javascript>
```

#### Use it (graphql-validation.js)

```
...
var bundle = context.getVariable('bundle');
var graphqlRequest = context.getVariable("request.queryparam.query");
var result = bundle.apigeefy.parse(graphqlRequest);
...
```
