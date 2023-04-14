const browserify = require('browserify');
const through = require('through2');
const babelTransform = require("@babel/core").transformSync;
const uglifyJS = require("uglify-js");
 
function apigeefyConvert (mod) {
  const replaceRegex = 'var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.apigeefy = f()'
  const policy = 'var g={};g.apigeefy=f();context.setVariable("bundle", g)'

  const bopts = { standalone: 'apigeefy' };

  return browserify(mod, bopts)
   .bundle()
   .pipe(through(function (buf, _, next) {
     const text = buf.toString();

     if (text.indexOf(replaceRegex) > -1) {
       const replacedText = text.replace(replaceRegex, policy);

       this.push(replacedText);
     } else {
       this.push(text);
     }
     next();
   }));
}

function streamToString (stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  })
}

async function apigeefy (mod) {
  const apigeefiedCode = await streamToString(apigeefyConvert(mod))
  const transpiledCode = babelTransform(apigeefiedCode, {
    plugins: ["@babel/plugin-transform-template-literals"],
  });
  const uglifiedCode = uglifyJS.minify(transpiledCode.code);
  
  if (uglifiedCode.error) {
    throw new Error("Error transforming code");
  }

  process.stdout.write(uglifiedCode.code);
}

module.exports = apigeefy;
