import { t as __commonJSMin } from "../_runtime.mjs";
import { t as require_lib } from "./xmldom__xmldom.mjs";
//#region node_modules/docxtemplater/js/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function last(a) {
		return a[a.length - 1];
	}
	function first(a) {
		return a[0];
	}
	module.exports = {
		last,
		first
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/errors.js
var require_errors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var _require = require_utils();
	var last = _require.last;
	var first = _require.first;
	function XTError(message) {
		this.name = "GenericError";
		this.message = message;
		this.stack = new Error(message).stack;
	}
	XTError.prototype = Error.prototype;
	function XTTemplateError(message) {
		this.name = "TemplateError";
		this.message = message;
		this.stack = new Error(message).stack;
	}
	XTTemplateError.prototype = new XTError();
	function XTRenderingError(message) {
		this.name = "RenderingError";
		this.message = message;
		this.stack = new Error(message).stack;
	}
	XTRenderingError.prototype = new XTError();
	function XTScopeParserError(message) {
		this.name = "ScopeParserError";
		this.message = message;
		this.stack = new Error(message).stack;
	}
	XTScopeParserError.prototype = new XTError();
	function XTInternalError(message) {
		this.name = "InternalError";
		this.properties = { explanation: "InternalError" };
		this.message = message;
		this.stack = new Error(message).stack;
	}
	XTInternalError.prototype = new XTError();
	function XTAPIVersionError(message) {
		this.name = "APIVersionError";
		this.properties = { explanation: "APIVersionError" };
		this.message = message;
		this.stack = new Error(message).stack;
	}
	XTAPIVersionError.prototype = new XTError();
	function throwApiVersionError(msg, properties) {
		var err = new XTAPIVersionError(msg);
		err.properties = _objectSpread({ id: "api_version_error" }, properties);
		throw err;
	}
	function throwFileTypeNotIdentified(zip) {
		var files = Object.keys(zip.files).slice(0, 10);
		var msg = "";
		if (files.length === 0) msg = "Empty zip file";
		else msg = "Zip file contains : ".concat(files.join(","));
		var err = new XTInternalError("The filetype for this file could not be identified, is this file corrupted ? ".concat(msg));
		err.properties = {
			id: "filetype_not_identified",
			explanation: "The filetype for this file could not be identified, is this file corrupted ? ".concat(msg)
		};
		throw err;
	}
	function throwFileTypeNotHandled(fileType) {
		var err = new XTInternalError("The filetype \"".concat(fileType, "\" is not handled by Docxtemplater"));
		err.properties = {
			id: "filetype_not_handled",
			explanation: "The file you are trying to generate is of type \"".concat(fileType, "\", but only docx and pptx formats are handled"),
			fileType
		};
		throw err;
	}
	function throwMultiError(errors) {
		var err = new XTTemplateError("Multi error");
		err.properties = {
			errors,
			id: "multi_error",
			explanation: "The template has multiple errors"
		};
		throw err;
	}
	function getUnopenedTagException(options) {
		var err = new XTTemplateError("Unopened tag");
		err.properties = {
			xtag: last(options.xtag.split(" ")),
			id: "unopened_tag",
			context: options.xtag,
			offset: options.offset,
			lIndex: options.lIndex,
			explanation: "The tag beginning with \"".concat(options.xtag.substr(0, 30), "\" is unopened")
		};
		return err;
	}
	function getDuplicateOpenTagException(options) {
		var err = new XTTemplateError("Duplicate open tag, expected one open tag");
		err.properties = {
			xtag: first(options.xtag.split(" ")),
			id: "duplicate_open_tag",
			context: options.xtag,
			offset: options.offset,
			lIndex: options.lIndex,
			explanation: "The tag beginning with \"".concat(options.xtag.substr(0, 30), "\" has duplicate open tags")
		};
		return err;
	}
	function getDuplicateCloseTagException(options) {
		var err = new XTTemplateError("Duplicate close tag, expected one close tag");
		err.properties = {
			xtag: first(options.xtag.split(" ")),
			id: "duplicate_close_tag",
			context: options.xtag,
			offset: options.offset,
			lIndex: options.lIndex,
			explanation: "The tag ending with \"".concat(options.xtag.substr(0, 30), "\" has duplicate close tags")
		};
		return err;
	}
	function getUnclosedTagException(options) {
		var err = new XTTemplateError("Unclosed tag");
		err.properties = {
			xtag: first(options.xtag.split(" ")).substr(1),
			id: "unclosed_tag",
			context: options.xtag,
			offset: options.offset,
			lIndex: options.lIndex,
			explanation: "The tag beginning with \"".concat(options.xtag.substr(0, 30), "\" is unclosed")
		};
		return err;
	}
	function throwXmlTagNotFound(options) {
		if (options.position === "left") throwXmlTagNotFoundLeft(options);
		else throwXmlTagNotFoundRight(options);
	}
	function throwXmlTagNotFoundLeft(options) {
		var err = new XTTemplateError("No tag \"".concat(options.element, "\" was found at the ").concat(options.position));
		var part = options.parsed[options.index];
		err.properties = {
			id: "no_xml_tag_found_at_left",
			explanation: "No tag \"".concat(options.element, "\" was found at the left"),
			offset: part.offset,
			part,
			parsed: options.parsed,
			index: options.index,
			element: options.element
		};
		throw err;
	}
	function throwXmlTagNotFoundRight(options) {
		var err = new XTTemplateError("No tag \"".concat(options.element, "\" was found at the ").concat(options.position));
		var part = options.parsed[options.index];
		err.properties = {
			id: "no_xml_tag_found_at_right",
			explanation: "No tag \"".concat(options.element, "\" was found at the right"),
			offset: part.offset,
			part,
			parsed: options.parsed,
			index: options.index,
			element: options.element
		};
		throw err;
	}
	function getCorruptCharactersException(_ref) {
		var tag = _ref.tag, value = _ref.value, offset = _ref.offset;
		var err = new XTRenderingError("There are some XML corrupt characters");
		err.properties = {
			id: "invalid_xml_characters",
			xtag: tag,
			value,
			offset,
			explanation: "There are some corrupt characters for the field \"".concat(tag, "\"")
		};
		return err;
	}
	function getInvalidRawXMLValueException(_ref2) {
		var tag = _ref2.tag, value = _ref2.value, offset = _ref2.offset, partDelims = _ref2.partDelims;
		var err = new XTRenderingError("Non string values are not allowed for rawXML tags");
		err.properties = {
			id: "invalid_raw_xml_value",
			xtag: tag,
			value,
			offset,
			explanation: "The value of the raw tag : \"".concat(partDelims, "\" is not a string")
		};
		return err;
	}
	function throwExpandNotFound(options) {
		var _options$part = options.part, value = _options$part.value, offset = _options$part.offset, _options$id = options.id, id = _options$id === void 0 ? "raw_tag_outerxml_invalid" : _options$id, _options$message = options.message, message = _options$message === void 0 ? "Raw tag not in paragraph" : _options$message;
		var part = options.part;
		var _options$explanation = options.explanation, explanation = _options$explanation === void 0 ? "The tag \"".concat(value, "\" is not inside a paragraph") : _options$explanation;
		if (typeof explanation === "function") explanation = explanation(part);
		var err = new XTTemplateError(message);
		err.properties = {
			id,
			explanation,
			rootError: options.rootError,
			xtag: value,
			offset,
			postparsed: options.postparsed,
			expandTo: options.expandTo,
			index: options.index
		};
		throw err;
	}
	function throwRawTagShouldBeOnlyTextInParagraph(options) {
		var err = new XTTemplateError("Raw tag should be the only text in paragraph");
		var tag = options.part.value;
		err.properties = {
			id: "raw_xml_tag_should_be_only_text_in_paragraph",
			explanation: "The raw tag \"".concat(tag, "\" should be the only text in this paragraph. This means that this tag should not be surrounded by any text or spaces."),
			xtag: tag,
			offset: options.part.offset,
			paragraphParts: options.paragraphParts
		};
		throw err;
	}
	function getUnmatchedLoopException(part) {
		var location = part.location, offset = part.offset, square = part.square;
		var t = location === "start" ? "unclosed" : "unopened";
		var T = location === "start" ? "Unclosed" : "Unopened";
		var err = new XTTemplateError("".concat(T, " loop"));
		var tag = part.value;
		err.properties = {
			id: "".concat(t, "_loop"),
			explanation: "The loop with tag \"".concat(tag, "\" is ").concat(t),
			xtag: tag,
			offset
		};
		if (square) err.properties.square = square;
		return err;
	}
	function getUnbalancedLoopException(pair, lastPair) {
		var err = new XTTemplateError("Unbalanced loop tag");
		var lastL = lastPair[0].part.value;
		var lastR = lastPair[1].part.value;
		var l = pair[0].part.value;
		var r = pair[1].part.value;
		err.properties = {
			id: "unbalanced_loop_tags",
			explanation: "Unbalanced loop tags {#".concat(lastL, "}{/").concat(lastR, "}{#").concat(l, "}{/").concat(r, "}"),
			offset: [lastPair[0].part.offset, pair[1].part.offset],
			lastPair: {
				left: lastPair[0].part.value,
				right: lastPair[1].part.value
			},
			pair: {
				left: pair[0].part.value,
				right: pair[1].part.value
			}
		};
		return err;
	}
	function getClosingTagNotMatchOpeningTag(_ref3) {
		var tags = _ref3.tags;
		var err = new XTTemplateError("Closing tag does not match opening tag");
		err.properties = {
			id: "closing_tag_does_not_match_opening_tag",
			explanation: "The tag \"".concat(tags[0].value, "\" is closed by the tag \"").concat(tags[1].value, "\""),
			openingtag: first(tags).value,
			offset: [first(tags).offset, last(tags).offset],
			closingtag: last(tags).value
		};
		if (first(tags).square) err.properties.square = [first(tags).square, last(tags).square];
		return err;
	}
	function getLoopPositionProducesInvalidXMLError(_ref4) {
		var tag = _ref4.tag, offset = _ref4.offset;
		var err = new XTTemplateError("The position of the loop tags \"".concat(tag, "\" would produce invalid XML"));
		err.properties = {
			xtag: tag,
			id: "loop_position_invalid",
			explanation: "The tags \"".concat(tag, "\" are misplaced in the document, for example one of them is in a table and the other one outside the table"),
			offset
		};
		return err;
	}
	function getScopeCompilationError(_ref5) {
		var tag = _ref5.tag, rootError = _ref5.rootError, offset = _ref5.offset;
		var err = new XTScopeParserError("Scope parser compilation failed");
		err.properties = {
			id: "scopeparser_compilation_failed",
			offset,
			xtag: tag,
			explanation: "The scope parser for the tag \"".concat(tag, "\" failed to compile"),
			rootError
		};
		return err;
	}
	function getScopeParserExecutionError(_ref6) {
		var tag = _ref6.tag, scope = _ref6.scope, error = _ref6.error, offset = _ref6.offset;
		var err = new XTScopeParserError("Scope parser execution failed");
		err.properties = {
			id: "scopeparser_execution_failed",
			explanation: "The scope parser for the tag \"".concat(tag, "\" failed to execute"),
			scope,
			offset,
			xtag: tag,
			rootError: error
		};
		return err;
	}
	function throwUnimplementedTagType(part, index) {
		var errorMsg = "Unimplemented tag type \"".concat(part.type, "\"");
		if (part.module) errorMsg += " \"".concat(part.module, "\"");
		var err = new XTTemplateError(errorMsg);
		err.properties = {
			part,
			index,
			id: "unimplemented_tag_type"
		};
		throw err;
	}
	function throwMalformedXml() {
		var err = new XTInternalError("Malformed xml");
		err.properties = {
			explanation: "The template contains malformed xml",
			id: "malformed_xml"
		};
		throw err;
	}
	function throwResolveBeforeCompile() {
		var err = new XTInternalError("You must run `.compile()` before running `.resolveData()`");
		err.properties = {
			id: "resolve_before_compile",
			explanation: "You must run `.compile()` before running `.resolveData()`"
		};
		throw err;
	}
	function throwRenderInvalidTemplate() {
		var err = new XTInternalError("You should not call .render on a document that had compilation errors");
		err.properties = {
			id: "render_on_invalid_template",
			explanation: "You should not call .render on a document that had compilation errors"
		};
		throw err;
	}
	function throwRenderTwice() {
		var err = new XTInternalError("You should not call .render twice on the same Docxtemplater instance");
		err.properties = {
			id: "render_twice",
			explanation: "You should not call .render twice on the same Docxtemplater instance"
		};
		throw err;
	}
	function throwXmlInvalid(content, offset) {
		var err = new XTTemplateError("An XML file has invalid xml");
		err.properties = {
			id: "file_has_invalid_xml",
			content,
			offset,
			explanation: "The docx contains invalid XML, it is most likely corrupt"
		};
		throw err;
	}
	module.exports = {
		XTError,
		XTTemplateError,
		XTInternalError,
		XTScopeParserError,
		XTAPIVersionError,
		RenderingError: XTRenderingError,
		XTRenderingError,
		getClosingTagNotMatchOpeningTag,
		getLoopPositionProducesInvalidXMLError,
		getScopeCompilationError,
		getScopeParserExecutionError,
		getUnclosedTagException,
		getUnopenedTagException,
		getUnmatchedLoopException,
		getDuplicateCloseTagException,
		getDuplicateOpenTagException,
		getCorruptCharactersException,
		getInvalidRawXMLValueException,
		getUnbalancedLoopException,
		throwApiVersionError,
		throwFileTypeNotHandled,
		throwFileTypeNotIdentified,
		throwMalformedXml,
		throwMultiError,
		throwExpandNotFound,
		throwRawTagShouldBeOnlyTextInParagraph,
		throwUnimplementedTagType,
		throwXmlTagNotFound,
		throwXmlInvalid,
		throwResolveBeforeCompile,
		throwRenderInvalidTemplate,
		throwRenderTwice
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/doc-utils.js
var require_doc_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _slicedToArray(r, e) {
		return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(r, a) {
		if (r) {
			if ("string" == typeof r) return _arrayLikeToArray(r, a);
			var t = {}.toString.call(r).slice(8, -1);
			return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
		}
	}
	function _arrayLikeToArray(r, a) {
		(null == a || a > r.length) && (a = r.length);
		for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
		return n;
	}
	function _iterableToArrayLimit(r, l) {
		var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (null != t) {
			var e, n, i, u, a = [], f = !0, o = !1;
			try {
				if (i = (t = t.call(r)).next, 0 === l) {
					if (Object(t) !== t) return;
					f = !1;
				} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
			} catch (r) {
				o = !0, n = r;
			} finally {
				try {
					if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
				} finally {
					if (o) throw n;
				}
			}
			return a;
		}
	}
	function _arrayWithHoles(r) {
		if (Array.isArray(r)) return r;
	}
	var _require = require_lib();
	var DOMParser = _require.DOMParser;
	var XMLSerializer = _require.XMLSerializer;
	var throwXmlTagNotFound = require_errors().throwXmlTagNotFound;
	var _require3 = require_utils();
	var last = _require3.last;
	var first = _require3.first;
	var nativeHasOwn = Object.prototype.hasOwnProperty;
	var nativeBind = Function.prototype.bind;
	var nativeCall = Function.prototype.call;
	var hasOwn = nativeCall.bind(nativeCall, nativeBind)(nativeCall, nativeCall, nativeHasOwn);
	function isWhiteSpace(value) {
		return /^[ \n\r\t]+$/.test(value);
	}
	function parser(tag) {
		return { get: function get(scope) {
			if (tag === ".") return scope;
			if (scope) {
				if (hasOwn(scope, tag)) return scope[tag];
				return;
			}
			return scope;
		} };
	}
	function defaultWarnFn(errors) {
		for (var _i2 = 0; _i2 < errors.length; _i2++) {
			var error = errors[_i2];
			if (error.message) console.warn("Warning : " + error.message);
		}
	}
	var attrToRegex = {};
	function setSingleAttribute(partValue, attr, attrValue) {
		var regex;
		if (attrToRegex[attr]) regex = attrToRegex[attr];
		else {
			regex = new RegExp("(<.* ".concat(attr, "=\")([^\"]*)(\".*)$"));
			attrToRegex[attr] = regex;
		}
		if (regex.test(partValue)) return partValue.replace(regex, "$1".concat(attrValue, "$3"));
		var end = partValue.lastIndexOf("/>");
		if (end === -1) end = partValue.lastIndexOf(">");
		return partValue.substr(0, end) + " ".concat(attr, "=\"").concat(attrValue, "\"") + partValue.substr(end);
	}
	function getSingleAttribute(value, attributeName) {
		var index = value.indexOf(" ".concat(attributeName, "=\""));
		if (index === -1) return null;
		var startIndex = value.substr(index).search(/["']/) + index;
		var endIndex = value.substr(startIndex + 1).search(/["']/) + startIndex;
		return value.substr(startIndex + 1, endIndex - startIndex);
	}
	function endsWith(str, suffix) {
		var subLen = str.length - suffix.length;
		return subLen >= 0 && str.lastIndexOf(suffix, subLen) === subLen;
	}
	function startsWith(str, prefix) {
		return str.lastIndexOf(prefix, 0) === 0;
	}
	function getDuplicates(arr) {
		var duplicates = [];
		var hash = {}, result = [];
		for (var i = 0, l = arr.length; i < l; ++i) if (!hash[arr[i]]) {
			hash[arr[i]] = true;
			result.push(arr[i]);
		} else duplicates.push(arr[i]);
		return duplicates;
	}
	function uniq(arr) {
		var hash = {}, result = [];
		for (var i = 0, l = arr.length; i < l; ++i) if (!hash[arr[i]]) {
			hash[arr[i]] = true;
			result.push(arr[i]);
		}
		return result;
	}
	function chunkBy(parsed, f) {
		var chunks = [[]];
		for (var _i4 = 0; _i4 < parsed.length; _i4++) {
			var p = parsed[_i4];
			var currentChunk = chunks[chunks.length - 1];
			var res = f(p);
			if (res === "start") chunks.push([p]);
			else if (res === "end") {
				currentChunk.push(p);
				chunks.push([]);
			} else currentChunk.push(p);
		}
		var result = [];
		for (var _i6 = 0; _i6 < chunks.length; _i6++) {
			var chunk = chunks[_i6];
			if (chunk.length > 0) result.push(chunk);
		}
		return result;
	}
	function getDefaults() {
		return {
			errorLogging: "json",
			stripInvalidXMLChars: false,
			paragraphLoop: false,
			nullGetter: function nullGetter(part) {
				return part.module ? "" : "undefined";
			},
			xmlFileNames: ["[Content_Types].xml"],
			parser,
			warnFn: defaultWarnFn,
			linebreaks: false,
			fileTypeConfig: null,
			delimiters: {
				start: "{",
				end: "}"
			},
			syntax: {
				changeDelimiterPrefix: "=",
				preserveNewlinesInTags: false,
				allowUnopenedTag: false,
				allowUnclosedTag: false,
				allowUnbalancedLoops: false
			}
		};
	}
	function xml2str(xmlNode) {
		return new XMLSerializer().serializeToString(xmlNode).replace(/xmlns(:[a-z0-9]+)?="" ?/g, "");
	}
	function str2xml(str) {
		if (str.charCodeAt(0) === 65279) str = str.substr(1);
		return new DOMParser().parseFromString(str, "text/xml");
	}
	var charMap = [
		["&", "&amp;"],
		["<", "&lt;"],
		[">", "&gt;"],
		["\"", "&quot;"],
		["'", "&apos;"]
	];
	var charMapRegexes = charMap.map(function(_ref) {
		var _ref2 = _slicedToArray(_ref, 2), endChar = _ref2[0], startChar = _ref2[1];
		return {
			rstart: new RegExp(startChar, "g"),
			rend: new RegExp(endChar, "g"),
			start: startChar,
			end: endChar
		};
	});
	function wordToUtf8(string) {
		for (var i = charMapRegexes.length - 1; i >= 0; i--) {
			var r = charMapRegexes[i];
			string = string.replace(r.rstart, r.end);
		}
		return string;
	}
	function utf8ToWord(string) {
		var _string;
		if ((_string = string) !== null && _string !== void 0 && _string.toString) string = string.toString();
		else string = "";
		var r;
		for (var i = 0, l = charMapRegexes.length; i < l; i++) {
			r = charMapRegexes[i];
			string = string.replace(r.rend, r.start);
		}
		return string;
	}
	function concatArrays(arrays) {
		var result = [];
		for (var _i8 = 0; _i8 < arrays.length; _i8++) {
			var array = arrays[_i8];
			for (var _i0 = 0; _i0 < array.length; _i0++) {
				var el = array[_i0];
				result.push(el);
			}
		}
		return result;
	}
	function pushArray(array1, array2) {
		if (!array2) return array1;
		for (var i = 0, len = array2.length; i < len; i++) array1.push(array2[i]);
		return array1;
	}
	var spaceRegexp = new RegExp(String.fromCharCode(160), "g");
	function convertSpaces(s) {
		return s.replace(spaceRegexp, " ");
	}
	function pregMatchAll(regex, content) {
		var matchArray = [];
		var match;
		while ((match = regex.exec(content)) != null) matchArray.push({
			array: match,
			offset: match.index
		});
		return matchArray;
	}
	function isEnding(value, element) {
		return value === "</" + element + ">";
	}
	function isStarting(value, element) {
		return value.indexOf("<" + element) === 0 && [
			">",
			" ",
			"/"
		].indexOf(value[element.length + 1]) !== -1;
	}
	function getRight(parsed, element, index) {
		var val = getRightOrNull(parsed, element, index);
		if (val !== null) return val;
		throwXmlTagNotFound({
			position: "right",
			element,
			parsed,
			index
		});
	}
	function getRightOrNull(parsed, elements, index) {
		if (typeof elements === "string") elements = [elements];
		var level = 1;
		for (var i = index, l = parsed.length; i < l; i++) {
			var part = parsed[i];
			for (var _i10 = 0, _elements2 = elements; _i10 < _elements2.length; _i10++) {
				var element = _elements2[_i10];
				if (isEnding(part.value, element)) level--;
				if (isStarting(part.value, element)) level++;
				if (level === 0) return i;
			}
		}
		return null;
	}
	function getLeft(parsed, element, index) {
		var val = getLeftOrNull(parsed, element, index);
		if (val !== null) return val;
		throwXmlTagNotFound({
			position: "left",
			element,
			parsed,
			index
		});
	}
	function getLeftOrNull(parsed, elements, index) {
		if (typeof elements === "string") elements = [elements];
		var level = 1;
		for (var i = index; i >= 0; i--) {
			var part = parsed[i];
			for (var _i12 = 0, _elements4 = elements; _i12 < _elements4.length; _i12++) {
				var element = _elements4[_i12];
				if (isStarting(part.value, element)) level--;
				if (isEnding(part.value, element)) level++;
				if (level === 0) return i;
			}
		}
		return null;
	}
	function isTagStart(tagType, _ref3) {
		var type = _ref3.type, tag = _ref3.tag, position = _ref3.position;
		return type === "tag" && tag === tagType && (position === "start" || position === "selfclosing");
	}
	function isTagEnd(tagType, _ref4) {
		var type = _ref4.type, tag = _ref4.tag, position = _ref4.position;
		return type === "tag" && tag === tagType && position === "end";
	}
	function isParagraphStart(_ref5) {
		var type = _ref5.type, tag = _ref5.tag, position = _ref5.position;
		return [
			"w:p",
			"a:p",
			"text:p"
		].indexOf(tag) !== -1 && type === "tag" && position === "start";
	}
	function isParagraphEnd(_ref6) {
		var type = _ref6.type, tag = _ref6.tag, position = _ref6.position;
		return [
			"w:p",
			"a:p",
			"text:p"
		].indexOf(tag) !== -1 && type === "tag" && position === "end";
	}
	function isBreakTag(_ref7) {
		var type = _ref7.type, tag = _ref7.tag, position = _ref7.position;
		return ["w:br", "a:br"].indexOf(tag) !== -1 && type === "tag" && (position === "start" || position === "selfclosing");
	}
	function isTextStart(_ref8) {
		var type = _ref8.type, position = _ref8.position;
		return _ref8.text && type === "tag" && position === "start";
	}
	function isTextEnd(_ref9) {
		var type = _ref9.type, position = _ref9.position;
		return _ref9.text && type === "tag" && position === "end";
	}
	function isContent(_ref0) {
		var type = _ref0.type, position = _ref0.position;
		return type === "placeholder" || type === "content" && position === "insidetag";
	}
	function isModule(_ref1, modules) {
		var module$7 = _ref1.module, type = _ref1.type;
		if (!(modules instanceof Array)) modules = [modules];
		return type === "placeholder" && modules.indexOf(module$7) !== -1;
	}
	var corruptCharacters = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;
	function hasCorruptCharacters(string) {
		corruptCharacters.lastIndex = 0;
		return corruptCharacters.test(string);
	}
	function removeCorruptCharacters(string) {
		if (typeof string !== "string") string = String(string);
		return string.replace(corruptCharacters, "");
	}
	function invertMap(map) {
		var invertedMap = {};
		for (var key in map) {
			var value = map[key];
			invertedMap[value] || (invertedMap[value] = []);
			invertedMap[value].push(key);
		}
		return invertedMap;
	}
	function stableSort(arr, compare) {
		var withIndex = [];
		for (var i = 0; i < arr.length; i++) withIndex.push({
			item: arr[i],
			index: i
		});
		withIndex.sort(function(a, b) {
			return compare(a.item, b.item) || a.index - b.index;
		});
		var result = [];
		for (var _i13 = 0; _i13 < withIndex.length; _i13++) result.push(withIndex[_i13].item);
		return result;
	}
	function getPartWithDelimiters(part, options) {
		return options.delimiters.start + part.raw + options.delimiters.end;
	}
	module.exports = {
		getPartWithDelimiters,
		endsWith,
		startsWith,
		isContent,
		isParagraphStart,
		isParagraphEnd,
		isBreakTag,
		isTagStart,
		isTagEnd,
		isTextStart,
		isTextEnd,
		isStarting,
		isEnding,
		isModule,
		uniq,
		getDuplicates,
		chunkBy,
		last,
		first,
		xml2str,
		str2xml,
		getRightOrNull,
		getRight,
		getLeftOrNull,
		getLeft,
		pregMatchAll,
		convertSpaces,
		charMapRegexes,
		hasCorruptCharacters,
		removeCorruptCharacters,
		getDefaults,
		wordToUtf8,
		utf8ToWord,
		concatArrays,
		pushArray,
		invertMap,
		charMap,
		getSingleAttribute,
		setSingleAttribute,
		isWhiteSpace,
		stableSort
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/minizod.js
var require_minizod = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _slicedToArray(r, e) {
		return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(r, a) {
		if (r) {
			if ("string" == typeof r) return _arrayLikeToArray(r, a);
			var t = {}.toString.call(r).slice(8, -1);
			return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
		}
	}
	function _arrayLikeToArray(r, a) {
		(null == a || a > r.length) && (a = r.length);
		for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
		return n;
	}
	function _iterableToArrayLimit(r, l) {
		var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (null != t) {
			var e, n, i, u, a = [], f = !0, o = !1;
			try {
				if (i = (t = t.call(r)).next, 0 === l) {
					if (Object(t) !== t) return;
					f = !1;
				} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
			} catch (r) {
				o = !0, n = r;
			} finally {
				try {
					if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
				} finally {
					if (o) throw n;
				}
			}
			return a;
		}
	}
	function _arrayWithHoles(r) {
		if (Array.isArray(r)) return r;
	}
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	module.exports = /* @__PURE__ */ function() {
		function MiniZod() {
			_classCallCheck(this, MiniZod);
		}
		return _createClass(MiniZod, null, [
			{
				key: "createSchema",
				value: function createSchema(validateFn) {
					return {
						validate: validateFn,
						optional: function optional() {
							return MiniZod.createSchema(function(value) {
								return value === void 0 ? {
									success: true,
									value
								} : validateFn(value);
							});
						},
						nullable: function nullable() {
							return MiniZod.createSchema(function(value) {
								return value == null ? {
									success: true,
									value
								} : validateFn(value);
							});
						}
					};
				}
			},
			{
				key: "string",
				value: function string() {
					return MiniZod.createSchema(function(value) {
						if (typeof value !== "string") return {
							success: false,
							error: "Expected string, received ".concat(_typeof(value))
						};
						return {
							success: true,
							value
						};
					});
				}
			},
			{
				key: "date",
				value: function date() {
					return MiniZod.createSchema(function(value) {
						if (!(value instanceof Date)) return {
							success: false,
							error: "Expected date, received ".concat(_typeof(value))
						};
						return {
							success: true,
							value
						};
					});
				}
			},
			{
				key: "boolean",
				value: function _boolean() {
					return MiniZod.createSchema(function(value) {
						if (typeof value !== "boolean") return {
							success: false,
							error: "Expected boolean, received ".concat(_typeof(value))
						};
						return {
							success: true,
							value
						};
					});
				}
			},
			{
				key: "number",
				value: function number() {
					return MiniZod.createSchema(function(value) {
						if (typeof value !== "number") return {
							success: false,
							error: "Expected number, received ".concat(_typeof(value))
						};
						return {
							success: true,
							value
						};
					});
				}
			},
			{
				key: "function",
				value: function _function() {
					return MiniZod.createSchema(function(value) {
						if (typeof value !== "function") return {
							success: false,
							error: "Expected function, received ".concat(_typeof(value))
						};
						return {
							success: true,
							value
						};
					});
				}
			},
			{
				key: "array",
				value: function array(itemSchema) {
					return MiniZod.createSchema(function(value) {
						if (!Array.isArray(value)) return {
							success: false,
							error: "Expected array, received ".concat(_typeof(value))
						};
						for (var i = 0; i < value.length; i++) {
							var result = itemSchema.validate(value[i]);
							if (!result.success) return {
								success: false,
								error: "".concat(result.error, " at index ").concat(i)
							};
						}
						return {
							success: true,
							value
						};
					});
				}
			},
			{
				key: "any",
				value: function any() {
					return MiniZod.createSchema(function(value) {
						return {
							success: true,
							value
						};
					});
				}
			},
			{
				key: "isRegex",
				value: function isRegex() {
					return MiniZod.createSchema(function(value) {
						if (!(value instanceof RegExp)) return {
							success: false,
							error: "Expected RegExp, received ".concat(_typeof(value))
						};
						return {
							success: true,
							value
						};
					});
				}
			},
			{
				key: "union",
				value: function union(schemas) {
					return MiniZod.createSchema(function(value) {
						for (var _i2 = 0; _i2 < schemas.length; _i2++) {
							var result = schemas[_i2].validate(value);
							if (result.success) return result;
						}
						return {
							success: false,
							error: "Value ".concat(value, " does not match any schema in union")
						};
					});
				}
			},
			{
				key: "object",
				value: function object(shape) {
					var schema = MiniZod.createSchema(function(value) {
						if (value == null) return {
							success: false,
							error: "Expected object, received ".concat(value)
						};
						if (_typeof(value) !== "object") return {
							success: false,
							error: "Expected object, received ".concat(_typeof(value))
						};
						for (var _i4 = 0, _Object$entries2 = Object.entries(shape); _i4 < _Object$entries2.length; _i4++) {
							var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i4], 2), key = _Object$entries2$_i[0];
							var result = _Object$entries2$_i[1].validate(value[key]);
							if (!result.success) return {
								success: false,
								error: "".concat(result.error, " at ").concat(key)
							};
						}
						return {
							success: true,
							value
						};
					});
					schema.strict = function() {
						return MiniZod.createSchema(function(value) {
							var baseResult = schema.validate(value);
							if (!baseResult.success) return baseResult;
							var extraKeys = Object.keys(value).filter(function(key) {
								return !(key in shape);
							});
							if (extraKeys.length > 0) return {
								success: false,
								error: "Unexpected properties: ".concat(extraKeys.join(", "))
							};
							return baseResult;
						});
					};
					return schema;
				}
			},
			{
				key: "record",
				value: function record(valueSchema) {
					return MiniZod.createSchema(function(value) {
						if (value === null) return {
							success: false,
							error: "Expected object, received null"
						};
						if (_typeof(value) !== "object") return {
							success: false,
							error: "Expected object, received ".concat(_typeof(value))
						};
						for (var _i6 = 0, _Object$keys2 = Object.keys(value); _i6 < _Object$keys2.length; _i6++) {
							var key = _Object$keys2[_i6];
							if (typeof key !== "string") return {
								success: false,
								error: "Expected string key, received ".concat(_typeof(key), " at ").concat(key)
							};
							var result = valueSchema.validate(value[key]);
							if (!result.success) return {
								success: false,
								error: "".concat(result.error, " at key ").concat(key)
							};
						}
						return {
							success: true,
							value
						};
					});
				}
			}
		]);
	}();
}));
//#endregion
//#region node_modules/docxtemplater/js/get-relation-types.js
var require_get_relation_types = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var str2xml = require_doc_utils().str2xml;
	var relsFile = "_rels/.rels";
	function getRelsTypes(zip) {
		var rootRels = zip.files[relsFile];
		var rootRelsXml = rootRels ? str2xml(rootRels.asText()) : null;
		var rootRelationships = rootRelsXml ? rootRelsXml.getElementsByTagName("Relationship") : [];
		var relsTypes = {};
		for (var _i2 = 0; _i2 < rootRelationships.length; _i2++) {
			var relation = rootRelationships[_i2];
			relsTypes[relation.getAttribute("Target")] = relation.getAttribute("Type");
		}
		return relsTypes;
	}
	module.exports = { getRelsTypes };
}));
//#endregion
//#region node_modules/docxtemplater/js/get-content-types.js
var require_get_content_types = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var str2xml = require_doc_utils().str2xml;
	var ctXML = "[Content_Types].xml";
	function collectContentTypes(overrides, defaults, zip) {
		var partNames = {};
		for (var _i2 = 0; _i2 < overrides.length; _i2++) {
			var override = overrides[_i2];
			var contentType = override.getAttribute("ContentType");
			var partName = override.getAttribute("PartName").substr(1);
			partNames[partName] = contentType;
		}
		zip.file(/./).map(function(_ref) {
			var name = _ref.name;
			for (var _i4 = 0; _i4 < defaults.length; _i4++) {
				var def = defaults[_i4];
				var _contentType = def.getAttribute("ContentType");
				var extension = def.getAttribute("Extension");
				if (name.slice(name.length - extension.length) === extension && !partNames[name] && name !== ctXML) partNames[name] = _contentType;
			}
			partNames[name] || (partNames[name] = "");
		});
		return partNames;
	}
	function getContentTypes(zip) {
		var contentTypes = zip.files[ctXML];
		var contentTypeXml = contentTypes ? str2xml(contentTypes.asText()) : null;
		return {
			overrides: contentTypeXml ? contentTypeXml.getElementsByTagName("Override") : null,
			defaults: contentTypeXml ? contentTypeXml.getElementsByTagName("Default") : null,
			contentTypes,
			contentTypeXml
		};
	}
	module.exports = {
		collectContentTypes,
		getContentTypes
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/module-wrapper.js
var require_module_wrapper = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var XTInternalError = require_errors().XTInternalError;
	function emptyFun() {}
	function identity(i) {
		return i;
	}
	module.exports = function(module$6) {
		var defaults = {
			on: emptyFun,
			set: emptyFun,
			getFileType: emptyFun,
			optionsTransformer: identity,
			preparse: identity,
			matchers: function matchers() {
				return [];
			},
			parse: emptyFun,
			getTraits: emptyFun,
			postparse: identity,
			errorsTransformer: identity,
			preResolve: emptyFun,
			resolve: emptyFun,
			getRenderedMap: identity,
			render: emptyFun,
			nullGetter: emptyFun,
			postrender: identity
		};
		if (Object.keys(defaults).every(function(key) {
			return !module$6[key];
		})) {
			var err = new XTInternalError("This module cannot be wrapped, because it doesn't define any of the necessary functions");
			err.properties = {
				id: "module_cannot_be_wrapped",
				explanation: "This module cannot be wrapped, because it doesn't define any of the necessary functions"
			};
			throw err;
		}
		for (var key in defaults) module$6[key] || (module$6[key] = defaults[key]);
		return module$6;
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/traits.js
var require_traits = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _toConsumableArray(r) {
		return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
	}
	function _nonIterableSpread() {
		throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _iterableToArray(r) {
		if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
	}
	function _arrayWithoutHoles(r) {
		if (Array.isArray(r)) return _arrayLikeToArray(r);
	}
	function _slicedToArray(r, e) {
		return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(r, a) {
		if (r) {
			if ("string" == typeof r) return _arrayLikeToArray(r, a);
			var t = {}.toString.call(r).slice(8, -1);
			return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
		}
	}
	function _arrayLikeToArray(r, a) {
		(null == a || a > r.length) && (a = r.length);
		for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
		return n;
	}
	function _iterableToArrayLimit(r, l) {
		var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (null != t) {
			var e, n, i, u, a = [], f = !0, o = !1;
			try {
				if (i = (t = t.call(r)).next, 0 === l) {
					if (Object(t) !== t) return;
					f = !1;
				} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
			} catch (r) {
				o = !0, n = r;
			} finally {
				try {
					if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
				} finally {
					if (o) throw n;
				}
			}
			return a;
		}
	}
	function _arrayWithHoles(r) {
		if (Array.isArray(r)) return r;
	}
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var _require = require_doc_utils();
	var getRightOrNull = _require.getRightOrNull;
	var getRight = _require.getRight;
	var getLeft = _require.getLeft;
	var getLeftOrNull = _require.getLeftOrNull;
	var chunkBy = _require.chunkBy;
	var isTagStart = _require.isTagStart;
	var isTagEnd = _require.isTagEnd;
	var isContent = _require.isContent;
	var last = _require.last;
	var first = _require.first;
	var _require2 = require_errors();
	var XTTemplateError = _require2.XTTemplateError;
	var throwExpandNotFound = _require2.throwExpandNotFound;
	var getLoopPositionProducesInvalidXMLError = _require2.getLoopPositionProducesInvalidXMLError;
	function lastTagIsOpenTag(tags, tag) {
		if (tags.length === 0) return false;
		return last(tags).substr(1).indexOf(tag) === 0;
	}
	function getListXmlElements(parts) {
		var result = [];
		for (var _i2 = 0; _i2 < parts.length; _i2++) {
			var _parts$_i = parts[_i2], position = _parts$_i.position, value = _parts$_i.value, tag = _parts$_i.tag;
			if (!tag) continue;
			if (position === "end") {
				if (lastTagIsOpenTag(result, tag)) result.pop();
				else result.push(value);
			} else if (position === "start") result.push(value);
		}
		return result;
	}
	function has(name, xmlElements) {
		for (var _i4 = 0; _i4 < xmlElements.length; _i4++) if (xmlElements[_i4].indexOf("<".concat(name)) === 0) return true;
		return false;
	}
	function getExpandToDefault(postparsed, pair, expandTags) {
		var xmlElements = getListXmlElements(postparsed.slice(pair[0].offset, pair[1].offset));
		var _loop = function _loop() {
			var _expandTags$_i = expandTags[_i6], contains = _expandTags$_i.contains, expand = _expandTags$_i.expand, onlyTextInTag = _expandTags$_i.onlyTextInTag;
			if (has(contains, xmlElements)) {
				if (onlyTextInTag) {
					var left = getLeftOrNull(postparsed, contains, pair[0].offset);
					var right = getRightOrNull(postparsed, contains, pair[1].offset);
					if (left === null || right === null) return 0;
					var chunks = chunkBy(postparsed.slice(left, right), function(p) {
						return isTagStart(contains, p) ? "start" : isTagEnd(contains, p) ? "end" : null;
					});
					var firstChunk = first(chunks);
					var lastChunk = last(chunks);
					var firstContent = firstChunk.filter(isContent);
					var lastContent = lastChunk.filter(isContent);
					if (firstContent.length !== 1 || lastContent.length !== 1) return 0;
				}
				var structured = getStructuredTagPositions(xmlElements);
				var openCount = 0;
				for (var _i8 = 0; _i8 < structured.length; _i8++) {
					var _structured$_i = structured[_i8], tag = _structured$_i.tag, position = _structured$_i.position;
					if (tag === expand) {
						if (position === "start") openCount++;
						if (position === "end") openCount--;
					}
				}
				if (openCount !== 0) return { v: { error: getLoopPositionProducesInvalidXMLError({
					tag: first(pair).part.value,
					offset: [first(pair).part.offset, last(pair).part.offset]
				}) } };
				return { v: { value: expand } };
			}
		}, _ret;
		for (var _i6 = 0; _i6 < expandTags.length; _i6++) {
			_ret = _loop();
			if (_ret === 0) continue;
			if (_ret) return _ret.v;
		}
		if (!checkStartEnd(xmlElements)) return { error: getLoopPositionProducesInvalidXMLError({
			tag: first(pair).part.value,
			offset: [first(pair).part.offset, last(pair).part.offset]
		}) };
		return {};
	}
	function getStructuredTagPositions(xmlElements) {
		var result = [];
		for (var _i0 = 0; _i0 < xmlElements.length; _i0++) {
			var el = xmlElements[_i0];
			var tag = getTagName(el);
			var position = /^\s*<\//.test(el) ? "end" : "start";
			result.push({
				tag,
				position
			});
		}
		return result;
	}
	function getTagName(tag) {
		return tag.replace(/^\s*<\/?([a-zA-Z:]+).*/, "$1");
	}
	function checkStartEnd(xmlElements) {
		if (xmlElements.length % 2 === 1) return false;
		for (var i = 0, len = xmlElements.length / 2; i < len; i++) {
			var start = xmlElements[i];
			var end = xmlElements[xmlElements.length - i - 1];
			if (getTagName(start) !== getTagName(end)) return false;
		}
		return true;
	}
	function getExpandLimit(part, index, postparsed, options) {
		var expandTo = part.expandTo || options.expandTo;
		if (!expandTo) return;
		var right, left;
		try {
			left = getLeft(postparsed, expandTo, index);
			right = getRight(postparsed, expandTo, index);
		} catch (rootError) {
			var errProps = _objectSpread({
				part,
				rootError,
				postparsed,
				expandTo,
				index
			}, options.error);
			if (options.onError) {
				if (options.onError(errProps) === "ignore") return;
			}
			throwExpandNotFound(errProps);
		}
		return [left, right];
	}
	function expandOne(_ref, part, postparsed, options) {
		var _ref2 = _slicedToArray(_ref, 2), left = _ref2[0], right = _ref2[1];
		var index = postparsed.indexOf(part);
		var leftParts = postparsed.slice(left, index);
		var rightParts = postparsed.slice(index + 1, right + 1);
		var inner = options.getInner({
			postparse: options.postparse,
			index,
			part,
			leftParts,
			rightParts,
			left,
			right,
			postparsed
		});
		if (!inner.length) {
			inner.expanded = [leftParts, rightParts];
			inner = [inner];
		}
		return {
			left,
			right,
			inner
		};
	}
	function expandToOne(postparsed, options) {
		var errors = [];
		if (postparsed.errors) {
			errors = postparsed.errors;
			postparsed = postparsed.postparsed;
		}
		var limits = [];
		for (var i = 0, len = postparsed.length; i < len; i++) {
			var part = postparsed[i];
			if (part.type === "placeholder" && part.module === options.moduleName && !part.subparsed && !part.expanded) try {
				var limit = getExpandLimit(part, i, postparsed, options);
				if (!limit) continue;
				var _limit = _slicedToArray(limit, 2), left = _limit[0], right = _limit[1];
				limits.push({
					left,
					right,
					part,
					i,
					leftPart: postparsed[left],
					rightPart: postparsed[right]
				});
			} catch (error) {
				errors.push(error);
			}
		}
		limits.sort(function(l1, l2) {
			if (l1.left === l2.left) return l2.part.lIndex < l1.part.lIndex ? 1 : -1;
			return l2.left < l1.left ? 1 : -1;
		});
		var maxRight = -1;
		var offset = 0;
		for (var _i1 = 0, _len = limits.length; _i1 < _len; _i1++) {
			var _postparsed;
			var _limit2 = limits[_i1];
			maxRight = Math.max(maxRight, _i1 > 0 ? limits[_i1 - 1].right : 0);
			if (_limit2.left < maxRight) continue;
			var result = void 0;
			try {
				result = expandOne([_limit2.left + offset, _limit2.right + offset], _limit2.part, postparsed, options);
			} catch (error) {
				if (options.onError) {
					if (options.onError(_objectSpread({
						part: _limit2.part,
						rootError: error,
						postparsed,
						expandOne
					}, options.errors)) === "ignore") continue;
				}
				if (error instanceof XTTemplateError) errors.push(error);
				else throw error;
			}
			if (!result) continue;
			offset += result.inner.length - (result.right + 1 - result.left);
			(_postparsed = postparsed).splice.apply(_postparsed, [result.left, result.right + 1 - result.left].concat(_toConsumableArray(result.inner)));
		}
		return {
			postparsed,
			errors
		};
	}
	module.exports = {
		expandToOne,
		getExpandToDefault
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/filetypes.js
var require_filetypes = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var docxContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml";
	var docxmContentType = "application/vnd.ms-word.document.macroEnabled.main+xml";
	var dotxContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml";
	var dotmContentType = "application/vnd.ms-word.template.macroEnabledTemplate.main+xml";
	var headerContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml";
	var footnotesContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml";
	var commentsContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml";
	var footerContentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml";
	var pptxContentType = "application/vnd.openxmlformats-officedocument.presentationml.slide+xml";
	var pptxSlideMaster = "application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml";
	var pptxSlideLayout = "application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml";
	var pptxPresentationContentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml";
	var xlsxContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml";
	var xlsmContentType = "application/vnd.ms-excel.sheet.macroEnabled.main+xml";
	var xlsxWorksheetContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml";
	var main = [
		docxContentType,
		docxmContentType,
		dotxContentType,
		dotmContentType
	];
	module.exports = {
		main,
		docx: [headerContentType].concat(main, [
			footerContentType,
			footnotesContentType,
			commentsContentType
		]),
		pptx: [
			pptxContentType,
			pptxSlideMaster,
			pptxSlideLayout,
			pptxPresentationContentType
		],
		xlsx: [
			xlsxContentType,
			xlsmContentType,
			xlsxWorksheetContentType
		]
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/content-types.js
var require_content_types = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		settingsContentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml",
		coreContentType: "application/vnd.openxmlformats-package.core-properties+xml",
		appContentType: "application/vnd.openxmlformats-officedocument.extended-properties+xml",
		customContentType: "application/vnd.openxmlformats-officedocument.custom-properties+xml",
		diagramDataContentType: "application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml",
		diagramDrawingContentType: "application/vnd.ms-office.drawingml.diagramDrawing+xml"
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/modules/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var pushArray = require_doc_utils().pushArray;
	var wrapper = require_module_wrapper();
	var filetypes = require_filetypes();
	var _require2 = require_content_types();
	var commonContentTypes = [
		_require2.settingsContentType,
		_require2.coreContentType,
		_require2.appContentType,
		_require2.customContentType,
		_require2.diagramDataContentType,
		_require2.diagramDrawingContentType
	];
	var Common = /*#__PURE__*/ function() {
		function Common() {
			_classCallCheck(this, Common);
			this.name = "Common";
		}
		return _createClass(Common, [{
			key: "getFileType",
			value: function getFileType(_ref) {
				var doc = _ref.doc;
				var invertedContentTypes = doc.invertedContentTypes;
				if (!invertedContentTypes) return;
				for (var _i2 = 0; _i2 < commonContentTypes.length; _i2++) {
					var ct = commonContentTypes[_i2];
					if (invertedContentTypes[ct]) pushArray(doc.targets, invertedContentTypes[ct]);
				}
				var keys = [
					"docx",
					"pptx",
					"xlsx"
				];
				var ftCandidate;
				for (var _i4 = 0; _i4 < keys.length; _i4++) {
					var key = keys[_i4];
					var contentTypes = filetypes[key];
					for (var _i6 = 0; _i6 < contentTypes.length; _i6++) {
						var _ct = contentTypes[_i6];
						if (invertedContentTypes[_ct]) for (var _i8 = 0, _invertedContentTypes2 = invertedContentTypes[_ct]; _i8 < _invertedContentTypes2.length; _i8++) {
							var target = _invertedContentTypes2[_i8];
							if (doc.relsTypes[target] && ["http://purl.oclc.org/ooxml/officeDocument/relationships/officeDocument", "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"].indexOf(doc.relsTypes[target]) === -1) continue;
							ftCandidate = key;
							if (filetypes.main.indexOf(_ct) !== -1 || _ct === filetypes.pptx[0]) doc.textTarget || (doc.textTarget = target);
							if (ftCandidate === "xlsx") continue;
							doc.targets.push(target);
						}
					}
					if (ftCandidate) continue;
				}
				return ftCandidate;
			}
		}]);
	}();
	module.exports = function() {
		return wrapper(new Common());
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/scope-manager.js
var require_scope_manager = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var getScopeParserExecutionError = require_errors().getScopeParserExecutionError;
	var last = require_utils().last;
	var concatArrays = require_doc_utils().concatArrays;
	function find(list, fn) {
		var length = list.length >>> 0;
		var value;
		for (var i = 0; i < length; i++) {
			value = list[i];
			if (fn.call(this, value, i, list)) return value;
		}
	}
	function _getValue(tag, meta, num) {
		var _this = this;
		var scope = this.scopeList[num];
		var lastScope = this.scopeList[this.scopeList.length - 1];
		if (this.root.finishedResolving) {
			var w = this.resolved;
			var _loop = function _loop() {
				var lIndex = _this.scopeLindex[i];
				w = find(w, function(r) {
					return r.lIndex === lIndex;
				});
				w = w.value[_this.scopePathItem[i]];
			};
			for (var i = this.resolveOffset, len = this.scopePath.length; i < len; i++) _loop();
			return find(w, function(r) {
				return meta.part.lIndex === r.lIndex;
			}).value;
		}
		var result;
		var parser;
		if (!this.cachedParsers || !meta.part) parser = this.parser(tag, {
			tag: meta.part,
			scopePath: this.scopePath
		});
		else if (this.cachedParsers[meta.part.lIndex]) parser = this.cachedParsers[meta.part.lIndex];
		else parser = this.cachedParsers[meta.part.lIndex] = this.parser(tag, {
			tag: meta.part,
			scopePath: this.scopePath
		});
		try {
			result = parser.get(scope, this.getContext(meta, num));
		} catch (error) {
			throw getScopeParserExecutionError({
				tag,
				scope,
				error,
				offset: meta.part.offset
			});
		}
		if (result == null && num > 0) return _getValue.call(this, tag, meta, num - 1);
		if (typeof result === "function") try {
			result = result(lastScope, this);
		} catch (error) {
			throw getScopeParserExecutionError({
				tag,
				scope,
				error,
				offset: meta.part.offset
			});
		}
		return result;
	}
	function _getValueAsync(tag, meta, num) {
		var _this2 = this;
		var scope = this.scopeList[num];
		var lastScope = this.scopeList[this.scopeList.length - 1];
		var parser;
		if (!this.cachedParsers || !meta.part) parser = this.parser(tag, {
			tag: meta.part,
			scopePath: this.scopePath
		});
		else if (this.cachedParsers[meta.part.lIndex]) parser = this.cachedParsers[meta.part.lIndex];
		else parser = this.cachedParsers[meta.part.lIndex] = this.parser(tag, {
			tag: meta.part,
			scopePath: this.scopePath
		});
		return Promise.resolve().then(function() {
			return parser.get(scope, _this2.getContext(meta, num));
		})["catch"](function(error) {
			throw getScopeParserExecutionError({
				tag,
				scope,
				error,
				offset: meta.part.offset
			});
		}).then(function(result) {
			if (result == null && num > 0) return _getValueAsync.call(_this2, tag, meta, num - 1);
			return result;
		}).then(function(result) {
			if (typeof result === "function") try {
				result = result(lastScope, _this2);
			} catch (error) {
				throw getScopeParserExecutionError({
					tag,
					scope,
					error,
					offset: meta.part.offset
				});
			}
			return result;
		});
	}
	var ScopeManager = /*#__PURE__*/ function() {
		function ScopeManager(options) {
			_classCallCheck(this, ScopeManager);
			this.root = options.root || this;
			this.resolveOffset = options.resolveOffset || 0;
			this.scopePath = options.scopePath;
			this.scopePathItem = options.scopePathItem;
			this.scopePathLength = options.scopePathLength;
			this.scopeList = options.scopeList;
			this.scopeType = "";
			this.scopeTypes = options.scopeTypes;
			this.scopeLindex = options.scopeLindex;
			this.parser = options.parser;
			this.resolved = options.resolved;
			this.cachedParsers = options.cachedParsers;
		}
		return _createClass(ScopeManager, [
			{
				key: "loopOver",
				value: function loopOver(tag, functor, inverted, meta) {
					return this.loopOverValue(this.getValue(tag, meta), functor, inverted);
				}
			},
			{
				key: "functorIfInverted",
				value: function functorIfInverted(inverted, functor, value, i, length) {
					if (inverted) functor(value, i, length);
					return inverted;
				}
			},
			{
				key: "isValueFalsy",
				value: function isValueFalsy(value, type) {
					return value == null || !value || type === "[object Array]" && value.length === 0;
				}
			},
			{
				key: "loopOverValue",
				value: function loopOverValue(value, functor, inverted) {
					if (this.root.finishedResolving) inverted = false;
					var type = Object.prototype.toString.call(value);
					if (this.isValueFalsy(value, type)) {
						this.scopeType = false;
						return this.functorIfInverted(inverted, functor, last(this.scopeList), 0, 1);
					}
					if (type === "[object Array]") {
						this.scopeType = "array";
						for (var i = 0; i < value.length; i++) this.functorIfInverted(!inverted, functor, value[i], i, value.length);
						return true;
					}
					if (type === "[object Object]") {
						this.scopeType = "object";
						return this.functorIfInverted(!inverted, functor, value, 0, 1);
					}
					this.scopeType = true;
					return this.functorIfInverted(!inverted, functor, last(this.scopeList), 0, 1);
				}
			},
			{
				key: "getValue",
				value: function getValue(tag, meta) {
					return _getValue.call(this, tag, meta, this.scopeList.length - 1);
				}
			},
			{
				key: "getValueAsync",
				value: function getValueAsync(tag, meta) {
					return _getValueAsync.call(this, tag, meta, this.scopeList.length - 1);
				}
			},
			{
				key: "getContext",
				value: function getContext(meta, num) {
					return {
						num,
						meta,
						scopeList: this.scopeList,
						resolved: this.resolved,
						scopePath: this.scopePath,
						scopeTypes: this.scopeTypes,
						scopePathItem: this.scopePathItem,
						scopePathLength: this.scopePathLength
					};
				}
			},
			{
				key: "createSubScopeManager",
				value: function createSubScopeManager(scope, tag, i, part, length) {
					return new ScopeManager({
						root: this.root,
						resolveOffset: this.resolveOffset,
						resolved: this.resolved,
						parser: this.parser,
						cachedParsers: this.cachedParsers,
						scopeTypes: concatArrays([this.scopeTypes, [this.scopeType]]),
						scopeList: concatArrays([this.scopeList, [scope]]),
						scopePath: concatArrays([this.scopePath, [tag]]),
						scopePathItem: concatArrays([this.scopePathItem, [i]]),
						scopePathLength: concatArrays([this.scopePathLength, [length]]),
						scopeLindex: concatArrays([this.scopeLindex, [part.lIndex]])
					});
				}
			}
		]);
	}();
	module.exports = function(options) {
		options.scopePath = [];
		options.scopePathItem = [];
		options.scopePathLength = [];
		options.scopeTypes = [];
		options.scopeLindex = [];
		options.scopeList = [options.tags];
		return new ScopeManager(options);
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/lexer.js
var require_lexer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _slicedToArray(r, e) {
		return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(r, a) {
		if (r) {
			if ("string" == typeof r) return _arrayLikeToArray(r, a);
			var t = {}.toString.call(r).slice(8, -1);
			return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
		}
	}
	function _arrayLikeToArray(r, a) {
		(null == a || a > r.length) && (a = r.length);
		for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
		return n;
	}
	function _iterableToArrayLimit(r, l) {
		var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (null != t) {
			var e, n, i, u, a = [], f = !0, o = !1;
			try {
				if (i = (t = t.call(r)).next, 0 === l) {
					if (Object(t) !== t) return;
					f = !1;
				} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
			} catch (r) {
				o = !0, n = r;
			} finally {
				try {
					if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
				} finally {
					if (o) throw n;
				}
			}
			return a;
		}
	}
	function _arrayWithHoles(r) {
		if (Array.isArray(r)) return r;
	}
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var _require = require_errors();
	var getUnclosedTagException = _require.getUnclosedTagException;
	var getUnopenedTagException = _require.getUnopenedTagException;
	var getDuplicateOpenTagException = _require.getDuplicateOpenTagException;
	var getDuplicateCloseTagException = _require.getDuplicateCloseTagException;
	var throwMalformedXml = _require.throwMalformedXml;
	var throwXmlInvalid = _require.throwXmlInvalid;
	var XTTemplateError = _require.XTTemplateError;
	var _require2 = require_doc_utils();
	var isTextStart = _require2.isTextStart;
	var isTextEnd = _require2.isTextEnd;
	var wordToUtf8 = _require2.wordToUtf8;
	var pushArray = _require2.pushArray;
	var DELIMITER_NONE = 0;
	var DELIMITER_EQUAL = 1;
	var DELIMITER_START = 2;
	var DELIMITER_END = 3;
	function inRange(range, match) {
		return range[0] <= match.offset && match.offset < range[1];
	}
	function updateInTextTag(part, inTextTag) {
		if (isTextStart(part)) {
			if (inTextTag) throwMalformedXml();
			return true;
		}
		if (isTextEnd(part)) {
			if (!inTextTag) throwMalformedXml();
			return false;
		}
		return inTextTag;
	}
	function getTag(tag) {
		var position = "";
		var start = 1;
		var end = tag.indexOf(" ");
		if (tag[tag.length - 2] === "/") {
			position = "selfclosing";
			if (end === -1) end = tag.length - 2;
		} else if (tag[1] === "/") {
			start = 2;
			position = "end";
			if (end === -1) end = tag.length - 1;
		} else {
			position = "start";
			if (end === -1) end = tag.length - 1;
		}
		return {
			tag: tag.slice(start, end),
			position
		};
	}
	function tagMatcher(content, textMatchArray, othersMatchArray) {
		var cursor = 0;
		var contentLength = content.length;
		var allMatches = {};
		for (var _i2 = 0; _i2 < textMatchArray.length; _i2++) {
			var m = textMatchArray[_i2];
			allMatches[m] = true;
		}
		for (var _i4 = 0; _i4 < othersMatchArray.length; _i4++) {
			var _m = othersMatchArray[_i4];
			allMatches[_m] = false;
		}
		var totalMatches = [];
		while (cursor < contentLength) {
			cursor = content.indexOf("<", cursor);
			if (cursor === -1) break;
			var offset = cursor;
			var nextOpening = content.indexOf("<", cursor + 1);
			cursor = content.indexOf(">", cursor);
			if (cursor === -1 || nextOpening !== -1 && cursor > nextOpening) throwXmlInvalid(content, offset);
			var tagText = content.slice(offset, cursor + 1);
			var _getTag = getTag(tagText), tag = _getTag.tag, position = _getTag.position;
			var text = allMatches[tag];
			if (text == null) continue;
			totalMatches.push({
				type: "tag",
				position,
				text,
				offset,
				value: tagText,
				tag
			});
		}
		return totalMatches;
	}
	function getDelimiterErrors(delimiterMatches, fullText, syntaxOptions) {
		var errors = [];
		var inDelimiter = false;
		var lastDelimiterMatch = { offset: 0 };
		var xtag;
		var delimiterWithErrors = delimiterMatches.reduce(function(delimiterAcc, currDelimiterMatch) {
			var position = currDelimiterMatch.position;
			var delimiterOffset = currDelimiterMatch.offset;
			var lastDelimiterOffset = lastDelimiterMatch.offset;
			var lastDelimiterLength = lastDelimiterMatch.length;
			xtag = fullText.substr(lastDelimiterOffset, delimiterOffset - lastDelimiterOffset);
			if (inDelimiter && position === "start") {
				if (lastDelimiterOffset + lastDelimiterLength === delimiterOffset) {
					xtag = fullText.substr(lastDelimiterOffset, delimiterOffset - lastDelimiterOffset + lastDelimiterLength + 4);
					if (!syntaxOptions.allowUnclosedTag) {
						errors.push(getDuplicateOpenTagException({
							xtag,
							offset: lastDelimiterOffset
						}));
						lastDelimiterMatch = currDelimiterMatch;
						delimiterAcc.push(_objectSpread(_objectSpread({}, currDelimiterMatch), {}, { error: true }));
						return delimiterAcc;
					}
				}
				if (!syntaxOptions.allowUnclosedTag) errors.push(getUnclosedTagException({
					xtag: wordToUtf8(xtag),
					offset: lastDelimiterOffset
				}));
				delimiterAcc.pop();
			}
			if (!inDelimiter && position === "end") {
				if (syntaxOptions.allowUnopenedTag) return delimiterAcc;
				if (lastDelimiterOffset + lastDelimiterLength === delimiterOffset) {
					xtag = fullText.substr(lastDelimiterOffset - 4, delimiterOffset - lastDelimiterOffset + lastDelimiterLength + 4);
					errors.push(getDuplicateCloseTagException({
						xtag,
						offset: lastDelimiterOffset
					}));
					lastDelimiterMatch = currDelimiterMatch;
					delimiterAcc.push(_objectSpread(_objectSpread({}, currDelimiterMatch), {}, { error: true }));
					return delimiterAcc;
				}
				errors.push(getUnopenedTagException({
					xtag,
					offset: delimiterOffset
				}));
				lastDelimiterMatch = currDelimiterMatch;
				delimiterAcc.push(_objectSpread(_objectSpread({}, currDelimiterMatch), {}, { error: true }));
				return delimiterAcc;
			}
			inDelimiter = position === "start";
			lastDelimiterMatch = currDelimiterMatch;
			delimiterAcc.push(currDelimiterMatch);
			return delimiterAcc;
		}, []);
		if (inDelimiter) {
			var lastDelimiterOffset = lastDelimiterMatch.offset;
			xtag = fullText.substr(lastDelimiterOffset, fullText.length - lastDelimiterOffset);
			if (!syntaxOptions.allowUnclosedTag) errors.push(getUnclosedTagException({
				xtag: wordToUtf8(xtag),
				offset: lastDelimiterOffset
			}));
			delimiterWithErrors.pop();
		}
		return {
			delimiterWithErrors,
			errors
		};
	}
	function compareOffsets(startOffset, endOffset) {
		if (startOffset === -1 && endOffset === -1) return DELIMITER_NONE;
		if (startOffset === endOffset) return DELIMITER_EQUAL;
		if (startOffset === -1 || endOffset === -1) return endOffset < startOffset ? DELIMITER_START : DELIMITER_END;
		return startOffset < endOffset ? DELIMITER_START : DELIMITER_END;
	}
	function splitDelimiters(inside) {
		var newDelimiters = inside.split(" ");
		if (newDelimiters.length !== 2) {
			var err = new XTTemplateError("New Delimiters cannot be parsed");
			err.properties = {
				id: "change_delimiters_invalid",
				explanation: "Cannot parser delimiters"
			};
			throw err;
		}
		var _newDelimiters = _slicedToArray(newDelimiters, 2), start = _newDelimiters[0], end = _newDelimiters[1];
		if (start.length === 0 || end.length === 0) {
			var _err = new XTTemplateError("New Delimiters cannot be parsed");
			_err.properties = {
				id: "change_delimiters_invalid",
				explanation: "Cannot parser delimiters"
			};
			throw _err;
		}
		return [start, end];
	}
	function getAllDelimiterIndexes(fullText, delimiters, syntaxOptions) {
		var indexes = [];
		var start = delimiters.start, end = delimiters.end;
		var offset = -1;
		var insideTag = false;
		if (start == null && end == null) return [];
		while (true) {
			var startOffset = fullText.indexOf(start, offset + 1);
			var endOffset = fullText.indexOf(end, offset + 1);
			var position = null;
			var len = void 0;
			var compareResult = compareOffsets(startOffset, endOffset);
			if (compareResult === DELIMITER_EQUAL) compareResult = insideTag ? DELIMITER_END : DELIMITER_START;
			switch (compareResult) {
				case DELIMITER_NONE: return indexes;
				case DELIMITER_END:
					insideTag = false;
					offset = endOffset;
					position = "end";
					len = end.length;
					break;
				case DELIMITER_START:
					insideTag = true;
					offset = startOffset;
					position = "start";
					len = start.length;
			}
			if (syntaxOptions.changeDelimiterPrefix && compareResult === DELIMITER_START && fullText[offset + start.length] === syntaxOptions.changeDelimiterPrefix) {
				indexes.push({
					offset: startOffset,
					position: "start",
					length: start.length,
					changedelimiter: true
				});
				var nextEqual = fullText.indexOf(syntaxOptions.changeDelimiterPrefix, offset + start.length + 1);
				var nextEndOffset = fullText.indexOf(end, nextEqual + 1);
				indexes.push({
					offset: nextEndOffset,
					position: "end",
					length: end.length,
					changedelimiter: true
				});
				var _splitDelimiters2 = _slicedToArray(splitDelimiters(fullText.substr(offset + start.length + 1, nextEqual - offset - start.length - 1)), 2);
				start = _splitDelimiters2[0];
				end = _splitDelimiters2[1];
				offset = nextEndOffset;
				continue;
			}
			indexes.push({
				offset,
				position,
				length: len
			});
		}
	}
	function parseDelimiters(innerContentParts, delimiters, syntaxOptions) {
		var full = "";
		for (var _i6 = 0; _i6 < innerContentParts.length; _i6++) {
			var p = innerContentParts[_i6];
			full += p.value;
		}
		var delimiterMatches = getAllDelimiterIndexes(full, delimiters, syntaxOptions);
		var offset = 0;
		var ranges = [];
		for (var _i8 = 0; _i8 < innerContentParts.length; _i8++) {
			var part = innerContentParts[_i8];
			offset += part.value.length;
			ranges.push({
				offset: offset - part.value.length,
				lIndex: part.lIndex
			});
		}
		var _getDelimiterErrors = getDelimiterErrors(delimiterMatches, full, syntaxOptions), delimiterWithErrors = _getDelimiterErrors.delimiterWithErrors, errors = _getDelimiterErrors.errors;
		var cutNext = 0;
		var delimiterIndex = 0;
		var parsed = [];
		for (var i = 0; i < ranges.length; i++) {
			var _p = ranges[i];
			var innerContentPart = innerContentParts[i];
			var _offset = _p.offset;
			var range = [_offset, _offset + innerContentPart.value.length];
			var partContent = innerContentPart.value;
			var delimitersInOffset = [];
			while (delimiterIndex < delimiterWithErrors.length && inRange(range, delimiterWithErrors[delimiterIndex])) {
				delimitersInOffset.push(delimiterWithErrors[delimiterIndex]);
				delimiterIndex++;
			}
			var parts = [];
			var cursor = 0;
			if (cutNext > 0) {
				cursor = cutNext;
				cutNext = 0;
			}
			for (var _i0 = 0; _i0 < delimitersInOffset.length; _i0++) {
				var delimiterInOffset = delimitersInOffset[_i0];
				var _value = partContent.substr(cursor, delimiterInOffset.offset - _offset - cursor);
				if (delimiterInOffset.changedelimiter) {
					if (delimiterInOffset.position === "start") {
						if (_value.length > 0) parts.push({
							type: "content",
							value: _value
						});
					} else cursor = delimiterInOffset.offset - _offset + delimiterInOffset.length;
					continue;
				}
				if (_value.length > 0) {
					parts.push({
						type: "content",
						value: _value
					});
					cursor += _value.length;
				}
				var delimiterPart = {
					type: "delimiter",
					position: delimiterInOffset.position,
					offset: cursor + _offset
				};
				parts.push(delimiterPart);
				cursor = delimiterInOffset.offset - _offset + delimiterInOffset.length;
			}
			cutNext = cursor - partContent.length;
			var value = partContent.substr(cursor);
			if (value.length > 0) parts.push({
				type: "content",
				value
			});
			parsed.push(parts);
		}
		return {
			parsed,
			errors
		};
	}
	function isInsideContent(part) {
		return part.type === "content" && part.position === "insidetag";
	}
	function getContentParts(xmlparsed) {
		return xmlparsed.filter(isInsideContent);
	}
	function decodeContentParts(xmlparsed, fileType) {
		var inTextTag = false;
		for (var _i10 = 0; _i10 < xmlparsed.length; _i10++) {
			var part = xmlparsed[_i10];
			inTextTag = updateInTextTag(part, inTextTag);
			if (part.type === "content") part.position = inTextTag ? "insidetag" : "outsidetag";
			if (fileType !== "text" && isInsideContent(part)) part.value = part.value.replace(/>/g, "&gt;");
		}
	}
	module.exports = {
		parseDelimiters,
		parse: function parse(xmllexed, delimiters, syntax, fileType) {
			decodeContentParts(xmllexed, fileType);
			var _parseDelimiters = parseDelimiters(getContentParts(xmllexed), delimiters, syntax), delimiterParsed = _parseDelimiters.parsed, errors = _parseDelimiters.errors;
			var lexed = [];
			var index = 0;
			var lIndex = 0;
			for (var _i12 = 0; _i12 < xmllexed.length; _i12++) {
				var part = xmllexed[_i12];
				if (isInsideContent(part)) {
					for (var _i14 = 0, _delimiterParsed$inde2 = delimiterParsed[index]; _i14 < _delimiterParsed$inde2.length; _i14++) {
						var p = _delimiterParsed$inde2[_i14];
						if (p.type === "content") p.position = "insidetag";
						p.lIndex = lIndex++;
					}
					pushArray(lexed, delimiterParsed[index]);
					index++;
				} else {
					part.lIndex = lIndex++;
					lexed.push(part);
				}
			}
			return {
				errors,
				lexed
			};
		},
		xmlparse: function xmlparse(content, xmltags) {
			var matches = tagMatcher(content, xmltags.text, xmltags.other);
			var cursor = 0;
			var parsed = [];
			for (var _i16 = 0; _i16 < matches.length; _i16++) {
				var match = matches[_i16];
				if (content.length > cursor && match.offset - cursor > 0) parsed.push({
					type: "content",
					value: content.substr(cursor, match.offset - cursor)
				});
				cursor = match.offset + match.value.length;
				delete match.offset;
				parsed.push(match);
			}
			if (content.length > cursor) parsed.push({
				type: "content",
				value: content.substr(cursor)
			});
			return parsed;
		}
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/get-tags.js
var require_get_tags = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _toConsumableArray(r) {
		return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
	}
	function _nonIterableSpread() {
		throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(r, a) {
		if (r) {
			if ("string" == typeof r) return _arrayLikeToArray(r, a);
			var t = {}.toString.call(r).slice(8, -1);
			return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
		}
	}
	function _iterableToArray(r) {
		if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
	}
	function _arrayWithoutHoles(r) {
		if (Array.isArray(r)) return _arrayLikeToArray(r);
	}
	function _arrayLikeToArray(r, a) {
		(null == a || a > r.length) && (a = r.length);
		for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
		return n;
	}
	function isPlaceholder(part) {
		return part.type === "placeholder";
	}
	function getTags(postParsed) {
		var tags = {};
		var stack = [{
			items: postParsed.filter(isPlaceholder),
			parents: [],
			path: []
		}];
		function processFiltered(part, current, filtered) {
			if (filtered.length) stack.push({
				items: filtered,
				parents: [].concat(_toConsumableArray(current.parents), [part]),
				path: part.dataBound !== false && !part.attrParsed && part.value && !part.attrParsed ? [].concat(_toConsumableArray(current.path), [part.value]) : _toConsumableArray(current.path)
			});
		}
		function getLocalTags(tags, path) {
			var sizeScope = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : path.length;
			var localTags = tags;
			for (var i = 0; i < sizeScope; i++) localTags = localTags[path[i]];
			return localTags;
		}
		function getScopeSize(part, parents) {
			var size = parents.length;
			for (var _i2 = 0; _i2 < parents.length; _i2++) {
				var parent = parents[_i2];
				if ((typeof parent.lIndex === "number" ? parent.lIndex : parseInt(parent.lIndex.split("-")[0], 10)) > part.lIndex) size--;
			}
			return size;
		}
		while (stack.length > 0) {
			var current = stack.pop();
			var localTags = getLocalTags(tags, current.path);
			for (var _i4 = 0, _current$items2 = current.items; _i4 < _current$items2.length; _i4++) {
				var _localTags4, _part$value2;
				var part = _current$items2[_i4];
				if (part.attrParsed) {
					for (var key in part.attrParsed) processFiltered(part, current, part.attrParsed[key].filter(isPlaceholder));
					continue;
				}
				if (part.subparsed) {
					if (part.dataBound !== false) {
						var _localTags, _part$value;
						(_localTags = localTags)[_part$value = part.value] || (_localTags[_part$value] = {});
					}
					processFiltered(part, current, part.subparsed.filter(isPlaceholder));
					continue;
				}
				if (part.cellParsed) {
					for (var _i6 = 0, _part$cellPostParsed2 = part.cellPostParsed; _i6 < _part$cellPostParsed2.length; _i6++) {
						var cp = _part$cellPostParsed2[_i6];
						if (cp.type === "placeholder") {
							if (cp.module === "pro-xml-templating/xls-module-loop") continue;
							else if (cp.subparsed) {
								var _localTags2, _cp$value;
								(_localTags2 = localTags)[_cp$value = cp.value] || (_localTags2[_cp$value] = {});
								processFiltered(cp, current, cp.subparsed.filter(isPlaceholder));
							} else {
								var _localTags3, _cp$value2;
								var sizeScope = getScopeSize(part, current.parents);
								localTags = getLocalTags(tags, current.path, sizeScope);
								(_localTags3 = localTags)[_cp$value2 = cp.value] || (_localTags3[_cp$value2] = {});
							}
						}
					}
					continue;
				}
				if (part.dataBound === false) continue;
				(_localTags4 = localTags)[_part$value2 = part.value] || (_localTags4[_part$value2] = {});
			}
		}
		return tags;
	}
	module.exports = {
		getTags,
		isPlaceholder
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/error-logger.js
var require_error_logger = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var pushArray = require_doc_utils().pushArray;
	function replaceErrors(key, value) {
		if (value instanceof Error) return pushArray(Object.getOwnPropertyNames(value), ["stack"]).reduce(function(error, key) {
			error[key] = value[key];
			if (key === "stack") error[key] = value[key].toString();
			return error;
		}, {});
		return value;
	}
	function logger(error, logging) {
		console.log(JSON.stringify({ error }, replaceErrors, logging === "json" ? 2 : null));
		if (error.properties && error.properties.errors instanceof Array) {
			var errorMessages = error.properties.errors.map(function(error) {
				return error.properties.explanation;
			}).join("\n");
			console.log("errorMessages", errorMessages);
		}
	}
	module.exports = logger;
}));
//#endregion
//#region node_modules/docxtemplater/js/xml-matcher.js
var require_xml_matcher = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var pregMatchAll = require_doc_utils().pregMatchAll;
	module.exports = function xmlMatcher(content, tagsXmlArray) {
		var res = { content };
		var taj = tagsXmlArray.join("|");
		res.matches = pregMatchAll(new RegExp("(?:(<(?:".concat(taj, ")[^>]*>)([^<>]*)</(?:").concat(taj, ")>)|(<(?:").concat(taj, ")[^>]*/>)"), "g"), res.content);
		return res;
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/prefix-matcher.js
var require_prefix_matcher = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	var nbspRegex = new RegExp(String.fromCharCode(160), "g");
	function replaceNbsps(str) {
		return str.replace(nbspRegex, " ");
	}
	function match(condition, placeHolderContent) {
		var type = _typeof(condition);
		if (type === "string") return replaceNbsps(placeHolderContent.substr(0, condition.length)) === condition;
		if (condition instanceof RegExp) return condition.test(replaceNbsps(placeHolderContent));
		if (type === "function") return !!condition(placeHolderContent);
	}
	function getValue(condition, placeHolderContent) {
		var type = _typeof(condition);
		if (type === "string") return replaceNbsps(placeHolderContent).substr(condition.length);
		if (condition instanceof RegExp) return replaceNbsps(placeHolderContent).match(condition)[1];
		if (type === "function") return condition(placeHolderContent);
	}
	function getValues(condition, placeHolderContent) {
		var type = _typeof(condition);
		if (type === "string") return [placeHolderContent, replaceNbsps(placeHolderContent).substr(condition.length)];
		if (condition instanceof RegExp) return replaceNbsps(placeHolderContent).match(condition);
		if (type === "function") return [placeHolderContent, condition(placeHolderContent)];
	}
	module.exports = {
		match,
		getValue,
		getValues
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/parser.js
var require_parser = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	function _slicedToArray(r, e) {
		return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(r, a) {
		if (r) {
			if ("string" == typeof r) return _arrayLikeToArray(r, a);
			var t = {}.toString.call(r).slice(8, -1);
			return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
		}
	}
	function _arrayLikeToArray(r, a) {
		(null == a || a > r.length) && (a = r.length);
		for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
		return n;
	}
	function _iterableToArrayLimit(r, l) {
		var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (null != t) {
			var e, n, i, u, a = [], f = !0, o = !1;
			try {
				if (i = (t = t.call(r)).next, 0 === l) {
					if (Object(t) !== t) return;
					f = !1;
				} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
			} catch (r) {
				o = !0, n = r;
			} finally {
				try {
					if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
				} finally {
					if (o) throw n;
				}
			}
			return a;
		}
	}
	function _arrayWithHoles(r) {
		if (Array.isArray(r)) return r;
	}
	var _require = require_doc_utils();
	var wordToUtf8 = _require.wordToUtf8;
	var pushArray = _require.pushArray;
	var isParagraphStart = _require.isParagraphStart;
	var isBreakTag = _require.isBreakTag;
	var _require2 = require_prefix_matcher();
	var match = _require2.match;
	var getValue = _require2.getValue;
	var getValues = _require2.getValues;
	function getMatchers(modules, options) {
		var allMatchers = [];
		for (var _i2 = 0; _i2 < modules.length; _i2++) {
			var _module = modules[_i2];
			if (_module.matchers) {
				var matchers = _module.matchers(options);
				if (!(matchers instanceof Array)) throw new Error("module matcher returns a non array");
				pushArray(allMatchers, matchers);
			}
		}
		return allMatchers;
	}
	function getMatches(matchers, placeHolderContent, options) {
		var matches = [];
		for (var _i4 = 0; _i4 < matchers.length; _i4++) {
			var matcher = matchers[_i4];
			var _matcher = _slicedToArray(matcher, 2), prefix = _matcher[0], _module2 = _matcher[1];
			var properties = matcher[2] || {};
			if (options.match(prefix, placeHolderContent)) {
				var values = options.getValues(prefix, placeHolderContent);
				if (typeof properties === "function") properties = properties(values);
				if (!properties.value) {
					var _values = _slicedToArray(values, 2);
					properties.value = _values[1];
				}
				matches.push(_objectSpread({
					type: "placeholder",
					prefix,
					module: _module2,
					onMatch: properties.onMatch,
					priority: properties.priority
				}, properties));
			}
		}
		return matches;
	}
	function moduleParse(placeHolderContent, options) {
		var modules = options.modules, startOffset = options.startOffset;
		var endLindex = options.lIndex;
		var moduleParsed;
		options.offset = startOffset;
		options.match = match;
		options.getValue = getValue;
		options.getValues = getValues;
		var matches = getMatches(getMatchers(modules, options), placeHolderContent, options);
		if (matches.length > 0) {
			var bestMatch = null;
			for (var _i6 = 0; _i6 < matches.length; _i6++) {
				var _match = matches[_i6];
				_match.priority || (_match.priority = -_match.value.length);
				if (!bestMatch || _match.priority > bestMatch.priority) bestMatch = _match;
			}
			bestMatch.offset = startOffset;
			delete bestMatch.priority;
			bestMatch.endLindex = endLindex;
			bestMatch.lIndex = endLindex;
			bestMatch.raw = placeHolderContent;
			if (bestMatch.onMatch) bestMatch.onMatch(bestMatch);
			delete bestMatch.onMatch;
			delete bestMatch.prefix;
			return bestMatch;
		}
		for (var _i8 = 0; _i8 < modules.length; _i8++) {
			moduleParsed = modules[_i8].parse(placeHolderContent, options);
			if (moduleParsed) {
				moduleParsed.offset = startOffset;
				moduleParsed.endLindex = endLindex;
				moduleParsed.lIndex = endLindex;
				moduleParsed.raw = placeHolderContent;
				return moduleParsed;
			}
		}
		return {
			type: "placeholder",
			value: placeHolderContent,
			offset: startOffset,
			endLindex,
			lIndex: endLindex
		};
	}
	module.exports = {
		preparse: function preparse(parsed, modules, options) {
			function preparse(parsed, options) {
				for (var _i0 = 0; _i0 < modules.length; _i0++) parsed = modules[_i0].preparse(parsed, options) || parsed;
				return parsed;
			}
			return preparse(parsed, options);
		},
		parse: function parse(lexed, modules, options) {
			var inPlaceHolder = false;
			var placeHolderContent = "";
			var startOffset;
			var tailParts = [];
			var droppedTags = options.fileTypeConfig.droppedTagsInsidePlaceholder || [];
			return lexed.reduce(function(parsed, token) {
				if (token.type === "delimiter") {
					inPlaceHolder = token.position === "start";
					if (token.position === "end") {
						options.parse = function(placeHolderContent) {
							return moduleParse(placeHolderContent, _objectSpread(_objectSpread(_objectSpread({}, options), token), {}, {
								startOffset,
								modules
							}));
						};
						parsed.push(options.parse(wordToUtf8(placeHolderContent)));
						pushArray(parsed, tailParts);
						tailParts = [];
					}
					if (token.position === "start") {
						tailParts = [];
						startOffset = token.offset;
					}
					placeHolderContent = "";
					return parsed;
				}
				if (!inPlaceHolder) {
					parsed.push(token);
					return parsed;
				}
				if (token.type !== "content" || token.position !== "insidetag") {
					if (options.syntax.preserveNewlinesInTags && (isBreakTag(token) || isParagraphStart(token))) placeHolderContent += "\n";
					if (droppedTags.indexOf(token.tag) !== -1) return parsed;
					tailParts.push(token);
					return parsed;
				}
				placeHolderContent += token.value;
				return parsed;
			}, []);
		},
		postparse: function postparse(postparsed, modules, options) {
			function getTraits(traitName, postparsed, options) {
				var result = [];
				for (var _i10 = 0; _i10 < modules.length; _i10++) {
					var _module5 = modules[_i10];
					result.push(_module5.getTraits(traitName, postparsed, options));
				}
				return result;
			}
			var errors = [];
			function _postparse(postparsed, options) {
				var newPostparsed = postparsed;
				for (var _i12 = 0; _i12 < modules.length; _i12++) {
					var postparseResult = modules[_i12].postparse(newPostparsed, _objectSpread(_objectSpread({}, options), {}, {
						postparse: function postparse(parsed, opts) {
							return _postparse(parsed, _objectSpread(_objectSpread({}, options), opts));
						},
						getTraits
					}));
					if (postparseResult == null) continue;
					if (postparseResult.errors) {
						pushArray(errors, postparseResult.errors);
						newPostparsed = postparseResult.postparsed;
						continue;
					}
					newPostparsed = postparseResult;
				}
				return newPostparsed;
			}
			return {
				postparsed: _postparse(postparsed, options),
				errors
			};
		}
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/get-resolved-id.js
var require_get_resolved_id = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function getResolvedId(part, options) {
		if (part.lIndex == null) return null;
		var path = options.scopeManager.scopePathItem;
		if (part.parentPart) path = path.slice(0, path.length - 1);
		return options.filePath + "@" + part.lIndex.toString() + "-" + path.join("-");
	}
	module.exports = getResolvedId;
}));
//#endregion
//#region node_modules/docxtemplater/js/render.js
var require_render$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var _require = require_errors();
	var throwUnimplementedTagType = _require.throwUnimplementedTagType;
	var XTScopeParserError = _require.XTScopeParserError;
	var pushArray = require_doc_utils().pushArray;
	var getResolvedId = require_get_resolved_id();
	function moduleRender(part, options) {
		for (var _i2 = 0, _options$modules2 = options.modules; _i2 < _options$modules2.length; _i2++) {
			var moduleRendered = _options$modules2[_i2].render(part, options);
			if (moduleRendered) return moduleRendered;
		}
		return false;
	}
	function render(options) {
		var baseNullGetter = options.baseNullGetter;
		var compiled = options.compiled, scopeManager = options.scopeManager;
		options.nullGetter = function(part, sm) {
			return baseNullGetter(part, sm || scopeManager);
		};
		var errors = [];
		var parts = [];
		for (var i = 0, len = compiled.length; i < len; i++) {
			var part = compiled[i];
			options.index = i;
			options.resolvedId = getResolvedId(part, options);
			var moduleRendered = void 0;
			try {
				moduleRendered = moduleRender(part, options);
			} catch (e) {
				if (e instanceof XTScopeParserError) {
					errors.push(e);
					parts.push(part);
					continue;
				}
				throw e;
			}
			if (moduleRendered) {
				if (moduleRendered.errors) pushArray(errors, moduleRendered.errors);
				parts.push(moduleRendered);
				continue;
			}
			if (part.type === "content" || part.type === "tag") {
				parts.push(part);
				continue;
			}
			throwUnimplementedTagType(part, i);
		}
		var totalParts = [];
		for (var _i4 = 0; _i4 < parts.length; _i4++) {
			var value = parts[_i4].value;
			if (value instanceof Array) pushArray(totalParts, value);
			else if (value) totalParts.push(value);
		}
		return {
			errors,
			parts: totalParts
		};
	}
	module.exports = render;
}));
//#endregion
//#region node_modules/docxtemplater/js/postrender.js
var require_postrender = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function utf8Length(parts) {
		var length = 0;
		var pendingHighSurrogate = -1;
		for (var _i2 = 0; _i2 < parts.length; _i2++) {
			var part = parts[_i2];
			if (part instanceof Uint8Array) {
				if (pendingHighSurrogate !== -1) {
					length += 3;
					pendingHighSurrogate = -1;
				}
				length += part.length;
				continue;
			}
			for (var i = 0; i < part.length; i++) {
				var codePoint = part.charCodeAt(i);
				if (pendingHighSurrogate !== -1) {
					if ((codePoint & 64512) === 56320) {
						length += 4;
						pendingHighSurrogate = -1;
						continue;
					}
					length += 3;
					pendingHighSurrogate = -1;
				}
				if ((codePoint & 64512) === 55296) {
					if (i + 1 < part.length) {
						if ((part.charCodeAt(i + 1) & 64512) === 56320) {
							length += 4;
							i++;
							continue;
						}
					} else {
						pendingHighSurrogate = codePoint;
						continue;
					}
				}
				length += codePoint < 128 ? 1 : codePoint < 2048 ? 2 : 3;
			}
		}
		return length + (pendingHighSurrogate === -1 ? 0 : 3);
	}
	function writeUtf8(parts, output) {
		var offset = 0;
		var pendingHighSurrogate = -1;
		function writeCodePoint(codePoint) {
			if (codePoint < 128) output[offset++] = codePoint;
			else if (codePoint < 2048) {
				output[offset++] = 192 | codePoint >>> 6;
				output[offset++] = 128 | codePoint & 63;
			} else if (codePoint < 65536) {
				output[offset++] = 224 | codePoint >>> 12;
				output[offset++] = 128 | codePoint >>> 6 & 63;
				output[offset++] = 128 | codePoint & 63;
			} else {
				output[offset++] = 240 | codePoint >>> 18;
				output[offset++] = 128 | codePoint >>> 12 & 63;
				output[offset++] = 128 | codePoint >>> 6 & 63;
				output[offset++] = 128 | codePoint & 63;
			}
		}
		for (var _i4 = 0; _i4 < parts.length; _i4++) {
			var part = parts[_i4];
			if (part instanceof Uint8Array) {
				if (pendingHighSurrogate !== -1) {
					writeCodePoint(pendingHighSurrogate);
					pendingHighSurrogate = -1;
				}
				output.set(part, offset);
				offset += part.length;
				continue;
			}
			for (var i = 0; i < part.length; i++) {
				var codePoint = part.charCodeAt(i);
				if (pendingHighSurrogate !== -1) {
					if ((codePoint & 64512) === 56320) {
						writeCodePoint(65536 + (pendingHighSurrogate - 55296 << 10) + (codePoint - 56320));
						pendingHighSurrogate = -1;
						continue;
					}
					writeCodePoint(pendingHighSurrogate);
					pendingHighSurrogate = -1;
				}
				if ((codePoint & 64512) === 55296) {
					if (i + 1 < part.length) {
						var next = part.charCodeAt(i + 1);
						if ((next & 64512) === 56320) {
							codePoint = 65536 + (codePoint - 55296 << 10) + (next - 56320);
							i++;
						} else {
							writeCodePoint(codePoint);
							continue;
						}
					} else {
						pendingHighSurrogate = codePoint;
						continue;
					}
				}
				writeCodePoint(codePoint);
			}
		}
		if (pendingHighSurrogate !== -1) writeCodePoint(pendingHighSurrogate);
	}
	function postrender(parts, options) {
		for (var i = 0, len = parts.length; i < len; i++) if (typeof parts[i] === "number") parts[i] = parts[i].toString();
		for (var _i6 = 0, _options$modules2 = options.modules; _i6 < _options$modules2.length; _i6++) parts = _options$modules2[_i6].postrender(parts, options);
		var newParts = options.joinUncorrupt(parts, options);
		var output = new Uint8Array(utf8Length(newParts));
		writeUtf8(newParts, output);
		for (var _i7 = 0; _i7 < newParts.length; _i7++) delete newParts[_i7];
		return output;
	}
	module.exports = postrender;
}));
//#endregion
//#region node_modules/docxtemplater/js/resolve.js
var require_resolve = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var pushArray = require_doc_utils().pushArray;
	var getResolvedId = require_get_resolved_id();
	function moduleResolve(part, options) {
		for (var _i2 = 0, _options$modules2 = options.modules; _i2 < _options$modules2.length; _i2++) {
			var moduleResolved = _options$modules2[_i2].resolve(part, options);
			if (moduleResolved) return moduleResolved;
		}
		return false;
	}
	function resolvePart(part, resolved, errors, options) {
		var moduleResolved = moduleResolve(part, _objectSpread(_objectSpread({}, options), {}, { resolvedId: getResolvedId(part, options) }));
		if (moduleResolved) return moduleResolved.then(function(value) {
			resolved.push({
				tag: part.value,
				lIndex: part.lIndex,
				value
			});
		})["catch"](function(e) {
			if (e instanceof Array) pushArray(errors, e);
			else errors.push(e);
		});
		if (part.type === "placeholder") return options.scopeManager.getValueAsync(part.value, { part }).then(function(value) {
			return value == null ? options.nullGetter(part) : value;
		}).then(function(value) {
			resolved.push({
				tag: part.value,
				lIndex: part.lIndex,
				value
			});
		})["catch"](function(e) {
			if (e instanceof Array) pushArray(errors, e);
			else errors.push(e);
		});
	}
	function resolve(options) {
		var resolved = [];
		var errors = [];
		var baseNullGetter = options.baseNullGetter;
		var scopeManager = options.scopeManager;
		options.nullGetter = function(part, sm) {
			return baseNullGetter(part, sm || scopeManager);
		};
		options.resolved = resolved;
		var p = resolveSerial(options, errors, resolved);
		if (p) return p.then(function() {
			return resolveParallel(options, errors, resolved);
		});
		return resolveParallel(options, errors, resolved);
	}
	function resolveSerial(options, errors, resolved) {
		var p = null;
		var _loop = function _loop() {
			var part = _options$compiled2[_i4];
			if (["content", "tag"].indexOf(part.type) !== -1) return 1;
			if (part.resolveFirst) {
				p !== null && p !== void 0 || (p = Promise.resolve(null));
				p = p.then(function() {
					return resolvePart(part, resolved, errors, options);
				});
			}
		};
		for (var _i4 = 0, _options$compiled2 = options.compiled; _i4 < _options$compiled2.length; _i4++) if (_loop()) continue;
		return p;
	}
	function resolveParallel(options, errors, resolved) {
		var promises = [];
		for (var _i6 = 0, _options$compiled4 = options.compiled; _i6 < _options$compiled4.length; _i6++) {
			var part = _options$compiled4[_i6];
			if (["content", "tag"].indexOf(part.type) !== -1) continue;
			if (!part.resolveFirst) promises.push(resolvePart(part, resolved, errors, options));
		}
		return Promise.all(promises).then(function() {
			return {
				errors,
				resolved
			};
		});
	}
	module.exports = resolve;
}));
//#endregion
//#region node_modules/docxtemplater/js/join-uncorrupt.js
var require_join_uncorrupt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var _require = require_doc_utils();
	var startsWith = _require.startsWith;
	var endsWith = _require.endsWith;
	var isStarting = _require.isStarting;
	var isEnding = _require.isEnding;
	var isWhiteSpace = _require.isWhiteSpace;
	var filetypes = require_filetypes();
	function addEmptyParagraphAfterTable(parts) {
		var lastNonEmpty = "";
		for (var i = 0, len = parts.length; i < len; i++) {
			var p = parts[i];
			if (p instanceof Uint8Array) continue;
			if (isWhiteSpace(p) || startsWith(p, "<w:bookmarkEnd")) continue;
			if (endsWith(lastNonEmpty, "</w:tbl>")) {
				if (!startsWith(p, "<w:p") && !startsWith(p, "<w:tbl") && !startsWith(p, "<w:sectPr") && !startsWith(p, "</w:ftr>") && !startsWith(p, "</w:hdr>")) p = "<w:p/>".concat(p);
			}
			lastNonEmpty = p;
			parts[i] = p;
		}
		return parts;
	}
	function joinUncorrupt(parts, options) {
		var contains = options.fileTypeConfig.tagShouldContain || [];
		var currentlyCollecting = -1;
		if (filetypes.docx.indexOf(options.contentType) !== -1) parts = addEmptyParagraphAfterTable(parts);
		var startIndex = -1;
		for (var j = 0, len2 = contains.length; j < len2; j++) {
			var _contains$j = contains[j], tag = _contains$j.tag, shouldContain = _contains$j.shouldContain, value = _contains$j.value, drop = _contains$j.drop, dropParent = _contains$j.dropParent;
			var collectedParts = null;
			for (var i = 0, len = parts.length; i < len; i++) {
				var part = parts[i];
				if (part instanceof Uint8Array) continue;
				if (currentlyCollecting === j) {
					if (isEnding(part, tag)) {
						currentlyCollecting = -1;
						if (dropParent) {
							var start = -1;
							for (var k = startIndex; k > 0; k--) if (isStarting(parts[k], dropParent)) {
								start = k;
								break;
							}
							for (var _k = start; _k <= parts.length; _k++) {
								if (isEnding(parts[_k], dropParent)) {
									parts[_k] = "";
									break;
								}
								parts[_k] = "";
							}
						} else {
							for (var _k2 = startIndex; _k2 <= i; _k2++) parts[_k2] = "";
							if (!drop) parts[i] = collectedParts.join("") + value + part;
						}
						collectedParts = null;
					} else {
						if (collectedParts) collectedParts.push(part);
						for (var _k3 = 0, len3 = shouldContain.length; _k3 < len3; _k3++) if (isStarting(part, shouldContain[_k3])) {
							currentlyCollecting = -1;
							collectedParts = null;
							break;
						}
					}
				}
				if (currentlyCollecting === -1 && isStarting(part, tag) && part.indexOf("<", 1) === -1) {
					if (part[part.length - 2] === "/") parts[i] = "";
					else {
						startIndex = i;
						currentlyCollecting = j;
						collectedParts = drop || dropParent ? null : [part];
					}
				}
			}
		}
		return parts;
	}
	module.exports = joinUncorrupt;
}));
//#endregion
//#region node_modules/docxtemplater/js/xml-templater.js
var require_xml_templater = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var _require = require_doc_utils();
	var pushArray = _require.pushArray;
	var wordToUtf8 = _require.wordToUtf8;
	var convertSpaces = _require.convertSpaces;
	var xmlMatcher = require_xml_matcher();
	var Lexer = require_lexer();
	var Parser = require_parser();
	var _render = require_render$1();
	var postrender = require_postrender();
	var resolve = require_resolve();
	var joinUncorrupt = require_join_uncorrupt();
	var nativeBind = Function.prototype.bind;
	var nativeCall = Function.prototype.call;
	var bind = nativeCall.bind(nativeCall, nativeBind);
	function _getFullText(content, tagsXmlArray) {
		var matcher = xmlMatcher(content, tagsXmlArray);
		var result = [];
		for (var _i2 = 0, _matcher$matches2 = matcher.matches; _i2 < _matcher$matches2.length; _i2++) {
			var match = _matcher$matches2[_i2];
			result.push(match.array[2]);
		}
		return wordToUtf8(convertSpaces(result.join("")));
	}
	module.exports = /*#__PURE__*/ function() {
		function XmlTemplater(content, options) {
			_classCallCheck(this, XmlTemplater);
			this.cachedParsers = {};
			this.content = content;
			for (var key in options) this[key] = options[key];
			this.setModules({ inspect: { filePath: options.filePath } });
		}
		return _createClass(XmlTemplater, [
			{
				key: "resolveTags",
				value: function resolveTags(tags) {
					var _this = this;
					this.tags = tags;
					var options = this.getOptions();
					var filePath = this.filePath;
					options.scopeManager = this.scopeManager;
					options.resolve = resolve;
					var errors = [];
					var promises = [];
					for (var _i4 = 0, _this$modules2 = this.modules; _i4 < _this$modules2.length; _i4++) {
						var _module = _this$modules2[_i4];
						promises.push(Promise.resolve(_module.preResolve(options))["catch"](function(e) {
							errors.push(e);
						}));
					}
					return Promise.all(promises).then(function() {
						if (errors.length !== 0) throw errors;
						return resolve(options).then(function(_ref) {
							var resolved = _ref.resolved, errors = _ref.errors;
							for (var i = 0; i < errors.length; i++) {
								var _error;
								var error = errors[i];
								if (!(error instanceof Error)) error = new Error(error);
								(_error = error).properties || (_error.properties = {});
								error.properties.file = filePath;
								errors[i] = error;
							}
							if (errors.length !== 0) throw errors;
							return Promise.all(resolved).then(function(resolved) {
								options.scopeManager.root.finishedResolving = true;
								options.scopeManager.resolved = resolved;
								_this.setModules({ inspect: {
									resolved,
									filePath
								} });
								return resolved;
							});
						})["catch"](function(error) {
							_this.errorChecker(error);
							throw error;
						});
					});
				}
			},
			{
				key: "getFullText",
				value: function getFullText() {
					return _getFullText(this.content, this.fileTypeConfig.tagsXmlTextArray);
				}
			},
			{
				key: "setModules",
				value: function setModules(obj) {
					for (var _i6 = 0, _this$modules4 = this.modules; _i6 < _this$modules4.length; _i6++) _this$modules4[_i6].set(obj);
				}
			},
			{
				key: "preparse",
				value: function preparse() {
					this.allErrors = [];
					this.xmllexed = Lexer.xmlparse(this.content, {
						text: this.fileTypeConfig.tagsXmlTextArray,
						other: this.fileTypeConfig.tagsXmlLexedArray
					});
					this.setModules({ inspect: {
						filePath: this.filePath,
						xmllexed: this.xmllexed
					} });
					var _Lexer$parse = Lexer.parse(this.xmllexed, this.delimiters, this.syntax, this.fileType), lexed = _Lexer$parse.lexed, lexerErrors = _Lexer$parse.errors;
					pushArray(this.allErrors, lexerErrors);
					this.lexed = lexed;
					this.setModules({ inspect: {
						filePath: this.filePath,
						lexed: this.lexed
					} });
					var options = this.getOptions();
					this.lexed = Parser.preparse(this.lexed, this.modules, options);
				}
			},
			{
				key: "parse",
				value: function parse() {
					var noPostParse = (arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}).noPostParse;
					this.setModules({ inspect: { filePath: this.filePath } });
					var options = this.getOptions();
					this.parsed = Parser.parse(this.lexed, this.modules, options);
					this.setModules({ inspect: {
						filePath: this.filePath,
						parsed: this.parsed
					} });
					if (noPostParse) return this;
					return this.postparse();
				}
			},
			{
				key: "postparse",
				value: function postparse() {
					var options = this.getOptions();
					var _Parser$postparse = Parser.postparse(this.parsed, this.modules, options), postparsed = _Parser$postparse.postparsed, postparsedErrors = _Parser$postparse.errors;
					this.postparsed = postparsed;
					this.setModules({ inspect: {
						filePath: this.filePath,
						postparsed: this.postparsed
					} });
					pushArray(this.allErrors, postparsedErrors);
					this.errorChecker(this.allErrors);
					return this;
				}
			},
			{
				key: "errorChecker",
				value: function errorChecker(errors) {
					for (var _i8 = 0, _errors2 = errors; _i8 < _errors2.length; _i8++) {
						var error = _errors2[_i8];
						error.properties || (error.properties = {});
						error.properties.file = this.filePath;
					}
					for (var _i0 = 0, _this$modules6 = this.modules; _i0 < _this$modules6.length; _i0++) errors = _this$modules6[_i0].errorsTransformer(errors);
				}
			},
			{
				key: "baseNullGetter",
				value: function baseNullGetter(part, sm) {
					var value = null;
					for (var _i10 = 0, _this$modules8 = this.modules; _i10 < _this$modules8.length; _i10++) {
						var _module4 = _this$modules8[_i10];
						if (value != null) continue;
						value = _module4.nullGetter(part, sm, this);
					}
					if (value != null) return value;
					return this.nullGetter(part, sm);
				}
			},
			{
				key: "getOptions",
				value: function getOptions() {
					return {
						compiled: this.postparsed,
						cachedParsers: this.cachedParsers,
						tags: this.tags,
						modules: this.modules,
						parser: this.parser,
						contentType: this.contentType,
						relsType: this.relsType,
						baseNullGetter: bind(this.baseNullGetter, this),
						filePath: this.filePath,
						syntax: this.syntax,
						fileTypeConfig: this.fileTypeConfig,
						fileType: this.fileType,
						linebreaks: this.linebreaks,
						stripInvalidXMLChars: this.stripInvalidXMLChars
					};
				}
			},
			{
				key: "render",
				value: function render(to) {
					this.filePath = to;
					var options = this.getOptions();
					options.resolved = this.scopeManager.resolved;
					options.scopeManager = this.scopeManager;
					options.render = _render;
					options.joinUncorrupt = joinUncorrupt;
					var _render2 = _render(options), errors = _render2.errors, parts = _render2.parts;
					if (errors.length > 0) {
						this.allErrors = errors;
						this.errorChecker(errors);
						return this;
					}
					this.content = postrender(parts, options);
					this.setModules({ inspect: {
						filePath: this.filePath,
						content: this.content
					} });
					return this;
				}
			}
		]);
	}();
}));
//#endregion
//#region node_modules/docxtemplater/js/modules/loop.js
var require_loop = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _slicedToArray(r, e) {
		return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(r, a) {
		if (r) {
			if ("string" == typeof r) return _arrayLikeToArray(r, a);
			var t = {}.toString.call(r).slice(8, -1);
			return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
		}
	}
	function _arrayLikeToArray(r, a) {
		(null == a || a > r.length) && (a = r.length);
		for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
		return n;
	}
	function _iterableToArrayLimit(r, l) {
		var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (null != t) {
			var e, n, i, u, a = [], f = !0, o = !1;
			try {
				if (i = (t = t.call(r)).next, 0 === l) {
					if (Object(t) !== t) return;
					f = !1;
				} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
			} catch (r) {
				o = !0, n = r;
			} finally {
				try {
					if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
				} finally {
					if (o) throw n;
				}
			}
			return a;
		}
	}
	function _arrayWithHoles(r) {
		if (Array.isArray(r)) return r;
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var _require = require_doc_utils();
	var chunkBy = _require.chunkBy;
	var last = _require.last;
	var isParagraphStart = _require.isParagraphStart;
	var isModule = _require.isModule;
	var pushArray = _require.pushArray;
	var isParagraphEnd = _require.isParagraphEnd;
	var isContent = _require.isContent;
	var startsWith = _require.startsWith;
	var isTagEnd = _require.isTagEnd;
	var isTagStart = _require.isTagStart;
	var getSingleAttribute = _require.getSingleAttribute;
	var setSingleAttribute = _require.setSingleAttribute;
	var filetypes = require_filetypes();
	var wrapper = require_module_wrapper();
	var isWhiteSpace = require_doc_utils().isWhiteSpace;
	var moduleName = "loop";
	function hasContent(parts) {
		for (var _i2 = 0; _i2 < parts.length; _i2++) {
			var part = parts[_i2];
			if (isContent(part)) return true;
		}
		return false;
	}
	function getFirstMeaningFulPart(parsed) {
		for (var _i4 = 0; _i4 < parsed.length; _i4++) {
			var part = parsed[_i4];
			if (part.type !== "content") return part;
		}
		return null;
	}
	function isInsideParagraphLoop(part) {
		var firstMeaningfulPart = getFirstMeaningFulPart(part.subparsed);
		return firstMeaningfulPart != null && firstMeaningfulPart.tag !== "w:t";
	}
	function getPageBreakIfApplies(part) {
		return part.hasPageBreak && isInsideParagraphLoop(part) ? "<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>" : "";
	}
	function isEnclosedByParagraphs(parsed) {
		return parsed.length && isParagraphStart(parsed[0]) && isParagraphEnd(last(parsed));
	}
	function getOffset(chunk) {
		return hasContent(chunk) ? 0 : chunk.length;
	}
	function addPageBreakAtEnd(subRendered) {
		var j = subRendered.parts.length - 1;
		if (subRendered.parts[j] === "</w:p>") subRendered.parts.splice(j, 0, "<w:r><w:br w:type=\"page\"/></w:r>");
		else subRendered.parts.push("<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>");
	}
	function addPageBreakAtBeginning(subRendered) {
		subRendered.parts.unshift("<w:p><w:r><w:br w:type=\"page\"/></w:r></w:p>");
	}
	function isContinuous(parts) {
		for (var _i6 = 0; _i6 < parts.length; _i6++) {
			var part = parts[_i6];
			if (isTagStart("w:type", part) && part.value.indexOf("continuous") !== -1) return true;
		}
		return false;
	}
	function isNextPage(parts) {
		for (var _i8 = 0; _i8 < parts.length; _i8++) {
			var part = parts[_i8];
			if (isTagStart("w:type", part) && part.value.indexOf("w:val=\"nextPage\"") !== -1) return true;
		}
		return false;
	}
	function addSectionBefore(parts, sect) {
		var result = "";
		for (var _i0 = 0; _i0 < sect.length; _i0++) {
			var value = sect[_i0].value;
			result += value;
		}
		parts.unshift("<w:p><w:pPr>".concat(result, "</w:pPr></w:p>"));
	}
	function addContinuousType(parts) {
		var stop = false;
		var inSectPr = false;
		for (var i = 0; i < parts.length; i++) {
			var part = parts[i];
			if (!stop && startsWith(part, "<w:sectPr")) inSectPr = true;
			if (inSectPr) {
				if (startsWith(part, "<w:type")) stop = true;
				if (!stop && startsWith(part, "</w:sectPr")) {
					parts.splice(i, 0, "<w:type w:val=\"continuous\"/>");
					i++;
				}
			}
		}
		return parts;
	}
	function dropHeaderFooterRefs(parts) {
		var writeIndex = 0;
		for (var readIndex = 0; readIndex < parts.length; readIndex++) if (!startsWith(parts[readIndex], "<w:headerReference") && !startsWith(parts[readIndex], "<w:footerReference")) {
			parts[writeIndex] = parts[readIndex];
			writeIndex++;
		}
		parts.length = writeIndex;
		return parts;
	}
	function hasPageBreak(chunk) {
		for (var _i10 = 0; _i10 < chunk.length; _i10++) {
			var part = chunk[_i10];
			if (part.tag === "w:br" && part.value.indexOf("w:type=\"page\"") !== -1) return true;
		}
		return false;
	}
	function hasImage(chunk) {
		for (var _i12 = 0; _i12 < chunk.length; _i12++) if (chunk[_i12].tag === "w:drawing") return true;
		return false;
	}
	function getSectPr(chunks) {
		var sectPrs = [];
		var currentSectPr = null;
		for (var _i14 = 0; _i14 < chunks.length; _i14++) {
			var part = chunks[_i14];
			if (isTagStart("w:sectPr", part)) {
				currentSectPr = [];
				sectPrs.push(currentSectPr);
			}
			if (currentSectPr !== null) currentSectPr.push(part);
			if (isTagEnd("w:sectPr", part)) currentSectPr = null;
		}
		return sectPrs;
	}
	function getSectPrHeaderFooterChangeCount(chunks) {
		var collectSectPr = false;
		var sectPrCount = 0;
		for (var _i16 = 0; _i16 < chunks.length; _i16++) {
			var part = chunks[_i16];
			if (isTagStart("w:sectPr", part)) collectSectPr = true;
			if (collectSectPr) {
				if (part.tag === "w:headerReference" || part.tag === "w:footerReference") {
					sectPrCount++;
					collectSectPr = false;
				}
			}
			if (isTagEnd("w:sectPr", part)) collectSectPr = false;
		}
		return sectPrCount;
	}
	function getLastSectPr(parsed) {
		var sectPr = [];
		var inSectPr = false;
		for (var i = parsed.length - 1; i >= 0; i--) {
			var part = parsed[i];
			if (isTagEnd("w:sectPr", part)) inSectPr = true;
			if (isTagStart("w:sectPr", part)) {
				sectPr.unshift(part.value);
				inSectPr = false;
			}
			if (inSectPr) sectPr.unshift(part.value);
			if (isParagraphStart(part)) {
				if (sectPr.length > 0) return sectPr.join("");
				break;
			}
		}
		return "";
	}
	var LoopModule = /*#__PURE__*/ function() {
		function LoopModule() {
			_classCallCheck(this, LoopModule);
			this.name = "LoopModule";
			this.inXfrm = false;
			this.totalSectPr = 0;
			this.prefix = {
				start: "#",
				end: "/",
				dash: /^-([^\s]+)\s(.+)/,
				inverted: "^"
			};
		}
		return _createClass(LoopModule, [
			{
				key: "optionsTransformer",
				value: function optionsTransformer(opts, docxtemplater) {
					this.docxtemplater = docxtemplater;
					return opts;
				}
			},
			{
				key: "preparse",
				value: function preparse(parsed, _ref) {
					var contentType = _ref.contentType;
					if (filetypes.main.indexOf(contentType) !== -1) this.sects = getSectPr(parsed);
				}
			},
			{
				key: "matchers",
				value: function matchers() {
					var module$5 = moduleName;
					return [
						[
							this.prefix.start,
							module$5,
							{
								expandTo: "auto",
								location: "start",
								inverted: false
							}
						],
						[
							this.prefix.inverted,
							module$5,
							{
								expandTo: "auto",
								location: "start",
								inverted: true
							}
						],
						[
							this.prefix.end,
							module$5,
							{ location: "end" }
						],
						[
							this.prefix.dash,
							module$5,
							function(_ref2) {
								var _ref3 = _slicedToArray(_ref2, 3);
								return {
									location: "start",
									inverted: false,
									expandTo: _ref3[1],
									value: _ref3[2]
								};
							}
						]
					];
				}
			},
			{
				key: "getTraits",
				value: function getTraits(traitName, parsed) {
					if (traitName !== "expandPair") return;
					var tags = [];
					for (var offset = 0, len = parsed.length; offset < len; offset++) {
						var part = parsed[offset];
						if (isModule(part, moduleName) && part.subparsed == null) tags.push({
							part,
							offset
						});
					}
					return tags;
				}
			},
			{
				key: "postparse",
				value: function postparse(parsed, _ref4) {
					var basePart = _ref4.basePart;
					if (basePart && this.docxtemplater.fileType === "docx" && parsed.length > 0) {
						basePart.sectPrCount = getSectPrHeaderFooterChangeCount(parsed);
						this.totalSectPr += basePart.sectPrCount;
						var sects = this.sects;
						for (var index = 0, len = sects.length; index < len; index++) {
							var sect = sects[index];
							if (basePart.lIndex < sect[0].lIndex) {
								if (index + 1 < sects.length && isContinuous(sects[index + 1])) basePart.addContinuousType = true;
								break;
							}
							if (parsed[0].lIndex < sect[0].lIndex && sect[0].lIndex < basePart.lIndex) {
								if (isNextPage(sects[index])) basePart.addNextPage = { index };
								break;
							}
						}
						basePart.lastParagrapSectPr = getLastSectPr(parsed);
					}
					if (!basePart || basePart.expandTo !== "auto" || basePart.module !== moduleName || !isEnclosedByParagraphs(parsed)) return parsed;
					basePart.paragraphLoop = true;
					var level = 0;
					var chunks = chunkBy(parsed, function(p) {
						if (isParagraphStart(p)) {
							level++;
							if (level === 1) return "start";
						}
						if (isParagraphEnd(p)) {
							level--;
							if (level === 0) return "end";
						}
						return null;
					});
					var firstChunk = chunks[0];
					var lastChunk = last(chunks);
					var firstOffset = getOffset(firstChunk);
					var lastOffset = getOffset(lastChunk);
					if (firstOffset > 0 && chunks[1][0].type === "content" && isWhiteSpace(chunks[1][0].value)) firstOffset += 1;
					if (lastOffset > 0 && last(chunks[chunks.length - 2]).type === "content" && isWhiteSpace(last(chunks[chunks.length - 2]).value)) lastOffset += 1;
					basePart.hasPageBreakBeginning = hasPageBreak(firstChunk);
					basePart.hasPageBreak = hasPageBreak(lastChunk);
					if (hasImage(firstChunk)) firstOffset = 0;
					if (hasImage(lastChunk)) lastOffset = 0;
					return parsed.slice(firstOffset, parsed.length - lastOffset);
				}
			},
			{
				key: "resolve",
				value: function resolve(part, options) {
					var self = this;
					if (!isModule(part, moduleName)) return null;
					var sm = options.scopeManager;
					var promisedValue = sm.getValueAsync(part.value, { part });
					var promises = [];
					var lastPromise;
					if (self.resolveSerially) lastPromise = Promise.resolve(null);
					function loopOver(scope, i, length) {
						var scopeManager = sm.createSubScopeManager(scope, part.value, i, part, length);
						if (self.resolveSerially) {
							lastPromise = lastPromise.then(function() {
								return options.resolve(_objectSpread(_objectSpread({}, options), {}, {
									compiled: part.subparsed,
									tags: {},
									scopeManager
								}));
							});
							promises.push(lastPromise);
						} else promises.push(options.resolve(_objectSpread(_objectSpread({}, options), {}, {
							compiled: part.subparsed,
							tags: {},
							scopeManager
						})));
					}
					var errorList = [];
					return promisedValue.then(function(values) {
						values !== null && values !== void 0 || (values = options.nullGetter(part));
						if (values instanceof Promise) return values.then(function(values) {
							if (values instanceof Array) return Promise.all(values);
							return values;
						});
						if (values instanceof Array) return Promise.all(values);
						return values;
					}).then(function(values) {
						sm.loopOverValue(values, loopOver, part.inverted);
						return Promise.all(promises).then(function(r) {
							var result = [];
							for (var _i18 = 0; _i18 < r.length; _i18++) {
								var _r$_i = r[_i18], resolved = _r$_i.resolved, errors = _r$_i.errors;
								pushArray(errorList, errors);
								result.push(resolved);
							}
							return result;
						}).then(function(value) {
							if (errorList.length > 0) throw errorList;
							return value;
						});
					});
				}
			},
			{
				key: "render",
				value: function render(part, options) {
					var self = this;
					if (part.tag === "p:xfrm") self.inXfrm = part.position === "start";
					if (part.tag === "a:ext" && self.inXfrm) {
						self.lastExt = part;
						return part;
					}
					if (!isModule(part, moduleName)) return null;
					var totalValue = [];
					var errors = [];
					var heightOffset = 0;
					var firstTag = part.subparsed[0];
					var tagHeight = 0;
					if ((firstTag === null || firstTag === void 0 ? void 0 : firstTag.tag) === "a:tr") tagHeight = +getSingleAttribute(firstTag.value, "h");
					heightOffset -= tagHeight;
					var a16RowIdOffset = 0;
					var insideParagraphLoop = isInsideParagraphLoop(part);
					function loopOver(scope, i, length) {
						heightOffset += tagHeight;
						var scopeManager = options.scopeManager.createSubScopeManager(scope, part.value, i, part, length);
						for (var _i20 = 0, _part$subparsed2 = part.subparsed; _i20 < _part$subparsed2.length; _i20++) {
							var pp = _part$subparsed2[_i20];
							if (isTagStart("a16:rowId", pp)) {
								var val = +getSingleAttribute(pp.value, "val") + a16RowIdOffset;
								a16RowIdOffset = 1;
								pp.value = setSingleAttribute(pp.value, "val", val);
							}
						}
						var subRendered = options.render(_objectSpread(_objectSpread({}, options), {}, {
							compiled: part.subparsed,
							tags: {},
							scopeManager
						}));
						if (part.hasPageBreak && i === length - 1 && insideParagraphLoop) addPageBreakAtEnd(subRendered);
						if (scopeManager.scopePathItem.some(function(i) {
							return i !== 0;
						})) {
							if (part.sectPrCount === 1) subRendered.parts = dropHeaderFooterRefs(subRendered.parts);
							if (part.addContinuousType) subRendered.parts = addContinuousType(subRendered.parts);
						} else if (part.addNextPage) addSectionBefore(subRendered.parts, self.sects[part.addNextPage.index]);
						if (part.addNextPage) addPageBreakAtEnd(subRendered);
						if (part.hasPageBreakBeginning && insideParagraphLoop) addPageBreakAtBeginning(subRendered);
						for (var _i22 = 0, _subRendered$parts2 = subRendered.parts; _i22 < _subRendered$parts2.length; _i22++) {
							var _val = _subRendered$parts2[_i22];
							totalValue.push(_val);
						}
						pushArray(errors, subRendered.errors);
					}
					var value = options.scopeManager.getValue(part.value, { part });
					value !== null && value !== void 0 || (value = options.nullGetter(part));
					if (options.scopeManager.loopOverValue(value, loopOver, part.inverted) === false) {
						if (part.lastParagrapSectPr) {
							if (part.paragraphLoop) return { value: "<w:p><w:pPr>".concat(part.lastParagrapSectPr, "</w:pPr></w:p>") };
							return { value: "</w:t></w:r></w:p><w:p><w:pPr>".concat(part.lastParagrapSectPr, "</w:pPr><w:r><w:t>") };
						}
						return {
							value: getPageBreakIfApplies(part) || "",
							errors
						};
					}
					if (heightOffset !== 0) {
						var cy = +getSingleAttribute(self.lastExt.value, "cy");
						self.lastExt.value = setSingleAttribute(self.lastExt.value, "cy", cy + heightOffset);
					}
					return {
						value: options.joinUncorrupt(totalValue, _objectSpread(_objectSpread({}, options), {}, { basePart: part })),
						errors
					};
				}
			}
		]);
	}();
	module.exports = function() {
		return wrapper(new LoopModule());
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/modules/space-preserve.js
var require_space_preserve = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var wrapper = require_module_wrapper();
	var _require = require_doc_utils();
	var isTextStart = _require.isTextStart;
	var isTextEnd = _require.isTextEnd;
	var endsWith = _require.endsWith;
	var startsWith = _require.startsWith;
	var pushArray = _require.pushArray;
	var wTpreserve = "<w:t xml:space=\"preserve\">";
	var wTpreservelen = wTpreserve.length;
	var wtEnd = "</w:t>";
	var wtEndlen = wtEnd.length;
	function isWtStart(part) {
		return isTextStart(part) && part.tag === "w:t";
	}
	function addXMLPreserve(chunk, index) {
		var tag = chunk[index].value;
		if (chunk[index + 1].value === "</w:t>") return tag;
		if (tag.indexOf("xml:space=\"preserve\"") !== -1) return tag;
		return tag.substr(0, tag.length - 1) + " xml:space=\"preserve\">";
	}
	function isInsideLoop(meta, chunk) {
		return meta && meta.basePart && chunk.length > 1;
	}
	var SpacePreserve = /*#__PURE__*/ function() {
		function SpacePreserve() {
			_classCallCheck(this, SpacePreserve);
			this.name = "SpacePreserveModule";
		}
		return _createClass(SpacePreserve, [{
			key: "postparse",
			value: function postparse(postparsed, meta) {
				var chunk = [], inTextTag = false, endLindex = 0, lastTextTag = 0;
				function isStartingPlaceHolder(part, chunk) {
					return part.type === "placeholder" && chunk.length > 1;
				}
				var result = postparsed.reduce(function(postparsed, part) {
					if (isWtStart(part)) {
						inTextTag = true;
						lastTextTag = chunk.length;
					}
					if (!inTextTag) {
						postparsed.push(part);
						return postparsed;
					}
					chunk.push(part);
					if (isInsideLoop(meta, chunk)) {
						endLindex = meta.basePart.endLindex;
						chunk[0].value = addXMLPreserve(chunk, 0);
					}
					if (isStartingPlaceHolder(part, chunk)) {
						chunk[lastTextTag].value = addXMLPreserve(chunk, lastTextTag);
						endLindex = part.endLindex;
					}
					if (isTextEnd(part) && part.lIndex > endLindex) {
						if (endLindex !== 0) chunk[lastTextTag].value = addXMLPreserve(chunk, lastTextTag);
						pushArray(postparsed, chunk);
						chunk = [];
						inTextTag = false;
						endLindex = 0;
						lastTextTag = 0;
					}
					return postparsed;
				}, []);
				pushArray(result, chunk);
				return result;
			}
		}, {
			key: "postrender",
			value: function postrender(parts) {
				var lastNonEmptyIndex = 0, endsWithWtPreserve = false;
				for (var i = 0, len = parts.length; i < len; i++) {
					if (parts[i] === "" || parts[i] instanceof Uint8Array) continue;
					var p = parts[i];
					if (endsWithWtPreserve && startsWith(p, wtEnd)) {
						parts[lastNonEmptyIndex] = parts[lastNonEmptyIndex].substr(0, parts[lastNonEmptyIndex].length - wTpreservelen) + "<w:t/>";
						p = p.substr(wtEndlen);
						parts[i] = p;
					}
					endsWithWtPreserve = endsWith(p, wTpreserve);
					lastNonEmptyIndex = i;
				}
				return parts;
			}
		}]);
	}();
	module.exports = function() {
		return wrapper(new SpacePreserve());
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/modules/rawxml.js
var require_rawxml = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var traits = require_traits();
	var _require = require_doc_utils();
	var isContent = _require.isContent;
	var getPartWithDelimiters = _require.getPartWithDelimiters;
	var _require2 = require_errors();
	var throwRawTagShouldBeOnlyTextInParagraph = _require2.throwRawTagShouldBeOnlyTextInParagraph;
	var getInvalidRawXMLValueException = _require2.getInvalidRawXMLValueException;
	var wrapper = require_module_wrapper();
	var moduleName = "rawxml";
	function getInner(_ref) {
		var part = _ref.part, left = _ref.left, right = _ref.right, postparsed = _ref.postparsed, index = _ref.index;
		var paragraphParts = postparsed.slice(left + 1, right);
		for (var i = 0, len = paragraphParts.length; i < len; i++) {
			if (i === index - left - 1) continue;
			var p = paragraphParts[i];
			if (isContent(p)) throwRawTagShouldBeOnlyTextInParagraph({
				paragraphParts,
				part
			});
		}
		return part;
	}
	var RawXmlModule = /*#__PURE__*/ function() {
		function RawXmlModule() {
			_classCallCheck(this, RawXmlModule);
			this.name = "RawXmlModule";
			this.prefix = "@";
		}
		return _createClass(RawXmlModule, [
			{
				key: "optionsTransformer",
				value: function optionsTransformer(options, docxtemplater) {
					this.fileTypeConfig = docxtemplater.fileTypeConfig;
					return options;
				}
			},
			{
				key: "matchers",
				value: function matchers() {
					return [[this.prefix, moduleName]];
				}
			},
			{
				key: "postparse",
				value: function postparse(postparsed) {
					var _this = this;
					return traits.expandToOne(postparsed, {
						moduleName,
						getInner,
						expandTo: this.fileTypeConfig.tagRawXml,
						error: {
							message: "Raw tag not in paragraph",
							id: "raw_tag_outerxml_invalid",
							explanation: function explanation(part) {
								return "The tag \"".concat(getPartWithDelimiters(part, _this.docxtemplater), "\" is not inside a paragraph, putting raw tags inside an inline loop is disallowed.");
							}
						}
					});
				}
			},
			{
				key: "render",
				value: function render(part, options) {
					if (part.module !== moduleName) return null;
					var value;
					var errors = [];
					try {
						value = options.scopeManager.getValue(part.value, { part });
						value !== null && value !== void 0 || (value = options.nullGetter(part));
					} catch (e) {
						errors.push(e);
						return { errors };
					}
					value = value ? value : "";
					if (typeof value === "string") return { value };
					return { errors: [getInvalidRawXMLValueException({
						tag: part.value,
						value,
						partDelims: getPartWithDelimiters(part, this.docxtemplater),
						part,
						offset: part.offset
					})] };
				}
			}
		]);
	}();
	module.exports = function() {
		return wrapper(new RawXmlModule());
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/merge-sort.js
var require_merge_sort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function getMinFromArrays(arrays, state) {
		var minIndex = -1;
		for (var i = 0, l = arrays.length; i < l; i++) {
			if (state[i] >= arrays[i].length) continue;
			if (minIndex === -1 || arrays[i][state[i]].offset < arrays[minIndex][state[minIndex]].offset) minIndex = i;
		}
		return minIndex;
	}
	module.exports = function(arrays) {
		var totalLength = 0;
		for (var _i2 = 0, _arrays2 = arrays; _i2 < _arrays2.length; _i2++) {
			var array = _arrays2[_i2];
			totalLength += array.length;
		}
		arrays = arrays.filter(function(array) {
			return array.length > 0;
		});
		var resultArray = new Array(totalLength);
		var state = arrays.map(function() {
			return 0;
		});
		for (var i = 0; i < totalLength; i++) {
			var arrayIndex = getMinFromArrays(arrays, state);
			resultArray[i] = arrays[arrayIndex][state[arrayIndex]];
			state[arrayIndex]++;
		}
		return resultArray;
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/modules/expand-pair-trait.js
var require_expand_pair_trait = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var traitName = "expandPair";
	var mergeSort = require_merge_sort();
	var _require = require_doc_utils();
	var getLeft = _require.getLeft;
	var getRight = _require.getRight;
	var pushArray = _require.pushArray;
	var wrapper = require_module_wrapper();
	var getExpandToDefault = require_traits().getExpandToDefault;
	var _require3 = require_errors();
	var getUnmatchedLoopException = _require3.getUnmatchedLoopException;
	var getClosingTagNotMatchOpeningTag = _require3.getClosingTagNotMatchOpeningTag;
	var getUnbalancedLoopException = _require3.getUnbalancedLoopException;
	function getOpenCountChange(part) {
		switch (part.location) {
			case "start": return 1;
			case "end": return -1;
		}
	}
	function match(start, end) {
		return start != null && end != null && (start.part.location === "start" && end.part.location === "end" && start.part.value === end.part.value || end.part.value === "");
	}
	function transformer(traits) {
		var i = 0;
		var errors = [];
		while (i < traits.length) {
			var part = traits[i].part;
			if (part.location === "end") {
				if (i === 0) {
					traits.splice(0, 1);
					errors.push(getUnmatchedLoopException(part));
					return {
						traits,
						errors
					};
				}
				var endIndex = i;
				var startIndex = i - 1;
				var offseter = 1;
				if (match(traits[startIndex], traits[endIndex])) {
					traits.splice(endIndex, 1);
					traits.splice(startIndex, 1);
					return {
						errors,
						traits
					};
				}
				while (offseter < 50) {
					var startCandidate = traits[startIndex - offseter];
					var endCandidate = traits[endIndex + offseter];
					if (match(startCandidate, traits[endIndex])) {
						traits.splice(endIndex, 1);
						traits.splice(startIndex - offseter, 1);
						return {
							errors,
							traits
						};
					}
					if (match(traits[startIndex], endCandidate)) {
						traits.splice(endIndex + offseter, 1);
						traits.splice(startIndex, 1);
						return {
							errors,
							traits
						};
					}
					offseter++;
				}
				errors.push(getClosingTagNotMatchOpeningTag({ tags: [traits[startIndex].part, traits[endIndex].part] }));
				traits.splice(endIndex, 1);
				traits.splice(startIndex, 1);
				return {
					traits,
					errors
				};
			}
			i++;
		}
		for (var _i2 = 0; _i2 < traits.length; _i2++) {
			var _part = traits[_i2].part;
			errors.push(getUnmatchedLoopException(_part));
		}
		return {
			traits: [],
			errors
		};
	}
	function getPairs(traits) {
		var levelTraits = {};
		var errors = [];
		var pairs = [];
		var transformedTraits = [];
		pushArray(transformedTraits, traits);
		while (transformedTraits.length > 0) {
			var result = transformer(transformedTraits);
			pushArray(errors, result.errors);
			transformedTraits = result.traits;
		}
		if (errors.length > 0) return {
			pairs,
			errors
		};
		var countOpen = 0;
		for (var _i4 = 0; _i4 < traits.length; _i4++) {
			var currentTrait = traits[_i4];
			var part = currentTrait.part;
			var change = getOpenCountChange(part);
			countOpen += change;
			if (change === 1) levelTraits[countOpen] = currentTrait;
			else {
				var startTrait = levelTraits[countOpen + 1];
				if (countOpen === 0) pairs.push([startTrait, currentTrait]);
			}
			countOpen = countOpen >= 0 ? countOpen : 0;
		}
		return {
			pairs,
			errors
		};
	}
	var ExpandPairTrait = /*#__PURE__*/ function() {
		function ExpandPairTrait() {
			_classCallCheck(this, ExpandPairTrait);
			this.name = "ExpandPairTrait";
		}
		return _createClass(ExpandPairTrait, [{
			key: "optionsTransformer",
			value: function optionsTransformer(options, docxtemplater) {
				if (docxtemplater.options.paragraphLoop) pushArray(docxtemplater.fileTypeConfig.expandTags, docxtemplater.fileTypeConfig.onParagraphLoop);
				this.expandTags = docxtemplater.fileTypeConfig.expandTags;
				return options;
			}
		}, {
			key: "postparse",
			value: function postparse(postparsed, options) {
				var _this = this;
				var getTraits = options.getTraits, postparse = options.postparse, fileType = options.fileType;
				var traits = getTraits(traitName, postparsed, options);
				traits = traits.map(function(trait) {
					return trait || [];
				});
				traits = mergeSort(traits);
				var _getPairs = getPairs(traits), pairs = _getPairs.pairs, errors = _getPairs.errors;
				var lastRight = 0;
				var lastPair = null;
				var expandedPairs = pairs.map(function(pair) {
					var expandTo = pair[0].part.expandTo;
					if (expandTo === "auto" && fileType !== "text") {
						var result = getExpandToDefault(postparsed, pair, _this.expandTags);
						if (result.error) errors.push(result.error);
						expandTo = result.value;
					}
					if (!expandTo || fileType === "text") {
						var _left = pair[0].offset;
						var _right = pair[1].offset;
						if (_left < lastRight && !_this.docxtemplater.options.syntax.allowUnbalancedLoops) errors.push(getUnbalancedLoopException(pair, lastPair));
						lastPair = pair;
						lastRight = _right;
						return [_left, _right];
					}
					var left, right;
					try {
						left = getLeft(postparsed, expandTo, pair[0].offset);
					} catch (e) {
						errors.push(e);
					}
					try {
						right = getRight(postparsed, expandTo, pair[1].offset);
					} catch (e) {
						errors.push(e);
					}
					if (left < lastRight && !_this.docxtemplater.options.syntax.allowUnbalancedLoops) errors.push(getUnbalancedLoopException(pair, lastPair));
					lastRight = right;
					lastPair = pair;
					return [left, right];
				});
				if (errors.length > 0) return {
					postparsed,
					errors
				};
				var currentPairIndex = 0;
				var innerParts;
				return {
					postparsed: postparsed.reduce(function(newParsed, part, i) {
						var inPair = currentPairIndex < pairs.length && expandedPairs[currentPairIndex][0] <= i && i <= expandedPairs[currentPairIndex][1];
						var pair = pairs[currentPairIndex];
						var expandedPair = expandedPairs[currentPairIndex];
						if (!inPair) {
							newParsed.push(part);
							return newParsed;
						}
						if (expandedPair[0] === i) innerParts = [];
						if (pair[0].offset !== i && pair[1].offset !== i) innerParts.push(part);
						if (expandedPair[1] === i) {
							var basePart = postparsed[pair[0].offset];
							basePart.subparsed = postparse(innerParts, { basePart });
							basePart.endLindex = pair[1].part.lIndex;
							delete basePart.location;
							delete basePart.expandTo;
							newParsed.push(basePart);
							currentPairIndex++;
							var _expandedPair = expandedPairs[currentPairIndex];
							while (_expandedPair && _expandedPair[0] < i) {
								currentPairIndex++;
								_expandedPair = expandedPairs[currentPairIndex];
							}
						}
						return newParsed;
					}, []),
					errors
				};
			}
		}]);
	}();
	module.exports = function() {
		return wrapper(new ExpandPairTrait());
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/modules/render.js
var require_render = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var wrapper = require_module_wrapper();
	var _require = require_errors();
	var getScopeCompilationError = _require.getScopeCompilationError;
	var getCorruptCharactersException = _require.getCorruptCharactersException;
	var _require2 = require_doc_utils();
	var utf8ToWord = _require2.utf8ToWord;
	var hasCorruptCharacters = _require2.hasCorruptCharacters;
	var removeCorruptCharacters = _require2.removeCorruptCharacters;
	var _require3 = require_content_types();
	var NON_LINE_BREAKS_CONTENT_TYPE = [
		_require3.settingsContentType,
		_require3.coreContentType,
		_require3.appContentType,
		_require3.customContentType
	];
	var ftprefix = {
		docx: "w",
		pptx: "a"
	};
	var Render = /*#__PURE__*/ function() {
		function Render() {
			_classCallCheck(this, Render);
			this.name = "Render";
			this.recordRun = false;
			this.recordedRun = [];
		}
		return _createClass(Render, [
			{
				key: "set",
				value: function set(obj) {
					if (obj.compiled) this.compiled = obj.compiled;
					if (obj.data != null) this.data = obj.data;
				}
			},
			{
				key: "optionsTransformer",
				value: function optionsTransformer(options, docxtemplater) {
					this.docxtemplater = docxtemplater;
					this.brTag = docxtemplater.fileType === "docx" ? "<w:r><w:br/></w:r>" : "<a:br/>";
					this.prefix = ftprefix[docxtemplater.fileType];
					this.runStartTag = "".concat(this.prefix, ":r");
					this.runPropsStartTag = "".concat(this.prefix, ":rPr");
					return options;
				}
			},
			{
				key: "postparse",
				value: function postparse(postparsed, options) {
					var errors = [];
					for (var _i2 = 0; _i2 < postparsed.length; _i2++) {
						var p = postparsed[_i2];
						if (p.type === "placeholder") {
							var tag = p.value;
							try {
								options.cachedParsers[p.lIndex] = this.docxtemplater.parser(tag, { tag: p });
							} catch (rootError) {
								errors.push(getScopeCompilationError({
									tag,
									rootError,
									offset: p.offset
								}));
							}
						}
					}
					return {
						postparsed,
						errors
					};
				}
			},
			{
				key: "getRenderedMap",
				value: function getRenderedMap(mapper) {
					for (var from in this.compiled) mapper[from] = {
						from,
						data: this.data
					};
					return mapper;
				}
			},
			{
				key: "render",
				value: function render(part, _ref) {
					var contentType = _ref.contentType, scopeManager = _ref.scopeManager, linebreaks = _ref.linebreaks, nullGetter = _ref.nullGetter, fileType = _ref.fileType, stripInvalidXMLChars = _ref.stripInvalidXMLChars;
					if (NON_LINE_BREAKS_CONTENT_TYPE.indexOf(contentType) !== -1) linebreaks = false;
					if (linebreaks) this.recordRuns(part);
					if (part.type !== "placeholder" || part.module) return;
					var value;
					try {
						value = scopeManager.getValue(part.value, { part });
					} catch (e) {
						return { errors: [e] };
					}
					value !== null && value !== void 0 || (value = nullGetter(part));
					if (typeof value === "string") {
						if (stripInvalidXMLChars) value = removeCorruptCharacters(value);
						else if ([
							"docx",
							"pptx",
							"xlsx"
						].indexOf(fileType) !== -1 && hasCorruptCharacters(value)) return { errors: [getCorruptCharactersException({
							tag: part.value,
							value,
							offset: part.offset
						})] };
					}
					if (fileType === "text") return { value };
					return { value: linebreaks && typeof value === "string" ? this.renderLineBreaks(value) : utf8ToWord(value) };
				}
			},
			{
				key: "recordRuns",
				value: function recordRuns(part) {
					if (part.tag === this.runStartTag) this.recordedRun = "";
					else if (part.tag === this.runPropsStartTag) {
						if (part.position === "start") {
							this.recordRun = true;
							this.recordedRun += part.value;
						}
						if (part.position === "end" || part.position === "selfclosing") {
							this.recordedRun += part.value;
							this.recordRun = false;
						}
					} else if (this.recordRun) this.recordedRun += part.value;
				}
			},
			{
				key: "renderLineBreaks",
				value: function renderLineBreaks(value) {
					var result = [];
					var lines = value.split("\n");
					for (var i = 0, len = lines.length; i < len; i++) {
						result.push(utf8ToWord(lines[i]));
						if (i < lines.length - 1) result.push("</".concat(this.prefix, ":t></").concat(this.prefix, ":r>").concat(this.brTag, "<").concat(this.prefix, ":r>").concat(this.recordedRun, "<").concat(this.prefix, ":t").concat(this.docxtemplater.fileType === "docx" ? " xml:space=\"preserve\"" : "", ">"));
					}
					return result;
				}
			}
		]);
	}();
	module.exports = function() {
		return wrapper(new Render());
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/file-type-config.js
var require_file_type_config = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var loopModule = require_loop();
	var spacePreserveModule = require_space_preserve();
	var rawXmlModule = require_rawxml();
	var expandPairTrait = require_expand_pair_trait();
	var render = require_render();
	function DocXFileTypeConfig() {
		return {
			getTemplatedFiles: function getTemplatedFiles() {
				return [];
			},
			templatedNs: ["http://schemas.microsoft.com/office/2006/coverPageProps"],
			textPath: function textPath(doc) {
				return doc.textTarget;
			},
			tagsXmlTextArray: [
				"Company",
				"HyperlinkBase",
				"Manager",
				"cp:category",
				"cp:keywords",
				"dc:creator",
				"dc:description",
				"dc:subject",
				"dc:title",
				"cp:contentStatus",
				"PublishDate",
				"Abstract",
				"CompanyAddress",
				"CompanyPhone",
				"CompanyFax",
				"CompanyEmail",
				"w:t",
				"a:t",
				"m:t",
				"vt:lpstr",
				"vt:lpwstr"
			],
			tagsXmlLexedArray: [
				"w:proofState",
				"w:tc",
				"w:tr",
				"w:tbl",
				"w:ftr",
				"w:hdr",
				"w:body",
				"w:document",
				"w:p",
				"w:r",
				"w:br",
				"w:rPr",
				"w:pPr",
				"w:spacing",
				"w:sdtContent",
				"w:sdt",
				"w:drawing",
				"w:sectPr",
				"w:type",
				"w:headerReference",
				"w:footerReference",
				"w:bookmarkStart",
				"w:bookmarkEnd",
				"w:commentRangeStart",
				"w:commentRangeEnd",
				"w:commentReference"
			],
			droppedTagsInsidePlaceholder: [
				"w:p",
				"w:br",
				"w:bookmarkStart",
				"w:bookmarkEnd"
			],
			expandTags: [{
				contains: "w:tc",
				expand: "w:tr"
			}],
			onParagraphLoop: [{
				contains: "w:p",
				expand: "w:p",
				onlyTextInTag: true
			}],
			tagRawXml: "w:p",
			baseModules: [
				loopModule,
				spacePreserveModule,
				expandPairTrait,
				rawXmlModule,
				render
			],
			tagShouldContain: [
				{
					tag: "w:sdtContent",
					shouldContain: [
						"w:p",
						"w:r",
						"w:commentRangeStart",
						"w:sdt"
					],
					value: "<w:p></w:p>"
				},
				{
					tag: "w:tc",
					shouldContain: ["w:p"],
					value: "<w:p></w:p>"
				},
				{
					tag: "w:tr",
					shouldContain: ["w:tc"],
					drop: true
				},
				{
					tag: "w:tbl",
					shouldContain: ["w:tr"],
					drop: true
				}
			]
		};
	}
	function PptXFileTypeConfig() {
		return {
			getTemplatedFiles: function getTemplatedFiles() {
				return [];
			},
			textPath: function textPath(doc) {
				return doc.textTarget;
			},
			tagsXmlTextArray: [
				"Company",
				"HyperlinkBase",
				"Manager",
				"cp:category",
				"cp:keywords",
				"dc:creator",
				"dc:description",
				"dc:subject",
				"dc:title",
				"a:t",
				"m:t",
				"vt:lpstr",
				"vt:lpwstr"
			],
			tagsXmlLexedArray: [
				"p:sp",
				"a:tc",
				"a:tr",
				"a:tbl",
				"a:graphicData",
				"a:p",
				"a:r",
				"a:rPr",
				"p:txBody",
				"a:txBody",
				"a:off",
				"a:ext",
				"p:graphicFrame",
				"p:xfrm",
				"a16:rowId",
				"a:endParaRPr"
			],
			droppedTagsInsidePlaceholder: ["a:p", "a:endParaRPr"],
			expandTags: [{
				contains: "a:tc",
				expand: "a:tr"
			}],
			onParagraphLoop: [{
				contains: "a:p",
				expand: "a:p",
				onlyTextInTag: true
			}],
			tagRawXml: "p:sp",
			baseModules: [
				loopModule,
				expandPairTrait,
				rawXmlModule,
				render
			],
			tagShouldContain: [
				{
					tag: "a:tbl",
					shouldContain: ["a:tr"],
					dropParent: "p:graphicFrame"
				},
				{
					tag: "p:txBody",
					shouldContain: ["a:p"],
					value: "<a:p></a:p>"
				},
				{
					tag: "a:txBody",
					shouldContain: ["a:p"],
					value: "<a:p></a:p>"
				}
			]
		};
	}
	module.exports = {
		docx: DocXFileTypeConfig,
		pptx: PptXFileTypeConfig
	};
}));
//#endregion
//#region node_modules/docxtemplater/js/docxtemplater.js
var require_docxtemplater = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var _excluded = ["modules"];
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r) {
				return Object.getOwnPropertyDescriptor(e, r).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
				_defineProperty(e, r, t[r]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
				Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
			});
		}
		return e;
	}
	function _defineProperty(e, r, t) {
		return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[r] = t, e;
	}
	function _slicedToArray(r, e) {
		return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
	}
	function _nonIterableRest() {
		throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}
	function _unsupportedIterableToArray(r, a) {
		if (r) {
			if ("string" == typeof r) return _arrayLikeToArray(r, a);
			var t = {}.toString.call(r).slice(8, -1);
			return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
		}
	}
	function _arrayLikeToArray(r, a) {
		(null == a || a > r.length) && (a = r.length);
		for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
		return n;
	}
	function _iterableToArrayLimit(r, l) {
		var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (null != t) {
			var e, n, i, u, a = [], f = !0, o = !1;
			try {
				if (i = (t = t.call(r)).next, 0 === l) {
					if (Object(t) !== t) return;
					f = !1;
				} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
			} catch (r) {
				o = !0, n = r;
			} finally {
				try {
					if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
				} finally {
					if (o) throw n;
				}
			}
			return a;
		}
	}
	function _arrayWithHoles(r) {
		if (Array.isArray(r)) return r;
	}
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _objectWithoutProperties(e, t) {
		if (null == e) return {};
		var o, r, i = _objectWithoutPropertiesLoose(e, t);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
		}
		return i;
	}
	function _objectWithoutPropertiesLoose(r, e) {
		if (null == r) return {};
		var t = {};
		for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
			if (-1 !== e.indexOf(n)) continue;
			t[n] = r[n];
		}
		return t;
	}
	function _classCallCheck(a, n) {
		if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
	}
	function _defineProperties(e, r) {
		for (var t = 0; t < r.length; t++) {
			var o = r[t];
			o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
		}
	}
	function _createClass(e, r, t) {
		return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e;
	}
	function _toPropertyKey(t) {
		var i = _toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	function _toPrimitive(t, r) {
		if ("object" != _typeof(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	var DocUtils = require_doc_utils();
	var z = require_minizod();
	var dxtSyntaxSchema = z.object({
		allowUnopenedTag: z["boolean"]().optional(),
		allowUnclosedTag: z["boolean"]().optional(),
		allowUnbalancedLoops: z["boolean"]().optional(),
		changeDelimiterPrefix: z.string().optional().nullable()
	});
	var dxtOptionsSchema = z.object({
		delimiters: z.object({
			start: z.string().nullable(),
			end: z.string().nullable()
		}).strict().optional(),
		fileTypeConfig: z.object({}).optional(),
		paragraphLoop: z["boolean"]().optional(),
		parser: z["function"]().optional(),
		errorLogging: z.union([z["boolean"](), z.string()]).optional(),
		linebreaks: z["boolean"]().optional(),
		nullGetter: z["function"]().optional(),
		syntax: dxtSyntaxSchema.optional(),
		stripInvalidXMLChars: z["boolean"]().optional(),
		warnFn: z["function"]().optional()
	}).strict();
	var getRelsTypes = require_get_relation_types().getRelsTypes;
	var _require2 = require_get_content_types();
	var collectContentTypes = _require2.collectContentTypes;
	var getContentTypes = _require2.getContentTypes;
	var moduleWrapper = require_module_wrapper();
	var traits = require_traits();
	var commonModule = require_common();
	var createScope = require_scope_manager();
	var Lexer = require_lexer();
	var _getTags = require_get_tags().getTags;
	var logErrors = require_error_logger();
	var _require4 = require_errors();
	var throwMultiError = _require4.throwMultiError;
	var throwResolveBeforeCompile = _require4.throwResolveBeforeCompile;
	var throwRenderInvalidTemplate = _require4.throwRenderInvalidTemplate;
	var throwRenderTwice = _require4.throwRenderTwice;
	var XTInternalError = _require4.XTInternalError;
	var XTTemplateError = _require4.XTTemplateError;
	var throwFileTypeNotIdentified = _require4.throwFileTypeNotIdentified;
	var throwFileTypeNotHandled = _require4.throwFileTypeNotHandled;
	var throwApiVersionError = _require4.throwApiVersionError;
	DocUtils.getRelsTypes = getRelsTypes;
	DocUtils.traits = traits;
	DocUtils.moduleWrapper = moduleWrapper;
	DocUtils.collectContentTypes = collectContentTypes;
	DocUtils.getContentTypes = getContentTypes;
	var getDefaults = DocUtils.getDefaults;
	var str2xml = DocUtils.str2xml;
	var xml2str = DocUtils.xml2str;
	var concatArrays = DocUtils.concatArrays;
	var uniq = DocUtils.uniq;
	var getDuplicates = DocUtils.getDuplicates;
	var stableSort = DocUtils.stableSort;
	var pushArray = DocUtils.pushArray;
	var utf8ToWord = DocUtils.utf8ToWord;
	var invertMap = DocUtils.invertMap;
	var ctXML = "[Content_Types].xml";
	var relsFile = "_rels/.rels";
	var currentModuleApiVersion = [
		3,
		48,
		0
	];
	function throwIfDuplicateModules(modules) {
		var names = [];
		for (var _i2 = 0; _i2 < modules.length; _i2++) {
			var mod = modules[_i2];
			names.push(mod.name);
		}
		var duplicates = getDuplicates(names);
		if (duplicates.length > 0) throw new XTInternalError("Detected duplicate module \"".concat(duplicates[0], "\""));
	}
	function addXmlFileNamesFromXmlContentType(doc) {
		for (var _i4 = 0, _doc$modules2 = doc.modules; _i4 < _doc$modules2.length; _i4++) {
			var _module = _doc$modules2[_i4];
			for (var _i6 = 0, _ref2 = _module.xmlContentTypes || []; _i6 < _ref2.length; _i6++) {
				var contentType = _ref2[_i6];
				var candidates = doc.invertedContentTypes[contentType] || [];
				for (var _i8 = 0; _i8 < candidates.length; _i8++) {
					var candidate = candidates[_i8];
					if (doc.zip.files[candidate]) doc.options.xmlFileNames.push(candidate);
				}
			}
		}
	}
	function reorderModules(modules) {
		/**
		* Modules will be sorted according to priority.
		*
		* Input example:
		* [
		*   { priority: 1, name: "FooMod" },
		*   { priority: -1, name: "XMod" },
		*   { priority: 4, name: "OtherMod" }
		* ]
		*
		* Output example (sorted by priority in descending order):
		* [
		*   { priority: 4, name: "OtherMod" },
		*   { priority: 1, name: "FooMod" },
		*   { priority: -1, name: "XMod" }
		* ]
		* Tested in #test-reorder-modules
		*/
		return stableSort(modules, function(m1, m2) {
			return (m2.priority || 0) - (m1.priority || 0);
		});
	}
	function zipFileOrder(files) {
		var allFiles = [];
		for (var name in files) allFiles.push(name);
		var resultFiles = [ctXML, relsFile];
		var prefixes = [
			"word/",
			"xl/",
			"ppt/"
		];
		for (var _i0 = 0; _i0 < allFiles.length; _i0++) {
			var _name = allFiles[_i0];
			for (var _i10 = 0; _i10 < prefixes.length; _i10++) {
				var prefix = prefixes[_i10];
				if (_name.indexOf("".concat(prefix)) === 0) resultFiles.push(_name);
			}
		}
		for (var _i12 = 0; _i12 < allFiles.length; _i12++) {
			var _name2 = allFiles[_i12];
			if (resultFiles.indexOf(_name2) === -1) resultFiles.push(_name2);
		}
		return resultFiles;
	}
	function deprecatedMessage(obj, message) {
		if (obj.hideDeprecations === true) return;
		console.warn(message);
	}
	function deprecatedMethod(obj, method) {
		if (obj.hideDeprecations === true) return;
		return deprecatedMessage(obj, "Deprecated method \".".concat(method, "\", view upgrade guide : https://docxtemplater.com/docs/api/#upgrade-guide, stack : ").concat((/* @__PURE__ */ new Error()).stack));
	}
	function dropUnsupportedFileTypesModules(doc) {
		doc.modules = doc.modules.filter(function(module$1) {
			if (!module$1.supportedFileTypes) return true;
			if (!Array.isArray(module$1.supportedFileTypes)) throw new Error("The supportedFileTypes field of the module must be an array");
			var isSupportedModule = module$1.supportedFileTypes.includes(doc.fileType);
			if (!isSupportedModule) module$1.on("detached");
			return isSupportedModule;
		});
	}
	function verifyErrors(doc) {
		var compiled = doc.compiled;
		doc.errors = concatArrays(Object.keys(compiled).map(function(name) {
			return compiled[name].allErrors;
		}));
		if (doc.errors.length !== 0) {
			if (doc.options.errorLogging) logErrors(doc.errors, doc.options.errorLogging);
			throwMultiError(doc.errors);
		}
	}
	function isBuffer(v) {
		return typeof Buffer !== "undefined" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(v);
	}
	var Docxtemplater = /*#__PURE__*/ function() {
		function Docxtemplater(zip) {
			var _ref3 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref3$modules = _ref3.modules, modules = _ref3$modules === void 0 ? [] : _ref3$modules, options = _objectWithoutProperties(_ref3, _excluded);
			_classCallCheck(this, Docxtemplater);
			this.targets = [];
			this.rendered = false;
			this.scopeManagers = {};
			this.compiled = {};
			this.modules = [commonModule()];
			this.xmlDocuments = {};
			if (arguments.length === 0) {
				deprecatedMessage(this, "Deprecated docxtemplater constructor with no arguments, view upgrade guide : https://docxtemplater.com/docs/api/#upgrade-guide, stack : ".concat((/* @__PURE__ */ new Error()).stack));
				this.hideDeprecations = true;
				this.setOptions(options);
			} else {
				this.hideDeprecations = true;
				this.setOptions(options);
				if (isBuffer(zip)) throw new Error("You passed a Buffer to the Docxtemplater constructor. The first argument of docxtemplater's constructor must be a valid zip file (jszip v2 or pizzip v3)");
				if (!zip || !zip.files || typeof zip.file !== "function") throw new Error("The first argument of docxtemplater's constructor must be a valid zip file (jszip v2 or pizzip v3)");
				if (!Array.isArray(modules)) throw new Error("The modules argument of docxtemplater's constructor must be an array");
				for (var _i14 = 0; _i14 < modules.length; _i14++) {
					var _module2 = modules[_i14];
					this.attachModule(_module2);
				}
				this.loadZip(zip);
				this.compile();
				this.v4Constructor = true;
			}
			this.hideDeprecations = false;
		}
		return _createClass(Docxtemplater, [
			{
				key: "verifyApiVersion",
				value: function verifyApiVersion(neededVersion) {
					neededVersion = neededVersion.split(".");
					for (var i = 0; i < neededVersion.length; i++) neededVersion[i] = parseInt(neededVersion[i], 10);
					if (neededVersion.length !== 3) throwApiVersionError("neededVersion is not a valid version", {
						neededVersion,
						explanation: "the neededVersion must be an array of length 3"
					});
					if (neededVersion[0] !== currentModuleApiVersion[0]) throwApiVersionError("The major api version do not match, you probably have to update docxtemplater with npm install --save docxtemplater", {
						neededVersion,
						currentModuleApiVersion,
						explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
					});
					if (neededVersion[1] > currentModuleApiVersion[1]) throwApiVersionError("The minor api version is not uptodate, you probably have to update docxtemplater with npm install --save docxtemplater", {
						neededVersion,
						currentModuleApiVersion,
						explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
					});
					if (neededVersion[1] === currentModuleApiVersion[1] && neededVersion[2] > currentModuleApiVersion[2]) throwApiVersionError("The patch api version is not uptodate, you probably have to update docxtemplater with npm install --save docxtemplater", {
						neededVersion,
						currentModuleApiVersion,
						explanation: "moduleAPIVersionMismatch : needed=".concat(neededVersion.join("."), ", current=").concat(currentModuleApiVersion.join("."))
					});
					return true;
				}
			},
			{
				key: "setModules",
				value: function setModules(obj) {
					for (var _i16 = 0, _this$modules2 = this.modules; _i16 < _this$modules2.length; _i16++) _this$modules2[_i16].set(obj);
				}
			},
			{
				key: "sendEvent",
				value: function sendEvent(eventName) {
					for (var _i18 = 0, _this$modules4 = this.modules; _i18 < _this$modules4.length; _i18++) _this$modules4[_i18].on(eventName);
				}
			},
			{
				key: "attachModule",
				value: function attachModule(module$2) {
					if (this.v4Constructor) throw new XTInternalError("attachModule() should not be called manually when using the v4 constructor");
					deprecatedMethod(this, "attachModule");
					var moduleType = _typeof(module$2);
					if (moduleType === "function") throw new XTInternalError("Cannot attach a class/function as a module. Most probably you forgot to instantiate the module by using `new` on the module.");
					if (!module$2 || moduleType !== "object") throw new XTInternalError("Cannot attachModule with a falsy value");
					if (module$2.requiredAPIVersion) this.verifyApiVersion(module$2.requiredAPIVersion);
					if (module$2.attached === true) {
						if (typeof module$2.clone === "function") module$2 = module$2.clone();
						else throw new Error("Cannot attach a module that was already attached : \"".concat(module$2.name, "\". The most likely cause is that you are instantiating the module at the root level, and using it for multiple instances of Docxtemplater"));
					}
					module$2.attached = true;
					var wrappedModule = moduleWrapper(module$2);
					this.modules.push(wrappedModule);
					wrappedModule.on("attached");
					if (this.fileType) dropUnsupportedFileTypesModules(this);
					return this;
				}
			},
			{
				key: "findModule",
				value: function findModule(name) {
					for (var _i20 = 0, _this$modules6 = this.modules; _i20 < _this$modules6.length; _i20++) {
						var _module5 = _this$modules6[_i20];
						if (_module5.name === name) return _module5;
					}
				}
			},
			{
				key: "setOptions",
				value: function setOptions(options) {
					var _this$delimiters, _this$delimiters2;
					if (this.v4Constructor) throw new Error("setOptions() should not be called manually when using the v4 constructor");
					if (!options) throw new Error("setOptions should be called with an object as first parameter");
					var result = dxtOptionsSchema.validate(options);
					if (result.success === false) throw new Error(result.error);
					deprecatedMethod(this, "setOptions");
					this.options = {};
					var defaults = getDefaults();
					for (var key in defaults) {
						var defaultValue = defaults[key];
						this.options[key] = options[key] != null ? options[key] : this[key] || defaultValue;
						this[key] = this.options[key];
					}
					(_this$delimiters = this.delimiters).start && (_this$delimiters.start = utf8ToWord(this.delimiters.start));
					(_this$delimiters2 = this.delimiters).end && (_this$delimiters2.end = utf8ToWord(this.delimiters.end));
					return this;
				}
			},
			{
				key: "loadZip",
				value: function loadZip(zip) {
					if (this.v4Constructor) throw new Error("loadZip() should not be called manually when using the v4 constructor");
					deprecatedMethod(this, "loadZip");
					if (zip.loadAsync) throw new XTInternalError("Docxtemplater doesn't handle JSZip version >=3, please use pizzip");
					if (zip.xtRendered) this.options.warnFn([/* @__PURE__ */ new Error("This zip file appears to be the outcome of a previous docxtemplater generation. This typically indicates that docxtemplater was integrated by reusing the same zip file. It is recommended to create a new Pizzip instance for each docxtemplater generation.")]);
					this.zip = zip;
					this.updateFileTypeConfig();
					this.modules = concatArrays([this.fileTypeConfig.baseModules.map(function(moduleFunction) {
						return moduleFunction();
					}), this.modules]);
					for (var _i22 = 0, _this$modules8 = this.modules; _i22 < _this$modules8.length; _i22++) {
						var _module6 = _this$modules8[_i22];
						_module6.zip = this.zip;
						_module6.docxtemplater = this;
						_module6.fileTypeConfig = this.fileTypeConfig;
						_module6.fileType = this.fileType;
						_module6.xtOptions = this.options;
						_module6.modules = this.modules;
					}
					dropUnsupportedFileTypesModules(this);
					return this;
				}
			},
			{
				key: "precompileFile",
				value: function precompileFile(fileName) {
					var currentFile = this.createTemplateClass(fileName);
					currentFile.preparse();
					this.compiled[fileName] = currentFile;
				}
			},
			{
				key: "compileFile",
				value: function compileFile(fileName) {
					this.compiled[fileName].parse();
				}
			},
			{
				key: "getScopeManager",
				value: function getScopeManager(to, currentFile, tags) {
					var _this$scopeManagers;
					(_this$scopeManagers = this.scopeManagers)[to] || (_this$scopeManagers[to] = createScope({
						tags,
						parser: this.parser,
						cachedParsers: currentFile.cachedParsers
					}));
					return this.scopeManagers[to];
				}
			},
			{
				key: "resolveData",
				value: function resolveData(data) {
					var _this = this;
					deprecatedMethod(this, "resolveData");
					var errors = [];
					if (!Object.keys(this.compiled).length) throwResolveBeforeCompile();
					return Promise.resolve(data).then(function(data) {
						_this.data = data;
						_this.setModules({
							data: _this.data,
							Lexer
						});
						_this.mapper = _this.modules.reduce(function(value, module$3) {
							return module$3.getRenderedMap(value);
						}, {});
						var promises = [];
						var _loop = function _loop() {
							var to = _Object$keys2[_i24];
							var _this$mapper$to = _this.mapper[to], from = _this$mapper$to.from, data = _this$mapper$to.data;
							promises.push(Promise.resolve(data).then(function(data) {
								var currentFile = _this.compiled[from];
								currentFile.filePath = to;
								currentFile.scopeManager = _this.getScopeManager(to, currentFile, data);
								return currentFile.resolveTags(data).then(function(result) {
									currentFile.scopeManager.finishedResolving = true;
									return result;
								}, function(errs) {
									pushArray(errors, errs);
								});
							}));
						};
						for (var _i24 = 0, _Object$keys2 = Object.keys(_this.mapper); _i24 < _Object$keys2.length; _i24++) _loop();
						return Promise.all(promises).then(function(resolved) {
							if (errors.length !== 0) {
								if (_this.options.errorLogging) logErrors(errors, _this.options.errorLogging);
								throwMultiError(errors);
							}
							return concatArrays(resolved);
						});
					});
				}
			},
			{
				key: "compile",
				value: function compile() {
					deprecatedMethod(this, "compile");
					this.updateFileTypeConfig();
					throwIfDuplicateModules(this.modules);
					this.modules = reorderModules(this.modules);
					if (Object.keys(this.compiled).length) return this;
					var options = this.options;
					for (var _i26 = 0, _this$modules0 = this.modules; _i26 < _this$modules0.length; _i26++) options = _this$modules0[_i26].optionsTransformer(options, this);
					this.options = options;
					this.options.xmlFileNames = uniq(this.options.xmlFileNames);
					for (var _i28 = 0, _this$options$xmlFile2 = this.options.xmlFileNames; _i28 < _this$options$xmlFile2.length; _i28++) {
						var fileName = _this$options$xmlFile2[_i28];
						var content = this.zip.files[fileName].asText();
						this.xmlDocuments[fileName] = str2xml(content);
					}
					this.setModules({
						zip: this.zip,
						xmlDocuments: this.xmlDocuments
					});
					for (var _i30 = 0, _this$modules10 = this.modules; _i30 < _this$modules10.length; _i30++) {
						var _module8 = _this$modules10[_i30];
						_module8.xmlDocuments = this.xmlDocuments;
					}
					this.getTemplatedFiles();
					this.sendEvent("before-preparse");
					for (var _i32 = 0, _this$templatedFiles2 = this.templatedFiles; _i32 < _this$templatedFiles2.length; _i32++) {
						var _fileName = _this$templatedFiles2[_i32];
						if (this.zip.files[_fileName] != null) this.precompileFile(_fileName);
					}
					this.sendEvent("after-preparse");
					for (var _i34 = 0, _this$templatedFiles4 = this.templatedFiles; _i34 < _this$templatedFiles4.length; _i34++) {
						var _fileName2 = _this$templatedFiles4[_i34];
						if (this.zip.files[_fileName2] != null) this.compiled[_fileName2].parse({ noPostParse: true });
					}
					this.sendEvent("after-parse");
					for (var _i36 = 0, _this$templatedFiles6 = this.templatedFiles; _i36 < _this$templatedFiles6.length; _i36++) {
						var _fileName3 = _this$templatedFiles6[_i36];
						if (this.zip.files[_fileName3] != null) this.compiled[_fileName3].postparse();
					}
					this.sendEvent("after-postparse");
					this.setModules({ compiled: this.compiled });
					verifyErrors(this);
					return this;
				}
			},
			{
				key: "updateFileTypeConfig",
				value: function updateFileTypeConfig() {
					this.relsTypes = getRelsTypes(this.zip);
					var _getContentTypes = getContentTypes(this.zip), overrides = _getContentTypes.overrides, defaults = _getContentTypes.defaults, contentTypes = _getContentTypes.contentTypes, contentTypeXml = _getContentTypes.contentTypeXml;
					if (contentTypeXml) {
						this.filesContentTypes = collectContentTypes(overrides, defaults, this.zip);
						this.invertedContentTypes = invertMap(this.filesContentTypes);
						this.setModules({
							contentTypes: this.contentTypes,
							invertedContentTypes: this.invertedContentTypes
						});
					}
					var fileType;
					if (this.zip.files.mimetype) fileType = "odt";
					for (var _i38 = 0, _this$modules12 = this.modules; _i38 < _this$modules12.length; _i38++) fileType = _this$modules12[_i38].getFileType({
						zip: this.zip,
						contentTypes,
						contentTypeXml,
						overrides,
						defaults,
						doc: this
					}) || fileType;
					this.fileType = fileType;
					if (fileType === "odt") throwFileTypeNotHandled(fileType);
					if (!fileType) throwFileTypeNotIdentified(this.zip);
					addXmlFileNamesFromXmlContentType(this);
					dropUnsupportedFileTypesModules(this);
					this.fileTypeConfig = this.options.fileTypeConfig || this.fileTypeConfig;
					if (!this.fileTypeConfig) {
						if (Docxtemplater.FileTypeConfig[this.fileType]) this.fileTypeConfig = Docxtemplater.FileTypeConfig[this.fileType]();
						else {
							var message = "Filetype \"".concat(this.fileType, "\" is not supported");
							var id = "filetype_not_supported";
							if (this.fileType === "xlsx") {
								message = "Filetype \"".concat(this.fileType, "\" is supported only with the paid XlsxModule");
								id = "xlsx_filetype_needs_xlsx_module";
							}
							var err = new XTTemplateError(message);
							err.properties = {
								id,
								explanation: message
							};
							throw err;
						}
					}
					return this;
				}
			},
			{
				key: "renderAsync",
				value: function renderAsync(data) {
					var _this2 = this;
					this.hideDeprecations = true;
					var promise = this.resolveData(data);
					this.hideDeprecations = false;
					this.zip.xtRendered = true;
					return promise.then(function() {
						return _this2.render();
					});
				}
			},
			{
				key: "render",
				value: function render(data) {
					this.zip.xtRendered = true;
					if (this.rendered) throwRenderTwice();
					this.rendered = true;
					if (Object.keys(this.compiled).length === 0) this.compile();
					if (this.errors.length > 0) throwRenderInvalidTemplate();
					if (arguments.length > 0) this.data = data;
					this.setModules({
						data: this.data,
						Lexer
					});
					this.mapper || (this.mapper = this.modules.reduce(function(value, module$4) {
						return module$4.getRenderedMap(value);
					}, {}));
					var output = [];
					for (var to in this.mapper) {
						var _this$mapper$to2 = this.mapper[to], from = _this$mapper$to2.from, _data = _this$mapper$to2.data;
						var currentFile = this.compiled[from];
						currentFile.scopeManager = this.getScopeManager(to, currentFile, _data);
						currentFile.render(to);
						output.push([
							to,
							currentFile.content,
							currentFile
						]);
						delete currentFile.content;
					}
					for (var _i40 = 0; _i40 < output.length; _i40++) {
						var outputPart = output[_i40];
						var _outputPart = _slicedToArray(outputPart, 3), content = _outputPart[1], _currentFile = _outputPart[2];
						for (var _i42 = 0, _this$modules14 = this.modules; _i42 < _this$modules14.length; _i42++) {
							var _module0 = _this$modules14[_i42];
							if (_module0.preZip) {
								var result = _module0.preZip(content, _currentFile);
								if (typeof result === "string") outputPart[1] = result;
							}
						}
					}
					for (var _i44 = 0; _i44 < output.length; _i44++) {
						var _output$_i = _slicedToArray(output[_i44], 2), _to = _output$_i[0], _content = _output$_i[1];
						this.zip.file(_to, _content, { createFolders: true });
					}
					verifyErrors(this);
					this.sendEvent("syncing-zip");
					this.syncZip();
					this.sendEvent("synced-zip");
					return this;
				}
			},
			{
				key: "syncZip",
				value: function syncZip() {
					for (var fileName in this.xmlDocuments) {
						this.zip.remove(fileName);
						var content = xml2str(this.xmlDocuments[fileName]);
						this.zip.file(fileName, content, { createFolders: true });
					}
				}
			},
			{
				key: "setData",
				value: function setData(data) {
					deprecatedMethod(this, "setData");
					this.data = data;
					return this;
				}
			},
			{
				key: "getZip",
				value: function getZip() {
					return this.zip;
				}
			},
			{
				key: "createTemplateClass",
				value: function createTemplateClass(path) {
					var content = this.zip.files[path].asText();
					return this.createTemplateClassFromContent(content, path);
				}
			},
			{
				key: "createTemplateClassFromContent",
				value: function createTemplateClassFromContent(content, filePath) {
					var xmltOptions = {
						filePath,
						contentType: this.filesContentTypes[filePath],
						relsType: this.relsTypes[filePath]
					};
					var defaults = getDefaults();
					var defaultKeys = pushArray(Object.keys(defaults), [
						"filesContentTypes",
						"fileTypeConfig",
						"fileType",
						"modules"
					]);
					for (var _i46 = 0; _i46 < defaultKeys.length; _i46++) {
						var key = defaultKeys[_i46];
						xmltOptions[key] = this[key];
					}
					return new Docxtemplater.XmlTemplater(content, xmltOptions);
				}
			},
			{
				key: "getFullText",
				value: function getFullText(path) {
					return this.createTemplateClass(path || this.fileTypeConfig.textPath(this)).getFullText();
				}
			},
			{
				key: "getTemplatedFiles",
				value: function getTemplatedFiles() {
					this.templatedFiles = this.fileTypeConfig.getTemplatedFiles(this.zip);
					pushArray(this.templatedFiles, this.targets);
					var templatedNs = this.fileTypeConfig.templatedNs || [];
					if (templatedNs.length > 0) {
						for (var key in this.filesContentTypes) if (/^customXml\/item\d+\.xml$/.test(key)) for (var _i48 = 0; _i48 < templatedNs.length; _i48++) {
							var ns = templatedNs[_i48];
							if (this.zip.file(key).asText().indexOf("xmlns=\"".concat(ns, "\"")) !== -1) this.templatedFiles.push(key);
						}
					}
					this.templatedFiles = uniq(this.templatedFiles);
					return this.templatedFiles;
				}
			},
			{
				key: "getTags",
				value: function getTags() {
					var result = {
						headers: [],
						footers: []
					};
					for (var key in this.compiled) {
						var contentType = this.filesContentTypes[key];
						if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml") result.document = {
							target: key,
							tags: _getTags(this.compiled[key].postparsed)
						};
						if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml") result.headers.push({
							target: key,
							tags: _getTags(this.compiled[key].postparsed)
						});
						if (contentType === "application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml") result.footers.push({
							target: key,
							tags: _getTags(this.compiled[key].postparsed)
						});
					}
					return result;
				}
			},
			{
				key: "toBuffer",
				value: function toBuffer(options) {
					return this.zip.generate(_objectSpread(_objectSpread({
						compression: "DEFLATE",
						fileOrder: zipFileOrder
					}, options), {}, { type: "nodebuffer" }));
				}
			},
			{
				key: "toBlob",
				value: function toBlob(options) {
					return this.zip.generate(_objectSpread(_objectSpread({
						compression: "DEFLATE",
						fileOrder: zipFileOrder
					}, options), {}, { type: "blob" }));
				}
			},
			{
				key: "toBase64",
				value: function toBase64(options) {
					return this.zip.generate(_objectSpread(_objectSpread({
						compression: "DEFLATE",
						fileOrder: zipFileOrder
					}, options), {}, { type: "base64" }));
				}
			},
			{
				key: "toUint8Array",
				value: function toUint8Array(options) {
					return this.zip.generate(_objectSpread(_objectSpread({
						compression: "DEFLATE",
						fileOrder: zipFileOrder
					}, options), {}, { type: "uint8array" }));
				}
			},
			{
				key: "toArrayBuffer",
				value: function toArrayBuffer(options) {
					return this.zip.generate(_objectSpread(_objectSpread({
						compression: "DEFLATE",
						fileOrder: zipFileOrder
					}, options), {}, { type: "arraybuffer" }));
				}
			}
		]);
	}();
	Docxtemplater.DocUtils = DocUtils;
	Docxtemplater.Errors = require_errors();
	Docxtemplater.XmlTemplater = require_xml_templater();
	Docxtemplater.FileTypeConfig = require_file_type_config();
	Docxtemplater.XmlMatcher = require_xml_matcher();
	module.exports = Docxtemplater;
	module.exports["default"] = Docxtemplater;
}));
//#endregion
export { require_docxtemplater as t };
