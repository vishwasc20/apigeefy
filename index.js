const browserify = require('browserify');
const through = require('through2');

function policify (mod) {
  const replaceRegex = 'var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.apigeefy = f()'
  const policy = 'var g={};g.apigeefy=f();context.setVariable("bundle", g)'

  var bopts = { standalone: 'apigeefy' };

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

module.exports = policify;
