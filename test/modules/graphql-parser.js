const parse = require('graphql/language/parser');
const Source = require('graphql/language/source');

exports.graphql = {parse: parse.parse, Source: Source.Source};