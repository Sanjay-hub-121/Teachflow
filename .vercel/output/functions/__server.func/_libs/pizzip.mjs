import { i as __require, t as __commonJSMin } from "../_runtime.mjs";
import { n as require_pako_es5_min, t as require_pako } from "./pako.mjs";
//#region node_modules/pizzip/js/base64.js
var require_base64 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	exports.encode = function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
		while (i < input.length) {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
			enc1 = chr1 >> 2;
			enc2 = (chr1 & 3) << 4 | chr2 >> 4;
			enc3 = (chr2 & 15) << 2 | chr3 >> 6;
			enc4 = chr3 & 63;
			if (isNaN(chr2)) enc3 = enc4 = 64;
			else if (isNaN(chr3)) enc4 = 64;
			output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
		}
		return output;
	};
	exports.decode = function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
		while (i < input.length) {
			enc1 = _keyStr.indexOf(input.charAt(i++));
			enc2 = _keyStr.indexOf(input.charAt(i++));
			enc3 = _keyStr.indexOf(input.charAt(i++));
			enc4 = _keyStr.indexOf(input.charAt(i++));
			chr1 = enc1 << 2 | enc2 >> 4;
			chr2 = (enc2 & 15) << 4 | enc3 >> 2;
			chr3 = (enc3 & 3) << 6 | enc4;
			output += String.fromCharCode(chr1);
			if (enc3 !== 64) output += String.fromCharCode(chr2);
			if (enc4 !== 64) output += String.fromCharCode(chr3);
		}
		return output;
	};
}));
//#endregion
//#region node_modules/pizzip/js/chunk-size.js
var require_chunk_size = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function chunkSize(value) {
		var fallback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1048576;
		var size = value === void 0 ? fallback : value;
		if (!Number.isSafeInteger(size) || size < 64 || size > 2147483647) throw new RangeError("chunkSize must be an integer between 64 and 2147483647 bytes");
		return size;
	};
}));
//#endregion
//#region node_modules/pizzip/js/support.js
var require_support = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.base64 = true;
	exports.array = true;
	exports.string = true;
	exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
	exports.nodebuffer = typeof Buffer !== "undefined";
	exports.uint8array = typeof Uint8Array !== "undefined";
	if (typeof ArrayBuffer === "undefined") exports.blob = false;
	else {
		var buffer = /* @__PURE__ */ new ArrayBuffer(0);
		try {
			exports.blob = new Blob([buffer], { type: "application/zip" }).size === 0;
		} catch (_unused) {
			try {
				var builder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder)();
				builder.append(buffer);
				exports.blob = builder.getBlob("application/zip").size === 0;
			} catch (_unused2) {
				exports.blob = false;
			}
		}
	}
}));
//#endregion
//#region node_modules/pizzip/js/flate.js
var require_flate = /* @__PURE__ */ __commonJSMin(((exports) => {
	var USE_TYPEDARRAY = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Uint32Array !== "undefined";
	var pako = require_pako_es5_min();
	exports.uncompressInputType = USE_TYPEDARRAY ? "uint8array" : "array";
	exports.compressInputType = USE_TYPEDARRAY ? "uint8array" : "array";
	exports.magic = "\b\0";
	exports.compress = function(input, compressionOptions) {
		return pako.deflateRaw(input, { level: compressionOptions.level || -1 });
	};
	exports.uncompress = function(input) {
		return pako.inflateRaw(input);
	};
}));
//#endregion
//#region node_modules/pizzip/js/compressions.js
var require_compressions = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.STORE = {
		magic: "\0\0",
		compress: function compress(content) {
			return content;
		},
		uncompress: function uncompress(content) {
			return content;
		},
		compressInputType: null,
		uncompressInputType: null
	};
	exports.DEFLATE = require_flate();
}));
//#endregion
//#region node_modules/pizzip/js/nodeBuffer.js
var require_nodeBuffer = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(data, encoding) {
		if (typeof data === "number") return Buffer.alloc(data);
		return Buffer.from(data, encoding);
	};
	module.exports.test = function(b) {
		return Buffer.isBuffer(b);
	};
}));
//#endregion
//#region node_modules/pizzip/js/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	var support = require_support();
	var compressions = require_compressions();
	var nodeBuffer = require_nodeBuffer();
	/**
	* Convert a string to a "binary string" : a string containing only char codes between 0 and 255.
	* @param {string} str the string to transform.
	* @return {String} the binary string.
	*/
	exports.string2binary = function(str) {
		var result = "";
		for (var i = 0; i < str.length; i++) result += String.fromCharCode(str.charCodeAt(i) & 255);
		return result;
	};
	exports.arrayBuffer2Blob = function(buffer, mimeType) {
		exports.checkSupport("blob");
		mimeType = mimeType || "application/zip";
		try {
			return new Blob([buffer], { type: mimeType });
		} catch (_unused) {
			try {
				var builder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder)();
				builder.append(buffer);
				return builder.getBlob(mimeType);
			} catch (_unused2) {
				throw new Error("Bug : can't construct the Blob.");
			}
		}
	};
	/**
	* The identity function.
	* @param {Object} input the input.
	* @return {Object} the same input.
	*/
	function identity(input) {
		return input;
	}
	/**
	* Fill in an array with a string.
	* @param {String} str the string to use.
	* @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).
	* @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.
	*/
	function stringToArrayLike(str, array) {
		for (var i = 0; i < str.length; ++i) array[i] = str.charCodeAt(i) & 255;
		return array;
	}
	/**
	* Transform an array-like object to a string.
	* @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
	* @return {String} the result.
	*/
	function arrayLikeToString(array) {
		var chunk = 65536;
		var result = [], len = array.length, type = exports.getTypeOf(array);
		var k = 0, canUseApply = true;
		try {
			switch (type) {
				case "uint8array":
					String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(0));
					break;
				case "nodebuffer": String.fromCharCode.apply(null, nodeBuffer(0));
			}
		} catch (_unused3) {
			canUseApply = false;
		}
		if (!canUseApply) {
			var resultStr = "";
			for (var i = 0; i < array.length; i++) resultStr += String.fromCharCode(array[i]);
			return resultStr;
		}
		while (k < len && chunk > 1) try {
			if (type === "array" || type === "nodebuffer") result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
			else result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
			k += chunk;
		} catch (_unused4) {
			chunk = Math.floor(chunk / 2);
		}
		return result.join("");
	}
	exports.applyFromCharCode = arrayLikeToString;
	/**
	* Copy the data from an array-like to an other array-like.
	* @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.
	* @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.
	* @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.
	*/
	function arrayLikeToArrayLike(arrayFrom, arrayTo) {
		for (var i = 0; i < arrayFrom.length; i++) arrayTo[i] = arrayFrom[i];
		return arrayTo;
	}
	var transform = {};
	transform.string = {
		string: identity,
		array: function array(input) {
			return stringToArrayLike(input, new Array(input.length));
		},
		arraybuffer: function arraybuffer(input) {
			return transform.string.uint8array(input).buffer;
		},
		uint8array: function uint8array(input) {
			return stringToArrayLike(input, new Uint8Array(input.length));
		},
		nodebuffer: function nodebuffer(input) {
			return stringToArrayLike(input, nodeBuffer(input.length));
		}
	};
	transform.array = {
		string: arrayLikeToString,
		array: identity,
		arraybuffer: function arraybuffer(input) {
			return new Uint8Array(input).buffer;
		},
		uint8array: function uint8array(input) {
			return new Uint8Array(input);
		},
		nodebuffer: function nodebuffer(input) {
			return nodeBuffer(input);
		}
	};
	transform.arraybuffer = {
		string: function string(input) {
			return arrayLikeToString(new Uint8Array(input));
		},
		array: function array(input) {
			return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
		},
		arraybuffer: identity,
		uint8array: function uint8array(input) {
			return new Uint8Array(input);
		},
		nodebuffer: function nodebuffer(input) {
			return nodeBuffer(new Uint8Array(input));
		}
	};
	transform.uint8array = {
		string: arrayLikeToString,
		array: function array(input) {
			return arrayLikeToArrayLike(input, new Array(input.length));
		},
		arraybuffer: function arraybuffer(input) {
			return input.buffer;
		},
		uint8array: identity,
		nodebuffer: function nodebuffer(input) {
			return nodeBuffer(input);
		}
	};
	transform.nodebuffer = {
		string: arrayLikeToString,
		array: function array(input) {
			return arrayLikeToArrayLike(input, new Array(input.length));
		},
		arraybuffer: function arraybuffer(input) {
			return transform.nodebuffer.uint8array(input).buffer;
		},
		uint8array: function uint8array(input) {
			return arrayLikeToArrayLike(input, new Uint8Array(input.length));
		},
		nodebuffer: identity
	};
	/**
	* Transform an input into any type.
	* The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.
	* If no output type is specified, the unmodified input will be returned.
	* @param {String} outputType the output type.
	* @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.
	* @throws {Error} an Error if the browser doesn't support the requested output type.
	*/
	exports.transformTo = function(outputType, input) {
		if (!input) input = "";
		if (!outputType) return input;
		exports.checkSupport(outputType);
		return transform[exports.getTypeOf(input)][outputType](input);
	};
	/**
	* Return the type of the input.
	* The type will be in a format valid for PizZip.utils.transformTo : string, array, uint8array, arraybuffer.
	* @param {Object} input the input to identify.
	* @return {String} the (lowercase) type of the input.
	*/
	exports.getTypeOf = function(input) {
		if (input == null) return;
		if (typeof input === "string") return "string";
		var protoResult = Object.prototype.toString.call(input);
		if (protoResult === "[object Array]") return "array";
		if (support.nodebuffer && nodeBuffer.test(input)) return "nodebuffer";
		if (support.uint8array && protoResult === "[object Uint8Array]") return "uint8array";
		if (support.arraybuffer && protoResult === "[object ArrayBuffer]") return "arraybuffer";
		if (protoResult === "[object Promise]") throw new Error("Cannot read data from a promise, you probably are running new PizZip(data) with a promise");
		if (_typeof(input) === "object" && typeof input.file === "function") throw new Error("Cannot read data from a pizzip instance, you probably are running new PizZip(zip) with a zipinstance");
		if (protoResult === "[object Date]") throw new Error("Cannot read data from a Date, you probably are running new PizZip(data) with a date");
		if (_typeof(input) === "object" && input.crc32 == null) throw new Error("Unsupported data given to new PizZip(data) (object given)");
	};
	/**
	* Throw an exception if the type is not supported.
	* @param {String} type the type to check.
	* @throws {Error} an Error if the browser doesn't support the requested type.
	*/
	exports.checkSupport = function(type) {
		if (!support[type.toLowerCase()]) throw new Error(type + " is not supported by this browser");
	};
	exports.MAX_VALUE_16BITS = 65535;
	exports.MAX_VALUE_32BITS = -1;
	/**
	* Prettify a string read as binary.
	* @param {string} str the string to prettify.
	* @return {string} a pretty string.
	*/
	exports.pretty = function(str) {
		var res = "", code, i = 0;
		for (; i < (str || "").length; i++) {
			code = str.charCodeAt(i);
			res += "\\x" + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
		}
		return res;
	};
	/**
	* Find a compression registered in PizZip.
	* @param {string} compressionMethod the method magic to find.
	* @return {Object|null} the PizZip compression object, null if none found.
	*/
	exports.findCompression = function(compressionMethod) {
		for (var method in compressions) {
			if (!compressions.hasOwnProperty(method)) continue;
			if (compressions[method].magic === compressionMethod) return compressions[method];
		}
		return null;
	};
	/**
	* Cross-window, cross-Node-context regular expression detection
	* @param  {Object}  object Anything
	* @return {Boolean}        true if the object is a regular expression,
	* false otherwise
	*/
	exports.isRegExp = function(object) {
		return Object.prototype.toString.call(object) === "[object RegExp]";
	};
	/**
	* Merge the objects passed as parameters into a new one.
	* @private
	* @param {...Object} var_args All objects to merge.
	* @return {Object} a new object with the data of the others.
	*/
	exports.extend = function() {
		var result = {};
		var i = 0, attr;
		for (; i < arguments.length; i++) for (attr in arguments[i]) if (arguments[i].hasOwnProperty(attr) && typeof result[attr] === "undefined") result[attr] = arguments[i][attr];
		return result;
	};
}));
//#endregion
//#region node_modules/pizzip/js/compressedObject.js
var require_compressedObject = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils();
	function CompressedObject() {
		this.compressedSize = 0;
		this.uncompressedSize = 0;
		this.crc32 = 0;
		this.compressionMethod = null;
		this.compressedContent = null;
	}
	CompressedObject.from = function(source, getCompressedContent) {
		var compression = utils.findCompression(source.compressionMethod);
		if (!compression) throw new Error("Corrupted zip : compression " + utils.pretty(source.compressionMethod) + " unknown");
		var result = new CompressedObject();
		result.compressedSize = source.compressedSize;
		result.uncompressedSize = source.uncompressedSize;
		result.crc32 = source.crc32;
		result.compressionMethod = source.compressionMethod;
		result.getCompressedContent = getCompressedContent;
		result.getContent = function() {
			var content = compression.uncompress(utils.transformTo(compression.uncompressInputType, getCompressedContent()));
			if (content.length !== result.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
			return content;
		};
		return result;
	};
	CompressedObject.prototype = {
		/**
		* Return the decompressed content in an unspecified format.
		* The format will depend on the decompressor.
		* @return {Object} the decompressed content.
		*/
		getContent: function getContent() {
			return null;
		},
		/**
		* Return the compressed content in an unspecified format.
		* The format will depend on the compressed conten source.
		* @return {Object} the compressed content.
		*/
		getCompressedContent: function getCompressedContent() {
			return null;
		}
	};
	module.exports = CompressedObject;
}));
//#endregion
//#region node_modules/pizzip/js/dataReader.js
var require_dataReader = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils();
	function DataReader() {
		this.data = null;
		this.length = 0;
		this.index = 0;
		this.zero = 0;
	}
	DataReader.prototype = {
		/**
		* Check that the offset will not go too far.
		* @param {string} offset the additional offset to check.
		* @throws {Error} an Error if the offset is out of bounds.
		*/
		checkOffset: function checkOffset(offset) {
			this.checkIndex(this.index + offset);
		},
		/**
		* Check that the specifed index will not be too far.
		* @param {string} newIndex the index to check.
		* @throws {Error} an Error if the index is out of bounds.
		*/
		checkIndex: function checkIndex(newIndex) {
			if (this.length < this.zero + newIndex || newIndex < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + newIndex + "). Corrupted zip ?");
		},
		/**
		* Change the index.
		* @param {number} newIndex The new index.
		* @throws {Error} if the new index is out of the data.
		*/
		setIndex: function setIndex(newIndex) {
			this.checkIndex(newIndex);
			this.index = newIndex;
		},
		/**
		* Skip the next n bytes.
		* @param {number} n the number of bytes to skip.
		* @throws {Error} if the new index is out of the data.
		*/
		skip: function skip(n) {
			this.setIndex(this.index + n);
		},
		/**
		* Get the byte at the specified index.
		* @param {number} i the index to use.
		* @return {number} a byte.
		*/
		byteAt: function byteAt() {},
		/**
		* Get the next number with a given byte size.
		* @param {number} size the number of bytes to read.
		* @return {number} the corresponding number.
		*/
		readInt: function readInt(size) {
			var result = 0, i;
			this.checkOffset(size);
			for (i = this.index + size - 1; i >= this.index; i--) result = (result << 8) + this.byteAt(i);
			this.index += size;
			return result;
		},
		/**
		* Get the next string with a given byte size.
		* @param {number} size the number of bytes to read.
		* @return {string} the corresponding string.
		*/
		readString: function readString(size) {
			return utils.transformTo("string", this.readData(size));
		},
		/**
		* Get raw data without conversion, <size> bytes.
		* @param {number} size the number of bytes to read.
		* @return {Object} the raw data, implementation specific.
		*/
		readData: function readData() {},
		/**
		* Find the last occurence of a zip signature (4 bytes).
		* @param {string} sig the signature to find.
		* @return {number} the index of the last occurence, -1 if not found.
		*/
		lastIndexOfSignature: function lastIndexOfSignature() {},
		/**
		* Get the next date.
		* @return {Date} the date.
		*/
		readDate: function readDate() {
			var dostime = this.readInt(4);
			return new Date((dostime >> 25 & 127) + 1980, (dostime >> 21 & 15) - 1, dostime >> 16 & 31, dostime >> 11 & 31, dostime >> 5 & 63, (dostime & 31) << 1);
		}
	};
	module.exports = DataReader;
}));
//#endregion
//#region node_modules/pizzip/js/crc32.js
var require_crc32 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils();
	var table = [
		0,
		1996959894,
		3993919788,
		2567524794,
		124634137,
		1886057615,
		3915621685,
		2657392035,
		249268274,
		2044508324,
		3772115230,
		2547177864,
		162941995,
		2125561021,
		3887607047,
		2428444049,
		498536548,
		1789927666,
		4089016648,
		2227061214,
		450548861,
		1843258603,
		4107580753,
		2211677639,
		325883990,
		1684777152,
		4251122042,
		2321926636,
		335633487,
		1661365465,
		4195302755,
		2366115317,
		997073096,
		1281953886,
		3579855332,
		2724688242,
		1006888145,
		1258607687,
		3524101629,
		2768942443,
		901097722,
		1119000684,
		3686517206,
		2898065728,
		853044451,
		1172266101,
		3705015759,
		2882616665,
		651767980,
		1373503546,
		3369554304,
		3218104598,
		565507253,
		1454621731,
		3485111705,
		3099436303,
		671266974,
		1594198024,
		3322730930,
		2970347812,
		795835527,
		1483230225,
		3244367275,
		3060149565,
		1994146192,
		31158534,
		2563907772,
		4023717930,
		1907459465,
		112637215,
		2680153253,
		3904427059,
		2013776290,
		251722036,
		2517215374,
		3775830040,
		2137656763,
		141376813,
		2439277719,
		3865271297,
		1802195444,
		476864866,
		2238001368,
		4066508878,
		1812370925,
		453092731,
		2181625025,
		4111451223,
		1706088902,
		314042704,
		2344532202,
		4240017532,
		1658658271,
		366619977,
		2362670323,
		4224994405,
		1303535960,
		984961486,
		2747007092,
		3569037538,
		1256170817,
		1037604311,
		2765210733,
		3554079995,
		1131014506,
		879679996,
		2909243462,
		3663771856,
		1141124467,
		855842277,
		2852801631,
		3708648649,
		1342533948,
		654459306,
		3188396048,
		3373015174,
		1466479909,
		544179635,
		3110523913,
		3462522015,
		1591671054,
		702138776,
		2966460450,
		3352799412,
		1504918807,
		783551873,
		3082640443,
		3233442989,
		3988292384,
		2596254646,
		62317068,
		1957810842,
		3939845945,
		2647816111,
		81470997,
		1943803523,
		3814918930,
		2489596804,
		225274430,
		2053790376,
		3826175755,
		2466906013,
		167816743,
		2097651377,
		4027552580,
		2265490386,
		503444072,
		1762050814,
		4150417245,
		2154129355,
		426522225,
		1852507879,
		4275313526,
		2312317920,
		282753626,
		1742555852,
		4189708143,
		2394877945,
		397917763,
		1622183637,
		3604390888,
		2714866558,
		953729732,
		1340076626,
		3518719985,
		2797360999,
		1068828381,
		1219638859,
		3624741850,
		2936675148,
		906185462,
		1090812512,
		3747672003,
		2825379669,
		829329135,
		1181335161,
		3412177804,
		3160834842,
		628085408,
		1382605366,
		3423369109,
		3138078467,
		570562233,
		1426400815,
		3317316542,
		2998733608,
		733239954,
		1555261956,
		3268935591,
		3050360625,
		752459403,
		1541320221,
		2607071920,
		3965973030,
		1969922972,
		40735498,
		2617837225,
		3943577151,
		1913087877,
		83908371,
		2512341634,
		3803740692,
		2075208622,
		213261112,
		2463272603,
		3855990285,
		2094854071,
		198958881,
		2262029012,
		4057260610,
		1759359992,
		534414190,
		2176718541,
		4139329115,
		1873836001,
		414664567,
		2282248934,
		4279200368,
		1711684554,
		285281116,
		2405801727,
		4167216745,
		1634467795,
		376229701,
		2685067896,
		3608007406,
		1308918612,
		956543938,
		2808555105,
		3495958263,
		1231636301,
		1047427035,
		2932959818,
		3654703836,
		1088359270,
		936918e3,
		2847714899,
		3736837829,
		1202900863,
		817233897,
		3183342108,
		3401237130,
		1404277552,
		615818150,
		3134207493,
		3453421203,
		1423857449,
		601450431,
		3009837614,
		3294710456,
		1567103746,
		711928724,
		3020668471,
		3272380065,
		1510334235,
		755167117
	];
	/**
	*
	*  Javascript crc32
	*  http://www.webtoolkit.info/
	*
	*/
	module.exports = function crc32(input, crc) {
		if (typeof input === "undefined" || !input.length) return 0;
		var isArray = utils.getTypeOf(input) !== "string";
		if (typeof crc == "undefined") crc = 0;
		var x = 0;
		var y = 0;
		var b = 0;
		crc ^= -1;
		for (var i = 0, iTop = input.length; i < iTop; i++) {
			b = isArray ? input[i] : input.charCodeAt(i);
			y = (crc ^ b) & 255;
			x = table[y];
			crc = crc >>> 8 ^ x;
		}
		return crc ^ -1;
	};
}));
//#endregion
//#region node_modules/pizzip/js/fileReader.js
var require_fileReader = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs$1 = __require("node:fs");
	var Readable = __require("node:stream").Readable;
	var DataReader = require_dataReader();
	function readExactly(fd, buffer, offset, length, position) {
		var read = 0;
		while (read < length) {
			var count = fs$1.readSync(fd, buffer, offset + read, length - read, position + read);
			if (!count) throw new Error("Corrupted zip : unexpected end of file");
			read += count;
		}
	}
	function FileReader(file) {
		var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
		this.chunkSize = require_chunk_size()(options.chunkSize);
		this.file = file;
		this.fd = fs$1.openSync(file, "r");
		try {
			this.length = fs$1.fstatSync(this.fd).size;
		} catch (error) {
			fs$1.closeSync(this.fd);
			throw error;
		}
		this.index = 0;
		this.zero = 0;
		this.closed = false;
	}
	FileReader.prototype = new DataReader();
	FileReader.prototype._pizzipFileReader = true;
	FileReader.prototype.assertOpen = function() {
		if (this.closed) throw new Error("ZIP file reader has been disposed");
	};
	FileReader.prototype.byteAt = function(index) {
		this.assertOpen();
		var _byte = Buffer.allocUnsafe(1);
		readExactly(this.fd, _byte, 0, 1, this.zero + index);
		return _byte[0];
	};
	FileReader.prototype.readData = function(size) {
		this.assertOpen();
		this.checkOffset(size);
		var data = Buffer.allocUnsafe(size);
		readExactly(this.fd, data, 0, size, this.zero + this.index);
		this.index += size;
		return data;
	};
	FileReader.prototype.lastIndexOfSignature = function(signature) {
		this.assertOpen();
		var size = Math.min(this.length, 65558);
		var offset = this.length - size;
		var data = Buffer.allocUnsafe(size);
		readExactly(this.fd, data, 0, size, offset);
		for (var i = data.length - 4; i >= 0; i--) if (data[i] === signature.charCodeAt(0) && data[i + 1] === signature.charCodeAt(1) && data[i + 2] === signature.charCodeAt(2) && data[i + 3] === signature.charCodeAt(3)) return offset + i - this.zero;
		return -1;
	};
	FileReader.prototype.dispose = function() {
		if (this.closed) return;
		this.closed = true;
		fs$1.closeSync(this.fd);
	};
	function createFdReadStream(source, offset, size, chunkSize, disposedError) {
		if (source.closed) throw new Error(disposedError);
		if (!size) return Readable.from([]);
		var position = offset;
		var remaining = size;
		var pending = false;
		return new Readable({
			highWaterMark: chunkSize,
			read: function read() {
				var _this = this;
				if (pending) return;
				if (source.closed) {
					this.destroy(new Error(disposedError));
					return;
				}
				if (remaining <= 0) {
					this.push(null);
					return;
				}
				pending = true;
				var buffer = Buffer.allocUnsafe(Math.min(chunkSize, remaining));
				fs$1.read(source.fd, buffer, 0, buffer.length, position, function(error, count) {
					pending = false;
					if (_this.destroyed) return;
					if (source.closed) {
						_this.destroy(new Error(disposedError));
						return;
					}
					if (error) {
						_this.destroy(error);
						return;
					}
					if (!count) {
						_this.destroy(/* @__PURE__ */ new Error("Corrupted zip : unexpected end of file"));
						return;
					}
					position += count;
					remaining -= count;
					_this.push(buffer.subarray(0, count));
				});
			}
		});
	}
	FileReader.prototype.createReadStream = function(offset, size) {
		var chunkSize = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : this.chunkSize;
		return createFdReadStream(this, offset, size, chunkSize, "ZIP file reader has been disposed");
	};
	FileReader.prototype.checkCRC32 = function(entry) {
		this.assertOpen();
		var crc32 = require_crc32();
		var checksum = 0;
		var length = 0;
		function consume(chunk) {
			checksum = crc32(chunk, checksum);
			length += chunk.length;
			if (length > entry.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
		}
		var inflater = entry.compressionMethod === "\b\0" ? new (require_pako()).Inflate({
			raw: true,
			chunkSize: this.chunkSize
		}) : null;
		if (inflater) inflater.onData = consume;
		var buffer = Buffer.allocUnsafe(Math.min(this.chunkSize, entry.compressedSize));
		var offset = 0;
		while (offset < entry.compressedSize) {
			var size = Math.min(buffer.length, entry.compressedSize - offset);
			readExactly(this.fd, buffer, 0, size, entry._fileOffset + offset);
			offset += size;
			var chunk = buffer.subarray(0, size);
			if (inflater) {
				inflater.push(chunk, offset === entry.compressedSize);
				if (inflater.err) throw new Error("Corrupted zip : " + inflater.msg);
			} else consume(chunk);
		}
		if (length !== entry.uncompressedSize || inflater && !inflater.ended) throw new Error("Bug : uncompressed data size mismatch");
		if (checksum >>> 0 !== entry.crc32 >>> 0) throw new Error("Corrupted zip : CRC32 mismatch");
	};
	FileReader.createFdReadStream = createFdReadStream;
	module.exports = FileReader;
}));
//#endregion
//#region node_modules/pizzip/js/filesystem-storage.js
var require_filesystem_storage = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs = __require("node:fs");
	var os = __require("node:os");
	var path = __require("node:path");
	var CompressedObject = require_compressedObject();
	var FileReader = require_fileReader();
	function toBuffer(data) {
		if (Buffer.isBuffer(data)) return data;
		if (data instanceof Uint8Array) return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
		if (typeof data === "string") return Buffer.from(data, "binary");
		return Buffer.from(data);
	}
	function writeAll(fd, buffer, offset) {
		var written = 0;
		while (written < buffer.length) {
			var count = fs.writeSync(fd, buffer, written, buffer.length - written, offset + written);
			if (!count) throw new Error("Could not write filesystem ZIP storage");
			written += count;
		}
	}
	function readExactly(fd, buffer, offset, size) {
		var read = 0;
		while (read < size) {
			var count = fs.readSync(fd, buffer, read, size - read, offset + read);
			if (!count) throw new Error("Corrupted zip : unexpected end of file");
			read += count;
		}
	}
	function DiskData(storage, offset, size) {
		this.storage = storage;
		this.offset = offset;
		this.size = size;
		this._pizzipDiskData = true;
	}
	DiskData.prototype.getContent = function() {
		return this.storage.read(this.offset, this.size);
	};
	DiskData.prototype.createReadStream = function(chunkSize) {
		return this.storage.createReadStream(this.offset, this.size, chunkSize);
	};
	function FilesystemStorage(options) {
		this.chunkSize = require_chunk_size()(options.chunkSize);
		var directory = options.directory || os.tmpdir();
		if (!fs.statSync(directory).isDirectory()) throw new Error("Filesystem ZIP storage directory does not exist: " + directory);
		this.path = fs.mkdtempSync(path.join(directory, "pizzip-"));
		this.file = path.join(this.path, "entries");
		try {
			this.fd = fs.openSync(this.file, "wx+", 384);
		} catch (error) {
			fs.rmSync(this.path, {
				recursive: true,
				force: true
			});
			throw error;
		}
		this.size = 0;
		this.closed = false;
		this.filter = options.filter || null;
	}
	FilesystemStorage.prototype.assertOpen = function() {
		if (this.closed) throw new Error("Filesystem ZIP storage has been disposed");
	};
	FilesystemStorage.prototype.shouldStore = function(name) {
		return !this.filter || this.filter(name);
	};
	FilesystemStorage.prototype.createReadStream = function(offset, size) {
		var chunkSize = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : this.chunkSize;
		return FileReader.createFdReadStream(this, offset, size, chunkSize, "Filesystem ZIP storage has been disposed");
	};
	FilesystemStorage.prototype.write = function(data, encoding) {
		this.assertOpen();
		var offset = this.size;
		if (typeof data === "string") data = Buffer.from(data, encoding);
		var buffer = toBuffer(data);
		writeAll(this.fd, buffer, offset);
		this.size += buffer.length;
		return new DiskData(this, offset, buffer.length);
	};
	FilesystemStorage.prototype.read = function(offset, size) {
		this.assertOpen();
		var buffer = Buffer.allocUnsafe(size);
		readExactly(this.fd, buffer, offset, size);
		return buffer;
	};
	FilesystemStorage.prototype.copyFrom = function(fd, offset, size) {
		this.assertOpen();
		var destOffset = this.size;
		if (!size) return new DiskData(this, destOffset, 0);
		var buffer = Buffer.allocUnsafe(Math.min(this.chunkSize, size));
		var remaining = size;
		var src = offset;
		var dest = destOffset;
		while (remaining > 0) {
			var want = Math.min(buffer.length, remaining);
			readExactly(fd, buffer, src, want);
			writeAll(this.fd, buffer.subarray(0, want), dest);
			src += want;
			dest += want;
			remaining -= want;
		}
		this.size += size;
		return new DiskData(this, destOffset, size);
	};
	FilesystemStorage.prototype.wrapCompressed = function(diskData, source) {
		var result = CompressedObject.from(source, function() {
			return diskData.getContent();
		});
		result._fileReader = this;
		result._fileOffset = diskData.offset;
		return result;
	};
	FilesystemStorage.prototype.compressed = function(data, source) {
		return this.wrapCompressed(this.write(data), source);
	};
	FilesystemStorage.prototype.compressedFromReader = function(source) {
		source._fileReader.assertOpen();
		return this.wrapCompressed(this.copyFrom(source._fileReader.fd, source._fileOffset, source.compressedSize), source);
	};
	FilesystemStorage.prototype.dispose = function() {
		if (this.closed) return;
		this.closed = true;
		fs.closeSync(this.fd);
		fs.rmSync(this.path, {
			recursive: true,
			force: true
		});
	};
	FilesystemStorage.DiskData = DiskData;
	module.exports = FilesystemStorage;
}));
//#endregion
//#region node_modules/pizzip/js/signature.js
var require_signature = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.LOCAL_FILE_HEADER = "PK";
	exports.CENTRAL_FILE_HEADER = "PK";
	exports.CENTRAL_DIRECTORY_END = "PK";
	exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
	exports.ZIP64_CENTRAL_DIRECTORY_END = "PK";
	exports.DATA_DESCRIPTOR = "PK\x07\b";
}));
//#endregion
//#region node_modules/pizzip/js/defaults.js
var require_defaults = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.base64 = false;
	exports.binary = false;
	exports.dir = false;
	exports.createFolders = false;
	exports.date = null;
	exports.compression = null;
	exports.compressionOptions = null;
	exports.comment = null;
	exports.unixPermissions = null;
	exports.dosPermissions = null;
}));
//#endregion
//#region node_modules/pizzip/js/utf8.js
var require_utf8 = /* @__PURE__ */ __commonJSMin(((exports) => {
	var utils = require_utils();
	var support = require_support();
	var nodeBuffer = require_nodeBuffer();
	/**
	* The following functions come from pako, from pako/lib/utils/strings
	* released under the MIT license, see pako https://github.com/nodeca/pako/
	*/
	var _utf8len = new Array(256);
	for (var i = 0; i < 256; i++) _utf8len[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
	_utf8len[254] = _utf8len[254] = 1;
	function string2buf(str) {
		var buf, c, c2, mPos, i, bufLen = 0;
		var strLen = str.length;
		for (mPos = 0; mPos < strLen; mPos++) {
			c = str.charCodeAt(mPos);
			if ((c & 64512) === 55296 && mPos + 1 < strLen) {
				c2 = str.charCodeAt(mPos + 1);
				if ((c2 & 64512) === 56320) {
					c = 65536 + (c - 55296 << 10) + (c2 - 56320);
					mPos++;
				}
			}
			bufLen += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
		}
		if (support.uint8array) buf = new Uint8Array(bufLen);
		else buf = new Array(bufLen);
		for (i = 0, mPos = 0; i < bufLen; mPos++) {
			c = str.charCodeAt(mPos);
			if ((c & 64512) === 55296 && mPos + 1 < strLen) {
				c2 = str.charCodeAt(mPos + 1);
				if ((c2 & 64512) === 56320) {
					c = 65536 + (c - 55296 << 10) + (c2 - 56320);
					mPos++;
				}
			}
			if (c < 128) buf[i++] = c;
			else if (c < 2048) {
				buf[i++] = 192 | c >>> 6;
				buf[i++] = 128 | c & 63;
			} else if (c < 65536) {
				buf[i++] = 224 | c >>> 12;
				buf[i++] = 128 | c >>> 6 & 63;
				buf[i++] = 128 | c & 63;
			} else {
				buf[i++] = 240 | c >>> 18;
				buf[i++] = 128 | c >>> 12 & 63;
				buf[i++] = 128 | c >>> 6 & 63;
				buf[i++] = 128 | c & 63;
			}
		}
		return buf;
	}
	function utf8border(buf, max) {
		var pos;
		max = max || buf.length;
		if (max > buf.length) max = buf.length;
		pos = max - 1;
		while (pos >= 0 && (buf[pos] & 192) === 128) pos--;
		if (pos < 0) return max;
		if (pos === 0) return max;
		return pos + _utf8len[buf[pos]] > max ? pos : max;
	}
	function buf2string(buf) {
		var i, out, c, cLen;
		var len = buf.length;
		var utf16buf = new Array(len * 2);
		for (out = 0, i = 0; i < len;) {
			c = buf[i++];
			if (c < 128) {
				utf16buf[out++] = c;
				continue;
			}
			cLen = _utf8len[c];
			if (cLen > 4) {
				utf16buf[out++] = 65533;
				i += cLen - 1;
				continue;
			}
			c &= cLen === 2 ? 31 : cLen === 3 ? 15 : 7;
			while (cLen > 1 && i < len) {
				c = c << 6 | buf[i++] & 63;
				cLen--;
			}
			if (cLen > 1) {
				utf16buf[out++] = 65533;
				continue;
			}
			if (c < 65536) utf16buf[out++] = c;
			else {
				c -= 65536;
				utf16buf[out++] = 55296 | c >> 10 & 1023;
				utf16buf[out++] = 56320 | c & 1023;
			}
		}
		if (utf16buf.length !== out) {
			if (utf16buf.subarray) utf16buf = utf16buf.subarray(0, out);
			else utf16buf.length = out;
		}
		return utils.applyFromCharCode(utf16buf);
	}
	/**
	* Transform a javascript string into an array (typed if possible) of bytes,
	* UTF-8 encoded.
	* @param {String} str the string to encode
	* @return {Array|Uint8Array|Buffer} the UTF-8 encoded string.
	*/
	exports.utf8encode = function utf8encode(str) {
		if (support.nodebuffer) return nodeBuffer(str, "utf-8");
		return string2buf(str);
	};
	/**
	* Transform a bytes array (or a representation) representing an UTF-8 encoded
	* string into a javascript string.
	* @param {Array|Uint8Array|Buffer} buf the data de decode
	* @return {String} the decoded string.
	*/
	exports.utf8decode = function utf8decode(buf) {
		if (support.nodebuffer) return utils.transformTo("nodebuffer", buf).toString("utf-8");
		buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);
		var result = [], len = buf.length, chunk = 65536;
		var k = 0;
		while (k < len) {
			var nextBoundary = utf8border(buf, Math.min(k + chunk, len));
			if (support.uint8array) result.push(buf2string(buf.subarray(k, nextBoundary)));
			else result.push(buf2string(buf.slice(k, nextBoundary)));
			k = nextBoundary;
		}
		return result.join("");
	};
}));
//#endregion
//#region node_modules/pizzip/js/stringWriter.js
var require_stringWriter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils();
	/**
	* An object to write any content to a string.
	* @constructor
	*/
	function StringWriter() {
		this.data = [];
	}
	StringWriter.prototype = {
		/**
		* Append any content to the current string.
		* @param {Object} input the content to add.
		*/
		append: function append(input) {
			input = utils.transformTo("string", input);
			this.data.push(input);
		},
		/**
		* Finalize the construction an return the result.
		* @return {string} the generated string.
		*/
		finalize: function finalize() {
			return this.data.join("");
		}
	};
	module.exports = StringWriter;
}));
//#endregion
//#region node_modules/pizzip/js/uint8ArrayWriter.js
var require_uint8ArrayWriter = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils();
	/**
	* An object to write any content to an Uint8Array.
	* @constructor
	* @param {number} length The length of the array.
	*/
	function Uint8ArrayWriter(length) {
		this.data = new Uint8Array(length);
		this.index = 0;
	}
	Uint8ArrayWriter.prototype = {
		/**
		* Append any content to the current array.
		* @param {Object} input the content to add.
		*/
		append: function append(input) {
			if (input.length !== 0) {
				input = utils.transformTo("uint8array", input);
				this.data.set(input, this.index);
				this.index += input.length;
			}
		},
		/**
		* Finalize the construction an return the result.
		* @return {Uint8Array} the generated array.
		*/
		finalize: function finalize() {
			return this.data;
		}
	};
	module.exports = Uint8ArrayWriter;
}));
//#endregion
//#region node_modules/pizzip/js/file-order.js
var require_file_order = /* @__PURE__ */ __commonJSMin(((exports, module) => {
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
	module.exports = function fileOrder(files, order) {
		if (typeof order === "function") return order(files);
		var names = Object.keys(files);
		if (!Array.isArray(order)) return names;
		return [].concat(_toConsumableArray(order), _toConsumableArray(names.filter(function(name) {
			return !order.includes(name);
		})));
	};
}));
//#endregion
//#region node_modules/pizzip/js/object.js
var require_object = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _createForOfIteratorHelper(r, e) {
		var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (!t) {
			if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
				t && (r = t);
				var _n = 0, F = function F() {};
				return {
					s: F,
					n: function n() {
						return _n >= r.length ? { done: !0 } : {
							done: !1,
							value: r[_n++]
						};
					},
					e: function e(r) {
						throw r;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var o, a = !0, u = !1;
		return {
			s: function s() {
				t = t.call(r);
			},
			n: function n() {
				var r = t.next();
				return a = r.done, r;
			},
			e: function e(r) {
				u = !0, o = r;
			},
			f: function f() {
				try {
					a || null == t["return"] || t["return"]();
				} finally {
					if (u) throw o;
				}
			}
		};
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
	var support = require_support();
	var utils = require_utils();
	var _crc = require_crc32();
	var signature = require_signature();
	var defaults = require_defaults();
	var base64 = require_base64();
	var compressions = require_compressions();
	var CompressedObject = require_compressedObject();
	var nodeBuffer = require_nodeBuffer();
	var utf8 = require_utf8();
	var StringWriter = require_stringWriter();
	var Uint8ArrayWriter = require_uint8ArrayWriter();
	var fileOrder = require_file_order();
	/**
	* Returns the raw data of a ZipObject, decompress the content if necessary.
	* @param {ZipObject} file the file to use.
	* @return {String|ArrayBuffer|Uint8Array|Buffer} the data.
	*/
	function getRawData(file) {
		if (file._data && file._data._pizzipDiskData) return file._data.getContent();
		if (file._data instanceof CompressedObject) {
			file._data = file._data.getContent();
			file.options.binary = true;
			file.options.base64 = false;
			if (utils.getTypeOf(file._data) === "uint8array") {
				var copy = file._data;
				file._data = new Uint8Array(copy.length);
				if (copy.length !== 0) file._data.set(copy, 0);
			}
		}
		return file._data;
	}
	/**
	* Returns the data of a ZipObject in a binary form. If the content is an unicode string, encode it.
	* @param {ZipObject} file the file to use.
	* @return {String|ArrayBuffer|Uint8Array|Buffer} the data.
	*/
	function getBinaryData(file) {
		var result = getRawData(file);
		if (utils.getTypeOf(result) === "string") {
			if (!file.options.binary) {
				if (support.nodebuffer) return nodeBuffer(result, "utf-8");
			}
			return file.asBinary();
		}
		return result;
	}
	var out = {
		/**
		* Read an existing zip and merge the data in the current PizZip object.
		* The implementation is in pizzip-load.js, don't forget to include it.
		* @param {String|ArrayBuffer|Uint8Array|Buffer} stream  The stream to load
		* @param {Object} options Options for loading the stream.
		*  options.base64 : is the stream in base64 ? default : false
		* @return {PizZip} the current PizZip object
		*/
		load: function load() {
			throw new Error("Load method is not defined. Is the file pizzip-load.js included ?");
		},
		/**
		* Filter nested files/folders with the specified function.
		* @param {Function} search the predicate to use :
		* function (relativePath, file) {...}
		* It takes 2 arguments : the relative path and the file.
		* @return {Array} An array of matching elements.
		*/
		filter: function filter(search) {
			var result = [];
			var filename, relativePath, file, fileClone;
			for (filename in this.files) {
				if (!this.files.hasOwnProperty(filename)) continue;
				file = this.files[filename];
				fileClone = new ZipObject(file.name, file._data, utils.extend(file.options));
				relativePath = filename.slice(this.root.length, filename.length);
				if (filename.slice(0, this.root.length) === this.root && search(relativePath, fileClone)) result.push(fileClone);
			}
			return result;
		},
		/**
		* Add a file to the zip file, or search a file.
		* @param   {string|RegExp} name The name of the file to add (if data is defined),
		* the name of the file to find (if no data) or a regex to match files.
		* @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
		* @param   {Object} o     File options
		* @return  {PizZip|Object|Array} this PizZip object (when adding a file),
		* a file (when searching by string) or an array of files (when searching by regex).
		*/
		file: function file(name, data, o) {
			if (arguments.length === 1) {
				if (utils.isRegExp(name)) {
					var regexp = name;
					return this.filter(function(relativePath, file) {
						return !file.dir && regexp.test(relativePath);
					});
				}
				return this.filter(function(relativePath, file) {
					return !file.dir && relativePath === name;
				})[0] || null;
			}
			name = this.root + name;
			fileAdd.call(this, name, data, o);
			return this;
		},
		/**
		* Add a directory to the zip file, or search.
		* @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
		* @return  {PizZip} an object with the new directory as the root, or an array containing matching folders.
		*/
		folder: function folder(arg) {
			if (!arg) return this;
			if (utils.isRegExp(arg)) return this.filter(function(relativePath, file) {
				return file.dir && arg.test(relativePath);
			});
			var name = this.root + arg;
			var newFolder = folderAdd.call(this, name);
			var ret = this.shallowClone();
			ret.root = newFolder.name;
			return ret;
		},
		/**
		* Delete a file, or a directory and all sub-files, from the zip
		* @param {string} name the name of the file to delete
		* @return {PizZip} this PizZip object
		*/
		remove: function remove(name) {
			name = this.root + name;
			var file = this.files[name];
			if (!file) {
				if (name.slice(-1) !== "/") name += "/";
				file = this.files[name];
			}
			if (file && !file.dir) delete this.files[name];
			else {
				var kids = this.filter(function(relativePath, file) {
					return file.name.slice(0, name.length) === name;
				});
				for (var i = 0; i < kids.length; i++) delete this.files[kids[i].name];
			}
			return this;
		},
		/**
		* Generate the complete zip file
		* @param {Object} options the options to generate the zip file :
		* - base64, (deprecated, use type instead) true to generate base64.
		* - compression, "STORE" by default.
		* - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
		* @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the zip file
		*/
		generate: function generate(options) {
			options = utils.extend(options || {}, {
				base64: true,
				compression: "STORE",
				compressionOptions: null,
				type: "base64",
				platform: "DOS",
				comment: null,
				mimeType: "application/zip",
				encodeFileName: utf8.utf8encode
			});
			utils.checkSupport(options.type);
			if (options.platform === "darwin" || options.platform === "freebsd" || options.platform === "linux" || options.platform === "sunos") options.platform = "UNIX";
			if (options.platform === "win32") options.platform = "DOS";
			var zipData = [], encodedComment = utils.transformTo("string", options.encodeFileName(options.comment || this.comment || ""));
			var localDirLength = 0, centralDirLength = 0, writer, i;
			var _iterator = _createForOfIteratorHelper(fileOrder(this.files, options.fileOrder)), _step;
			try {
				for (_iterator.s(); !(_step = _iterator.n()).done;) {
					var name = _step.value;
					if (!this.files.hasOwnProperty(name)) continue;
					var file = this.files[name];
					var compressionName = file.options.compression || options.compression.toUpperCase();
					var compression = compressions[compressionName];
					if (!compression) throw new Error(compressionName + " is not a valid compression method !");
					var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
					var compressedObject = generateCompressedObjectFrom.call(this, file, compression, compressionOptions);
					var zipPart = generateZipParts.call(this, name, file, compressedObject, localDirLength, options.platform, options.encodeFileName);
					localDirLength += zipPart.fileRecord.length + compressedObject.compressedSize;
					centralDirLength += zipPart.dirRecord.length;
					zipData.push(zipPart);
				}
			} catch (err) {
				_iterator.e(err);
			} finally {
				_iterator.f();
			}
			var dirEnd = "";
			dirEnd = signature.CENTRAL_DIRECTORY_END + "\0\0\0\0" + decToHex(zipData.length, 2) + decToHex(zipData.length, 2) + decToHex(centralDirLength, 4) + decToHex(localDirLength, 4) + decToHex(encodedComment.length, 2) + encodedComment;
			var typeName = options.type.toLowerCase();
			if (typeName === "uint8array" || typeName === "arraybuffer" || typeName === "blob" || typeName === "nodebuffer") writer = new Uint8ArrayWriter(localDirLength + centralDirLength + dirEnd.length);
			else writer = new StringWriter(localDirLength + centralDirLength + dirEnd.length);
			for (i = 0; i < zipData.length; i++) {
				writer.append(zipData[i].fileRecord);
				writer.append(zipData[i].compressedObject.compressedContent);
			}
			for (i = 0; i < zipData.length; i++) writer.append(zipData[i].dirRecord);
			writer.append(dirEnd);
			var zip = writer.finalize();
			switch (options.type.toLowerCase()) {
				case "uint8array":
				case "arraybuffer":
				case "nodebuffer": return utils.transformTo(options.type.toLowerCase(), zip);
				case "blob": return utils.arrayBuffer2Blob(utils.transformTo("arraybuffer", zip), options.mimeType);
				case "base64": return options.base64 ? base64.encode(zip) : zip;
				default: return zip;
			}
		},
		/**
		* @deprecated
		* This method will be removed in a future version without replacement.
		*/
		crc32: function crc32(input, crc) {
			return _crc(input, crc);
		},
		/**
		* @deprecated
		* This method will be removed in a future version without replacement.
		*/
		utf8encode: function utf8encode(string) {
			return utils.transformTo("string", utf8.utf8encode(string));
		},
		/**
		* @deprecated
		* This method will be removed in a future version without replacement.
		*/
		utf8decode: function utf8decode(input) {
			return utf8.utf8decode(input);
		}
	};
	/**
	* Transform this._data into a string.
	* @param {function} filter a function String -> String, applied if not null on the result.
	* @return {String} the string representing this._data.
	*/
	function dataToString(asUTF8) {
		var result = getRawData(this);
		if (result === null || typeof result === "undefined") return "";
		if (this.options.base64) result = base64.decode(result);
		if (asUTF8 && this.options.binary) result = out.utf8decode(result);
		else result = utils.transformTo("string", result);
		if (!asUTF8 && !this.options.binary) result = utils.transformTo("string", out.utf8encode(result));
		return result;
	}
	/**
	* A simple object representing a file in the zip file.
	* @constructor
	* @param {string} name the name of the file
	* @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
	* @param {Object} options the options of the file
	*/
	function ZipObject(name, data, options) {
		this.name = name;
		this.dir = options.dir;
		this.date = options.date;
		this.comment = options.comment;
		this.unixPermissions = options.unixPermissions;
		this.dosPermissions = options.dosPermissions;
		this._data = data;
		this.options = options;
		this._initialMetadata = {
			dir: options.dir,
			date: options.date
		};
	}
	ZipObject.prototype = {
		/**
		* Return the content as UTF8 string.
		* @return {string} the UTF8 string.
		*/
		asText: function asText() {
			return dataToString.call(this, true);
		},
		/**
		* Returns the binary content.
		* @return {string} the content as binary.
		*/
		asBinary: function asBinary() {
			return dataToString.call(this, false);
		},
		/**
		* Returns the content as a nodejs Buffer.
		* @return {Buffer} the content as a Buffer.
		*/
		asNodeBuffer: function asNodeBuffer() {
			var result = getBinaryData(this);
			return utils.transformTo("nodebuffer", result);
		},
		/**
		* Returns the content as an Uint8Array.
		* @return {Uint8Array} the content as an Uint8Array.
		*/
		asUint8Array: function asUint8Array() {
			var result = getBinaryData(this);
			return utils.transformTo("uint8array", result);
		},
		/**
		* Returns the content as an ArrayBuffer.
		* @return {ArrayBuffer} the content as an ArrayBufer.
		*/
		asArrayBuffer: function asArrayBuffer() {
			return this.asUint8Array().buffer;
		}
	};
	/**
	* Transform an integer into a string in hexadecimal.
	* @private
	* @param {number} dec the number to convert.
	* @param {number} bytes the number of bytes to generate.
	* @returns {string} the result.
	*/
	function decToHex(dec, bytes) {
		var hex = "", i = 0;
		for (; i < bytes; i++) {
			hex += String.fromCharCode(dec & 255);
			dec >>>= 8;
		}
		return hex;
	}
	/**
	* Transforms the (incomplete) options from the user into the complete
	* set of options to create a file.
	* @private
	* @param {Object} o the options from the user.
	* @return {Object} the complete set of options.
	*/
	function prepareFileAttrs(o) {
		o = o || {};
		if (o.base64 === true && (o.binary === null || o.binary === void 0)) o.binary = true;
		o = utils.extend(o, defaults);
		o.date = o.date || /* @__PURE__ */ new Date();
		if (typeof o.compression === "string") o.compression = o.compression.toUpperCase();
		else o.compression = null;
		return o;
	}
	function copyCompressed(source) {
		var copy = new Uint8Array(utils.transformTo("uint8array", source.getCompressedContent()));
		return CompressedObject.from(source, function() {
			return copy;
		});
	}
	function persistData(storage, name, data, o) {
		if (data instanceof CompressedObject) {
			if (storage.shouldStore(name)) return data._fileReader ? storage.compressedFromReader(data) : storage.compressed(data.getCompressedContent(), data);
			if (!data._fileReader) return copyCompressed(data);
			return data;
		}
		if (!storage.shouldStore(name)) return data;
		var storageEncoding = "utf-8";
		if (typeof data === "string") {
			if (o.base64) {
				data = base64.decode(data);
				storageEncoding = "binary";
			} else if (o.binary) storageEncoding = "binary";
		}
		o.base64 = false;
		o.binary = true;
		return storage.write(data, typeof data === "string" ? storageEncoding : null);
	}
	/**
	* Add a file in the current folder.
	* @private
	* @param {string} name the name of the file
	* @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file
	* @param {Object} o the options of the file
	* @return {Object} the new file.
	*/
	function fileAdd(name, data, o) {
		var dataType = utils.getTypeOf(data), parent;
		o = prepareFileAttrs(o);
		if (typeof o.unixPermissions === "string") o.unixPermissions = parseInt(o.unixPermissions, 8);
		if (o.unixPermissions && o.unixPermissions & 16384) o.dir = true;
		if (o.dosPermissions && o.dosPermissions & 16) o.dir = true;
		if (o.dir) name = forceTrailingSlash(name);
		if (o.createFolders && (parent = parentFolder(name))) folderAdd.call(this, parent, true);
		if (o.dir || data === null || typeof data === "undefined") {
			o.base64 = false;
			o.binary = false;
			data = null;
			dataType = null;
		} else if (dataType === "string") {
			if (o.binary && !o.base64) {
				if (o.optimizedBinaryString !== true) data = utils.string2binary(data);
			}
		} else {
			o.base64 = false;
			o.binary = true;
			if (!dataType && !(data instanceof CompressedObject) && !(data && data._pizzipDiskData)) throw new Error("The data of '" + name + "' is in an unsupported format !");
			if (dataType === "arraybuffer") data = utils.transformTo("uint8array", data);
		}
		if (this._storage && data !== null) data = persistData(this._storage, name, data, o);
		var object = new ZipObject(name, data, o);
		this.files[name] = object;
		return object;
	}
	/**
	* Find the parent folder of the path.
	* @private
	* @param {string} path the path to use
	* @return {string} the parent folder, or ""
	*/
	function parentFolder(path) {
		if (path.slice(-1) === "/") path = path.substring(0, path.length - 1);
		var lastSlash = path.lastIndexOf("/");
		return lastSlash > 0 ? path.substring(0, lastSlash) : "";
	}
	/**
	* Returns the path with a slash at the end.
	* @private
	* @param {String} path the path to check.
	* @return {String} the path with a trailing slash.
	*/
	function forceTrailingSlash(path) {
		if (path.slice(-1) !== "/") path += "/";
		return path;
	}
	/**
	* Add a (sub) folder in the current folder.
	* @private
	* @param {string} name the folder's name
	* @param {boolean=} [createFolders] If true, automatically create sub
	*  folders. Defaults to false.
	* @return {Object} the new folder.
	*/
	function folderAdd(name, createFolders) {
		createFolders = typeof createFolders !== "undefined" ? createFolders : false;
		name = forceTrailingSlash(name);
		if (!this.files[name]) fileAdd.call(this, name, null, {
			dir: true,
			createFolders
		});
		return this.files[name];
	}
	/**
	* Generate a PizZip.CompressedObject for a given zipOject.
	* @param {ZipObject} file the object to read.
	* @param {PizZip.compression} compression the compression to use.
	* @param {Object} compressionOptions the options to use when compressing.
	* @return {PizZip.CompressedObject} the compressed result.
	*/
	function generateCompressedObjectFrom(file, compression, compressionOptions) {
		var result = new CompressedObject();
		var content;
		if (file._data instanceof CompressedObject) {
			result.uncompressedSize = file._data.uncompressedSize;
			result.crc32 = file._data.crc32;
			if (result.uncompressedSize === 0 || file.dir) {
				compression = compressions.STORE;
				result.compressedContent = "";
				result.crc32 = 0;
			} else if (file._data.compressionMethod === compression.magic) result.compressedContent = file._data.getCompressedContent();
			else {
				content = file._data.getContent();
				result.compressedContent = compression.compress(utils.transformTo(compression.compressInputType, content), compressionOptions);
			}
		} else {
			content = getBinaryData(file);
			if (!content || content.length === 0 || file.dir) {
				compression = compressions.STORE;
				content = "";
			}
			result.uncompressedSize = content.length;
			result.crc32 = _crc(content);
			result.compressedContent = compression.compress(utils.transformTo(compression.compressInputType, content), compressionOptions);
		}
		result.compressedSize = result.compressedContent.length;
		result.compressionMethod = compression.magic;
		return result;
	}
	/**
	* Generate the UNIX part of the external file attributes.
	* @param {Object} unixPermissions the unix permissions or null.
	* @param {Boolean} isDir true if the entry is a directory, false otherwise.
	* @return {Number} a 32 bit integer.
	*
	* adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :
	*
	* TTTTsstrwxrwxrwx0000000000ADVSHR
	* ^^^^____________________________ file type, see zipinfo.c (UNX_*)
	*     ^^^_________________________ setuid, setgid, sticky
	*        ^^^^^^^^^________________ permissions
	*                 ^^^^^^^^^^______ not used ?
	*                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only
	*/
	function generateUnixExternalFileAttr(unixPermissions, isDir) {
		var result = unixPermissions;
		if (!unixPermissions) result = isDir ? 16893 : 33204;
		return (result & 65535) << 16;
	}
	/**
	* Generate the DOS part of the external file attributes.
	* @param {Object} dosPermissions the dos permissions or null.
	* @param {Boolean} isDir true if the entry is a directory, false otherwise.
	* @return {Number} a 32 bit integer.
	*
	* Bit 0     Read-Only
	* Bit 1     Hidden
	* Bit 2     System
	* Bit 3     Volume Label
	* Bit 4     Directory
	* Bit 5     Archive
	*/
	function generateDosExternalFileAttr(dosPermissions) {
		return (dosPermissions || 0) & 63;
	}
	/**
	* Generate the various parts used in the construction of the final zip file.
	* @param {string} name the file name.
	* @param {ZipObject} file the file content.
	* @param {PizZip.CompressedObject} compressedObject the compressed object.
	* @param {number} offset the current offset from the start of the zip file.
	* @param {String} platform let's pretend we are this platform (change platform dependents fields)
	* @param {Function} encodeFileName the function to encode the file name / comment.
	* @return {object} the zip parts.
	*/
	function generateZipParts(name, file, compressedObject, offset, platform, encodeFileName) {
		var useCustomEncoding = encodeFileName !== utf8.utf8encode, encodedFileName = utils.transformTo("string", encodeFileName(file.name)), utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)), comment = file.comment || "", encodedComment = utils.transformTo("string", encodeFileName(comment)), utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)), useUTF8ForFileName = utfEncodedFileName.length !== file.name.length, useUTF8ForComment = utfEncodedComment.length !== comment.length, o = file.options;
		var dosTime, dosDate, extraFields = "", unicodePathExtraField = "", unicodeCommentExtraField = "", dir, date;
		if (file._initialMetadata.dir !== file.dir) dir = file.dir;
		else dir = o.dir;
		if (file._initialMetadata.date !== file.date) date = file.date;
		else date = o.date;
		var extFileAttr = 0;
		var versionMadeBy = 0;
		if (dir) extFileAttr |= 16;
		if (platform === "UNIX") {
			versionMadeBy = 798;
			extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
		} else {
			versionMadeBy = 20;
			extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
		}
		dosTime = date.getHours();
		dosTime <<= 6;
		dosTime |= date.getMinutes();
		dosTime <<= 5;
		dosTime |= date.getSeconds() / 2;
		dosDate = date.getFullYear() - 1980;
		dosDate <<= 4;
		dosDate |= date.getMonth() + 1;
		dosDate <<= 5;
		dosDate |= date.getDate();
		if (useUTF8ForFileName) {
			unicodePathExtraField = decToHex(1, 1) + decToHex(_crc(encodedFileName), 4) + utfEncodedFileName;
			extraFields += "up" + decToHex(unicodePathExtraField.length, 2) + unicodePathExtraField;
		}
		if (useUTF8ForComment) {
			unicodeCommentExtraField = decToHex(1, 1) + decToHex(this.crc32(encodedComment), 4) + utfEncodedComment;
			extraFields += "uc" + decToHex(unicodeCommentExtraField.length, 2) + unicodeCommentExtraField;
		}
		var header = "";
		header += "\n\0";
		header += !useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment) ? "\0\b" : "\0\0";
		header += compressedObject.compressionMethod;
		header += decToHex(dosTime, 2);
		header += decToHex(dosDate, 2);
		header += decToHex(compressedObject.crc32, 4);
		header += decToHex(compressedObject.compressedSize, 4);
		header += decToHex(compressedObject.uncompressedSize, 4);
		header += decToHex(encodedFileName.length, 2);
		header += decToHex(extraFields.length, 2);
		return {
			fileRecord: signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields,
			dirRecord: signature.CENTRAL_FILE_HEADER + decToHex(versionMadeBy, 2) + header + decToHex(encodedComment.length, 2) + "\0\0\0\0" + decToHex(extFileAttr, 4) + decToHex(offset, 4) + encodedFileName + extraFields + encodedComment,
			compressedObject
		};
	}
	module.exports = out;
}));
//#endregion
//#region node_modules/pizzip/js/stringReader.js
var require_stringReader = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DataReader = require_dataReader();
	var utils = require_utils();
	function StringReader(data, optimizedBinaryString) {
		this.data = data;
		if (!optimizedBinaryString) this.data = utils.string2binary(this.data);
		this.length = this.data.length;
		this.index = 0;
		this.zero = 0;
	}
	StringReader.prototype = new DataReader();
	/**
	* @see DataReader.byteAt
	*/
	StringReader.prototype.byteAt = function(i) {
		return this.data.charCodeAt(this.zero + i);
	};
	/**
	* @see DataReader.lastIndexOfSignature
	*/
	StringReader.prototype.lastIndexOfSignature = function(sig) {
		return this.data.lastIndexOf(sig) - this.zero;
	};
	/**
	* @see DataReader.readData
	*/
	StringReader.prototype.readData = function(size) {
		this.checkOffset(size);
		var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
		this.index += size;
		return result;
	};
	module.exports = StringReader;
}));
//#endregion
//#region node_modules/pizzip/js/arrayReader.js
var require_arrayReader = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var DataReader = require_dataReader();
	function ArrayReader(data) {
		if (data) {
			this.data = data;
			this.length = this.data.length;
			this.index = 0;
			this.zero = 0;
			for (var i = 0; i < this.data.length; i++) data[i] &= data[i];
		}
	}
	ArrayReader.prototype = new DataReader();
	/**
	* @see DataReader.byteAt
	*/
	ArrayReader.prototype.byteAt = function(i) {
		return this.data[this.zero + i];
	};
	/**
	* @see DataReader.lastIndexOfSignature
	*/
	ArrayReader.prototype.lastIndexOfSignature = function(sig) {
		var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3);
		for (var i = this.length - 4; i >= 0; --i) if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) return i - this.zero;
		return -1;
	};
	/**
	* @see DataReader.readData
	*/
	ArrayReader.prototype.readData = function(size) {
		this.checkOffset(size);
		if (size === 0) return [];
		var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
		this.index += size;
		return result;
	};
	module.exports = ArrayReader;
}));
//#endregion
//#region node_modules/pizzip/js/uint8ArrayReader.js
var require_uint8ArrayReader = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ArrayReader = require_arrayReader();
	function Uint8ArrayReader(data) {
		if (data) {
			this.data = data;
			this.length = this.data.length;
			this.index = 0;
			this.zero = 0;
		}
	}
	Uint8ArrayReader.prototype = new ArrayReader();
	/**
	* @see DataReader.readData
	*/
	Uint8ArrayReader.prototype.readData = function(size) {
		this.checkOffset(size);
		if (size === 0) return /* @__PURE__ */ new Uint8Array(0);
		var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
		this.index += size;
		return result;
	};
	module.exports = Uint8ArrayReader;
}));
//#endregion
//#region node_modules/pizzip/js/nodeBufferReader.js
var require_nodeBufferReader = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var Uint8ArrayReader = require_uint8ArrayReader();
	function NodeBufferReader(data) {
		this.data = data;
		this.length = this.data.length;
		this.index = 0;
		this.zero = 0;
	}
	NodeBufferReader.prototype = new Uint8ArrayReader();
	/**
	* @see DataReader.readData
	*/
	NodeBufferReader.prototype.readData = function(size) {
		this.checkOffset(size);
		var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
		this.index += size;
		return result;
	};
	module.exports = NodeBufferReader;
}));
//#endregion
//#region node_modules/pizzip/js/zipEntry.js
var require_zipEntry = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var StringReader = require_stringReader();
	var utils = require_utils();
	var CompressedObject = require_compressedObject();
	var pizzipProto = require_object();
	var support = require_support();
	var MADE_BY_DOS = 0;
	var MADE_BY_UNIX = 3;
	/**
	* An entry in the zip file.
	* @constructor
	* @param {Object} options Options of the current file.
	* @param {Object} loadOptions Options for loading the stream.
	*/
	function ZipEntry(options, loadOptions) {
		this.options = options;
		this.loadOptions = loadOptions;
	}
	ZipEntry.prototype = {
		/**
		* say if the file is encrypted.
		* @return {boolean} true if the file is encrypted, false otherwise.
		*/
		isEncrypted: function isEncrypted() {
			return (this.bitFlag & 1) === 1;
		},
		/**
		* say if the file has utf-8 filename/comment.
		* @return {boolean} true if the filename/comment is in utf-8, false otherwise.
		*/
		useUTF8: function useUTF8() {
			return (this.bitFlag & 2048) === 2048;
		},
		/**
		* Prepare the function used to generate the compressed content from this ZipFile.
		* @param {DataReader} reader the reader to use.
		* @param {number} from the offset from where we should read the data.
		* @param {number} length the length of the data to read.
		* @return {Function} the callback to get the compressed content (the type depends of the DataReader class).
		*/
		prepareCompressedContent: function prepareCompressedContent(reader, from, length) {
			return function() {
				var previousIndex = reader.index;
				reader.setIndex(from);
				var compressedFileData = reader.readData(length);
				reader.setIndex(previousIndex);
				return compressedFileData;
			};
		},
		/**
		* Prepare the function used to generate the uncompressed content from this ZipFile.
		* @param {DataReader} reader the reader to use.
		* @param {number} from the offset from where we should read the data.
		* @param {number} length the length of the data to read.
		* @param {PizZip.compression} compression the compression used on this file.
		* @param {number} uncompressedSize the uncompressed size to expect.
		* @return {Function} the callback to get the uncompressed content (the type depends of the DataReader class).
		*/
		prepareContent: function prepareContent(reader, from, length, compression, uncompressedSize) {
			return function() {
				var compressedFileData = utils.transformTo(compression.uncompressInputType, this.getCompressedContent());
				var uncompressedFileData = compression.uncompress(compressedFileData);
				if (uncompressedFileData.length !== uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
				return uncompressedFileData;
			};
		},
		/**
		* Read the local part of a zip file and add the info in this object.
		* @param {DataReader} reader the reader to use.
		*/
		readLocalPart: function readLocalPart(reader) {
			reader.skip(22);
			this.fileNameLength = reader.readInt(2);
			var localExtraFieldsLength = reader.readInt(2);
			this.fileName = reader.readData(this.fileNameLength);
			reader.skip(localExtraFieldsLength);
			if (this.compressedSize === -1 || this.uncompressedSize === -1) throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");
			var compression = utils.findCompression(this.compressionMethod);
			if (compression === null) throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
			this.decompressed = new CompressedObject();
			this.decompressed.compressedSize = this.compressedSize;
			this.decompressed.uncompressedSize = this.uncompressedSize;
			this.decompressed.crc32 = this.crc32;
			this.decompressed.compressionMethod = this.compressionMethod;
			this.decompressed.getCompressedContent = this.prepareCompressedContent(reader, reader.index, this.compressedSize, compression);
			this.decompressed.getContent = this.prepareContent(reader, reader.index, this.compressedSize, compression, this.uncompressedSize);
			if (reader._pizzipFileReader) {
				if (this.compressedSize < 0 || this.uncompressedSize < 0) throw new Error("Corrupted zip : invalid entry size");
				reader.checkOffset(this.compressedSize);
				this.decompressed._fileReader = reader;
				this.decompressed._fileOffset = reader.zero + reader.index;
			}
			if (this.loadOptions.checkCRC32) {
				if (reader.checkCRC32) {
					reader.checkCRC32(this.decompressed);
					return;
				}
				this.decompressed = utils.transformTo("string", this.decompressed.getContent());
				if (pizzipProto.crc32(this.decompressed) !== this.crc32) throw new Error("Corrupted zip : CRC32 mismatch");
			}
		},
		/**
		* Read the central part of a zip file and add the info in this object.
		* @param {DataReader} reader the reader to use.
		*/
		readCentralPart: function readCentralPart(reader) {
			this.versionMadeBy = reader.readInt(2);
			this.versionNeeded = reader.readInt(2);
			this.bitFlag = reader.readInt(2);
			this.compressionMethod = reader.readString(2);
			this.date = reader.readDate();
			this.crc32 = reader.readInt(4);
			this.compressedSize = reader.readInt(4);
			this.uncompressedSize = reader.readInt(4);
			this.fileNameLength = reader.readInt(2);
			this.extraFieldsLength = reader.readInt(2);
			this.fileCommentLength = reader.readInt(2);
			this.diskNumberStart = reader.readInt(2);
			this.internalFileAttributes = reader.readInt(2);
			this.externalFileAttributes = reader.readInt(4);
			this.localHeaderOffset = reader.readInt(4);
			if (this.isEncrypted()) throw new Error("Encrypted zip are not supported");
			this.fileName = reader.readData(this.fileNameLength);
			this.readExtraFields(reader);
			this.parseZIP64ExtraField(reader);
			this.fileComment = reader.readData(this.fileCommentLength);
		},
		/**
		* Parse the external file attributes and get the unix/dos permissions.
		*/
		processAttributes: function processAttributes() {
			this.unixPermissions = null;
			this.dosPermissions = null;
			var madeBy = this.versionMadeBy >> 8;
			this.dir = !!(this.externalFileAttributes & 16);
			if (madeBy === MADE_BY_DOS) this.dosPermissions = this.externalFileAttributes & 63;
			if (madeBy === MADE_BY_UNIX) this.unixPermissions = this.externalFileAttributes >> 16 & 65535;
			if (!this.dir && this.fileNameStr.slice(-1) === "/") this.dir = true;
		},
		/**
		* Parse the ZIP64 extra field and merge the info in the current ZipEntry.
		*/
		parseZIP64ExtraField: function parseZIP64ExtraField() {
			if (!this.extraFields[1]) return;
			var extraReader = new StringReader(this.extraFields[1].value);
			if (this.uncompressedSize === utils.MAX_VALUE_32BITS) this.uncompressedSize = extraReader.readInt(8);
			if (this.compressedSize === utils.MAX_VALUE_32BITS) this.compressedSize = extraReader.readInt(8);
			if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) this.localHeaderOffset = extraReader.readInt(8);
			if (this.diskNumberStart === utils.MAX_VALUE_32BITS) this.diskNumberStart = extraReader.readInt(4);
		},
		/**
		* Read the central part of a zip file and add the info in this object.
		* @param {DataReader} reader the reader to use.
		*/
		readExtraFields: function readExtraFields(reader) {
			var start = reader.index;
			var extraFieldId, extraFieldLength, extraFieldValue;
			this.extraFields = this.extraFields || {};
			while (reader.index < start + this.extraFieldsLength) {
				extraFieldId = reader.readInt(2);
				extraFieldLength = reader.readInt(2);
				extraFieldValue = reader.readString(extraFieldLength);
				this.extraFields[extraFieldId] = {
					id: extraFieldId,
					length: extraFieldLength,
					value: extraFieldValue
				};
			}
		},
		/**
		* Apply an UTF8 transformation if needed.
		*/
		handleUTF8: function handleUTF8() {
			var decodeParamType = support.uint8array ? "uint8array" : "array";
			if (this.useUTF8()) {
				this.fileNameStr = pizzipProto.utf8decode(this.fileName);
				this.fileCommentStr = pizzipProto.utf8decode(this.fileComment);
			} else {
				var upath = this.findExtraFieldUnicodePath();
				if (upath !== null) this.fileNameStr = upath;
				else {
					var fileNameByteArray = utils.transformTo(decodeParamType, this.fileName);
					this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
				}
				var ucomment = this.findExtraFieldUnicodeComment();
				if (ucomment !== null) this.fileCommentStr = ucomment;
				else {
					var commentByteArray = utils.transformTo(decodeParamType, this.fileComment);
					this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
				}
			}
		},
		/**
		* Find the unicode path declared in the extra field, if any.
		* @return {String} the unicode path, null otherwise.
		*/
		findExtraFieldUnicodePath: function findExtraFieldUnicodePath() {
			var upathField = this.extraFields[28789];
			if (upathField) {
				var extraReader = new StringReader(upathField.value);
				if (extraReader.readInt(1) !== 1) return null;
				if (pizzipProto.crc32(this.fileName) !== extraReader.readInt(4)) return null;
				return pizzipProto.utf8decode(extraReader.readString(upathField.length - 5));
			}
			return null;
		},
		/**
		* Find the unicode comment declared in the extra field, if any.
		* @return {String} the unicode comment, null otherwise.
		*/
		findExtraFieldUnicodeComment: function findExtraFieldUnicodeComment() {
			var ucommentField = this.extraFields[25461];
			if (ucommentField) {
				var extraReader = new StringReader(ucommentField.value);
				if (extraReader.readInt(1) !== 1) return null;
				if (pizzipProto.crc32(this.fileComment) !== extraReader.readInt(4)) return null;
				return pizzipProto.utf8decode(extraReader.readString(ucommentField.length - 5));
			}
			return null;
		}
	};
	module.exports = ZipEntry;
}));
//#endregion
//#region node_modules/pizzip/js/zipEntries.js
var require_zipEntries = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var StringReader = require_stringReader();
	var NodeBufferReader = require_nodeBufferReader();
	var Uint8ArrayReader = require_uint8ArrayReader();
	var ArrayReader = require_arrayReader();
	var utils = require_utils();
	var sig = require_signature();
	var ZipEntry = require_zipEntry();
	var support = require_support();
	/**
	* All the entries in the zip file.
	* @constructor
	* @param {String|ArrayBuffer|Uint8Array} data the binary stream to load.
	* @param {Object} loadOptions Options for loading the stream.
	*/
	function ZipEntries(data, loadOptions) {
		this.files = [];
		this.loadOptions = loadOptions;
		if (data) this.load(data);
	}
	ZipEntries.prototype = {
		/**
		* Check that the reader is on the speficied signature.
		* @param {string} expectedSignature the expected signature.
		* @throws {Error} if it is an other signature.
		*/
		checkSignature: function checkSignature(expectedSignature) {
			var signature = this.reader.readString(4);
			if (signature !== expectedSignature) throw new Error("Corrupted zip or bug : unexpected signature (" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
		},
		/**
		* Check if the given signature is at the given index.
		* @param {number} askedIndex the index to check.
		* @param {string} expectedSignature the signature to expect.
		* @return {boolean} true if the signature is here, false otherwise.
		*/
		isSignature: function isSignature(askedIndex, expectedSignature) {
			var currentIndex = this.reader.index;
			this.reader.setIndex(askedIndex);
			var result = this.reader.readString(4) === expectedSignature;
			this.reader.setIndex(currentIndex);
			return result;
		},
		/**
		* Read the end of the central directory.
		*/
		readBlockEndOfCentral: function readBlockEndOfCentral() {
			this.diskNumber = this.reader.readInt(2);
			this.diskWithCentralDirStart = this.reader.readInt(2);
			this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
			this.centralDirRecords = this.reader.readInt(2);
			this.centralDirSize = this.reader.readInt(4);
			this.centralDirOffset = this.reader.readInt(4);
			this.zipCommentLength = this.reader.readInt(2);
			var zipComment = this.reader.readData(this.zipCommentLength);
			var decodeParamType = support.uint8array ? "uint8array" : "array";
			var decodeContent = utils.transformTo(decodeParamType, zipComment);
			this.zipComment = this.loadOptions.decodeFileName(decodeContent);
		},
		/**
		* Read the end of the Zip 64 central directory.
		* Not merged with the method readEndOfCentral :
		* The end of central can coexist with its Zip64 brother,
		* I don't want to read the wrong number of bytes !
		*/
		readBlockZip64EndOfCentral: function readBlockZip64EndOfCentral() {
			this.zip64EndOfCentralSize = this.reader.readInt(8);
			this.versionMadeBy = this.reader.readString(2);
			this.versionNeeded = this.reader.readInt(2);
			this.diskNumber = this.reader.readInt(4);
			this.diskWithCentralDirStart = this.reader.readInt(4);
			this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
			this.centralDirRecords = this.reader.readInt(8);
			this.centralDirSize = this.reader.readInt(8);
			this.centralDirOffset = this.reader.readInt(8);
			this.zip64ExtensibleData = {};
			var extraDataSize = this.zip64EndOfCentralSize - 44;
			var index = 0;
			var extraFieldId, extraFieldLength, extraFieldValue;
			while (index < extraDataSize) {
				extraFieldId = this.reader.readInt(2);
				extraFieldLength = this.reader.readInt(4);
				extraFieldValue = this.reader.readString(extraFieldLength);
				this.zip64ExtensibleData[extraFieldId] = {
					id: extraFieldId,
					length: extraFieldLength,
					value: extraFieldValue
				};
			}
		},
		/**
		* Read the end of the Zip 64 central directory locator.
		*/
		readBlockZip64EndOfCentralLocator: function readBlockZip64EndOfCentralLocator() {
			this.diskWithZip64CentralDirStart = this.reader.readInt(4);
			this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
			this.disksCount = this.reader.readInt(4);
			if (this.disksCount > 1) throw new Error("Multi-volumes zip are not supported");
		},
		/**
		* Read the local files, based on the offset read in the central part.
		*/
		readLocalFiles: function readLocalFiles() {
			var i = 0, file;
			for (; i < this.files.length; i++) {
				file = this.files[i];
				this.reader.setIndex(file.localHeaderOffset);
				this.checkSignature(sig.LOCAL_FILE_HEADER);
				file.readLocalPart(this.reader);
				file.handleUTF8();
				file.processAttributes();
			}
		},
		/**
		* Read the central directory.
		*/
		readCentralDir: function readCentralDir() {
			var file;
			this.reader.setIndex(this.centralDirOffset);
			while (this.reader.readString(4) === sig.CENTRAL_FILE_HEADER) {
				file = new ZipEntry({ zip64: this.zip64 }, this.loadOptions);
				file.readCentralPart(this.reader);
				this.files.push(file);
			}
			if (this.centralDirRecords !== this.files.length) {
				if (this.centralDirRecords !== 0 && this.files.length === 0) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
			}
		},
		/**
		* Read the end of central directory.
		*/
		readEndOfCentral: function readEndOfCentral() {
			var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
			if (offset < 0) {
				if (!this.isSignature(0, sig.LOCAL_FILE_HEADER)) throw new Error("Can't find end of central directory : is this a zip file ?");
				else throw new Error("Corrupted zip : can't find end of central directory");
			}
			this.reader.setIndex(offset);
			var endOfCentralDirOffset = offset;
			this.checkSignature(sig.CENTRAL_DIRECTORY_END);
			this.readBlockEndOfCentral();
			if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
				this.zip64 = true;
				offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
				if (offset < 0) throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");
				this.reader.setIndex(offset);
				this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
				this.readBlockZip64EndOfCentralLocator();
				if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
					this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
					if (this.relativeOffsetEndOfZip64CentralDir < 0) throw new Error("Corrupted zip : can't find the ZIP64 end of central directory");
				}
				this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
				this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
				this.readBlockZip64EndOfCentral();
			}
			var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
			if (this.zip64) {
				expectedEndOfCentralDirOffset += 20;
				expectedEndOfCentralDirOffset += 12 + this.zip64EndOfCentralSize;
			}
			var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;
			if (extraBytes > 0) {
				if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {} else this.reader.zero = extraBytes;
			} else if (extraBytes < 0) throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
		},
		prepareReader: function prepareReader(data) {
			if (data && data._pizzipFileReader) {
				this.reader = data;
				return;
			}
			var type = utils.getTypeOf(data);
			utils.checkSupport(type);
			if (type === "string" && !support.uint8array) this.reader = new StringReader(data, this.loadOptions.optimizedBinaryString);
			else if (type === "nodebuffer") this.reader = new NodeBufferReader(data);
			else if (support.uint8array) this.reader = new Uint8ArrayReader(utils.transformTo("uint8array", data));
			else if (support.array) this.reader = new ArrayReader(utils.transformTo("array", data));
			else throw new Error("Unexpected error: unsupported type '" + type + "'");
		},
		/**
		* Read a zip file and create ZipEntries.
		* @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
		*/
		load: function load(data) {
			this.prepareReader(data);
			this.readEndOfCentral();
			this.readCentralDir();
			this.readLocalFiles();
		}
	};
	module.exports = ZipEntries;
}));
//#endregion
//#region node_modules/pizzip/js/load.js
var require_load = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var base64 = require_base64();
	var utf8 = require_utf8();
	var utils = require_utils();
	var ZipEntries = require_zipEntries();
	module.exports = function(data, options) {
		var i, input;
		options = utils.extend(options || {}, {
			base64: false,
			checkCRC32: false,
			optimizedBinaryString: false,
			createFolders: false,
			decodeFileName: utf8.utf8decode
		});
		if (options.base64) data = base64.decode(data);
		var zipEntries = new ZipEntries(data, options);
		var files = zipEntries.files;
		for (i = 0; i < files.length; i++) {
			input = files[i];
			this.file(input.fileNameStr, input.decompressed, {
				binary: true,
				optimizedBinaryString: true,
				date: input.date,
				dir: input.dir,
				comment: input.fileCommentStr.length ? input.fileCommentStr : null,
				unixPermissions: input.unixPermissions,
				dosPermissions: input.dosPermissions,
				createFolders: options.createFolders
			});
		}
		if (zipEntries.zipComment.length) this.comment = zipEntries.zipComment;
		return this;
	};
}));
//#endregion
//#region node_modules/pizzip/js/loadFile.js
var require_loadFile = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var FileReader = require_fileReader();
	module.exports = function(file, options) {
		var reader = new FileReader(file, { chunkSize: options && options.chunkSize !== void 0 ? options.chunkSize : this._chunkSize });
		var snapshot = Object.assign({}, this.files);
		var comment = this.comment;
		try {
			this.load(reader, options);
			this._readers.add(reader);
			return this;
		} catch (error) {
			for (var _i = 0, _Object$keys = Object.keys(this.files); _i < _Object$keys.length; _i++) {
				var name = _Object$keys[_i];
				delete this.files[name];
			}
			Object.assign(this.files, snapshot);
			this.comment = comment;
			reader.dispose();
			throw error;
		}
	};
}));
//#endregion
//#region node_modules/pizzip/js/deprecatedPublicUtils.js
var require_deprecatedPublicUtils = /* @__PURE__ */ __commonJSMin(((exports) => {
	var utils = require_utils();
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.string2binary = function(str) {
		return utils.string2binary(str);
	};
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.string2Uint8Array = function(str) {
		return utils.transformTo("uint8array", str);
	};
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.uint8Array2String = function(array) {
		return utils.transformTo("string", array);
	};
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.string2Blob = function(str) {
		var buffer = utils.transformTo("arraybuffer", str);
		return utils.arrayBuffer2Blob(buffer);
	};
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.arrayBuffer2Blob = function(buffer) {
		return utils.arrayBuffer2Blob(buffer);
	};
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.transformTo = function(outputType, input) {
		return utils.transformTo(outputType, input);
	};
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.getTypeOf = function(input) {
		return utils.getTypeOf(input);
	};
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.checkSupport = function(type) {
		return utils.checkSupport(type);
	};
	/**
	* @deprecated
	* This value will be removed in a future version without replacement.
	*/
	exports.MAX_VALUE_16BITS = utils.MAX_VALUE_16BITS;
	/**
	* @deprecated
	* This value will be removed in a future version without replacement.
	*/
	exports.MAX_VALUE_32BITS = utils.MAX_VALUE_32BITS;
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.pretty = function(str) {
		return utils.pretty(str);
	};
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.findCompression = function(compressionMethod) {
		return utils.findCompression(compressionMethod);
	};
	/**
	* @deprecated
	* This function will be removed in a future version without replacement.
	*/
	exports.isRegExp = function(object) {
		return utils.isRegExp(object);
	};
}));
//#endregion
//#region node_modules/pizzip/js/node-stream.js
var require_node_stream = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _createForOfIteratorHelper(r, e) {
		var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (!t) {
			if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
				t && (r = t);
				var _n = 0, F = function F() {};
				return {
					s: F,
					n: function n() {
						return _n >= r.length ? { done: !0 } : {
							done: !1,
							value: r[_n++]
						};
					},
					e: function e(r) {
						throw r;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var o, a = !0, u = !1;
		return {
			s: function s() {
				t = t.call(r);
			},
			n: function n() {
				var r = t.next();
				return a = r.done, r;
			},
			e: function e(r) {
				u = !0, o = r;
			},
			f: function f() {
				try {
					a || null == t["return"] || t["return"]();
				} finally {
					if (u) throw o;
				}
			}
		};
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
	function _regeneratorRuntime() {
		"use strict";
		var r = _regenerator(), e = r.m(_regeneratorRuntime), t = (Object.getPrototypeOf ? Object.getPrototypeOf(e) : e.__proto__).constructor;
		function n(r) {
			var e = "function" == typeof r && r.constructor;
			return !!e && (e === t || "GeneratorFunction" === (e.displayName || e.name));
		}
		var o = {
			"throw": 1,
			"return": 2,
			"break": 3,
			"continue": 3
		};
		function a(r) {
			var e, t;
			return function(n) {
				e || (e = {
					stop: function stop() {
						return t(n.a, 2);
					},
					"catch": function _catch() {
						return n.v;
					},
					abrupt: function abrupt(r, e) {
						return t(n.a, o[r], e);
					},
					delegateYield: function delegateYield(r, o, a) {
						return e.resultName = o, t(n.d, _regeneratorValues(r), a);
					},
					finish: function finish(r) {
						return t(n.f, r);
					}
				}, t = function t(r, _t, o) {
					n.p = e.prev, n.n = e.next;
					try {
						return r(_t, o);
					} finally {
						e.next = n.n;
					}
				}), e.resultName && (e[e.resultName] = n.v, e.resultName = void 0), e.sent = n.v, e.next = n.n;
				try {
					return r.call(this, e);
				} finally {
					n.p = e.prev, n.n = e.next;
				}
			};
		}
		return (_regeneratorRuntime = function _regeneratorRuntime() {
			return {
				wrap: function wrap(e, t, n, o) {
					return r.w(a(e), t, n, o && o.reverse());
				},
				isGeneratorFunction: n,
				mark: r.m,
				awrap: function awrap(r, e) {
					return new _OverloadYield(r, e);
				},
				AsyncIterator: _regeneratorAsyncIterator,
				async: function async(r, e, t, o, u) {
					return (n(e) ? _regeneratorAsyncGen : _regeneratorAsync)(a(r), e, t, o, u);
				},
				keys: _regeneratorKeys,
				values: _regeneratorValues
			};
		})();
	}
	function _regeneratorValues(e) {
		if (null != e) {
			var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0;
			if (t) return t.call(e);
			if ("function" == typeof e.next) return e;
			if (!isNaN(e.length)) return { next: function next() {
				return e && r >= e.length && (e = void 0), {
					value: e && e[r++],
					done: !e
				};
			} };
		}
		throw new TypeError(_typeof(e) + " is not iterable");
	}
	function _regeneratorKeys(e) {
		var n = Object(e), r = [];
		for (var t in n) r.unshift(t);
		return function e() {
			for (; r.length;) if ((t = r.pop()) in n) return e.value = t, e.done = !1, e;
			return e.done = !0, e;
		};
	}
	function _regeneratorAsync(n, e, r, t, o) {
		var a = _regeneratorAsyncGen(n, e, r, t, o);
		return a.next().then(function(n) {
			return n.done ? n.value : a.next();
		});
	}
	function _regeneratorAsyncGen(r, e, t, o, n) {
		return new _regeneratorAsyncIterator(_regenerator().w(r, e, t, o), n || Promise);
	}
	function _regeneratorAsyncIterator(t, e) {
		function n(r, o, i, f) {
			try {
				var c = t[r](o), u = c.value;
				return u instanceof _OverloadYield ? e.resolve(u.v).then(function(t) {
					n("next", t, i, f);
				}, function(t) {
					n("throw", t, i, f);
				}) : e.resolve(u).then(function(t) {
					c.value = t, i(c);
				}, function(t) {
					return n("throw", t, i, f);
				});
			} catch (t) {
				f(t);
			}
		}
		var r;
		this.next || (_regeneratorDefine2(_regeneratorAsyncIterator.prototype), _regeneratorDefine2(_regeneratorAsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function() {
			return this;
		})), _regeneratorDefine2(this, "_invoke", function(t, o, i) {
			function f() {
				return new e(function(e, r) {
					n(t, i, e, r);
				});
			}
			return r = r ? r.then(f, f) : f();
		}, !0);
	}
	function _regenerator() {
		/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag";
		function i(r, n, o, i) {
			var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype);
			return _regeneratorDefine2(u, "_invoke", function(r, n, o) {
				var i, c, u, f = 0, p = o || [], y = !1, G = {
					p: 0,
					n: 0,
					v: e,
					a: d,
					f: d.bind(e, 4),
					d: function d(t, r) {
						return i = t, c = 0, u = e, G.n = r, a;
					}
				};
				function d(r, n) {
					for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) {
						var o, i = p[t], d = G.p, l = i[2];
						r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0));
					}
					if (o || r > 1) return a;
					throw y = !0, n;
				}
				return function(o, p, l) {
					if (f > 1) throw TypeError("Generator is already running");
					for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) {
						i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u);
						try {
							if (f = 2, i) {
								if (c || (o = "next"), t = i[o]) {
									if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object");
									if (!t.done) return t;
									u = t.value, c < 2 && (c = 0);
								} else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1);
								i = e;
							} else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break;
						} catch (t) {
							i = e, c = 1, u = t;
						} finally {
							f = 1;
						}
					}
					return {
						value: t,
						done: y
					};
				};
			}(r, o, i), !0), u;
		}
		var a = {};
		function Generator() {}
		function GeneratorFunction() {}
		function GeneratorFunctionPrototype() {}
		t = Object.getPrototypeOf;
		var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function() {
			return this;
		}), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c);
		function f(e) {
			return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e;
		}
		return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function() {
			return this;
		}), _regeneratorDefine2(u, "toString", function() {
			return "[object Generator]";
		}), (_regenerator = function _regenerator() {
			return {
				w: i,
				m: f
			};
		})();
	}
	function _regeneratorDefine2(e, r, n, t) {
		var i = Object.defineProperty;
		try {
			i({}, "", {});
		} catch (e) {
			i = 0;
		}
		_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) {
			function o(r, n) {
				_regeneratorDefine2(e, r, function(e) {
					return this._invoke(r, n, e);
				});
			}
			r ? i ? i(e, r, {
				value: n,
				enumerable: !t,
				configurable: !t,
				writable: !t
			}) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2));
		}, _regeneratorDefine2(e, r, n, t);
	}
	var _marked = /*#__PURE__*/ _regeneratorRuntime().mark(slices);
	function asyncGeneratorStep(n, t, e, r, o, a, c) {
		try {
			var i = n[a](c), u = i.value;
		} catch (n) {
			e(n);
			return;
		}
		i.done ? t(u) : Promise.resolve(u).then(r, o);
	}
	function _asyncToGenerator(n) {
		return function() {
			var t = this, e = arguments;
			return new Promise(function(r, o) {
				var a = n.apply(t, e);
				function _next(n) {
					asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
				}
				function _throw(n) {
					asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
				}
				_next(void 0);
			});
		};
	}
	function _wrapAsyncGenerator(e) {
		return function() {
			return new AsyncGenerator(e.apply(this, arguments));
		};
	}
	function AsyncGenerator(e) {
		var t, n;
		function resume(t, n) {
			try {
				var r = e[t](n), o = r.value, u = o instanceof _OverloadYield;
				Promise.resolve(u ? o.v : o).then(function(n) {
					if (u) {
						var i = "return" === t && o.k ? t : "next";
						if (!o.k || n.done) return resume(i, n);
						n = e[i](n).value;
					}
					settle(!!r.done, n);
				}, function(e) {
					resume("throw", e);
				});
			} catch (e) {
				settle(2, e);
			}
		}
		function settle(e, r) {
			2 === e ? t.reject(r) : t.resolve({
				value: r,
				done: e
			}), (t = t.next) ? resume(t.key, t.arg) : n = null;
		}
		this._invoke = function(e, r) {
			return new Promise(function(o, u) {
				var i = {
					key: e,
					arg: r,
					resolve: o,
					reject: u,
					next: null
				};
				n ? n = n.next = i : (t = n = i, resume(e, r));
			});
		}, "function" != typeof e["return"] && (this["return"] = void 0);
	}
	AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
		return this;
	}, AsyncGenerator.prototype.next = function(e) {
		return this._invoke("next", e);
	}, AsyncGenerator.prototype["throw"] = function(e) {
		return this._invoke("throw", e);
	}, AsyncGenerator.prototype["return"] = function(e) {
		return this._invoke("return", e);
	};
	function _awaitAsyncGenerator(e) {
		return new _OverloadYield(e, 0);
	}
	function _asyncGeneratorDelegate(t) {
		var e = {}, n = !1;
		function pump(e, r) {
			return n = !0, r = new Promise(function(n) {
				n(t[e](r));
			}), {
				done: !1,
				value: new _OverloadYield(r, 1)
			};
		}
		return e["undefined" != typeof Symbol && Symbol.iterator || "@@iterator"] = function() {
			return this;
		}, e.next = function(t) {
			return n ? (n = !1, t) : pump("next", t);
		}, "function" == typeof t["throw"] && (e["throw"] = function(t) {
			if (n) throw n = !1, t;
			return pump("throw", t);
		}), "function" == typeof t["return"] && (e["return"] = function(t) {
			return n ? (n = !1, t) : pump("return", t);
		}), e;
	}
	function _OverloadYield(e, d) {
		this.v = e, this.k = d;
	}
	function _asyncIterator(r) {
		var n, t, o, e = 2;
		for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
			if (t && null != (n = r[t])) return n.call(r);
			if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
			t = "@@asyncIterator", o = "@@iterator";
		}
		throw new TypeError("Object is not async iterable");
	}
	function AsyncFromSyncIterator(r) {
		function AsyncFromSyncIteratorContinuation(r) {
			if (Object(r) !== r) return Promise.reject(/* @__PURE__ */ new TypeError(r + " is not an object."));
			var n = r.done;
			return Promise.resolve(r.value).then(function(r) {
				return {
					value: r,
					done: n
				};
			});
		}
		return AsyncFromSyncIterator = function AsyncFromSyncIterator(r) {
			this.s = r, this.n = r.next;
		}, AsyncFromSyncIterator.prototype = {
			s: null,
			n: null,
			next: function next() {
				return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
			},
			"return": function _return(r) {
				var n = this.s["return"];
				return void 0 === n ? Promise.resolve({
					value: r,
					done: !0
				}) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
			},
			"throw": function _throw(r) {
				var n = this.s["return"];
				return void 0 === n ? Promise.reject(r) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
			}
		}, new AsyncFromSyncIterator(r);
	}
	var _require = __require("node:stream");
	var PassThrough = _require.PassThrough;
	var Readable = _require.Readable;
	var Transform = _require.Transform;
	var Writable = _require.Writable;
	var pipeline = _require.pipeline;
	var _require2 = __require("node:zlib");
	var createDeflateRaw = _require2.createDeflateRaw;
	var createInflateRaw = _require2.createInflateRaw;
	var CompressedObject = require_compressedObject();
	var crc32 = require_crc32();
	var fileOrder = require_file_order();
	var STORE = 0;
	var DEFLATE = 8;
	var DATA_DESCRIPTOR = 8;
	var UTF8 = 2048;
	var MAX_16 = 65535;
	var MAX_32 = 4294967295;
	function write16(buffer, value, offset) {
		if (value < 0 || value > MAX_16) throw new RangeError("ZIP64 is required for this ZIP field");
		buffer.writeUInt16LE(value, offset);
	}
	function write32(buffer, value, offset) {
		if (value < 0 || value > MAX_32) throw new RangeError("ZIP64 is required for this ZIP field");
		buffer.writeUInt32LE(value >>> 0, offset);
	}
	function dosDateTime(date) {
		var value = date || /* @__PURE__ */ new Date();
		return {
			date: Math.min(2107, Math.max(1980, value.getFullYear())) - 1980 << 9 | value.getMonth() + 1 << 5 | value.getDate(),
			time: value.getHours() << 11 | value.getMinutes() << 5 | value.getSeconds() >> 1
		};
	}
	function writeChunk(_x3, _x4) {
		return _writeChunk.apply(this, arguments);
	}
	function _writeChunk() {
		_writeChunk = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee2(destination, chunk) {
			var offset;
			return _regeneratorRuntime().wrap(function _callee2$(_context3) {
				while (1) switch (_context3.prev = _context3.next) {
					case 0: offset = 0;
					case 1:
						if (!(offset < chunk.length)) {
							_context3.next = 7;
							break;
						}
						_context3.next = 4;
						return writeBuffer(destination, chunk.subarray(offset, offset + destination._zipChunkSize));
					case 4:
						offset += destination._zipChunkSize;
						_context3.next = 1;
						break;
					case 7:
					case "end": return _context3.stop();
				}
			}, _callee2);
		}));
		return _writeChunk.apply(this, arguments);
	}
	function writeBuffer(destination, chunk) {
		if (destination.destroyed) return Promise.reject(/* @__PURE__ */ new Error("ZIP stream was destroyed"));
		if (destination.write(chunk)) return Promise.resolve();
		return new Promise(function(resolve, reject) {
			function done(callback, value) {
				destination.removeListener("drain", onDrain);
				destination.removeListener("error", onError);
				destination.removeListener("close", onClose);
				callback(value);
			}
			function onDrain() {
				done(resolve);
			}
			function onError(error) {
				done(reject, error);
			}
			function onClose() {
				done(reject, /* @__PURE__ */ new Error("ZIP stream closed before drain"));
			}
			destination.once("drain", onDrain);
			destination.once("error", onError);
			destination.once("close", onClose);
		});
	}
	function rawData(entry) {
		if (entry.dir) return Buffer.alloc(0);
		return entry.asNodeBuffer();
	}
	function asBuffer(value) {
		if (Buffer.isBuffer(value)) return value;
		if (value instanceof Uint8Array) return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
		if (typeof value === "string") return Buffer.from(value, "binary");
		throw new TypeError("ZIP entry has unsupported compressed data");
	}
	function isCompressed(data) {
		return data instanceof CompressedObject;
	}
	function compressionMethod(entry, options) {
		if (entry.dir) return STORE;
		var requested = entry.options.compression || options.compression;
		if (requested === "STORE") return STORE;
		if (requested === "DEFLATE") return DEFLATE;
		throw new Error("".concat(requested, " is not a valid compression method for generateNodeStream"));
	}
	function slices(data, chunkSize) {
		var offset;
		return _regeneratorRuntime().wrap(function slices$(_context) {
			while (1) switch (_context.prev = _context.next) {
				case 0: offset = 0;
				case 1:
					if (!(offset < data.length)) {
						_context.next = 7;
						break;
					}
					_context.next = 4;
					return data.subarray(offset, offset + chunkSize);
				case 4:
					offset += chunkSize;
					_context.next = 1;
					break;
				case 7:
				case "end": return _context.stop();
			}
		}, _marked);
	}
	function entryChunks(_x, _x2) {
		return _entryChunks.apply(this, arguments);
	}
	function _entryChunks() {
		_entryChunks = _wrapAsyncGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee(entry, chunkSize) {
			var data;
			return _regeneratorRuntime().wrap(function _callee$(_context2) {
				while (1) switch (_context2.prev = _context2.next) {
					case 0:
						data = entry._data;
						if (!isCompressed(data)) {
							_context2.next = 9;
							break;
						}
						if (!(data._fileReader && data._fileReader.createReadStream)) {
							_context2.next = 6;
							break;
						}
						return _context2.delegateYield(_asyncGeneratorDelegate(_asyncIterator(data._fileReader.createReadStream(data._fileOffset, data.compressedSize, chunkSize)), _awaitAsyncGenerator), "t0", 4);
					case 4:
						_context2.next = 7;
						break;
					case 6: return _context2.delegateYield(_asyncGeneratorDelegate(_asyncIterator(slices(asBuffer(data.getCompressedContent()), chunkSize)), _awaitAsyncGenerator), "t1", 7);
					case 7:
						_context2.next = 14;
						break;
					case 9:
						if (!(data && data.createReadStream)) {
							_context2.next = 13;
							break;
						}
						return _context2.delegateYield(_asyncGeneratorDelegate(_asyncIterator(data.createReadStream(chunkSize)), _awaitAsyncGenerator), "t2", 11);
					case 11:
						_context2.next = 14;
						break;
					case 13: return _context2.delegateYield(_asyncGeneratorDelegate(_asyncIterator(slices(rawData(entry), chunkSize)), _awaitAsyncGenerator), "t3", 14);
					case 14:
					case "end": return _context2.stop();
				}
			}, _callee);
		}));
		return _entryChunks.apply(this, arguments);
	}
	function sourceFor(entry, reused, chunkSize) {
		return {
			stream: Readable.from(entryChunks(entry, chunkSize), {
				objectMode: false,
				highWaterMark: chunkSize
			}),
			inflate: !reused && isCompressed(entry._data) && entry._data.compressionMethod === "\b\0"
		};
	}
	function utf8Flag(name, comment) {
		return Buffer.byteLength(name, "utf8") !== name.length || Buffer.byteLength(comment, "utf8") !== comment.length ? UTF8 : 0;
	}
	function localHeader(entry) {
		var header = Buffer.alloc(30 + entry.name.length);
		header.writeUInt32LE(67324752, 0);
		write16(header, entry.usesDescriptor ? 20 : 10, 4);
		write16(header, entry.flags | (entry.usesDescriptor ? DATA_DESCRIPTOR : 0), 6);
		write16(header, entry.method, 8);
		write16(header, entry.time, 10);
		write16(header, entry.date, 12);
		write32(header, entry.usesDescriptor ? 0 : entry.crc32, 14);
		write32(header, entry.usesDescriptor ? 0 : entry.compressedSize, 18);
		write32(header, entry.usesDescriptor ? 0 : entry.uncompressedSize, 22);
		write16(header, entry.name.length, 26);
		write16(header, 0, 28);
		entry.name.copy(header, 30);
		return header;
	}
	function descriptor(entry) {
		var buffer = Buffer.alloc(16);
		buffer.writeUInt32LE(134695760, 0);
		write32(buffer, entry.crc32, 4);
		write32(buffer, entry.compressedSize, 8);
		write32(buffer, entry.uncompressedSize, 12);
		return buffer;
	}
	function centralHeader(entry) {
		var buffer = Buffer.alloc(46 + entry.name.length + entry.comment.length);
		buffer.writeUInt32LE(33639248, 0);
		write16(buffer, 20, 4);
		write16(buffer, entry.usesDescriptor ? 20 : 10, 6);
		write16(buffer, entry.flags | (entry.usesDescriptor ? DATA_DESCRIPTOR : 0), 8);
		write16(buffer, entry.method, 10);
		write16(buffer, entry.time, 12);
		write16(buffer, entry.date, 14);
		write32(buffer, entry.crc32, 16);
		write32(buffer, entry.compressedSize, 20);
		write32(buffer, entry.uncompressedSize, 24);
		write16(buffer, entry.name.length, 28);
		write16(buffer, 0, 30);
		write16(buffer, entry.comment.length, 32);
		write16(buffer, 0, 34);
		write16(buffer, 0, 36);
		write32(buffer, entry.dir ? 16 : entry.dosPermissions || 0, 38);
		write32(buffer, entry.offset, 42);
		entry.name.copy(buffer, 46);
		entry.comment.copy(buffer, 46 + entry.name.length);
		return buffer;
	}
	function endRecord(entries, size, offset, comment) {
		var buffer = Buffer.alloc(22 + comment.length);
		buffer.writeUInt32LE(101010256, 0);
		write16(buffer, 0, 4);
		write16(buffer, 0, 6);
		write16(buffer, entries, 8);
		write16(buffer, entries, 10);
		write32(buffer, size, 12);
		write32(buffer, offset, 16);
		write16(buffer, comment.length, 20);
		comment.copy(buffer, 22);
		return buffer;
	}
	function writeEntry(_x5, _x6, _x7, _x8) {
		return _writeEntry.apply(this, arguments);
	}
	function _writeEntry() {
		_writeEntry = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee3(destination, entry, offset, options) {
			var name, comment, method, reused, usesDescriptor, dateTime, metadata, source, stages, streamOptions, compressionOptions, written, onClose;
			return _regeneratorRuntime().wrap(function _callee3$(_context4) {
				while (1) switch (_context4.prev = _context4.next) {
					case 0:
						onClose = function _onClose() {
							var _iterator = _createForOfIteratorHelper(stages), _step;
							try {
								for (_iterator.s(); !(_step = _iterator.n()).done;) _step.value.destroy(/* @__PURE__ */ new Error("ZIP stream was destroyed"));
							} catch (err) {
								_iterator.e(err);
							} finally {
								_iterator.f();
							}
						};
						name = Buffer.from(entry.name, "utf8");
						comment = Buffer.from(entry.comment || "", "utf8");
						if (!(name.length > MAX_16 || comment.length > MAX_16)) {
							_context4.next = 5;
							break;
						}
						throw new RangeError("ZIP filename or comment exceeds the classic ZIP limit");
					case 5:
						method = compressionMethod(entry, options);
						reused = isCompressed(entry._data) && entry._data.compressionMethod === (method === STORE ? "\0\0" : "\b\0");
						usesDescriptor = !reused;
						dateTime = dosDateTime(entry.date);
						metadata = {
							comment,
							compressedSize: reused ? entry._data.compressedSize : 0,
							crc32: reused ? entry._data.crc32 >>> 0 : 0,
							date: dateTime.date,
							dir: entry.dir,
							dosPermissions: entry.dosPermissions,
							flags: utf8Flag(entry.name, entry.comment || ""),
							method,
							name,
							offset,
							time: dateTime.time,
							uncompressedSize: reused ? entry._data.uncompressedSize : 0,
							usesDescriptor
						};
						_context4.next = 12;
						return writeChunk(destination, localHeader(metadata));
					case 12:
						source = sourceFor(entry, reused, options.chunkSize);
						stages = [source.stream];
						streamOptions = {
							highWaterMark: options.chunkSize,
							chunkSize: options.chunkSize
						};
						if (source.inflate) stages.push(createInflateRaw(streamOptions));
						if (!reused) {
							stages.push(new Transform({
								highWaterMark: options.chunkSize,
								transform: function transform(chunk, encoding, callback) {
									metadata.crc32 = crc32(chunk, metadata.crc32) >>> 0;
									metadata.uncompressedSize += chunk.length;
									if (isCompressed(entry._data) && metadata.uncompressedSize > entry._data.uncompressedSize) {
										callback(/* @__PURE__ */ new Error("Bug : uncompressed data size mismatch"));
										return;
									}
									if (metadata.uncompressedSize > MAX_32) {
										callback(/* @__PURE__ */ new RangeError("ZIP64 is required for this ZIP field"));
										return;
									}
									callback(null, chunk);
								}
							}));
							if (method === DEFLATE) {
								compressionOptions = entry.options.compressionOptions || options.compressionOptions;
								stages.push(createDeflateRaw(_objectSpread({ level: compressionOptions.level }, streamOptions)));
							}
						}
						written = 0;
						stages.push(new Writable({
							highWaterMark: options.chunkSize,
							write: function write(chunk, encoding, callback) {
								written += chunk.length;
								if (written > MAX_32) {
									callback(/* @__PURE__ */ new RangeError("ZIP64 is required for this ZIP field"));
									return;
								}
								writeChunk(destination, chunk).then(function() {
									return callback();
								}, callback);
							}
						}));
						destination.once("close", onClose);
						_context4.prev = 20;
						_context4.next = 23;
						return new Promise(function(resolve, reject) {
							pipeline.apply(void 0, stages.concat([function(error) {
								return error ? reject(error) : resolve();
							}]));
							if (destination.destroyed) onClose();
						});
					case 23:
						_context4.prev = 23;
						destination.removeListener("close", onClose);
						return _context4.finish(23);
					case 26:
						if (!(reused && written !== metadata.compressedSize)) {
							_context4.next = 28;
							break;
						}
						throw new Error("Bug : compressed data size mismatch");
					case 28:
						if (reused) {
							_context4.next = 34;
							break;
						}
						if (!(isCompressed(entry._data) && metadata.uncompressedSize !== entry._data.uncompressedSize)) {
							_context4.next = 31;
							break;
						}
						throw new Error("Bug : uncompressed data size mismatch");
					case 31:
						metadata.compressedSize = written;
						_context4.next = 34;
						return writeChunk(destination, descriptor(metadata));
					case 34: return _context4.abrupt("return", metadata);
					case 35:
					case "end": return _context4.stop();
				}
			}, _callee3, null, [[
				20,
				,
				23,
				26
			]]);
		}));
		return _writeEntry.apply(this, arguments);
	}
	function writeArchive(_x9, _x0, _x1) {
		return _writeArchive.apply(this, arguments);
	}
	function _writeArchive() {
		_writeArchive = _asyncToGenerator(/*#__PURE__*/ _regeneratorRuntime().mark(function _callee4(zip, destination, options) {
			var names, offset, entries, _iterator2, _step2, name, _entry, centralOffset, _i, _entries, entry, header, comment;
			return _regeneratorRuntime().wrap(function _callee4$(_context5) {
				while (1) switch (_context5.prev = _context5.next) {
					case 0:
						names = fileOrder(zip.files, options.fileOrder);
						if (!(names.length > MAX_16)) {
							_context5.next = 3;
							break;
						}
						throw new RangeError("ZIP64 is required for more than 65535 entries");
					case 3:
						offset = 0;
						entries = [];
						_iterator2 = _createForOfIteratorHelper(names);
						_context5.prev = 6;
						_iterator2.s();
					case 8:
						if ((_step2 = _iterator2.n()).done) {
							_context5.next = 19;
							break;
						}
						name = _step2.value;
						if (Object.prototype.hasOwnProperty.call(zip.files, name)) {
							_context5.next = 12;
							break;
						}
						return _context5.abrupt("continue", 17);
					case 12:
						_context5.next = 14;
						return writeEntry(destination, zip.files[name], offset, options);
					case 14:
						_entry = _context5.sent;
						entries.push(_entry);
						offset += 30 + _entry.name.length + _entry.compressedSize + (_entry.usesDescriptor ? 16 : 0);
					case 17:
						_context5.next = 8;
						break;
					case 19:
						_context5.next = 24;
						break;
					case 21:
						_context5.prev = 21;
						_context5.t0 = _context5["catch"](6);
						_iterator2.e(_context5.t0);
					case 24:
						_context5.prev = 24;
						_iterator2.f();
						return _context5.finish(24);
					case 27:
						centralOffset = offset;
						_i = 0, _entries = entries;
					case 29:
						if (!(_i < _entries.length)) {
							_context5.next = 38;
							break;
						}
						entry = _entries[_i];
						header = centralHeader(entry);
						_context5.next = 34;
						return writeChunk(destination, header);
					case 34: offset += header.length;
					case 35:
						_i++;
						_context5.next = 29;
						break;
					case 38:
						comment = Buffer.from(options.comment || zip.comment || "", "utf8");
						if (!(comment.length > MAX_16)) {
							_context5.next = 41;
							break;
						}
						throw new RangeError("ZIP comment exceeds the classic ZIP limit");
					case 41:
						_context5.next = 43;
						return writeChunk(destination, endRecord(entries.length, offset - centralOffset, centralOffset, comment));
					case 43:
					case "end": return _context5.stop();
				}
			}, _callee4, null, [[
				6,
				21,
				24,
				27
			]]);
		}));
		return _writeArchive.apply(this, arguments);
	}
	module.exports = function generateNodeStream() {
		var _this = this;
		var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		var chunkSize = require_chunk_size()(options.chunkSize, this._chunkSize);
		var destination = new PassThrough({ highWaterMark: options.highWaterMark === void 0 ? chunkSize : options.highWaterMark });
		destination._zipChunkSize = chunkSize;
		var settings = {
			chunkSize,
			comment: options.comment,
			compression: (options.compression || "STORE").toUpperCase(),
			compressionOptions: options.compressionOptions || {},
			fileOrder: options.fileOrder
		};
		queueMicrotask(function() {
			writeArchive(_this, destination, settings).then(function() {
				return destination.end();
			}, function(error) {
				return destination.destroy(error);
			});
		});
		return destination;
	};
}));
//#endregion
//#region node_modules/pizzip/js/index.js
var require_js = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function _typeof(o) {
		"@babel/helpers - typeof";
		return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
			return typeof o;
		} : function(o) {
			return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
		}, _typeof(o);
	}
	function _createForOfIteratorHelper(r, e) {
		var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
		if (!t) {
			if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
				t && (r = t);
				var _n = 0, F = function F() {};
				return {
					s: F,
					n: function n() {
						return _n >= r.length ? { done: !0 } : {
							done: !1,
							value: r[_n++]
						};
					},
					e: function e(r) {
						throw r;
					},
					f: F
				};
			}
			throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
		}
		var o, a = !0, u = !1;
		return {
			s: function s() {
				t = t.call(r);
			},
			n: function n() {
				var r = t.next();
				return a = r.done, r;
			},
			e: function e(r) {
				u = !0, o = r;
			},
			f: function f() {
				try {
					a || null == t["return"] || t["return"]();
				} finally {
					if (u) throw o;
				}
			}
		};
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
	var base64 = require_base64();
	/**
	Usage:
	zip = new PizZip();
	zip.file("hello.txt", "Hello, World!").file("tempfile", "nothing");
	zip.folder("images").file("smile.gif", base64Data, {base64: true});
	zip.file("Xmas.txt", "Ho ho ho !", {date : new Date("December 25, 2007 00:00:01")});
	zip.remove("tempfile");
	
	base64zip = zip.generate();
	
	**/
	/**
	* Representation a of zip file in js
	* @constructor
	* @param {String=|ArrayBuffer=|Uint8Array=} data the data to load, if any (optional).
	* @param {Object=} options the options for creating this objects (optional).
	*/
	function PizZip(data, options) {
		if (!(this instanceof PizZip)) return new PizZip(data, options);
		this.files = {};
		this.comment = null;
		this._chunkSize = require_chunk_size()(options && options.chunkSize);
		this._storage = null;
		this._readers = /* @__PURE__ */ new Set();
		if (options && options.storage && options.storage.type === "filesystem") this._storage = new (require_filesystem_storage())(_objectSpread(_objectSpread({}, options.storage), {}, { chunkSize: this._chunkSize }));
		this.dispose = function() {
			var _iterator = _createForOfIteratorHelper(this._readers), _step;
			try {
				for (_iterator.s(); !(_step = _iterator.n()).done;) _step.value.dispose();
			} catch (err) {
				_iterator.e(err);
			} finally {
				_iterator.f();
			}
			this._readers.clear();
			if (this._storage) this._storage.dispose();
		};
		this.root = "";
		if (data) try {
			this.load(data, options);
		} catch (error) {
			this.dispose();
			throw error;
		}
		this.clone = function() {
			var _this = this;
			var newObj = new PizZip();
			Object.keys(this.files).forEach(function(file) {
				newObj.file(file, _this.files[file].asUint8Array());
			});
			return newObj;
		};
		this.shallowClone = function() {
			var newObj = new PizZip();
			for (var i in this) if (typeof this[i] !== "function") newObj[i] = this[i];
			return newObj;
		};
	}
	PizZip.prototype = require_object();
	PizZip.prototype.load = require_load();
	PizZip.prototype.loadFile = require_loadFile();
	PizZip.support = require_support();
	PizZip.defaults = require_defaults();
	/**
	* @deprecated
	* This namespace will be removed in a future version without replacement.
	*/
	PizZip.utils = require_deprecatedPublicUtils();
	PizZip.base64 = {
		/**
		* @deprecated
		* This method will be removed in a future version without replacement.
		*/
		encode: function encode(input) {
			return base64.encode(input);
		},
		/**
		* @deprecated
		* This method will be removed in a future version without replacement.
		*/
		decode: function decode(input) {
			return base64.decode(input);
		}
	};
	PizZip.compressions = require_compressions();
	PizZip.prototype.generateNodeStream = require_node_stream();
	module.exports = PizZip;
	module.exports["default"] = PizZip;
}));
//#endregion
export { require_js as t };
