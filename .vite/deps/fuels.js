import {
  ASSET_ID_LEN,
  AbstractAccount,
  AbstractAddress,
  AbstractContract,
  AbstractPredicate,
  AbstractProgram,
  AbstractScript,
  AbstractScriptRequest,
  Address,
  AddressType,
  ArrayCoder,
  B256Coder,
  B512Coder,
  BN,
  BaseAssetId,
  BaseTransactionRequest,
  BooleanCoder,
  ByteArrayCoder,
  CONTRACT_ID_LEN,
  CONTRACT_MAX_SIZE,
  ChainName,
  ChangeOutputCollisionError,
  Coder,
  CreateTransactionRequest,
  EmptyRoot,
  EnumCoder,
  ErrorCode,
  FAILED_ASSERT_EQ_SIGNAL,
  FAILED_ASSERT_SIGNAL,
  FAILED_REQUIRE_SIGNAL,
  FAILED_SEND_MESSAGE_SIGNAL,
  FAILED_TRANSFER_TO_ADDRESS_SIGNAL,
  FAILED_UNKNOWN_SIGNAL,
  FUEL_BECH32_HRP_PREFIX,
  FuelError,
  INPUT_COIN_FIXED_SIZE,
  InputCoder,
  InputCoinCoder,
  InputContractCoder,
  InputMessageCoder,
  InputType,
  Interface,
  MAX_PREDICATE_DATA_LENGTH,
  MAX_PREDICATE_LENGTH,
  MAX_SCRIPT_DATA_LENGTH,
  MAX_SCRIPT_LENGTH,
  MAX_STATIC_CONTRACTS,
  MAX_WITNESSES,
  NoWitnessAtIndexError,
  NoWitnessByOwnerError,
  NumberCoder,
  OperationName,
  OutputChangeCoder,
  OutputCoder,
  OutputCoinCoder,
  OutputContractCoder,
  OutputContractCreatedCoder,
  OutputType,
  OutputVariableCoder,
  Provider,
  ReceiptBurnCoder,
  ReceiptCallCoder,
  ReceiptCoder,
  ReceiptLogCoder,
  ReceiptLogDataCoder,
  ReceiptMessageOutCoder,
  ReceiptMintCoder,
  ReceiptPanicCoder,
  ReceiptReturnCoder,
  ReceiptReturnDataCoder,
  ReceiptRevertCoder,
  ReceiptScriptResultCoder,
  ReceiptTransferCoder,
  ReceiptTransferOutCoder,
  ReceiptType,
  SCRIPT_FIXED_SIZE,
  ScriptTransactionRequest,
  StorageSlotCoder,
  StringCoder,
  StructCoder,
  TransactionCoder,
  TransactionCreateCoder,
  TransactionMintCoder,
  TransactionResponse,
  TransactionScriptCoder,
  TransactionStatus,
  TransactionType,
  TransactionTypeName,
  TupleCoder,
  TxPointerCoder,
  U64Coder,
  UtxoIdCoder,
  VecCoder,
  WORD_SIZE,
  WitnessCoder,
  ZeroBytes32,
  addOperation,
  addressify,
  assembleReceiptByType,
  assembleTransactionSummary,
  bn,
  bufferFromString2,
  buildBlockExplorerUrl,
  calculatePriceWithFactor,
  calculateTransactionFee,
  calculateTransactionFeeForContractCreated,
  calculateTransactionFeeForScript,
  calculateVmTxMemory,
  chunkAndPadBytes,
  clearFirst12BytesFromB256,
  clone_default,
  coinQuantityfy,
  computeHmac,
  concat,
  concatBytes,
  dataSlice,
  decodeBase58,
  decrypt2,
  decryptJsonWalletData2,
  encodeBase58,
  encrypt2,
  encryptJsonWalletData2,
  extractBurnedAssetsFromReceipts,
  extractMintedAssetsFromReceipts,
  format,
  formatUnits,
  fromBech32,
  fromDateToTai64,
  fromTai64ToDate,
  fromTai64ToUnix,
  fromUnixToTai64,
  getBytesCopy,
  getBytesFromBech32,
  getContractCallOperations,
  getContractCreatedOperations,
  getContractTransferOperations,
  getDecodedLogs,
  getGasUsedFromReceipts,
  getInputAccountAddress,
  getInputContractFromIndex,
  getInputFromAssetId,
  getInputsByType,
  getInputsCoin,
  getInputsContract,
  getInputsMessage,
  getOperations,
  getOutputsByType,
  getOutputsChange,
  getOutputsCoin,
  getOutputsContract,
  getOutputsContractCreated,
  getOutputsVariable,
  getPayProducerOperations,
  getRandomB256,
  getReceiptsByType,
  getReceiptsCall,
  getReceiptsMessageOut,
  getReceiptsTransferOut,
  getReceiptsWithMissingData,
  getTransactionStatusName,
  getTransactionSummary,
  getTransactionSummaryFromRequest,
  getTransactionTypeName,
  getTransactionsSummaries,
  getTransferOperations,
  getWithdrawFromFuelOperations,
  hasSameAssetId,
  hexlify,
  inputify,
  isB256,
  isBech32,
  isCoin,
  isEvmAddress,
  isMessage,
  isPublicKey,
  isRawCoin,
  isRawMessage,
  isType,
  isTypeCreate,
  isTypeMint,
  isTypeScript,
  keccak2562,
  keyFromPassword2,
  max,
  multiply,
  normalizeBech32,
  normalizeJSON,
  outputify,
  padFirst12BytesOfEvmAddress,
  pbkdf2,
  processGqlReceipt,
  processGraphqlStatus,
  randomBytes2,
  require_buffer,
  returnZeroScript,
  ripemd160,
  scrypt2,
  sha256,
  sleep,
  stringFromBuffer2,
  toB256,
  toBeHex,
  toBech32,
  toBytes,
  toFixed,
  toHex,
  toNumber,
  transactionRequestify,
  withdrawScript
} from "./chunk-ZNHFE3DJ.js";
import "./chunk-6EEL643C.js";
import {
  __commonJS,
  __privateAdd,
  __privateGet,
  __privateSet,
  __publicField,
  __toESM
} from "./chunk-J32WSRGE.js";

// node_modules/elliptic/package.json
var require_package = __commonJS({
  "node_modules/elliptic/package.json"(exports, module) {
    module.exports = {
      name: "elliptic",
      version: "6.5.4",
      description: "EC cryptography",
      main: "lib/elliptic.js",
      files: [
        "lib"
      ],
      scripts: {
        lint: "eslint lib test",
        "lint:fix": "npm run lint -- --fix",
        unit: "istanbul test _mocha --reporter=spec test/index.js",
        test: "npm run lint && npm run unit",
        version: "grunt dist && git add dist/"
      },
      repository: {
        type: "git",
        url: "git@github.com:indutny/elliptic"
      },
      keywords: [
        "EC",
        "Elliptic",
        "curve",
        "Cryptography"
      ],
      author: "Fedor Indutny <fedor@indutny.com>",
      license: "MIT",
      bugs: {
        url: "https://github.com/indutny/elliptic/issues"
      },
      homepage: "https://github.com/indutny/elliptic",
      devDependencies: {
        brfs: "^2.0.2",
        coveralls: "^3.1.0",
        eslint: "^7.6.0",
        grunt: "^1.2.1",
        "grunt-browserify": "^5.3.0",
        "grunt-cli": "^1.3.2",
        "grunt-contrib-connect": "^3.0.0",
        "grunt-contrib-copy": "^1.0.0",
        "grunt-contrib-uglify": "^5.0.0",
        "grunt-mocha-istanbul": "^5.0.2",
        "grunt-saucelabs": "^9.0.1",
        istanbul: "^0.4.5",
        mocha: "^8.0.1"
      },
      dependencies: {
        "bn.js": "^4.11.9",
        brorand: "^1.1.0",
        "hash.js": "^1.0.0",
        "hmac-drbg": "^1.0.1",
        inherits: "^2.0.4",
        "minimalistic-assert": "^1.0.1",
        "minimalistic-crypto-utils": "^1.0.1"
      }
    };
  }
});

// node_modules/bn.js/lib/bn.js
var require_bn = __commonJS({
  "node_modules/bn.js/lib/bn.js"(exports, module) {
    (function(module2, exports2) {
      "use strict";
      function assert2(val, msg) {
        if (!val)
          throw new Error(msg || "Assertion failed");
      }
      function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      }
      function BN2(number, base, endian) {
        if (BN2.isBN(number)) {
          return number;
        }
        this.negative = 0;
        this.words = null;
        this.length = 0;
        this.red = null;
        if (number !== null) {
          if (base === "le" || base === "be") {
            endian = base;
            base = 10;
          }
          this._init(number || 0, base || 10, endian || "be");
        }
      }
      if (typeof module2 === "object") {
        module2.exports = BN2;
      } else {
        exports2.BN = BN2;
      }
      BN2.BN = BN2;
      BN2.wordSize = 26;
      var Buffer2;
      try {
        if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") {
          Buffer2 = window.Buffer;
        } else {
          Buffer2 = require_buffer().Buffer;
        }
      } catch (e) {
      }
      BN2.isBN = function isBN(num) {
        if (num instanceof BN2) {
          return true;
        }
        return num !== null && typeof num === "object" && num.constructor.wordSize === BN2.wordSize && Array.isArray(num.words);
      };
      BN2.max = function max2(left, right) {
        if (left.cmp(right) > 0)
          return left;
        return right;
      };
      BN2.min = function min(left, right) {
        if (left.cmp(right) < 0)
          return left;
        return right;
      };
      BN2.prototype._init = function init(number, base, endian) {
        if (typeof number === "number") {
          return this._initNumber(number, base, endian);
        }
        if (typeof number === "object") {
          return this._initArray(number, base, endian);
        }
        if (base === "hex") {
          base = 16;
        }
        assert2(base === (base | 0) && base >= 2 && base <= 36);
        number = number.toString().replace(/\s+/g, "");
        var start = 0;
        if (number[0] === "-") {
          start++;
          this.negative = 1;
        }
        if (start < number.length) {
          if (base === 16) {
            this._parseHex(number, start, endian);
          } else {
            this._parseBase(number, base, start);
            if (endian === "le") {
              this._initArray(this.toArray(), base, endian);
            }
          }
        }
      };
      BN2.prototype._initNumber = function _initNumber(number, base, endian) {
        if (number < 0) {
          this.negative = 1;
          number = -number;
        }
        if (number < 67108864) {
          this.words = [number & 67108863];
          this.length = 1;
        } else if (number < 4503599627370496) {
          this.words = [
            number & 67108863,
            number / 67108864 & 67108863
          ];
          this.length = 2;
        } else {
          assert2(number < 9007199254740992);
          this.words = [
            number & 67108863,
            number / 67108864 & 67108863,
            1
          ];
          this.length = 3;
        }
        if (endian !== "le")
          return;
        this._initArray(this.toArray(), base, endian);
      };
      BN2.prototype._initArray = function _initArray(number, base, endian) {
        assert2(typeof number.length === "number");
        if (number.length <= 0) {
          this.words = [0];
          this.length = 1;
          return this;
        }
        this.length = Math.ceil(number.length / 3);
        this.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
          this.words[i] = 0;
        }
        var j, w;
        var off = 0;
        if (endian === "be") {
          for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
            w = number[i] | number[i - 1] << 8 | number[i - 2] << 16;
            this.words[j] |= w << off & 67108863;
            this.words[j + 1] = w >>> 26 - off & 67108863;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
        } else if (endian === "le") {
          for (i = 0, j = 0; i < number.length; i += 3) {
            w = number[i] | number[i + 1] << 8 | number[i + 2] << 16;
            this.words[j] |= w << off & 67108863;
            this.words[j + 1] = w >>> 26 - off & 67108863;
            off += 24;
            if (off >= 26) {
              off -= 26;
              j++;
            }
          }
        }
        return this.strip();
      };
      function parseHex4Bits(string, index) {
        var c = string.charCodeAt(index);
        if (c >= 65 && c <= 70) {
          return c - 55;
        } else if (c >= 97 && c <= 102) {
          return c - 87;
        } else {
          return c - 48 & 15;
        }
      }
      function parseHexByte(string, lowerBound, index) {
        var r = parseHex4Bits(string, index);
        if (index - 1 >= lowerBound) {
          r |= parseHex4Bits(string, index - 1) << 4;
        }
        return r;
      }
      BN2.prototype._parseHex = function _parseHex(number, start, endian) {
        this.length = Math.ceil((number.length - start) / 6);
        this.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
          this.words[i] = 0;
        }
        var off = 0;
        var j = 0;
        var w;
        if (endian === "be") {
          for (i = number.length - 1; i >= start; i -= 2) {
            w = parseHexByte(number, start, i) << off;
            this.words[j] |= w & 67108863;
            if (off >= 18) {
              off -= 18;
              j += 1;
              this.words[j] |= w >>> 26;
            } else {
              off += 8;
            }
          }
        } else {
          var parseLength = number.length - start;
          for (i = parseLength % 2 === 0 ? start + 1 : start; i < number.length; i += 2) {
            w = parseHexByte(number, start, i) << off;
            this.words[j] |= w & 67108863;
            if (off >= 18) {
              off -= 18;
              j += 1;
              this.words[j] |= w >>> 26;
            } else {
              off += 8;
            }
          }
        }
        this.strip();
      };
      function parseBase(str, start, end, mul) {
        var r = 0;
        var len = Math.min(str.length, end);
        for (var i = start; i < len; i++) {
          var c = str.charCodeAt(i) - 48;
          r *= mul;
          if (c >= 49) {
            r += c - 49 + 10;
          } else if (c >= 17) {
            r += c - 17 + 10;
          } else {
            r += c;
          }
        }
        return r;
      }
      BN2.prototype._parseBase = function _parseBase(number, base, start) {
        this.words = [0];
        this.length = 1;
        for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base) {
          limbLen++;
        }
        limbLen--;
        limbPow = limbPow / base | 0;
        var total = number.length - start;
        var mod = total % limbLen;
        var end = Math.min(total, total - mod) + start;
        var word = 0;
        for (var i = start; i < end; i += limbLen) {
          word = parseBase(number, i, i + limbLen, base);
          this.imuln(limbPow);
          if (this.words[0] + word < 67108864) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }
        if (mod !== 0) {
          var pow = 1;
          word = parseBase(number, i, number.length, base);
          for (i = 0; i < mod; i++) {
            pow *= base;
          }
          this.imuln(pow);
          if (this.words[0] + word < 67108864) {
            this.words[0] += word;
          } else {
            this._iaddn(word);
          }
        }
        this.strip();
      };
      BN2.prototype.copy = function copy(dest) {
        dest.words = new Array(this.length);
        for (var i = 0; i < this.length; i++) {
          dest.words[i] = this.words[i];
        }
        dest.length = this.length;
        dest.negative = this.negative;
        dest.red = this.red;
      };
      BN2.prototype.clone = function clone() {
        var r = new BN2(null);
        this.copy(r);
        return r;
      };
      BN2.prototype._expand = function _expand(size) {
        while (this.length < size) {
          this.words[this.length++] = 0;
        }
        return this;
      };
      BN2.prototype.strip = function strip() {
        while (this.length > 1 && this.words[this.length - 1] === 0) {
          this.length--;
        }
        return this._normSign();
      };
      BN2.prototype._normSign = function _normSign() {
        if (this.length === 1 && this.words[0] === 0) {
          this.negative = 0;
        }
        return this;
      };
      BN2.prototype.inspect = function inspect() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
      };
      var zeros = [
        "",
        "0",
        "00",
        "000",
        "0000",
        "00000",
        "000000",
        "0000000",
        "00000000",
        "000000000",
        "0000000000",
        "00000000000",
        "000000000000",
        "0000000000000",
        "00000000000000",
        "000000000000000",
        "0000000000000000",
        "00000000000000000",
        "000000000000000000",
        "0000000000000000000",
        "00000000000000000000",
        "000000000000000000000",
        "0000000000000000000000",
        "00000000000000000000000",
        "000000000000000000000000",
        "0000000000000000000000000"
      ];
      var groupSizes = [
        0,
        0,
        25,
        16,
        12,
        11,
        10,
        9,
        8,
        8,
        7,
        7,
        7,
        7,
        6,
        6,
        6,
        6,
        6,
        6,
        6,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5,
        5
      ];
      var groupBases = [
        0,
        0,
        33554432,
        43046721,
        16777216,
        48828125,
        60466176,
        40353607,
        16777216,
        43046721,
        1e7,
        19487171,
        35831808,
        62748517,
        7529536,
        11390625,
        16777216,
        24137569,
        34012224,
        47045881,
        64e6,
        4084101,
        5153632,
        6436343,
        7962624,
        9765625,
        11881376,
        14348907,
        17210368,
        20511149,
        243e5,
        28629151,
        33554432,
        39135393,
        45435424,
        52521875,
        60466176
      ];
      BN2.prototype.toString = function toString(base, padding) {
        base = base || 10;
        padding = padding | 0 || 1;
        var out;
        if (base === 16 || base === "hex") {
          out = "";
          var off = 0;
          var carry = 0;
          for (var i = 0; i < this.length; i++) {
            var w = this.words[i];
            var word = ((w << off | carry) & 16777215).toString(16);
            carry = w >>> 24 - off & 16777215;
            if (carry !== 0 || i !== this.length - 1) {
              out = zeros[6 - word.length] + word + out;
            } else {
              out = word + out;
            }
            off += 2;
            if (off >= 26) {
              off -= 26;
              i--;
            }
          }
          if (carry !== 0) {
            out = carry.toString(16) + out;
          }
          while (out.length % padding !== 0) {
            out = "0" + out;
          }
          if (this.negative !== 0) {
            out = "-" + out;
          }
          return out;
        }
        if (base === (base | 0) && base >= 2 && base <= 36) {
          var groupSize = groupSizes[base];
          var groupBase = groupBases[base];
          out = "";
          var c = this.clone();
          c.negative = 0;
          while (!c.isZero()) {
            var r = c.modn(groupBase).toString(base);
            c = c.idivn(groupBase);
            if (!c.isZero()) {
              out = zeros[groupSize - r.length] + r + out;
            } else {
              out = r + out;
            }
          }
          if (this.isZero()) {
            out = "0" + out;
          }
          while (out.length % padding !== 0) {
            out = "0" + out;
          }
          if (this.negative !== 0) {
            out = "-" + out;
          }
          return out;
        }
        assert2(false, "Base should be between 2 and 36");
      };
      BN2.prototype.toNumber = function toNumber2() {
        var ret2 = this.words[0];
        if (this.length === 2) {
          ret2 += this.words[1] * 67108864;
        } else if (this.length === 3 && this.words[2] === 1) {
          ret2 += 4503599627370496 + this.words[1] * 67108864;
        } else if (this.length > 2) {
          assert2(false, "Number can only safely store up to 53 bits");
        }
        return this.negative !== 0 ? -ret2 : ret2;
      };
      BN2.prototype.toJSON = function toJSON() {
        return this.toString(16);
      };
      BN2.prototype.toBuffer = function toBuffer(endian, length) {
        assert2(typeof Buffer2 !== "undefined");
        return this.toArrayLike(Buffer2, endian, length);
      };
      BN2.prototype.toArray = function toArray(endian, length) {
        return this.toArrayLike(Array, endian, length);
      };
      BN2.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
        var byteLength = this.byteLength();
        var reqLength = length || Math.max(1, byteLength);
        assert2(byteLength <= reqLength, "byte array longer than desired length");
        assert2(reqLength > 0, "Requested array length <= 0");
        this.strip();
        var littleEndian = endian === "le";
        var res = new ArrayType(reqLength);
        var b, i;
        var q = this.clone();
        if (!littleEndian) {
          for (i = 0; i < reqLength - byteLength; i++) {
            res[i] = 0;
          }
          for (i = 0; !q.isZero(); i++) {
            b = q.andln(255);
            q.iushrn(8);
            res[reqLength - i - 1] = b;
          }
        } else {
          for (i = 0; !q.isZero(); i++) {
            b = q.andln(255);
            q.iushrn(8);
            res[i] = b;
          }
          for (; i < reqLength; i++) {
            res[i] = 0;
          }
        }
        return res;
      };
      if (Math.clz32) {
        BN2.prototype._countBits = function _countBits(w) {
          return 32 - Math.clz32(w);
        };
      } else {
        BN2.prototype._countBits = function _countBits(w) {
          var t = w;
          var r = 0;
          if (t >= 4096) {
            r += 13;
            t >>>= 13;
          }
          if (t >= 64) {
            r += 7;
            t >>>= 7;
          }
          if (t >= 8) {
            r += 4;
            t >>>= 4;
          }
          if (t >= 2) {
            r += 2;
            t >>>= 2;
          }
          return r + t;
        };
      }
      BN2.prototype._zeroBits = function _zeroBits(w) {
        if (w === 0)
          return 26;
        var t = w;
        var r = 0;
        if ((t & 8191) === 0) {
          r += 13;
          t >>>= 13;
        }
        if ((t & 127) === 0) {
          r += 7;
          t >>>= 7;
        }
        if ((t & 15) === 0) {
          r += 4;
          t >>>= 4;
        }
        if ((t & 3) === 0) {
          r += 2;
          t >>>= 2;
        }
        if ((t & 1) === 0) {
          r++;
        }
        return r;
      };
      BN2.prototype.bitLength = function bitLength() {
        var w = this.words[this.length - 1];
        var hi = this._countBits(w);
        return (this.length - 1) * 26 + hi;
      };
      function toBitArray(num) {
        var w = new Array(num.bitLength());
        for (var bit = 0; bit < w.length; bit++) {
          var off = bit / 26 | 0;
          var wbit = bit % 26;
          w[bit] = (num.words[off] & 1 << wbit) >>> wbit;
        }
        return w;
      }
      BN2.prototype.zeroBits = function zeroBits() {
        if (this.isZero())
          return 0;
        var r = 0;
        for (var i = 0; i < this.length; i++) {
          var b = this._zeroBits(this.words[i]);
          r += b;
          if (b !== 26)
            break;
        }
        return r;
      };
      BN2.prototype.byteLength = function byteLength() {
        return Math.ceil(this.bitLength() / 8);
      };
      BN2.prototype.toTwos = function toTwos(width) {
        if (this.negative !== 0) {
          return this.abs().inotn(width).iaddn(1);
        }
        return this.clone();
      };
      BN2.prototype.fromTwos = function fromTwos(width) {
        if (this.testn(width - 1)) {
          return this.notn(width).iaddn(1).ineg();
        }
        return this.clone();
      };
      BN2.prototype.isNeg = function isNeg() {
        return this.negative !== 0;
      };
      BN2.prototype.neg = function neg() {
        return this.clone().ineg();
      };
      BN2.prototype.ineg = function ineg() {
        if (!this.isZero()) {
          this.negative ^= 1;
        }
        return this;
      };
      BN2.prototype.iuor = function iuor(num) {
        while (this.length < num.length) {
          this.words[this.length++] = 0;
        }
        for (var i = 0; i < num.length; i++) {
          this.words[i] = this.words[i] | num.words[i];
        }
        return this.strip();
      };
      BN2.prototype.ior = function ior(num) {
        assert2((this.negative | num.negative) === 0);
        return this.iuor(num);
      };
      BN2.prototype.or = function or(num) {
        if (this.length > num.length)
          return this.clone().ior(num);
        return num.clone().ior(this);
      };
      BN2.prototype.uor = function uor(num) {
        if (this.length > num.length)
          return this.clone().iuor(num);
        return num.clone().iuor(this);
      };
      BN2.prototype.iuand = function iuand(num) {
        var b;
        if (this.length > num.length) {
          b = num;
        } else {
          b = this;
        }
        for (var i = 0; i < b.length; i++) {
          this.words[i] = this.words[i] & num.words[i];
        }
        this.length = b.length;
        return this.strip();
      };
      BN2.prototype.iand = function iand(num) {
        assert2((this.negative | num.negative) === 0);
        return this.iuand(num);
      };
      BN2.prototype.and = function and(num) {
        if (this.length > num.length)
          return this.clone().iand(num);
        return num.clone().iand(this);
      };
      BN2.prototype.uand = function uand(num) {
        if (this.length > num.length)
          return this.clone().iuand(num);
        return num.clone().iuand(this);
      };
      BN2.prototype.iuxor = function iuxor(num) {
        var a;
        var b;
        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        for (var i = 0; i < b.length; i++) {
          this.words[i] = a.words[i] ^ b.words[i];
        }
        if (this !== a) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }
        this.length = a.length;
        return this.strip();
      };
      BN2.prototype.ixor = function ixor(num) {
        assert2((this.negative | num.negative) === 0);
        return this.iuxor(num);
      };
      BN2.prototype.xor = function xor(num) {
        if (this.length > num.length)
          return this.clone().ixor(num);
        return num.clone().ixor(this);
      };
      BN2.prototype.uxor = function uxor(num) {
        if (this.length > num.length)
          return this.clone().iuxor(num);
        return num.clone().iuxor(this);
      };
      BN2.prototype.inotn = function inotn(width) {
        assert2(typeof width === "number" && width >= 0);
        var bytesNeeded = Math.ceil(width / 26) | 0;
        var bitsLeft = width % 26;
        this._expand(bytesNeeded);
        if (bitsLeft > 0) {
          bytesNeeded--;
        }
        for (var i = 0; i < bytesNeeded; i++) {
          this.words[i] = ~this.words[i] & 67108863;
        }
        if (bitsLeft > 0) {
          this.words[i] = ~this.words[i] & 67108863 >> 26 - bitsLeft;
        }
        return this.strip();
      };
      BN2.prototype.notn = function notn(width) {
        return this.clone().inotn(width);
      };
      BN2.prototype.setn = function setn(bit, val) {
        assert2(typeof bit === "number" && bit >= 0);
        var off = bit / 26 | 0;
        var wbit = bit % 26;
        this._expand(off + 1);
        if (val) {
          this.words[off] = this.words[off] | 1 << wbit;
        } else {
          this.words[off] = this.words[off] & ~(1 << wbit);
        }
        return this.strip();
      };
      BN2.prototype.iadd = function iadd(num) {
        var r;
        if (this.negative !== 0 && num.negative === 0) {
          this.negative = 0;
          r = this.isub(num);
          this.negative ^= 1;
          return this._normSign();
        } else if (this.negative === 0 && num.negative !== 0) {
          num.negative = 0;
          r = this.isub(num);
          num.negative = 1;
          return r._normSign();
        }
        var a, b;
        if (this.length > num.length) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        var carry = 0;
        for (var i = 0; i < b.length; i++) {
          r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
          this.words[i] = r & 67108863;
          carry = r >>> 26;
        }
        for (; carry !== 0 && i < a.length; i++) {
          r = (a.words[i] | 0) + carry;
          this.words[i] = r & 67108863;
          carry = r >>> 26;
        }
        this.length = a.length;
        if (carry !== 0) {
          this.words[this.length] = carry;
          this.length++;
        } else if (a !== this) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }
        return this;
      };
      BN2.prototype.add = function add(num) {
        var res;
        if (num.negative !== 0 && this.negative === 0) {
          num.negative = 0;
          res = this.sub(num);
          num.negative ^= 1;
          return res;
        } else if (num.negative === 0 && this.negative !== 0) {
          this.negative = 0;
          res = num.sub(this);
          this.negative = 1;
          return res;
        }
        if (this.length > num.length)
          return this.clone().iadd(num);
        return num.clone().iadd(this);
      };
      BN2.prototype.isub = function isub(num) {
        if (num.negative !== 0) {
          num.negative = 0;
          var r = this.iadd(num);
          num.negative = 1;
          return r._normSign();
        } else if (this.negative !== 0) {
          this.negative = 0;
          this.iadd(num);
          this.negative = 1;
          return this._normSign();
        }
        var cmp = this.cmp(num);
        if (cmp === 0) {
          this.negative = 0;
          this.length = 1;
          this.words[0] = 0;
          return this;
        }
        var a, b;
        if (cmp > 0) {
          a = this;
          b = num;
        } else {
          a = num;
          b = this;
        }
        var carry = 0;
        for (var i = 0; i < b.length; i++) {
          r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
          carry = r >> 26;
          this.words[i] = r & 67108863;
        }
        for (; carry !== 0 && i < a.length; i++) {
          r = (a.words[i] | 0) + carry;
          carry = r >> 26;
          this.words[i] = r & 67108863;
        }
        if (carry === 0 && i < a.length && a !== this) {
          for (; i < a.length; i++) {
            this.words[i] = a.words[i];
          }
        }
        this.length = Math.max(this.length, i);
        if (a !== this) {
          this.negative = 1;
        }
        return this.strip();
      };
      BN2.prototype.sub = function sub(num) {
        return this.clone().isub(num);
      };
      function smallMulTo(self2, num, out) {
        out.negative = num.negative ^ self2.negative;
        var len = self2.length + num.length | 0;
        out.length = len;
        len = len - 1 | 0;
        var a = self2.words[0] | 0;
        var b = num.words[0] | 0;
        var r = a * b;
        var lo = r & 67108863;
        var carry = r / 67108864 | 0;
        out.words[0] = lo;
        for (var k = 1; k < len; k++) {
          var ncarry = carry >>> 26;
          var rword = carry & 67108863;
          var maxJ = Math.min(k, num.length - 1);
          for (var j = Math.max(0, k - self2.length + 1); j <= maxJ; j++) {
            var i = k - j | 0;
            a = self2.words[i] | 0;
            b = num.words[j] | 0;
            r = a * b + rword;
            ncarry += r / 67108864 | 0;
            rword = r & 67108863;
          }
          out.words[k] = rword | 0;
          carry = ncarry | 0;
        }
        if (carry !== 0) {
          out.words[k] = carry | 0;
        } else {
          out.length--;
        }
        return out.strip();
      }
      var comb10MulTo = function comb10MulTo2(self2, num, out) {
        var a = self2.words;
        var b = num.words;
        var o = out.words;
        var c = 0;
        var lo;
        var mid;
        var hi;
        var a0 = a[0] | 0;
        var al0 = a0 & 8191;
        var ah0 = a0 >>> 13;
        var a1 = a[1] | 0;
        var al1 = a1 & 8191;
        var ah1 = a1 >>> 13;
        var a2 = a[2] | 0;
        var al2 = a2 & 8191;
        var ah2 = a2 >>> 13;
        var a3 = a[3] | 0;
        var al3 = a3 & 8191;
        var ah3 = a3 >>> 13;
        var a4 = a[4] | 0;
        var al4 = a4 & 8191;
        var ah4 = a4 >>> 13;
        var a5 = a[5] | 0;
        var al5 = a5 & 8191;
        var ah5 = a5 >>> 13;
        var a6 = a[6] | 0;
        var al6 = a6 & 8191;
        var ah6 = a6 >>> 13;
        var a7 = a[7] | 0;
        var al7 = a7 & 8191;
        var ah7 = a7 >>> 13;
        var a8 = a[8] | 0;
        var al8 = a8 & 8191;
        var ah8 = a8 >>> 13;
        var a9 = a[9] | 0;
        var al9 = a9 & 8191;
        var ah9 = a9 >>> 13;
        var b0 = b[0] | 0;
        var bl0 = b0 & 8191;
        var bh0 = b0 >>> 13;
        var b1 = b[1] | 0;
        var bl1 = b1 & 8191;
        var bh1 = b1 >>> 13;
        var b2 = b[2] | 0;
        var bl2 = b2 & 8191;
        var bh2 = b2 >>> 13;
        var b3 = b[3] | 0;
        var bl3 = b3 & 8191;
        var bh3 = b3 >>> 13;
        var b4 = b[4] | 0;
        var bl4 = b4 & 8191;
        var bh4 = b4 >>> 13;
        var b5 = b[5] | 0;
        var bl5 = b5 & 8191;
        var bh5 = b5 >>> 13;
        var b6 = b[6] | 0;
        var bl6 = b6 & 8191;
        var bh6 = b6 >>> 13;
        var b7 = b[7] | 0;
        var bl7 = b7 & 8191;
        var bh7 = b7 >>> 13;
        var b8 = b[8] | 0;
        var bl8 = b8 & 8191;
        var bh8 = b8 >>> 13;
        var b9 = b[9] | 0;
        var bl9 = b9 & 8191;
        var bh9 = b9 >>> 13;
        out.negative = self2.negative ^ num.negative;
        out.length = 19;
        lo = Math.imul(al0, bl0);
        mid = Math.imul(al0, bh0);
        mid = mid + Math.imul(ah0, bl0) | 0;
        hi = Math.imul(ah0, bh0);
        var w0 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
        w0 &= 67108863;
        lo = Math.imul(al1, bl0);
        mid = Math.imul(al1, bh0);
        mid = mid + Math.imul(ah1, bl0) | 0;
        hi = Math.imul(ah1, bh0);
        lo = lo + Math.imul(al0, bl1) | 0;
        mid = mid + Math.imul(al0, bh1) | 0;
        mid = mid + Math.imul(ah0, bl1) | 0;
        hi = hi + Math.imul(ah0, bh1) | 0;
        var w1 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
        w1 &= 67108863;
        lo = Math.imul(al2, bl0);
        mid = Math.imul(al2, bh0);
        mid = mid + Math.imul(ah2, bl0) | 0;
        hi = Math.imul(ah2, bh0);
        lo = lo + Math.imul(al1, bl1) | 0;
        mid = mid + Math.imul(al1, bh1) | 0;
        mid = mid + Math.imul(ah1, bl1) | 0;
        hi = hi + Math.imul(ah1, bh1) | 0;
        lo = lo + Math.imul(al0, bl2) | 0;
        mid = mid + Math.imul(al0, bh2) | 0;
        mid = mid + Math.imul(ah0, bl2) | 0;
        hi = hi + Math.imul(ah0, bh2) | 0;
        var w2 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
        w2 &= 67108863;
        lo = Math.imul(al3, bl0);
        mid = Math.imul(al3, bh0);
        mid = mid + Math.imul(ah3, bl0) | 0;
        hi = Math.imul(ah3, bh0);
        lo = lo + Math.imul(al2, bl1) | 0;
        mid = mid + Math.imul(al2, bh1) | 0;
        mid = mid + Math.imul(ah2, bl1) | 0;
        hi = hi + Math.imul(ah2, bh1) | 0;
        lo = lo + Math.imul(al1, bl2) | 0;
        mid = mid + Math.imul(al1, bh2) | 0;
        mid = mid + Math.imul(ah1, bl2) | 0;
        hi = hi + Math.imul(ah1, bh2) | 0;
        lo = lo + Math.imul(al0, bl3) | 0;
        mid = mid + Math.imul(al0, bh3) | 0;
        mid = mid + Math.imul(ah0, bl3) | 0;
        hi = hi + Math.imul(ah0, bh3) | 0;
        var w3 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
        w3 &= 67108863;
        lo = Math.imul(al4, bl0);
        mid = Math.imul(al4, bh0);
        mid = mid + Math.imul(ah4, bl0) | 0;
        hi = Math.imul(ah4, bh0);
        lo = lo + Math.imul(al3, bl1) | 0;
        mid = mid + Math.imul(al3, bh1) | 0;
        mid = mid + Math.imul(ah3, bl1) | 0;
        hi = hi + Math.imul(ah3, bh1) | 0;
        lo = lo + Math.imul(al2, bl2) | 0;
        mid = mid + Math.imul(al2, bh2) | 0;
        mid = mid + Math.imul(ah2, bl2) | 0;
        hi = hi + Math.imul(ah2, bh2) | 0;
        lo = lo + Math.imul(al1, bl3) | 0;
        mid = mid + Math.imul(al1, bh3) | 0;
        mid = mid + Math.imul(ah1, bl3) | 0;
        hi = hi + Math.imul(ah1, bh3) | 0;
        lo = lo + Math.imul(al0, bl4) | 0;
        mid = mid + Math.imul(al0, bh4) | 0;
        mid = mid + Math.imul(ah0, bl4) | 0;
        hi = hi + Math.imul(ah0, bh4) | 0;
        var w4 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
        w4 &= 67108863;
        lo = Math.imul(al5, bl0);
        mid = Math.imul(al5, bh0);
        mid = mid + Math.imul(ah5, bl0) | 0;
        hi = Math.imul(ah5, bh0);
        lo = lo + Math.imul(al4, bl1) | 0;
        mid = mid + Math.imul(al4, bh1) | 0;
        mid = mid + Math.imul(ah4, bl1) | 0;
        hi = hi + Math.imul(ah4, bh1) | 0;
        lo = lo + Math.imul(al3, bl2) | 0;
        mid = mid + Math.imul(al3, bh2) | 0;
        mid = mid + Math.imul(ah3, bl2) | 0;
        hi = hi + Math.imul(ah3, bh2) | 0;
        lo = lo + Math.imul(al2, bl3) | 0;
        mid = mid + Math.imul(al2, bh3) | 0;
        mid = mid + Math.imul(ah2, bl3) | 0;
        hi = hi + Math.imul(ah2, bh3) | 0;
        lo = lo + Math.imul(al1, bl4) | 0;
        mid = mid + Math.imul(al1, bh4) | 0;
        mid = mid + Math.imul(ah1, bl4) | 0;
        hi = hi + Math.imul(ah1, bh4) | 0;
        lo = lo + Math.imul(al0, bl5) | 0;
        mid = mid + Math.imul(al0, bh5) | 0;
        mid = mid + Math.imul(ah0, bl5) | 0;
        hi = hi + Math.imul(ah0, bh5) | 0;
        var w5 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
        w5 &= 67108863;
        lo = Math.imul(al6, bl0);
        mid = Math.imul(al6, bh0);
        mid = mid + Math.imul(ah6, bl0) | 0;
        hi = Math.imul(ah6, bh0);
        lo = lo + Math.imul(al5, bl1) | 0;
        mid = mid + Math.imul(al5, bh1) | 0;
        mid = mid + Math.imul(ah5, bl1) | 0;
        hi = hi + Math.imul(ah5, bh1) | 0;
        lo = lo + Math.imul(al4, bl2) | 0;
        mid = mid + Math.imul(al4, bh2) | 0;
        mid = mid + Math.imul(ah4, bl2) | 0;
        hi = hi + Math.imul(ah4, bh2) | 0;
        lo = lo + Math.imul(al3, bl3) | 0;
        mid = mid + Math.imul(al3, bh3) | 0;
        mid = mid + Math.imul(ah3, bl3) | 0;
        hi = hi + Math.imul(ah3, bh3) | 0;
        lo = lo + Math.imul(al2, bl4) | 0;
        mid = mid + Math.imul(al2, bh4) | 0;
        mid = mid + Math.imul(ah2, bl4) | 0;
        hi = hi + Math.imul(ah2, bh4) | 0;
        lo = lo + Math.imul(al1, bl5) | 0;
        mid = mid + Math.imul(al1, bh5) | 0;
        mid = mid + Math.imul(ah1, bl5) | 0;
        hi = hi + Math.imul(ah1, bh5) | 0;
        lo = lo + Math.imul(al0, bl6) | 0;
        mid = mid + Math.imul(al0, bh6) | 0;
        mid = mid + Math.imul(ah0, bl6) | 0;
        hi = hi + Math.imul(ah0, bh6) | 0;
        var w6 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
        w6 &= 67108863;
        lo = Math.imul(al7, bl0);
        mid = Math.imul(al7, bh0);
        mid = mid + Math.imul(ah7, bl0) | 0;
        hi = Math.imul(ah7, bh0);
        lo = lo + Math.imul(al6, bl1) | 0;
        mid = mid + Math.imul(al6, bh1) | 0;
        mid = mid + Math.imul(ah6, bl1) | 0;
        hi = hi + Math.imul(ah6, bh1) | 0;
        lo = lo + Math.imul(al5, bl2) | 0;
        mid = mid + Math.imul(al5, bh2) | 0;
        mid = mid + Math.imul(ah5, bl2) | 0;
        hi = hi + Math.imul(ah5, bh2) | 0;
        lo = lo + Math.imul(al4, bl3) | 0;
        mid = mid + Math.imul(al4, bh3) | 0;
        mid = mid + Math.imul(ah4, bl3) | 0;
        hi = hi + Math.imul(ah4, bh3) | 0;
        lo = lo + Math.imul(al3, bl4) | 0;
        mid = mid + Math.imul(al3, bh4) | 0;
        mid = mid + Math.imul(ah3, bl4) | 0;
        hi = hi + Math.imul(ah3, bh4) | 0;
        lo = lo + Math.imul(al2, bl5) | 0;
        mid = mid + Math.imul(al2, bh5) | 0;
        mid = mid + Math.imul(ah2, bl5) | 0;
        hi = hi + Math.imul(ah2, bh5) | 0;
        lo = lo + Math.imul(al1, bl6) | 0;
        mid = mid + Math.imul(al1, bh6) | 0;
        mid = mid + Math.imul(ah1, bl6) | 0;
        hi = hi + Math.imul(ah1, bh6) | 0;
        lo = lo + Math.imul(al0, bl7) | 0;
        mid = mid + Math.imul(al0, bh7) | 0;
        mid = mid + Math.imul(ah0, bl7) | 0;
        hi = hi + Math.imul(ah0, bh7) | 0;
        var w7 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
        w7 &= 67108863;
        lo = Math.imul(al8, bl0);
        mid = Math.imul(al8, bh0);
        mid = mid + Math.imul(ah8, bl0) | 0;
        hi = Math.imul(ah8, bh0);
        lo = lo + Math.imul(al7, bl1) | 0;
        mid = mid + Math.imul(al7, bh1) | 0;
        mid = mid + Math.imul(ah7, bl1) | 0;
        hi = hi + Math.imul(ah7, bh1) | 0;
        lo = lo + Math.imul(al6, bl2) | 0;
        mid = mid + Math.imul(al6, bh2) | 0;
        mid = mid + Math.imul(ah6, bl2) | 0;
        hi = hi + Math.imul(ah6, bh2) | 0;
        lo = lo + Math.imul(al5, bl3) | 0;
        mid = mid + Math.imul(al5, bh3) | 0;
        mid = mid + Math.imul(ah5, bl3) | 0;
        hi = hi + Math.imul(ah5, bh3) | 0;
        lo = lo + Math.imul(al4, bl4) | 0;
        mid = mid + Math.imul(al4, bh4) | 0;
        mid = mid + Math.imul(ah4, bl4) | 0;
        hi = hi + Math.imul(ah4, bh4) | 0;
        lo = lo + Math.imul(al3, bl5) | 0;
        mid = mid + Math.imul(al3, bh5) | 0;
        mid = mid + Math.imul(ah3, bl5) | 0;
        hi = hi + Math.imul(ah3, bh5) | 0;
        lo = lo + Math.imul(al2, bl6) | 0;
        mid = mid + Math.imul(al2, bh6) | 0;
        mid = mid + Math.imul(ah2, bl6) | 0;
        hi = hi + Math.imul(ah2, bh6) | 0;
        lo = lo + Math.imul(al1, bl7) | 0;
        mid = mid + Math.imul(al1, bh7) | 0;
        mid = mid + Math.imul(ah1, bl7) | 0;
        hi = hi + Math.imul(ah1, bh7) | 0;
        lo = lo + Math.imul(al0, bl8) | 0;
        mid = mid + Math.imul(al0, bh8) | 0;
        mid = mid + Math.imul(ah0, bl8) | 0;
        hi = hi + Math.imul(ah0, bh8) | 0;
        var w8 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
        w8 &= 67108863;
        lo = Math.imul(al9, bl0);
        mid = Math.imul(al9, bh0);
        mid = mid + Math.imul(ah9, bl0) | 0;
        hi = Math.imul(ah9, bh0);
        lo = lo + Math.imul(al8, bl1) | 0;
        mid = mid + Math.imul(al8, bh1) | 0;
        mid = mid + Math.imul(ah8, bl1) | 0;
        hi = hi + Math.imul(ah8, bh1) | 0;
        lo = lo + Math.imul(al7, bl2) | 0;
        mid = mid + Math.imul(al7, bh2) | 0;
        mid = mid + Math.imul(ah7, bl2) | 0;
        hi = hi + Math.imul(ah7, bh2) | 0;
        lo = lo + Math.imul(al6, bl3) | 0;
        mid = mid + Math.imul(al6, bh3) | 0;
        mid = mid + Math.imul(ah6, bl3) | 0;
        hi = hi + Math.imul(ah6, bh3) | 0;
        lo = lo + Math.imul(al5, bl4) | 0;
        mid = mid + Math.imul(al5, bh4) | 0;
        mid = mid + Math.imul(ah5, bl4) | 0;
        hi = hi + Math.imul(ah5, bh4) | 0;
        lo = lo + Math.imul(al4, bl5) | 0;
        mid = mid + Math.imul(al4, bh5) | 0;
        mid = mid + Math.imul(ah4, bl5) | 0;
        hi = hi + Math.imul(ah4, bh5) | 0;
        lo = lo + Math.imul(al3, bl6) | 0;
        mid = mid + Math.imul(al3, bh6) | 0;
        mid = mid + Math.imul(ah3, bl6) | 0;
        hi = hi + Math.imul(ah3, bh6) | 0;
        lo = lo + Math.imul(al2, bl7) | 0;
        mid = mid + Math.imul(al2, bh7) | 0;
        mid = mid + Math.imul(ah2, bl7) | 0;
        hi = hi + Math.imul(ah2, bh7) | 0;
        lo = lo + Math.imul(al1, bl8) | 0;
        mid = mid + Math.imul(al1, bh8) | 0;
        mid = mid + Math.imul(ah1, bl8) | 0;
        hi = hi + Math.imul(ah1, bh8) | 0;
        lo = lo + Math.imul(al0, bl9) | 0;
        mid = mid + Math.imul(al0, bh9) | 0;
        mid = mid + Math.imul(ah0, bl9) | 0;
        hi = hi + Math.imul(ah0, bh9) | 0;
        var w9 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
        w9 &= 67108863;
        lo = Math.imul(al9, bl1);
        mid = Math.imul(al9, bh1);
        mid = mid + Math.imul(ah9, bl1) | 0;
        hi = Math.imul(ah9, bh1);
        lo = lo + Math.imul(al8, bl2) | 0;
        mid = mid + Math.imul(al8, bh2) | 0;
        mid = mid + Math.imul(ah8, bl2) | 0;
        hi = hi + Math.imul(ah8, bh2) | 0;
        lo = lo + Math.imul(al7, bl3) | 0;
        mid = mid + Math.imul(al7, bh3) | 0;
        mid = mid + Math.imul(ah7, bl3) | 0;
        hi = hi + Math.imul(ah7, bh3) | 0;
        lo = lo + Math.imul(al6, bl4) | 0;
        mid = mid + Math.imul(al6, bh4) | 0;
        mid = mid + Math.imul(ah6, bl4) | 0;
        hi = hi + Math.imul(ah6, bh4) | 0;
        lo = lo + Math.imul(al5, bl5) | 0;
        mid = mid + Math.imul(al5, bh5) | 0;
        mid = mid + Math.imul(ah5, bl5) | 0;
        hi = hi + Math.imul(ah5, bh5) | 0;
        lo = lo + Math.imul(al4, bl6) | 0;
        mid = mid + Math.imul(al4, bh6) | 0;
        mid = mid + Math.imul(ah4, bl6) | 0;
        hi = hi + Math.imul(ah4, bh6) | 0;
        lo = lo + Math.imul(al3, bl7) | 0;
        mid = mid + Math.imul(al3, bh7) | 0;
        mid = mid + Math.imul(ah3, bl7) | 0;
        hi = hi + Math.imul(ah3, bh7) | 0;
        lo = lo + Math.imul(al2, bl8) | 0;
        mid = mid + Math.imul(al2, bh8) | 0;
        mid = mid + Math.imul(ah2, bl8) | 0;
        hi = hi + Math.imul(ah2, bh8) | 0;
        lo = lo + Math.imul(al1, bl9) | 0;
        mid = mid + Math.imul(al1, bh9) | 0;
        mid = mid + Math.imul(ah1, bl9) | 0;
        hi = hi + Math.imul(ah1, bh9) | 0;
        var w10 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
        w10 &= 67108863;
        lo = Math.imul(al9, bl2);
        mid = Math.imul(al9, bh2);
        mid = mid + Math.imul(ah9, bl2) | 0;
        hi = Math.imul(ah9, bh2);
        lo = lo + Math.imul(al8, bl3) | 0;
        mid = mid + Math.imul(al8, bh3) | 0;
        mid = mid + Math.imul(ah8, bl3) | 0;
        hi = hi + Math.imul(ah8, bh3) | 0;
        lo = lo + Math.imul(al7, bl4) | 0;
        mid = mid + Math.imul(al7, bh4) | 0;
        mid = mid + Math.imul(ah7, bl4) | 0;
        hi = hi + Math.imul(ah7, bh4) | 0;
        lo = lo + Math.imul(al6, bl5) | 0;
        mid = mid + Math.imul(al6, bh5) | 0;
        mid = mid + Math.imul(ah6, bl5) | 0;
        hi = hi + Math.imul(ah6, bh5) | 0;
        lo = lo + Math.imul(al5, bl6) | 0;
        mid = mid + Math.imul(al5, bh6) | 0;
        mid = mid + Math.imul(ah5, bl6) | 0;
        hi = hi + Math.imul(ah5, bh6) | 0;
        lo = lo + Math.imul(al4, bl7) | 0;
        mid = mid + Math.imul(al4, bh7) | 0;
        mid = mid + Math.imul(ah4, bl7) | 0;
        hi = hi + Math.imul(ah4, bh7) | 0;
        lo = lo + Math.imul(al3, bl8) | 0;
        mid = mid + Math.imul(al3, bh8) | 0;
        mid = mid + Math.imul(ah3, bl8) | 0;
        hi = hi + Math.imul(ah3, bh8) | 0;
        lo = lo + Math.imul(al2, bl9) | 0;
        mid = mid + Math.imul(al2, bh9) | 0;
        mid = mid + Math.imul(ah2, bl9) | 0;
        hi = hi + Math.imul(ah2, bh9) | 0;
        var w11 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
        w11 &= 67108863;
        lo = Math.imul(al9, bl3);
        mid = Math.imul(al9, bh3);
        mid = mid + Math.imul(ah9, bl3) | 0;
        hi = Math.imul(ah9, bh3);
        lo = lo + Math.imul(al8, bl4) | 0;
        mid = mid + Math.imul(al8, bh4) | 0;
        mid = mid + Math.imul(ah8, bl4) | 0;
        hi = hi + Math.imul(ah8, bh4) | 0;
        lo = lo + Math.imul(al7, bl5) | 0;
        mid = mid + Math.imul(al7, bh5) | 0;
        mid = mid + Math.imul(ah7, bl5) | 0;
        hi = hi + Math.imul(ah7, bh5) | 0;
        lo = lo + Math.imul(al6, bl6) | 0;
        mid = mid + Math.imul(al6, bh6) | 0;
        mid = mid + Math.imul(ah6, bl6) | 0;
        hi = hi + Math.imul(ah6, bh6) | 0;
        lo = lo + Math.imul(al5, bl7) | 0;
        mid = mid + Math.imul(al5, bh7) | 0;
        mid = mid + Math.imul(ah5, bl7) | 0;
        hi = hi + Math.imul(ah5, bh7) | 0;
        lo = lo + Math.imul(al4, bl8) | 0;
        mid = mid + Math.imul(al4, bh8) | 0;
        mid = mid + Math.imul(ah4, bl8) | 0;
        hi = hi + Math.imul(ah4, bh8) | 0;
        lo = lo + Math.imul(al3, bl9) | 0;
        mid = mid + Math.imul(al3, bh9) | 0;
        mid = mid + Math.imul(ah3, bl9) | 0;
        hi = hi + Math.imul(ah3, bh9) | 0;
        var w12 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
        w12 &= 67108863;
        lo = Math.imul(al9, bl4);
        mid = Math.imul(al9, bh4);
        mid = mid + Math.imul(ah9, bl4) | 0;
        hi = Math.imul(ah9, bh4);
        lo = lo + Math.imul(al8, bl5) | 0;
        mid = mid + Math.imul(al8, bh5) | 0;
        mid = mid + Math.imul(ah8, bl5) | 0;
        hi = hi + Math.imul(ah8, bh5) | 0;
        lo = lo + Math.imul(al7, bl6) | 0;
        mid = mid + Math.imul(al7, bh6) | 0;
        mid = mid + Math.imul(ah7, bl6) | 0;
        hi = hi + Math.imul(ah7, bh6) | 0;
        lo = lo + Math.imul(al6, bl7) | 0;
        mid = mid + Math.imul(al6, bh7) | 0;
        mid = mid + Math.imul(ah6, bl7) | 0;
        hi = hi + Math.imul(ah6, bh7) | 0;
        lo = lo + Math.imul(al5, bl8) | 0;
        mid = mid + Math.imul(al5, bh8) | 0;
        mid = mid + Math.imul(ah5, bl8) | 0;
        hi = hi + Math.imul(ah5, bh8) | 0;
        lo = lo + Math.imul(al4, bl9) | 0;
        mid = mid + Math.imul(al4, bh9) | 0;
        mid = mid + Math.imul(ah4, bl9) | 0;
        hi = hi + Math.imul(ah4, bh9) | 0;
        var w13 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
        w13 &= 67108863;
        lo = Math.imul(al9, bl5);
        mid = Math.imul(al9, bh5);
        mid = mid + Math.imul(ah9, bl5) | 0;
        hi = Math.imul(ah9, bh5);
        lo = lo + Math.imul(al8, bl6) | 0;
        mid = mid + Math.imul(al8, bh6) | 0;
        mid = mid + Math.imul(ah8, bl6) | 0;
        hi = hi + Math.imul(ah8, bh6) | 0;
        lo = lo + Math.imul(al7, bl7) | 0;
        mid = mid + Math.imul(al7, bh7) | 0;
        mid = mid + Math.imul(ah7, bl7) | 0;
        hi = hi + Math.imul(ah7, bh7) | 0;
        lo = lo + Math.imul(al6, bl8) | 0;
        mid = mid + Math.imul(al6, bh8) | 0;
        mid = mid + Math.imul(ah6, bl8) | 0;
        hi = hi + Math.imul(ah6, bh8) | 0;
        lo = lo + Math.imul(al5, bl9) | 0;
        mid = mid + Math.imul(al5, bh9) | 0;
        mid = mid + Math.imul(ah5, bl9) | 0;
        hi = hi + Math.imul(ah5, bh9) | 0;
        var w14 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
        w14 &= 67108863;
        lo = Math.imul(al9, bl6);
        mid = Math.imul(al9, bh6);
        mid = mid + Math.imul(ah9, bl6) | 0;
        hi = Math.imul(ah9, bh6);
        lo = lo + Math.imul(al8, bl7) | 0;
        mid = mid + Math.imul(al8, bh7) | 0;
        mid = mid + Math.imul(ah8, bl7) | 0;
        hi = hi + Math.imul(ah8, bh7) | 0;
        lo = lo + Math.imul(al7, bl8) | 0;
        mid = mid + Math.imul(al7, bh8) | 0;
        mid = mid + Math.imul(ah7, bl8) | 0;
        hi = hi + Math.imul(ah7, bh8) | 0;
        lo = lo + Math.imul(al6, bl9) | 0;
        mid = mid + Math.imul(al6, bh9) | 0;
        mid = mid + Math.imul(ah6, bl9) | 0;
        hi = hi + Math.imul(ah6, bh9) | 0;
        var w15 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
        w15 &= 67108863;
        lo = Math.imul(al9, bl7);
        mid = Math.imul(al9, bh7);
        mid = mid + Math.imul(ah9, bl7) | 0;
        hi = Math.imul(ah9, bh7);
        lo = lo + Math.imul(al8, bl8) | 0;
        mid = mid + Math.imul(al8, bh8) | 0;
        mid = mid + Math.imul(ah8, bl8) | 0;
        hi = hi + Math.imul(ah8, bh8) | 0;
        lo = lo + Math.imul(al7, bl9) | 0;
        mid = mid + Math.imul(al7, bh9) | 0;
        mid = mid + Math.imul(ah7, bl9) | 0;
        hi = hi + Math.imul(ah7, bh9) | 0;
        var w16 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
        w16 &= 67108863;
        lo = Math.imul(al9, bl8);
        mid = Math.imul(al9, bh8);
        mid = mid + Math.imul(ah9, bl8) | 0;
        hi = Math.imul(ah9, bh8);
        lo = lo + Math.imul(al8, bl9) | 0;
        mid = mid + Math.imul(al8, bh9) | 0;
        mid = mid + Math.imul(ah8, bl9) | 0;
        hi = hi + Math.imul(ah8, bh9) | 0;
        var w17 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
        w17 &= 67108863;
        lo = Math.imul(al9, bl9);
        mid = Math.imul(al9, bh9);
        mid = mid + Math.imul(ah9, bl9) | 0;
        hi = Math.imul(ah9, bh9);
        var w18 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
        c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
        w18 &= 67108863;
        o[0] = w0;
        o[1] = w1;
        o[2] = w2;
        o[3] = w3;
        o[4] = w4;
        o[5] = w5;
        o[6] = w6;
        o[7] = w7;
        o[8] = w8;
        o[9] = w9;
        o[10] = w10;
        o[11] = w11;
        o[12] = w12;
        o[13] = w13;
        o[14] = w14;
        o[15] = w15;
        o[16] = w16;
        o[17] = w17;
        o[18] = w18;
        if (c !== 0) {
          o[19] = c;
          out.length++;
        }
        return out;
      };
      if (!Math.imul) {
        comb10MulTo = smallMulTo;
      }
      function bigMulTo(self2, num, out) {
        out.negative = num.negative ^ self2.negative;
        out.length = self2.length + num.length;
        var carry = 0;
        var hncarry = 0;
        for (var k = 0; k < out.length - 1; k++) {
          var ncarry = hncarry;
          hncarry = 0;
          var rword = carry & 67108863;
          var maxJ = Math.min(k, num.length - 1);
          for (var j = Math.max(0, k - self2.length + 1); j <= maxJ; j++) {
            var i = k - j;
            var a = self2.words[i] | 0;
            var b = num.words[j] | 0;
            var r = a * b;
            var lo = r & 67108863;
            ncarry = ncarry + (r / 67108864 | 0) | 0;
            lo = lo + rword | 0;
            rword = lo & 67108863;
            ncarry = ncarry + (lo >>> 26) | 0;
            hncarry += ncarry >>> 26;
            ncarry &= 67108863;
          }
          out.words[k] = rword;
          carry = ncarry;
          ncarry = hncarry;
        }
        if (carry !== 0) {
          out.words[k] = carry;
        } else {
          out.length--;
        }
        return out.strip();
      }
      function jumboMulTo(self2, num, out) {
        var fftm = new FFTM();
        return fftm.mulp(self2, num, out);
      }
      BN2.prototype.mulTo = function mulTo(num, out) {
        var res;
        var len = this.length + num.length;
        if (this.length === 10 && num.length === 10) {
          res = comb10MulTo(this, num, out);
        } else if (len < 63) {
          res = smallMulTo(this, num, out);
        } else if (len < 1024) {
          res = bigMulTo(this, num, out);
        } else {
          res = jumboMulTo(this, num, out);
        }
        return res;
      };
      function FFTM(x, y) {
        this.x = x;
        this.y = y;
      }
      FFTM.prototype.makeRBT = function makeRBT(N) {
        var t = new Array(N);
        var l = BN2.prototype._countBits(N) - 1;
        for (var i = 0; i < N; i++) {
          t[i] = this.revBin(i, l, N);
        }
        return t;
      };
      FFTM.prototype.revBin = function revBin(x, l, N) {
        if (x === 0 || x === N - 1)
          return x;
        var rb = 0;
        for (var i = 0; i < l; i++) {
          rb |= (x & 1) << l - i - 1;
          x >>= 1;
        }
        return rb;
      };
      FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
        for (var i = 0; i < N; i++) {
          rtws[i] = rws[rbt[i]];
          itws[i] = iws[rbt[i]];
        }
      };
      FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
        this.permute(rbt, rws, iws, rtws, itws, N);
        for (var s = 1; s < N; s <<= 1) {
          var l = s << 1;
          var rtwdf = Math.cos(2 * Math.PI / l);
          var itwdf = Math.sin(2 * Math.PI / l);
          for (var p = 0; p < N; p += l) {
            var rtwdf_ = rtwdf;
            var itwdf_ = itwdf;
            for (var j = 0; j < s; j++) {
              var re = rtws[p + j];
              var ie = itws[p + j];
              var ro = rtws[p + j + s];
              var io = itws[p + j + s];
              var rx = rtwdf_ * ro - itwdf_ * io;
              io = rtwdf_ * io + itwdf_ * ro;
              ro = rx;
              rtws[p + j] = re + ro;
              itws[p + j] = ie + io;
              rtws[p + j + s] = re - ro;
              itws[p + j + s] = ie - io;
              if (j !== l) {
                rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                rtwdf_ = rx;
              }
            }
          }
        }
      };
      FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
        var N = Math.max(m, n) | 1;
        var odd = N & 1;
        var i = 0;
        for (N = N / 2 | 0; N; N = N >>> 1) {
          i++;
        }
        return 1 << i + 1 + odd;
      };
      FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
        if (N <= 1)
          return;
        for (var i = 0; i < N / 2; i++) {
          var t = rws[i];
          rws[i] = rws[N - i - 1];
          rws[N - i - 1] = t;
          t = iws[i];
          iws[i] = -iws[N - i - 1];
          iws[N - i - 1] = -t;
        }
      };
      FFTM.prototype.normalize13b = function normalize13b(ws, N) {
        var carry = 0;
        for (var i = 0; i < N / 2; i++) {
          var w = Math.round(ws[2 * i + 1] / N) * 8192 + Math.round(ws[2 * i] / N) + carry;
          ws[i] = w & 67108863;
          if (w < 67108864) {
            carry = 0;
          } else {
            carry = w / 67108864 | 0;
          }
        }
        return ws;
      };
      FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
        var carry = 0;
        for (var i = 0; i < len; i++) {
          carry = carry + (ws[i] | 0);
          rws[2 * i] = carry & 8191;
          carry = carry >>> 13;
          rws[2 * i + 1] = carry & 8191;
          carry = carry >>> 13;
        }
        for (i = 2 * len; i < N; ++i) {
          rws[i] = 0;
        }
        assert2(carry === 0);
        assert2((carry & ~8191) === 0);
      };
      FFTM.prototype.stub = function stub(N) {
        var ph = new Array(N);
        for (var i = 0; i < N; i++) {
          ph[i] = 0;
        }
        return ph;
      };
      FFTM.prototype.mulp = function mulp(x, y, out) {
        var N = 2 * this.guessLen13b(x.length, y.length);
        var rbt = this.makeRBT(N);
        var _ = this.stub(N);
        var rws = new Array(N);
        var rwst = new Array(N);
        var iwst = new Array(N);
        var nrws = new Array(N);
        var nrwst = new Array(N);
        var niwst = new Array(N);
        var rmws = out.words;
        rmws.length = N;
        this.convert13b(x.words, x.length, rws, N);
        this.convert13b(y.words, y.length, nrws, N);
        this.transform(rws, _, rwst, iwst, N, rbt);
        this.transform(nrws, _, nrwst, niwst, N, rbt);
        for (var i = 0; i < N; i++) {
          var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
          iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
          rwst[i] = rx;
        }
        this.conjugate(rwst, iwst, N);
        this.transform(rwst, iwst, rmws, _, N, rbt);
        this.conjugate(rmws, _, N);
        this.normalize13b(rmws, N);
        out.negative = x.negative ^ y.negative;
        out.length = x.length + y.length;
        return out.strip();
      };
      BN2.prototype.mul = function mul(num) {
        var out = new BN2(null);
        out.words = new Array(this.length + num.length);
        return this.mulTo(num, out);
      };
      BN2.prototype.mulf = function mulf(num) {
        var out = new BN2(null);
        out.words = new Array(this.length + num.length);
        return jumboMulTo(this, num, out);
      };
      BN2.prototype.imul = function imul(num) {
        return this.clone().mulTo(num, this);
      };
      BN2.prototype.imuln = function imuln(num) {
        assert2(typeof num === "number");
        assert2(num < 67108864);
        var carry = 0;
        for (var i = 0; i < this.length; i++) {
          var w = (this.words[i] | 0) * num;
          var lo = (w & 67108863) + (carry & 67108863);
          carry >>= 26;
          carry += w / 67108864 | 0;
          carry += lo >>> 26;
          this.words[i] = lo & 67108863;
        }
        if (carry !== 0) {
          this.words[i] = carry;
          this.length++;
        }
        return this;
      };
      BN2.prototype.muln = function muln(num) {
        return this.clone().imuln(num);
      };
      BN2.prototype.sqr = function sqr() {
        return this.mul(this);
      };
      BN2.prototype.isqr = function isqr() {
        return this.imul(this.clone());
      };
      BN2.prototype.pow = function pow(num) {
        var w = toBitArray(num);
        if (w.length === 0)
          return new BN2(1);
        var res = this;
        for (var i = 0; i < w.length; i++, res = res.sqr()) {
          if (w[i] !== 0)
            break;
        }
        if (++i < w.length) {
          for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
            if (w[i] === 0)
              continue;
            res = res.mul(q);
          }
        }
        return res;
      };
      BN2.prototype.iushln = function iushln(bits) {
        assert2(typeof bits === "number" && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        var carryMask = 67108863 >>> 26 - r << 26 - r;
        var i;
        if (r !== 0) {
          var carry = 0;
          for (i = 0; i < this.length; i++) {
            var newCarry = this.words[i] & carryMask;
            var c = (this.words[i] | 0) - newCarry << r;
            this.words[i] = c | carry;
            carry = newCarry >>> 26 - r;
          }
          if (carry) {
            this.words[i] = carry;
            this.length++;
          }
        }
        if (s !== 0) {
          for (i = this.length - 1; i >= 0; i--) {
            this.words[i + s] = this.words[i];
          }
          for (i = 0; i < s; i++) {
            this.words[i] = 0;
          }
          this.length += s;
        }
        return this.strip();
      };
      BN2.prototype.ishln = function ishln(bits) {
        assert2(this.negative === 0);
        return this.iushln(bits);
      };
      BN2.prototype.iushrn = function iushrn(bits, hint, extended) {
        assert2(typeof bits === "number" && bits >= 0);
        var h;
        if (hint) {
          h = (hint - hint % 26) / 26;
        } else {
          h = 0;
        }
        var r = bits % 26;
        var s = Math.min((bits - r) / 26, this.length);
        var mask = 67108863 ^ 67108863 >>> r << r;
        var maskedWords = extended;
        h -= s;
        h = Math.max(0, h);
        if (maskedWords) {
          for (var i = 0; i < s; i++) {
            maskedWords.words[i] = this.words[i];
          }
          maskedWords.length = s;
        }
        if (s === 0) {
        } else if (this.length > s) {
          this.length -= s;
          for (i = 0; i < this.length; i++) {
            this.words[i] = this.words[i + s];
          }
        } else {
          this.words[0] = 0;
          this.length = 1;
        }
        var carry = 0;
        for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
          var word = this.words[i] | 0;
          this.words[i] = carry << 26 - r | word >>> r;
          carry = word & mask;
        }
        if (maskedWords && carry !== 0) {
          maskedWords.words[maskedWords.length++] = carry;
        }
        if (this.length === 0) {
          this.words[0] = 0;
          this.length = 1;
        }
        return this.strip();
      };
      BN2.prototype.ishrn = function ishrn(bits, hint, extended) {
        assert2(this.negative === 0);
        return this.iushrn(bits, hint, extended);
      };
      BN2.prototype.shln = function shln(bits) {
        return this.clone().ishln(bits);
      };
      BN2.prototype.ushln = function ushln(bits) {
        return this.clone().iushln(bits);
      };
      BN2.prototype.shrn = function shrn(bits) {
        return this.clone().ishrn(bits);
      };
      BN2.prototype.ushrn = function ushrn(bits) {
        return this.clone().iushrn(bits);
      };
      BN2.prototype.testn = function testn(bit) {
        assert2(typeof bit === "number" && bit >= 0);
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;
        if (this.length <= s)
          return false;
        var w = this.words[s];
        return !!(w & q);
      };
      BN2.prototype.imaskn = function imaskn(bits) {
        assert2(typeof bits === "number" && bits >= 0);
        var r = bits % 26;
        var s = (bits - r) / 26;
        assert2(this.negative === 0, "imaskn works only with positive numbers");
        if (this.length <= s) {
          return this;
        }
        if (r !== 0) {
          s++;
        }
        this.length = Math.min(s, this.length);
        if (r !== 0) {
          var mask = 67108863 ^ 67108863 >>> r << r;
          this.words[this.length - 1] &= mask;
        }
        return this.strip();
      };
      BN2.prototype.maskn = function maskn(bits) {
        return this.clone().imaskn(bits);
      };
      BN2.prototype.iaddn = function iaddn(num) {
        assert2(typeof num === "number");
        assert2(num < 67108864);
        if (num < 0)
          return this.isubn(-num);
        if (this.negative !== 0) {
          if (this.length === 1 && (this.words[0] | 0) < num) {
            this.words[0] = num - (this.words[0] | 0);
            this.negative = 0;
            return this;
          }
          this.negative = 0;
          this.isubn(num);
          this.negative = 1;
          return this;
        }
        return this._iaddn(num);
      };
      BN2.prototype._iaddn = function _iaddn(num) {
        this.words[0] += num;
        for (var i = 0; i < this.length && this.words[i] >= 67108864; i++) {
          this.words[i] -= 67108864;
          if (i === this.length - 1) {
            this.words[i + 1] = 1;
          } else {
            this.words[i + 1]++;
          }
        }
        this.length = Math.max(this.length, i + 1);
        return this;
      };
      BN2.prototype.isubn = function isubn(num) {
        assert2(typeof num === "number");
        assert2(num < 67108864);
        if (num < 0)
          return this.iaddn(-num);
        if (this.negative !== 0) {
          this.negative = 0;
          this.iaddn(num);
          this.negative = 1;
          return this;
        }
        this.words[0] -= num;
        if (this.length === 1 && this.words[0] < 0) {
          this.words[0] = -this.words[0];
          this.negative = 1;
        } else {
          for (var i = 0; i < this.length && this.words[i] < 0; i++) {
            this.words[i] += 67108864;
            this.words[i + 1] -= 1;
          }
        }
        return this.strip();
      };
      BN2.prototype.addn = function addn(num) {
        return this.clone().iaddn(num);
      };
      BN2.prototype.subn = function subn(num) {
        return this.clone().isubn(num);
      };
      BN2.prototype.iabs = function iabs() {
        this.negative = 0;
        return this;
      };
      BN2.prototype.abs = function abs() {
        return this.clone().iabs();
      };
      BN2.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
        var len = num.length + shift;
        var i;
        this._expand(len);
        var w;
        var carry = 0;
        for (i = 0; i < num.length; i++) {
          w = (this.words[i + shift] | 0) + carry;
          var right = (num.words[i] | 0) * mul;
          w -= right & 67108863;
          carry = (w >> 26) - (right / 67108864 | 0);
          this.words[i + shift] = w & 67108863;
        }
        for (; i < this.length - shift; i++) {
          w = (this.words[i + shift] | 0) + carry;
          carry = w >> 26;
          this.words[i + shift] = w & 67108863;
        }
        if (carry === 0)
          return this.strip();
        assert2(carry === -1);
        carry = 0;
        for (i = 0; i < this.length; i++) {
          w = -(this.words[i] | 0) + carry;
          carry = w >> 26;
          this.words[i] = w & 67108863;
        }
        this.negative = 1;
        return this.strip();
      };
      BN2.prototype._wordDiv = function _wordDiv(num, mode) {
        var shift = this.length - num.length;
        var a = this.clone();
        var b = num;
        var bhi = b.words[b.length - 1] | 0;
        var bhiBits = this._countBits(bhi);
        shift = 26 - bhiBits;
        if (shift !== 0) {
          b = b.ushln(shift);
          a.iushln(shift);
          bhi = b.words[b.length - 1] | 0;
        }
        var m = a.length - b.length;
        var q;
        if (mode !== "mod") {
          q = new BN2(null);
          q.length = m + 1;
          q.words = new Array(q.length);
          for (var i = 0; i < q.length; i++) {
            q.words[i] = 0;
          }
        }
        var diff = a.clone()._ishlnsubmul(b, 1, m);
        if (diff.negative === 0) {
          a = diff;
          if (q) {
            q.words[m] = 1;
          }
        }
        for (var j = m - 1; j >= 0; j--) {
          var qj = (a.words[b.length + j] | 0) * 67108864 + (a.words[b.length + j - 1] | 0);
          qj = Math.min(qj / bhi | 0, 67108863);
          a._ishlnsubmul(b, qj, j);
          while (a.negative !== 0) {
            qj--;
            a.negative = 0;
            a._ishlnsubmul(b, 1, j);
            if (!a.isZero()) {
              a.negative ^= 1;
            }
          }
          if (q) {
            q.words[j] = qj;
          }
        }
        if (q) {
          q.strip();
        }
        a.strip();
        if (mode !== "div" && shift !== 0) {
          a.iushrn(shift);
        }
        return {
          div: q || null,
          mod: a
        };
      };
      BN2.prototype.divmod = function divmod(num, mode, positive) {
        assert2(!num.isZero());
        if (this.isZero()) {
          return {
            div: new BN2(0),
            mod: new BN2(0)
          };
        }
        var div, mod, res;
        if (this.negative !== 0 && num.negative === 0) {
          res = this.neg().divmod(num, mode);
          if (mode !== "mod") {
            div = res.div.neg();
          }
          if (mode !== "div") {
            mod = res.mod.neg();
            if (positive && mod.negative !== 0) {
              mod.iadd(num);
            }
          }
          return {
            div,
            mod
          };
        }
        if (this.negative === 0 && num.negative !== 0) {
          res = this.divmod(num.neg(), mode);
          if (mode !== "mod") {
            div = res.div.neg();
          }
          return {
            div,
            mod: res.mod
          };
        }
        if ((this.negative & num.negative) !== 0) {
          res = this.neg().divmod(num.neg(), mode);
          if (mode !== "div") {
            mod = res.mod.neg();
            if (positive && mod.negative !== 0) {
              mod.isub(num);
            }
          }
          return {
            div: res.div,
            mod
          };
        }
        if (num.length > this.length || this.cmp(num) < 0) {
          return {
            div: new BN2(0),
            mod: this
          };
        }
        if (num.length === 1) {
          if (mode === "div") {
            return {
              div: this.divn(num.words[0]),
              mod: null
            };
          }
          if (mode === "mod") {
            return {
              div: null,
              mod: new BN2(this.modn(num.words[0]))
            };
          }
          return {
            div: this.divn(num.words[0]),
            mod: new BN2(this.modn(num.words[0]))
          };
        }
        return this._wordDiv(num, mode);
      };
      BN2.prototype.div = function div(num) {
        return this.divmod(num, "div", false).div;
      };
      BN2.prototype.mod = function mod(num) {
        return this.divmod(num, "mod", false).mod;
      };
      BN2.prototype.umod = function umod(num) {
        return this.divmod(num, "mod", true).mod;
      };
      BN2.prototype.divRound = function divRound(num) {
        var dm = this.divmod(num);
        if (dm.mod.isZero())
          return dm.div;
        var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
        var half = num.ushrn(1);
        var r2 = num.andln(1);
        var cmp = mod.cmp(half);
        if (cmp < 0 || r2 === 1 && cmp === 0)
          return dm.div;
        return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
      };
      BN2.prototype.modn = function modn(num) {
        assert2(num <= 67108863);
        var p = (1 << 26) % num;
        var acc = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          acc = (p * acc + (this.words[i] | 0)) % num;
        }
        return acc;
      };
      BN2.prototype.idivn = function idivn(num) {
        assert2(num <= 67108863);
        var carry = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          var w = (this.words[i] | 0) + carry * 67108864;
          this.words[i] = w / num | 0;
          carry = w % num;
        }
        return this.strip();
      };
      BN2.prototype.divn = function divn(num) {
        return this.clone().idivn(num);
      };
      BN2.prototype.egcd = function egcd(p) {
        assert2(p.negative === 0);
        assert2(!p.isZero());
        var x = this;
        var y = p.clone();
        if (x.negative !== 0) {
          x = x.umod(p);
        } else {
          x = x.clone();
        }
        var A = new BN2(1);
        var B = new BN2(0);
        var C = new BN2(0);
        var D = new BN2(1);
        var g = 0;
        while (x.isEven() && y.isEven()) {
          x.iushrn(1);
          y.iushrn(1);
          ++g;
        }
        var yp = y.clone();
        var xp = x.clone();
        while (!x.isZero()) {
          for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1)
            ;
          if (i > 0) {
            x.iushrn(i);
            while (i-- > 0) {
              if (A.isOdd() || B.isOdd()) {
                A.iadd(yp);
                B.isub(xp);
              }
              A.iushrn(1);
              B.iushrn(1);
            }
          }
          for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
            ;
          if (j > 0) {
            y.iushrn(j);
            while (j-- > 0) {
              if (C.isOdd() || D.isOdd()) {
                C.iadd(yp);
                D.isub(xp);
              }
              C.iushrn(1);
              D.iushrn(1);
            }
          }
          if (x.cmp(y) >= 0) {
            x.isub(y);
            A.isub(C);
            B.isub(D);
          } else {
            y.isub(x);
            C.isub(A);
            D.isub(B);
          }
        }
        return {
          a: C,
          b: D,
          gcd: y.iushln(g)
        };
      };
      BN2.prototype._invmp = function _invmp(p) {
        assert2(p.negative === 0);
        assert2(!p.isZero());
        var a = this;
        var b = p.clone();
        if (a.negative !== 0) {
          a = a.umod(p);
        } else {
          a = a.clone();
        }
        var x1 = new BN2(1);
        var x2 = new BN2(0);
        var delta = b.clone();
        while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
          for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1)
            ;
          if (i > 0) {
            a.iushrn(i);
            while (i-- > 0) {
              if (x1.isOdd()) {
                x1.iadd(delta);
              }
              x1.iushrn(1);
            }
          }
          for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
            ;
          if (j > 0) {
            b.iushrn(j);
            while (j-- > 0) {
              if (x2.isOdd()) {
                x2.iadd(delta);
              }
              x2.iushrn(1);
            }
          }
          if (a.cmp(b) >= 0) {
            a.isub(b);
            x1.isub(x2);
          } else {
            b.isub(a);
            x2.isub(x1);
          }
        }
        var res;
        if (a.cmpn(1) === 0) {
          res = x1;
        } else {
          res = x2;
        }
        if (res.cmpn(0) < 0) {
          res.iadd(p);
        }
        return res;
      };
      BN2.prototype.gcd = function gcd(num) {
        if (this.isZero())
          return num.abs();
        if (num.isZero())
          return this.abs();
        var a = this.clone();
        var b = num.clone();
        a.negative = 0;
        b.negative = 0;
        for (var shift = 0; a.isEven() && b.isEven(); shift++) {
          a.iushrn(1);
          b.iushrn(1);
        }
        do {
          while (a.isEven()) {
            a.iushrn(1);
          }
          while (b.isEven()) {
            b.iushrn(1);
          }
          var r = a.cmp(b);
          if (r < 0) {
            var t = a;
            a = b;
            b = t;
          } else if (r === 0 || b.cmpn(1) === 0) {
            break;
          }
          a.isub(b);
        } while (true);
        return b.iushln(shift);
      };
      BN2.prototype.invm = function invm(num) {
        return this.egcd(num).a.umod(num);
      };
      BN2.prototype.isEven = function isEven() {
        return (this.words[0] & 1) === 0;
      };
      BN2.prototype.isOdd = function isOdd() {
        return (this.words[0] & 1) === 1;
      };
      BN2.prototype.andln = function andln(num) {
        return this.words[0] & num;
      };
      BN2.prototype.bincn = function bincn(bit) {
        assert2(typeof bit === "number");
        var r = bit % 26;
        var s = (bit - r) / 26;
        var q = 1 << r;
        if (this.length <= s) {
          this._expand(s + 1);
          this.words[s] |= q;
          return this;
        }
        var carry = q;
        for (var i = s; carry !== 0 && i < this.length; i++) {
          var w = this.words[i] | 0;
          w += carry;
          carry = w >>> 26;
          w &= 67108863;
          this.words[i] = w;
        }
        if (carry !== 0) {
          this.words[i] = carry;
          this.length++;
        }
        return this;
      };
      BN2.prototype.isZero = function isZero() {
        return this.length === 1 && this.words[0] === 0;
      };
      BN2.prototype.cmpn = function cmpn(num) {
        var negative = num < 0;
        if (this.negative !== 0 && !negative)
          return -1;
        if (this.negative === 0 && negative)
          return 1;
        this.strip();
        var res;
        if (this.length > 1) {
          res = 1;
        } else {
          if (negative) {
            num = -num;
          }
          assert2(num <= 67108863, "Number is too big");
          var w = this.words[0] | 0;
          res = w === num ? 0 : w < num ? -1 : 1;
        }
        if (this.negative !== 0)
          return -res | 0;
        return res;
      };
      BN2.prototype.cmp = function cmp(num) {
        if (this.negative !== 0 && num.negative === 0)
          return -1;
        if (this.negative === 0 && num.negative !== 0)
          return 1;
        var res = this.ucmp(num);
        if (this.negative !== 0)
          return -res | 0;
        return res;
      };
      BN2.prototype.ucmp = function ucmp(num) {
        if (this.length > num.length)
          return 1;
        if (this.length < num.length)
          return -1;
        var res = 0;
        for (var i = this.length - 1; i >= 0; i--) {
          var a = this.words[i] | 0;
          var b = num.words[i] | 0;
          if (a === b)
            continue;
          if (a < b) {
            res = -1;
          } else if (a > b) {
            res = 1;
          }
          break;
        }
        return res;
      };
      BN2.prototype.gtn = function gtn(num) {
        return this.cmpn(num) === 1;
      };
      BN2.prototype.gt = function gt(num) {
        return this.cmp(num) === 1;
      };
      BN2.prototype.gten = function gten(num) {
        return this.cmpn(num) >= 0;
      };
      BN2.prototype.gte = function gte(num) {
        return this.cmp(num) >= 0;
      };
      BN2.prototype.ltn = function ltn(num) {
        return this.cmpn(num) === -1;
      };
      BN2.prototype.lt = function lt(num) {
        return this.cmp(num) === -1;
      };
      BN2.prototype.lten = function lten(num) {
        return this.cmpn(num) <= 0;
      };
      BN2.prototype.lte = function lte(num) {
        return this.cmp(num) <= 0;
      };
      BN2.prototype.eqn = function eqn(num) {
        return this.cmpn(num) === 0;
      };
      BN2.prototype.eq = function eq(num) {
        return this.cmp(num) === 0;
      };
      BN2.red = function red(num) {
        return new Red(num);
      };
      BN2.prototype.toRed = function toRed(ctx) {
        assert2(!this.red, "Already a number in reduction context");
        assert2(this.negative === 0, "red works only with positives");
        return ctx.convertTo(this)._forceRed(ctx);
      };
      BN2.prototype.fromRed = function fromRed() {
        assert2(this.red, "fromRed works only with numbers in reduction context");
        return this.red.convertFrom(this);
      };
      BN2.prototype._forceRed = function _forceRed(ctx) {
        this.red = ctx;
        return this;
      };
      BN2.prototype.forceRed = function forceRed(ctx) {
        assert2(!this.red, "Already a number in reduction context");
        return this._forceRed(ctx);
      };
      BN2.prototype.redAdd = function redAdd(num) {
        assert2(this.red, "redAdd works only with red numbers");
        return this.red.add(this, num);
      };
      BN2.prototype.redIAdd = function redIAdd(num) {
        assert2(this.red, "redIAdd works only with red numbers");
        return this.red.iadd(this, num);
      };
      BN2.prototype.redSub = function redSub(num) {
        assert2(this.red, "redSub works only with red numbers");
        return this.red.sub(this, num);
      };
      BN2.prototype.redISub = function redISub(num) {
        assert2(this.red, "redISub works only with red numbers");
        return this.red.isub(this, num);
      };
      BN2.prototype.redShl = function redShl(num) {
        assert2(this.red, "redShl works only with red numbers");
        return this.red.shl(this, num);
      };
      BN2.prototype.redMul = function redMul(num) {
        assert2(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.mul(this, num);
      };
      BN2.prototype.redIMul = function redIMul(num) {
        assert2(this.red, "redMul works only with red numbers");
        this.red._verify2(this, num);
        return this.red.imul(this, num);
      };
      BN2.prototype.redSqr = function redSqr() {
        assert2(this.red, "redSqr works only with red numbers");
        this.red._verify1(this);
        return this.red.sqr(this);
      };
      BN2.prototype.redISqr = function redISqr() {
        assert2(this.red, "redISqr works only with red numbers");
        this.red._verify1(this);
        return this.red.isqr(this);
      };
      BN2.prototype.redSqrt = function redSqrt() {
        assert2(this.red, "redSqrt works only with red numbers");
        this.red._verify1(this);
        return this.red.sqrt(this);
      };
      BN2.prototype.redInvm = function redInvm() {
        assert2(this.red, "redInvm works only with red numbers");
        this.red._verify1(this);
        return this.red.invm(this);
      };
      BN2.prototype.redNeg = function redNeg() {
        assert2(this.red, "redNeg works only with red numbers");
        this.red._verify1(this);
        return this.red.neg(this);
      };
      BN2.prototype.redPow = function redPow(num) {
        assert2(this.red && !num.red, "redPow(normalNum)");
        this.red._verify1(this);
        return this.red.pow(this, num);
      };
      var primes = {
        k256: null,
        p224: null,
        p192: null,
        p25519: null
      };
      function MPrime(name, p) {
        this.name = name;
        this.p = new BN2(p, 16);
        this.n = this.p.bitLength();
        this.k = new BN2(1).iushln(this.n).isub(this.p);
        this.tmp = this._tmp();
      }
      MPrime.prototype._tmp = function _tmp() {
        var tmp = new BN2(null);
        tmp.words = new Array(Math.ceil(this.n / 13));
        return tmp;
      };
      MPrime.prototype.ireduce = function ireduce(num) {
        var r = num;
        var rlen;
        do {
          this.split(r, this.tmp);
          r = this.imulK(r);
          r = r.iadd(this.tmp);
          rlen = r.bitLength();
        } while (rlen > this.n);
        var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
        if (cmp === 0) {
          r.words[0] = 0;
          r.length = 1;
        } else if (cmp > 0) {
          r.isub(this.p);
        } else {
          if (r.strip !== void 0) {
            r.strip();
          } else {
            r._strip();
          }
        }
        return r;
      };
      MPrime.prototype.split = function split(input, out) {
        input.iushrn(this.n, 0, out);
      };
      MPrime.prototype.imulK = function imulK(num) {
        return num.imul(this.k);
      };
      function K256() {
        MPrime.call(
          this,
          "k256",
          "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
        );
      }
      inherits(K256, MPrime);
      K256.prototype.split = function split(input, output) {
        var mask = 4194303;
        var outLen = Math.min(input.length, 9);
        for (var i = 0; i < outLen; i++) {
          output.words[i] = input.words[i];
        }
        output.length = outLen;
        if (input.length <= 9) {
          input.words[0] = 0;
          input.length = 1;
          return;
        }
        var prev = input.words[9];
        output.words[output.length++] = prev & mask;
        for (i = 10; i < input.length; i++) {
          var next = input.words[i] | 0;
          input.words[i - 10] = (next & mask) << 4 | prev >>> 22;
          prev = next;
        }
        prev >>>= 22;
        input.words[i - 10] = prev;
        if (prev === 0 && input.length > 10) {
          input.length -= 10;
        } else {
          input.length -= 9;
        }
      };
      K256.prototype.imulK = function imulK(num) {
        num.words[num.length] = 0;
        num.words[num.length + 1] = 0;
        num.length += 2;
        var lo = 0;
        for (var i = 0; i < num.length; i++) {
          var w = num.words[i] | 0;
          lo += w * 977;
          num.words[i] = lo & 67108863;
          lo = w * 64 + (lo / 67108864 | 0);
        }
        if (num.words[num.length - 1] === 0) {
          num.length--;
          if (num.words[num.length - 1] === 0) {
            num.length--;
          }
        }
        return num;
      };
      function P224() {
        MPrime.call(
          this,
          "p224",
          "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
        );
      }
      inherits(P224, MPrime);
      function P192() {
        MPrime.call(
          this,
          "p192",
          "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
        );
      }
      inherits(P192, MPrime);
      function P25519() {
        MPrime.call(
          this,
          "25519",
          "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
        );
      }
      inherits(P25519, MPrime);
      P25519.prototype.imulK = function imulK(num) {
        var carry = 0;
        for (var i = 0; i < num.length; i++) {
          var hi = (num.words[i] | 0) * 19 + carry;
          var lo = hi & 67108863;
          hi >>>= 26;
          num.words[i] = lo;
          carry = hi;
        }
        if (carry !== 0) {
          num.words[num.length++] = carry;
        }
        return num;
      };
      BN2._prime = function prime(name) {
        if (primes[name])
          return primes[name];
        var prime2;
        if (name === "k256") {
          prime2 = new K256();
        } else if (name === "p224") {
          prime2 = new P224();
        } else if (name === "p192") {
          prime2 = new P192();
        } else if (name === "p25519") {
          prime2 = new P25519();
        } else {
          throw new Error("Unknown prime " + name);
        }
        primes[name] = prime2;
        return prime2;
      };
      function Red(m) {
        if (typeof m === "string") {
          var prime = BN2._prime(m);
          this.m = prime.p;
          this.prime = prime;
        } else {
          assert2(m.gtn(1), "modulus must be greater than 1");
          this.m = m;
          this.prime = null;
        }
      }
      Red.prototype._verify1 = function _verify1(a) {
        assert2(a.negative === 0, "red works only with positives");
        assert2(a.red, "red works only with red numbers");
      };
      Red.prototype._verify2 = function _verify2(a, b) {
        assert2((a.negative | b.negative) === 0, "red works only with positives");
        assert2(
          a.red && a.red === b.red,
          "red works only with red numbers"
        );
      };
      Red.prototype.imod = function imod(a) {
        if (this.prime)
          return this.prime.ireduce(a)._forceRed(this);
        return a.umod(this.m)._forceRed(this);
      };
      Red.prototype.neg = function neg(a) {
        if (a.isZero()) {
          return a.clone();
        }
        return this.m.sub(a)._forceRed(this);
      };
      Red.prototype.add = function add(a, b) {
        this._verify2(a, b);
        var res = a.add(b);
        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }
        return res._forceRed(this);
      };
      Red.prototype.iadd = function iadd(a, b) {
        this._verify2(a, b);
        var res = a.iadd(b);
        if (res.cmp(this.m) >= 0) {
          res.isub(this.m);
        }
        return res;
      };
      Red.prototype.sub = function sub(a, b) {
        this._verify2(a, b);
        var res = a.sub(b);
        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }
        return res._forceRed(this);
      };
      Red.prototype.isub = function isub(a, b) {
        this._verify2(a, b);
        var res = a.isub(b);
        if (res.cmpn(0) < 0) {
          res.iadd(this.m);
        }
        return res;
      };
      Red.prototype.shl = function shl(a, num) {
        this._verify1(a);
        return this.imod(a.ushln(num));
      };
      Red.prototype.imul = function imul(a, b) {
        this._verify2(a, b);
        return this.imod(a.imul(b));
      };
      Red.prototype.mul = function mul(a, b) {
        this._verify2(a, b);
        return this.imod(a.mul(b));
      };
      Red.prototype.isqr = function isqr(a) {
        return this.imul(a, a.clone());
      };
      Red.prototype.sqr = function sqr(a) {
        return this.mul(a, a);
      };
      Red.prototype.sqrt = function sqrt(a) {
        if (a.isZero())
          return a.clone();
        var mod3 = this.m.andln(3);
        assert2(mod3 % 2 === 1);
        if (mod3 === 3) {
          var pow = this.m.add(new BN2(1)).iushrn(2);
          return this.pow(a, pow);
        }
        var q = this.m.subn(1);
        var s = 0;
        while (!q.isZero() && q.andln(1) === 0) {
          s++;
          q.iushrn(1);
        }
        assert2(!q.isZero());
        var one = new BN2(1).toRed(this);
        var nOne = one.redNeg();
        var lpow = this.m.subn(1).iushrn(1);
        var z = this.m.bitLength();
        z = new BN2(2 * z * z).toRed(this);
        while (this.pow(z, lpow).cmp(nOne) !== 0) {
          z.redIAdd(nOne);
        }
        var c = this.pow(z, q);
        var r = this.pow(a, q.addn(1).iushrn(1));
        var t = this.pow(a, q);
        var m = s;
        while (t.cmp(one) !== 0) {
          var tmp = t;
          for (var i = 0; tmp.cmp(one) !== 0; i++) {
            tmp = tmp.redSqr();
          }
          assert2(i < m);
          var b = this.pow(c, new BN2(1).iushln(m - i - 1));
          r = r.redMul(b);
          c = b.redSqr();
          t = t.redMul(c);
          m = i;
        }
        return r;
      };
      Red.prototype.invm = function invm(a) {
        var inv = a._invmp(this.m);
        if (inv.negative !== 0) {
          inv.negative = 0;
          return this.imod(inv).redNeg();
        } else {
          return this.imod(inv);
        }
      };
      Red.prototype.pow = function pow(a, num) {
        if (num.isZero())
          return new BN2(1).toRed(this);
        if (num.cmpn(1) === 0)
          return a.clone();
        var windowSize = 4;
        var wnd = new Array(1 << windowSize);
        wnd[0] = new BN2(1).toRed(this);
        wnd[1] = a;
        for (var i = 2; i < wnd.length; i++) {
          wnd[i] = this.mul(wnd[i - 1], a);
        }
        var res = wnd[0];
        var current = 0;
        var currentLen = 0;
        var start = num.bitLength() % 26;
        if (start === 0) {
          start = 26;
        }
        for (i = num.length - 1; i >= 0; i--) {
          var word = num.words[i];
          for (var j = start - 1; j >= 0; j--) {
            var bit = word >> j & 1;
            if (res !== wnd[0]) {
              res = this.sqr(res);
            }
            if (bit === 0 && current === 0) {
              currentLen = 0;
              continue;
            }
            current <<= 1;
            current |= bit;
            currentLen++;
            if (currentLen !== windowSize && (i !== 0 || j !== 0))
              continue;
            res = this.mul(res, wnd[current]);
            currentLen = 0;
            current = 0;
          }
          start = 26;
        }
        return res;
      };
      Red.prototype.convertTo = function convertTo(num) {
        var r = num.umod(this.m);
        return r === num ? r.clone() : r;
      };
      Red.prototype.convertFrom = function convertFrom(num) {
        var res = num.clone();
        res.red = null;
        return res;
      };
      BN2.mont = function mont(num) {
        return new Mont(num);
      };
      function Mont(m) {
        Red.call(this, m);
        this.shift = this.m.bitLength();
        if (this.shift % 26 !== 0) {
          this.shift += 26 - this.shift % 26;
        }
        this.r = new BN2(1).iushln(this.shift);
        this.r2 = this.imod(this.r.sqr());
        this.rinv = this.r._invmp(this.m);
        this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
        this.minv = this.minv.umod(this.r);
        this.minv = this.r.sub(this.minv);
      }
      inherits(Mont, Red);
      Mont.prototype.convertTo = function convertTo(num) {
        return this.imod(num.ushln(this.shift));
      };
      Mont.prototype.convertFrom = function convertFrom(num) {
        var r = this.imod(num.mul(this.rinv));
        r.red = null;
        return r;
      };
      Mont.prototype.imul = function imul(a, b) {
        if (a.isZero() || b.isZero()) {
          a.words[0] = 0;
          a.length = 1;
          return a;
        }
        var t = a.imul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) {
          res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
          res = u.iadd(this.m);
        }
        return res._forceRed(this);
      };
      Mont.prototype.mul = function mul(a, b) {
        if (a.isZero() || b.isZero())
          return new BN2(0)._forceRed(this);
        var t = a.mul(b);
        var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
        var u = t.isub(c).iushrn(this.shift);
        var res = u;
        if (u.cmp(this.m) >= 0) {
          res = u.isub(this.m);
        } else if (u.cmpn(0) < 0) {
          res = u.iadd(this.m);
        }
        return res._forceRed(this);
      };
      Mont.prototype.invm = function invm(a) {
        var res = this.imod(a._invmp(this.m).mul(this.r2));
        return res._forceRed(this);
      };
    })(typeof module === "undefined" || module, exports);
  }
});

// node_modules/minimalistic-assert/index.js
var require_minimalistic_assert = __commonJS({
  "node_modules/minimalistic-assert/index.js"(exports, module) {
    module.exports = assert2;
    function assert2(val, msg) {
      if (!val)
        throw new Error(msg || "Assertion failed");
    }
    assert2.equal = function assertEqual(l, r, msg) {
      if (l != r)
        throw new Error(msg || "Assertion failed: " + l + " != " + r);
    };
  }
});

// node_modules/minimalistic-crypto-utils/lib/utils.js
var require_utils = __commonJS({
  "node_modules/minimalistic-crypto-utils/lib/utils.js"(exports) {
    "use strict";
    var utils = exports;
    function toArray(msg, enc) {
      if (Array.isArray(msg))
        return msg.slice();
      if (!msg)
        return [];
      var res = [];
      if (typeof msg !== "string") {
        for (var i = 0; i < msg.length; i++)
          res[i] = msg[i] | 0;
        return res;
      }
      if (enc === "hex") {
        msg = msg.replace(/[^a-z0-9]+/ig, "");
        if (msg.length % 2 !== 0)
          msg = "0" + msg;
        for (var i = 0; i < msg.length; i += 2)
          res.push(parseInt(msg[i] + msg[i + 1], 16));
      } else {
        for (var i = 0; i < msg.length; i++) {
          var c = msg.charCodeAt(i);
          var hi = c >> 8;
          var lo = c & 255;
          if (hi)
            res.push(hi, lo);
          else
            res.push(lo);
        }
      }
      return res;
    }
    utils.toArray = toArray;
    function zero2(word) {
      if (word.length === 1)
        return "0" + word;
      else
        return word;
    }
    utils.zero2 = zero2;
    function toHex2(msg) {
      var res = "";
      for (var i = 0; i < msg.length; i++)
        res += zero2(msg[i].toString(16));
      return res;
    }
    utils.toHex = toHex2;
    utils.encode = function encode(arr, enc) {
      if (enc === "hex")
        return toHex2(arr);
      else
        return arr;
    };
  }
});

// node_modules/elliptic/lib/elliptic/utils.js
var require_utils2 = __commonJS({
  "node_modules/elliptic/lib/elliptic/utils.js"(exports) {
    "use strict";
    var utils = exports;
    var BN2 = require_bn();
    var minAssert = require_minimalistic_assert();
    var minUtils = require_utils();
    utils.assert = minAssert;
    utils.toArray = minUtils.toArray;
    utils.zero2 = minUtils.zero2;
    utils.toHex = minUtils.toHex;
    utils.encode = minUtils.encode;
    function getNAF(num, w, bits) {
      var naf = new Array(Math.max(num.bitLength(), bits) + 1);
      naf.fill(0);
      var ws = 1 << w + 1;
      var k = num.clone();
      for (var i = 0; i < naf.length; i++) {
        var z;
        var mod = k.andln(ws - 1);
        if (k.isOdd()) {
          if (mod > (ws >> 1) - 1)
            z = (ws >> 1) - mod;
          else
            z = mod;
          k.isubn(z);
        } else {
          z = 0;
        }
        naf[i] = z;
        k.iushrn(1);
      }
      return naf;
    }
    utils.getNAF = getNAF;
    function getJSF(k1, k2) {
      var jsf = [
        [],
        []
      ];
      k1 = k1.clone();
      k2 = k2.clone();
      var d1 = 0;
      var d2 = 0;
      var m8;
      while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {
        var m14 = k1.andln(3) + d1 & 3;
        var m24 = k2.andln(3) + d2 & 3;
        if (m14 === 3)
          m14 = -1;
        if (m24 === 3)
          m24 = -1;
        var u1;
        if ((m14 & 1) === 0) {
          u1 = 0;
        } else {
          m8 = k1.andln(7) + d1 & 7;
          if ((m8 === 3 || m8 === 5) && m24 === 2)
            u1 = -m14;
          else
            u1 = m14;
        }
        jsf[0].push(u1);
        var u2;
        if ((m24 & 1) === 0) {
          u2 = 0;
        } else {
          m8 = k2.andln(7) + d2 & 7;
          if ((m8 === 3 || m8 === 5) && m14 === 2)
            u2 = -m24;
          else
            u2 = m24;
        }
        jsf[1].push(u2);
        if (2 * d1 === u1 + 1)
          d1 = 1 - d1;
        if (2 * d2 === u2 + 1)
          d2 = 1 - d2;
        k1.iushrn(1);
        k2.iushrn(1);
      }
      return jsf;
    }
    utils.getJSF = getJSF;
    function cachedProperty(obj, name, computer) {
      var key = "_" + name;
      obj.prototype[name] = function cachedProperty2() {
        return this[key] !== void 0 ? this[key] : this[key] = computer.call(this);
      };
    }
    utils.cachedProperty = cachedProperty;
    function parseBytes(bytes) {
      return typeof bytes === "string" ? utils.toArray(bytes, "hex") : bytes;
    }
    utils.parseBytes = parseBytes;
    function intFromLE(bytes) {
      return new BN2(bytes, "hex", "le");
    }
    utils.intFromLE = intFromLE;
  }
});

// browser-external:crypto
var require_crypto = __commonJS({
  "browser-external:crypto"(exports, module) {
    module.exports = Object.create(new Proxy({}, {
      get(_, key) {
        if (key !== "__esModule" && key !== "__proto__" && key !== "constructor" && key !== "splice") {
          console.warn(`Module "crypto" has been externalized for browser compatibility. Cannot access "crypto.${key}" in client code. See http://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
        }
      }
    }));
  }
});

// node_modules/brorand/index.js
var require_brorand = __commonJS({
  "node_modules/brorand/index.js"(exports, module) {
    var r;
    module.exports = function rand(len) {
      if (!r)
        r = new Rand(null);
      return r.generate(len);
    };
    function Rand(rand) {
      this.rand = rand;
    }
    module.exports.Rand = Rand;
    Rand.prototype.generate = function generate(len) {
      return this._rand(len);
    };
    Rand.prototype._rand = function _rand(n) {
      if (this.rand.getBytes)
        return this.rand.getBytes(n);
      var res = new Uint8Array(n);
      for (var i = 0; i < res.length; i++)
        res[i] = this.rand.getByte();
      return res;
    };
    if (typeof self === "object") {
      if (self.crypto && self.crypto.getRandomValues) {
        Rand.prototype._rand = function _rand(n) {
          var arr = new Uint8Array(n);
          self.crypto.getRandomValues(arr);
          return arr;
        };
      } else if (self.msCrypto && self.msCrypto.getRandomValues) {
        Rand.prototype._rand = function _rand(n) {
          var arr = new Uint8Array(n);
          self.msCrypto.getRandomValues(arr);
          return arr;
        };
      } else if (typeof window === "object") {
        Rand.prototype._rand = function() {
          throw new Error("Not implemented yet");
        };
      }
    } else {
      try {
        crypto2 = require_crypto();
        if (typeof crypto2.randomBytes !== "function")
          throw new Error("Not supported");
        Rand.prototype._rand = function _rand(n) {
          return crypto2.randomBytes(n);
        };
      } catch (e) {
      }
    }
    var crypto2;
  }
});

// node_modules/elliptic/lib/elliptic/curve/base.js
var require_base = __commonJS({
  "node_modules/elliptic/lib/elliptic/curve/base.js"(exports, module) {
    "use strict";
    var BN2 = require_bn();
    var utils = require_utils2();
    var getNAF = utils.getNAF;
    var getJSF = utils.getJSF;
    var assert2 = utils.assert;
    function BaseCurve(type, conf) {
      this.type = type;
      this.p = new BN2(conf.p, 16);
      this.red = conf.prime ? BN2.red(conf.prime) : BN2.mont(this.p);
      this.zero = new BN2(0).toRed(this.red);
      this.one = new BN2(1).toRed(this.red);
      this.two = new BN2(2).toRed(this.red);
      this.n = conf.n && new BN2(conf.n, 16);
      this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);
      this._wnafT1 = new Array(4);
      this._wnafT2 = new Array(4);
      this._wnafT3 = new Array(4);
      this._wnafT4 = new Array(4);
      this._bitLength = this.n ? this.n.bitLength() : 0;
      var adjustCount = this.n && this.p.div(this.n);
      if (!adjustCount || adjustCount.cmpn(100) > 0) {
        this.redN = null;
      } else {
        this._maxwellTrick = true;
        this.redN = this.n.toRed(this.red);
      }
    }
    module.exports = BaseCurve;
    BaseCurve.prototype.point = function point() {
      throw new Error("Not implemented");
    };
    BaseCurve.prototype.validate = function validate2() {
      throw new Error("Not implemented");
    };
    BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
      assert2(p.precomputed);
      var doubles = p._getDoubles();
      var naf = getNAF(k, 1, this._bitLength);
      var I = (1 << doubles.step + 1) - (doubles.step % 2 === 0 ? 2 : 1);
      I /= 3;
      var repr = [];
      var j;
      var nafW;
      for (j = 0; j < naf.length; j += doubles.step) {
        nafW = 0;
        for (var l = j + doubles.step - 1; l >= j; l--)
          nafW = (nafW << 1) + naf[l];
        repr.push(nafW);
      }
      var a = this.jpoint(null, null, null);
      var b = this.jpoint(null, null, null);
      for (var i = I; i > 0; i--) {
        for (j = 0; j < repr.length; j++) {
          nafW = repr[j];
          if (nafW === i)
            b = b.mixedAdd(doubles.points[j]);
          else if (nafW === -i)
            b = b.mixedAdd(doubles.points[j].neg());
        }
        a = a.add(b);
      }
      return a.toP();
    };
    BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
      var w = 4;
      var nafPoints = p._getNAFPoints(w);
      w = nafPoints.wnd;
      var wnd = nafPoints.points;
      var naf = getNAF(k, w, this._bitLength);
      var acc = this.jpoint(null, null, null);
      for (var i = naf.length - 1; i >= 0; i--) {
        for (var l = 0; i >= 0 && naf[i] === 0; i--)
          l++;
        if (i >= 0)
          l++;
        acc = acc.dblp(l);
        if (i < 0)
          break;
        var z = naf[i];
        assert2(z !== 0);
        if (p.type === "affine") {
          if (z > 0)
            acc = acc.mixedAdd(wnd[z - 1 >> 1]);
          else
            acc = acc.mixedAdd(wnd[-z - 1 >> 1].neg());
        } else {
          if (z > 0)
            acc = acc.add(wnd[z - 1 >> 1]);
          else
            acc = acc.add(wnd[-z - 1 >> 1].neg());
        }
      }
      return p.type === "affine" ? acc.toP() : acc;
    };
    BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW, points, coeffs, len, jacobianResult) {
      var wndWidth = this._wnafT1;
      var wnd = this._wnafT2;
      var naf = this._wnafT3;
      var max2 = 0;
      var i;
      var j;
      var p;
      for (i = 0; i < len; i++) {
        p = points[i];
        var nafPoints = p._getNAFPoints(defW);
        wndWidth[i] = nafPoints.wnd;
        wnd[i] = nafPoints.points;
      }
      for (i = len - 1; i >= 1; i -= 2) {
        var a = i - 1;
        var b = i;
        if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
          naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
          naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
          max2 = Math.max(naf[a].length, max2);
          max2 = Math.max(naf[b].length, max2);
          continue;
        }
        var comb = [
          points[a],
          /* 1 */
          null,
          /* 3 */
          null,
          /* 5 */
          points[b]
          /* 7 */
        ];
        if (points[a].y.cmp(points[b].y) === 0) {
          comb[1] = points[a].add(points[b]);
          comb[2] = points[a].toJ().mixedAdd(points[b].neg());
        } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
          comb[1] = points[a].toJ().mixedAdd(points[b]);
          comb[2] = points[a].add(points[b].neg());
        } else {
          comb[1] = points[a].toJ().mixedAdd(points[b]);
          comb[2] = points[a].toJ().mixedAdd(points[b].neg());
        }
        var index = [
          -3,
          /* -1 -1 */
          -1,
          /* -1 0 */
          -5,
          /* -1 1 */
          -7,
          /* 0 -1 */
          0,
          /* 0 0 */
          7,
          /* 0 1 */
          5,
          /* 1 -1 */
          1,
          /* 1 0 */
          3
          /* 1 1 */
        ];
        var jsf = getJSF(coeffs[a], coeffs[b]);
        max2 = Math.max(jsf[0].length, max2);
        naf[a] = new Array(max2);
        naf[b] = new Array(max2);
        for (j = 0; j < max2; j++) {
          var ja = jsf[0][j] | 0;
          var jb = jsf[1][j] | 0;
          naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
          naf[b][j] = 0;
          wnd[a] = comb;
        }
      }
      var acc = this.jpoint(null, null, null);
      var tmp = this._wnafT4;
      for (i = max2; i >= 0; i--) {
        var k = 0;
        while (i >= 0) {
          var zero = true;
          for (j = 0; j < len; j++) {
            tmp[j] = naf[j][i] | 0;
            if (tmp[j] !== 0)
              zero = false;
          }
          if (!zero)
            break;
          k++;
          i--;
        }
        if (i >= 0)
          k++;
        acc = acc.dblp(k);
        if (i < 0)
          break;
        for (j = 0; j < len; j++) {
          var z = tmp[j];
          p;
          if (z === 0)
            continue;
          else if (z > 0)
            p = wnd[j][z - 1 >> 1];
          else if (z < 0)
            p = wnd[j][-z - 1 >> 1].neg();
          if (p.type === "affine")
            acc = acc.mixedAdd(p);
          else
            acc = acc.add(p);
        }
      }
      for (i = 0; i < len; i++)
        wnd[i] = null;
      if (jacobianResult)
        return acc;
      else
        return acc.toP();
    };
    function BasePoint(curve, type) {
      this.curve = curve;
      this.type = type;
      this.precomputed = null;
    }
    BaseCurve.BasePoint = BasePoint;
    BasePoint.prototype.eq = function eq() {
      throw new Error("Not implemented");
    };
    BasePoint.prototype.validate = function validate2() {
      return this.curve.validate(this);
    };
    BaseCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
      bytes = utils.toArray(bytes, enc);
      var len = this.p.byteLength();
      if ((bytes[0] === 4 || bytes[0] === 6 || bytes[0] === 7) && bytes.length - 1 === 2 * len) {
        if (bytes[0] === 6)
          assert2(bytes[bytes.length - 1] % 2 === 0);
        else if (bytes[0] === 7)
          assert2(bytes[bytes.length - 1] % 2 === 1);
        var res = this.point(
          bytes.slice(1, 1 + len),
          bytes.slice(1 + len, 1 + 2 * len)
        );
        return res;
      } else if ((bytes[0] === 2 || bytes[0] === 3) && bytes.length - 1 === len) {
        return this.pointFromX(bytes.slice(1, 1 + len), bytes[0] === 3);
      }
      throw new Error("Unknown point format");
    };
    BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
      return this.encode(enc, true);
    };
    BasePoint.prototype._encode = function _encode(compact) {
      var len = this.curve.p.byteLength();
      var x = this.getX().toArray("be", len);
      if (compact)
        return [this.getY().isEven() ? 2 : 3].concat(x);
      return [4].concat(x, this.getY().toArray("be", len));
    };
    BasePoint.prototype.encode = function encode(enc, compact) {
      return utils.encode(this._encode(compact), enc);
    };
    BasePoint.prototype.precompute = function precompute(power) {
      if (this.precomputed)
        return this;
      var precomputed = {
        doubles: null,
        naf: null,
        beta: null
      };
      precomputed.naf = this._getNAFPoints(8);
      precomputed.doubles = this._getDoubles(4, power);
      precomputed.beta = this._getBeta();
      this.precomputed = precomputed;
      return this;
    };
    BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
      if (!this.precomputed)
        return false;
      var doubles = this.precomputed.doubles;
      if (!doubles)
        return false;
      return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
    };
    BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
      if (this.precomputed && this.precomputed.doubles)
        return this.precomputed.doubles;
      var doubles = [this];
      var acc = this;
      for (var i = 0; i < power; i += step) {
        for (var j = 0; j < step; j++)
          acc = acc.dbl();
        doubles.push(acc);
      }
      return {
        step,
        points: doubles
      };
    };
    BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
      if (this.precomputed && this.precomputed.naf)
        return this.precomputed.naf;
      var res = [this];
      var max2 = (1 << wnd) - 1;
      var dbl = max2 === 1 ? null : this.dbl();
      for (var i = 1; i < max2; i++)
        res[i] = res[i - 1].add(dbl);
      return {
        wnd,
        points: res
      };
    };
    BasePoint.prototype._getBeta = function _getBeta() {
      return null;
    };
    BasePoint.prototype.dblp = function dblp(k) {
      var r = this;
      for (var i = 0; i < k; i++)
        r = r.dbl();
      return r;
    };
  }
});

// node_modules/inherits/inherits_browser.js
var require_inherits_browser = __commonJS({
  "node_modules/inherits/inherits_browser.js"(exports, module) {
    if (typeof Object.create === "function") {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      module.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }
  }
});

// node_modules/elliptic/lib/elliptic/curve/short.js
var require_short = __commonJS({
  "node_modules/elliptic/lib/elliptic/curve/short.js"(exports, module) {
    "use strict";
    var utils = require_utils2();
    var BN2 = require_bn();
    var inherits = require_inherits_browser();
    var Base = require_base();
    var assert2 = utils.assert;
    function ShortCurve(conf) {
      Base.call(this, "short", conf);
      this.a = new BN2(conf.a, 16).toRed(this.red);
      this.b = new BN2(conf.b, 16).toRed(this.red);
      this.tinv = this.two.redInvm();
      this.zeroA = this.a.fromRed().cmpn(0) === 0;
      this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;
      this.endo = this._getEndomorphism(conf);
      this._endoWnafT1 = new Array(4);
      this._endoWnafT2 = new Array(4);
    }
    inherits(ShortCurve, Base);
    module.exports = ShortCurve;
    ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
      if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
        return;
      var beta;
      var lambda;
      if (conf.beta) {
        beta = new BN2(conf.beta, 16).toRed(this.red);
      } else {
        var betas = this._getEndoRoots(this.p);
        beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
        beta = beta.toRed(this.red);
      }
      if (conf.lambda) {
        lambda = new BN2(conf.lambda, 16);
      } else {
        var lambdas = this._getEndoRoots(this.n);
        if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
          lambda = lambdas[0];
        } else {
          lambda = lambdas[1];
          assert2(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
        }
      }
      var basis;
      if (conf.basis) {
        basis = conf.basis.map(function(vec) {
          return {
            a: new BN2(vec.a, 16),
            b: new BN2(vec.b, 16)
          };
        });
      } else {
        basis = this._getEndoBasis(lambda);
      }
      return {
        beta,
        lambda,
        basis
      };
    };
    ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
      var red = num === this.p ? this.red : BN2.mont(num);
      var tinv = new BN2(2).toRed(red).redInvm();
      var ntinv = tinv.redNeg();
      var s = new BN2(3).toRed(red).redNeg().redSqrt().redMul(tinv);
      var l1 = ntinv.redAdd(s).fromRed();
      var l2 = ntinv.redSub(s).fromRed();
      return [l1, l2];
    };
    ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
      var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));
      var u = lambda;
      var v = this.n.clone();
      var x1 = new BN2(1);
      var y1 = new BN2(0);
      var x2 = new BN2(0);
      var y2 = new BN2(1);
      var a0;
      var b0;
      var a1;
      var b1;
      var a2;
      var b2;
      var prevR;
      var i = 0;
      var r;
      var x;
      while (u.cmpn(0) !== 0) {
        var q = v.div(u);
        r = v.sub(q.mul(u));
        x = x2.sub(q.mul(x1));
        var y = y2.sub(q.mul(y1));
        if (!a1 && r.cmp(aprxSqrt) < 0) {
          a0 = prevR.neg();
          b0 = x1;
          a1 = r.neg();
          b1 = x;
        } else if (a1 && ++i === 2) {
          break;
        }
        prevR = r;
        v = u;
        u = r;
        x2 = x1;
        x1 = x;
        y2 = y1;
        y1 = y;
      }
      a2 = r.neg();
      b2 = x;
      var len1 = a1.sqr().add(b1.sqr());
      var len2 = a2.sqr().add(b2.sqr());
      if (len2.cmp(len1) >= 0) {
        a2 = a0;
        b2 = b0;
      }
      if (a1.negative) {
        a1 = a1.neg();
        b1 = b1.neg();
      }
      if (a2.negative) {
        a2 = a2.neg();
        b2 = b2.neg();
      }
      return [
        { a: a1, b: b1 },
        { a: a2, b: b2 }
      ];
    };
    ShortCurve.prototype._endoSplit = function _endoSplit(k) {
      var basis = this.endo.basis;
      var v1 = basis[0];
      var v2 = basis[1];
      var c1 = v2.b.mul(k).divRound(this.n);
      var c2 = v1.b.neg().mul(k).divRound(this.n);
      var p1 = c1.mul(v1.a);
      var p2 = c2.mul(v2.a);
      var q1 = c1.mul(v1.b);
      var q2 = c2.mul(v2.b);
      var k1 = k.sub(p1).sub(p2);
      var k2 = q1.add(q2).neg();
      return { k1, k2 };
    };
    ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
      x = new BN2(x, 16);
      if (!x.red)
        x = x.toRed(this.red);
      var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
      var y = y2.redSqrt();
      if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
        throw new Error("invalid point");
      var isOdd = y.fromRed().isOdd();
      if (odd && !isOdd || !odd && isOdd)
        y = y.redNeg();
      return this.point(x, y);
    };
    ShortCurve.prototype.validate = function validate2(point) {
      if (point.inf)
        return true;
      var x = point.x;
      var y = point.y;
      var ax = this.a.redMul(x);
      var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
      return y.redSqr().redISub(rhs).cmpn(0) === 0;
    };
    ShortCurve.prototype._endoWnafMulAdd = function _endoWnafMulAdd(points, coeffs, jacobianResult) {
      var npoints = this._endoWnafT1;
      var ncoeffs = this._endoWnafT2;
      for (var i = 0; i < points.length; i++) {
        var split = this._endoSplit(coeffs[i]);
        var p = points[i];
        var beta = p._getBeta();
        if (split.k1.negative) {
          split.k1.ineg();
          p = p.neg(true);
        }
        if (split.k2.negative) {
          split.k2.ineg();
          beta = beta.neg(true);
        }
        npoints[i * 2] = p;
        npoints[i * 2 + 1] = beta;
        ncoeffs[i * 2] = split.k1;
        ncoeffs[i * 2 + 1] = split.k2;
      }
      var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);
      for (var j = 0; j < i * 2; j++) {
        npoints[j] = null;
        ncoeffs[j] = null;
      }
      return res;
    };
    function Point(curve, x, y, isRed) {
      Base.BasePoint.call(this, curve, "affine");
      if (x === null && y === null) {
        this.x = null;
        this.y = null;
        this.inf = true;
      } else {
        this.x = new BN2(x, 16);
        this.y = new BN2(y, 16);
        if (isRed) {
          this.x.forceRed(this.curve.red);
          this.y.forceRed(this.curve.red);
        }
        if (!this.x.red)
          this.x = this.x.toRed(this.curve.red);
        if (!this.y.red)
          this.y = this.y.toRed(this.curve.red);
        this.inf = false;
      }
    }
    inherits(Point, Base.BasePoint);
    ShortCurve.prototype.point = function point(x, y, isRed) {
      return new Point(this, x, y, isRed);
    };
    ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
      return Point.fromJSON(this, obj, red);
    };
    Point.prototype._getBeta = function _getBeta() {
      if (!this.curve.endo)
        return;
      var pre = this.precomputed;
      if (pre && pre.beta)
        return pre.beta;
      var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
      if (pre) {
        var curve = this.curve;
        var endoMul = function(p) {
          return curve.point(p.x.redMul(curve.endo.beta), p.y);
        };
        pre.beta = beta;
        beta.precomputed = {
          beta: null,
          naf: pre.naf && {
            wnd: pre.naf.wnd,
            points: pre.naf.points.map(endoMul)
          },
          doubles: pre.doubles && {
            step: pre.doubles.step,
            points: pre.doubles.points.map(endoMul)
          }
        };
      }
      return beta;
    };
    Point.prototype.toJSON = function toJSON() {
      if (!this.precomputed)
        return [this.x, this.y];
      return [this.x, this.y, this.precomputed && {
        doubles: this.precomputed.doubles && {
          step: this.precomputed.doubles.step,
          points: this.precomputed.doubles.points.slice(1)
        },
        naf: this.precomputed.naf && {
          wnd: this.precomputed.naf.wnd,
          points: this.precomputed.naf.points.slice(1)
        }
      }];
    };
    Point.fromJSON = function fromJSON(curve, obj, red) {
      if (typeof obj === "string")
        obj = JSON.parse(obj);
      var res = curve.point(obj[0], obj[1], red);
      if (!obj[2])
        return res;
      function obj2point(obj2) {
        return curve.point(obj2[0], obj2[1], red);
      }
      var pre = obj[2];
      res.precomputed = {
        beta: null,
        doubles: pre.doubles && {
          step: pre.doubles.step,
          points: [res].concat(pre.doubles.points.map(obj2point))
        },
        naf: pre.naf && {
          wnd: pre.naf.wnd,
          points: [res].concat(pre.naf.points.map(obj2point))
        }
      };
      return res;
    };
    Point.prototype.inspect = function inspect() {
      if (this.isInfinity())
        return "<EC Point Infinity>";
      return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
    };
    Point.prototype.isInfinity = function isInfinity() {
      return this.inf;
    };
    Point.prototype.add = function add(p) {
      if (this.inf)
        return p;
      if (p.inf)
        return this;
      if (this.eq(p))
        return this.dbl();
      if (this.neg().eq(p))
        return this.curve.point(null, null);
      if (this.x.cmp(p.x) === 0)
        return this.curve.point(null, null);
      var c = this.y.redSub(p.y);
      if (c.cmpn(0) !== 0)
        c = c.redMul(this.x.redSub(p.x).redInvm());
      var nx = c.redSqr().redISub(this.x).redISub(p.x);
      var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
      return this.curve.point(nx, ny);
    };
    Point.prototype.dbl = function dbl() {
      if (this.inf)
        return this;
      var ys1 = this.y.redAdd(this.y);
      if (ys1.cmpn(0) === 0)
        return this.curve.point(null, null);
      var a = this.curve.a;
      var x2 = this.x.redSqr();
      var dyinv = ys1.redInvm();
      var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);
      var nx = c.redSqr().redISub(this.x.redAdd(this.x));
      var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
      return this.curve.point(nx, ny);
    };
    Point.prototype.getX = function getX() {
      return this.x.fromRed();
    };
    Point.prototype.getY = function getY() {
      return this.y.fromRed();
    };
    Point.prototype.mul = function mul(k) {
      k = new BN2(k, 16);
      if (this.isInfinity())
        return this;
      else if (this._hasDoubles(k))
        return this.curve._fixedNafMul(this, k);
      else if (this.curve.endo)
        return this.curve._endoWnafMulAdd([this], [k]);
      else
        return this.curve._wnafMul(this, k);
    };
    Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
      var points = [this, p2];
      var coeffs = [k1, k2];
      if (this.curve.endo)
        return this.curve._endoWnafMulAdd(points, coeffs);
      else
        return this.curve._wnafMulAdd(1, points, coeffs, 2);
    };
    Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
      var points = [this, p2];
      var coeffs = [k1, k2];
      if (this.curve.endo)
        return this.curve._endoWnafMulAdd(points, coeffs, true);
      else
        return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
    };
    Point.prototype.eq = function eq(p) {
      return this === p || this.inf === p.inf && (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
    };
    Point.prototype.neg = function neg(_precompute) {
      if (this.inf)
        return this;
      var res = this.curve.point(this.x, this.y.redNeg());
      if (_precompute && this.precomputed) {
        var pre = this.precomputed;
        var negate = function(p) {
          return p.neg();
        };
        res.precomputed = {
          naf: pre.naf && {
            wnd: pre.naf.wnd,
            points: pre.naf.points.map(negate)
          },
          doubles: pre.doubles && {
            step: pre.doubles.step,
            points: pre.doubles.points.map(negate)
          }
        };
      }
      return res;
    };
    Point.prototype.toJ = function toJ() {
      if (this.inf)
        return this.curve.jpoint(null, null, null);
      var res = this.curve.jpoint(this.x, this.y, this.curve.one);
      return res;
    };
    function JPoint(curve, x, y, z) {
      Base.BasePoint.call(this, curve, "jacobian");
      if (x === null && y === null && z === null) {
        this.x = this.curve.one;
        this.y = this.curve.one;
        this.z = new BN2(0);
      } else {
        this.x = new BN2(x, 16);
        this.y = new BN2(y, 16);
        this.z = new BN2(z, 16);
      }
      if (!this.x.red)
        this.x = this.x.toRed(this.curve.red);
      if (!this.y.red)
        this.y = this.y.toRed(this.curve.red);
      if (!this.z.red)
        this.z = this.z.toRed(this.curve.red);
      this.zOne = this.z === this.curve.one;
    }
    inherits(JPoint, Base.BasePoint);
    ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
      return new JPoint(this, x, y, z);
    };
    JPoint.prototype.toP = function toP() {
      if (this.isInfinity())
        return this.curve.point(null, null);
      var zinv = this.z.redInvm();
      var zinv2 = zinv.redSqr();
      var ax = this.x.redMul(zinv2);
      var ay = this.y.redMul(zinv2).redMul(zinv);
      return this.curve.point(ax, ay);
    };
    JPoint.prototype.neg = function neg() {
      return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
    };
    JPoint.prototype.add = function add(p) {
      if (this.isInfinity())
        return p;
      if (p.isInfinity())
        return this;
      var pz2 = p.z.redSqr();
      var z2 = this.z.redSqr();
      var u1 = this.x.redMul(pz2);
      var u2 = p.x.redMul(z2);
      var s1 = this.y.redMul(pz2.redMul(p.z));
      var s2 = p.y.redMul(z2.redMul(this.z));
      var h = u1.redSub(u2);
      var r = s1.redSub(s2);
      if (h.cmpn(0) === 0) {
        if (r.cmpn(0) !== 0)
          return this.curve.jpoint(null, null, null);
        else
          return this.dbl();
      }
      var h2 = h.redSqr();
      var h3 = h2.redMul(h);
      var v = u1.redMul(h2);
      var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
      var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
      var nz = this.z.redMul(p.z).redMul(h);
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype.mixedAdd = function mixedAdd(p) {
      if (this.isInfinity())
        return p.toJ();
      if (p.isInfinity())
        return this;
      var z2 = this.z.redSqr();
      var u1 = this.x;
      var u2 = p.x.redMul(z2);
      var s1 = this.y;
      var s2 = p.y.redMul(z2).redMul(this.z);
      var h = u1.redSub(u2);
      var r = s1.redSub(s2);
      if (h.cmpn(0) === 0) {
        if (r.cmpn(0) !== 0)
          return this.curve.jpoint(null, null, null);
        else
          return this.dbl();
      }
      var h2 = h.redSqr();
      var h3 = h2.redMul(h);
      var v = u1.redMul(h2);
      var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
      var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
      var nz = this.z.redMul(h);
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype.dblp = function dblp(pow) {
      if (pow === 0)
        return this;
      if (this.isInfinity())
        return this;
      if (!pow)
        return this.dbl();
      var i;
      if (this.curve.zeroA || this.curve.threeA) {
        var r = this;
        for (i = 0; i < pow; i++)
          r = r.dbl();
        return r;
      }
      var a = this.curve.a;
      var tinv = this.curve.tinv;
      var jx = this.x;
      var jy = this.y;
      var jz = this.z;
      var jz4 = jz.redSqr().redSqr();
      var jyd = jy.redAdd(jy);
      for (i = 0; i < pow; i++) {
        var jx2 = jx.redSqr();
        var jyd2 = jyd.redSqr();
        var jyd4 = jyd2.redSqr();
        var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
        var t1 = jx.redMul(jyd2);
        var nx = c.redSqr().redISub(t1.redAdd(t1));
        var t2 = t1.redISub(nx);
        var dny = c.redMul(t2);
        dny = dny.redIAdd(dny).redISub(jyd4);
        var nz = jyd.redMul(jz);
        if (i + 1 < pow)
          jz4 = jz4.redMul(jyd4);
        jx = nx;
        jz = nz;
        jyd = dny;
      }
      return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
    };
    JPoint.prototype.dbl = function dbl() {
      if (this.isInfinity())
        return this;
      if (this.curve.zeroA)
        return this._zeroDbl();
      else if (this.curve.threeA)
        return this._threeDbl();
      else
        return this._dbl();
    };
    JPoint.prototype._zeroDbl = function _zeroDbl() {
      var nx;
      var ny;
      var nz;
      if (this.zOne) {
        var xx = this.x.redSqr();
        var yy = this.y.redSqr();
        var yyyy = yy.redSqr();
        var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
        s = s.redIAdd(s);
        var m = xx.redAdd(xx).redIAdd(xx);
        var t = m.redSqr().redISub(s).redISub(s);
        var yyyy8 = yyyy.redIAdd(yyyy);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        nx = t;
        ny = m.redMul(s.redISub(t)).redISub(yyyy8);
        nz = this.y.redAdd(this.y);
      } else {
        var a = this.x.redSqr();
        var b = this.y.redSqr();
        var c = b.redSqr();
        var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
        d = d.redIAdd(d);
        var e = a.redAdd(a).redIAdd(a);
        var f2 = e.redSqr();
        var c8 = c.redIAdd(c);
        c8 = c8.redIAdd(c8);
        c8 = c8.redIAdd(c8);
        nx = f2.redISub(d).redISub(d);
        ny = e.redMul(d.redISub(nx)).redISub(c8);
        nz = this.y.redMul(this.z);
        nz = nz.redIAdd(nz);
      }
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype._threeDbl = function _threeDbl() {
      var nx;
      var ny;
      var nz;
      if (this.zOne) {
        var xx = this.x.redSqr();
        var yy = this.y.redSqr();
        var yyyy = yy.redSqr();
        var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
        s = s.redIAdd(s);
        var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
        var t = m.redSqr().redISub(s).redISub(s);
        nx = t;
        var yyyy8 = yyyy.redIAdd(yyyy);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        yyyy8 = yyyy8.redIAdd(yyyy8);
        ny = m.redMul(s.redISub(t)).redISub(yyyy8);
        nz = this.y.redAdd(this.y);
      } else {
        var delta = this.z.redSqr();
        var gamma = this.y.redSqr();
        var beta = this.x.redMul(gamma);
        var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
        alpha = alpha.redAdd(alpha).redIAdd(alpha);
        var beta4 = beta.redIAdd(beta);
        beta4 = beta4.redIAdd(beta4);
        var beta8 = beta4.redAdd(beta4);
        nx = alpha.redSqr().redISub(beta8);
        nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
        var ggamma8 = gamma.redSqr();
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ggamma8 = ggamma8.redIAdd(ggamma8);
        ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
      }
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype._dbl = function _dbl() {
      var a = this.curve.a;
      var jx = this.x;
      var jy = this.y;
      var jz = this.z;
      var jz4 = jz.redSqr().redSqr();
      var jx2 = jx.redSqr();
      var jy2 = jy.redSqr();
      var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
      var jxd4 = jx.redAdd(jx);
      jxd4 = jxd4.redIAdd(jxd4);
      var t1 = jxd4.redMul(jy2);
      var nx = c.redSqr().redISub(t1.redAdd(t1));
      var t2 = t1.redISub(nx);
      var jyd8 = jy2.redSqr();
      jyd8 = jyd8.redIAdd(jyd8);
      jyd8 = jyd8.redIAdd(jyd8);
      jyd8 = jyd8.redIAdd(jyd8);
      var ny = c.redMul(t2).redISub(jyd8);
      var nz = jy.redAdd(jy).redMul(jz);
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype.trpl = function trpl() {
      if (!this.curve.zeroA)
        return this.dbl().add(this);
      var xx = this.x.redSqr();
      var yy = this.y.redSqr();
      var zz = this.z.redSqr();
      var yyyy = yy.redSqr();
      var m = xx.redAdd(xx).redIAdd(xx);
      var mm = m.redSqr();
      var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
      e = e.redIAdd(e);
      e = e.redAdd(e).redIAdd(e);
      e = e.redISub(mm);
      var ee = e.redSqr();
      var t = yyyy.redIAdd(yyyy);
      t = t.redIAdd(t);
      t = t.redIAdd(t);
      t = t.redIAdd(t);
      var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
      var yyu4 = yy.redMul(u);
      yyu4 = yyu4.redIAdd(yyu4);
      yyu4 = yyu4.redIAdd(yyu4);
      var nx = this.x.redMul(ee).redISub(yyu4);
      nx = nx.redIAdd(nx);
      nx = nx.redIAdd(nx);
      var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
      ny = ny.redIAdd(ny);
      ny = ny.redIAdd(ny);
      ny = ny.redIAdd(ny);
      var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);
      return this.curve.jpoint(nx, ny, nz);
    };
    JPoint.prototype.mul = function mul(k, kbase) {
      k = new BN2(k, kbase);
      return this.curve._wnafMul(this, k);
    };
    JPoint.prototype.eq = function eq(p) {
      if (p.type === "affine")
        return this.eq(p.toJ());
      if (this === p)
        return true;
      var z2 = this.z.redSqr();
      var pz2 = p.z.redSqr();
      if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
        return false;
      var z3 = z2.redMul(this.z);
      var pz3 = pz2.redMul(p.z);
      return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
    };
    JPoint.prototype.eqXToP = function eqXToP(x) {
      var zs = this.z.redSqr();
      var rx = x.toRed(this.curve.red).redMul(zs);
      if (this.x.cmp(rx) === 0)
        return true;
      var xc = x.clone();
      var t = this.curve.redN.redMul(zs);
      for (; ; ) {
        xc.iadd(this.curve.n);
        if (xc.cmp(this.curve.p) >= 0)
          return false;
        rx.redIAdd(t);
        if (this.x.cmp(rx) === 0)
          return true;
      }
    };
    JPoint.prototype.inspect = function inspect() {
      if (this.isInfinity())
        return "<EC JPoint Infinity>";
      return "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
    };
    JPoint.prototype.isInfinity = function isInfinity() {
      return this.z.cmpn(0) === 0;
    };
  }
});

// node_modules/elliptic/lib/elliptic/curve/mont.js
var require_mont = __commonJS({
  "node_modules/elliptic/lib/elliptic/curve/mont.js"(exports, module) {
    "use strict";
    var BN2 = require_bn();
    var inherits = require_inherits_browser();
    var Base = require_base();
    var utils = require_utils2();
    function MontCurve(conf) {
      Base.call(this, "mont", conf);
      this.a = new BN2(conf.a, 16).toRed(this.red);
      this.b = new BN2(conf.b, 16).toRed(this.red);
      this.i4 = new BN2(4).toRed(this.red).redInvm();
      this.two = new BN2(2).toRed(this.red);
      this.a24 = this.i4.redMul(this.a.redAdd(this.two));
    }
    inherits(MontCurve, Base);
    module.exports = MontCurve;
    MontCurve.prototype.validate = function validate2(point) {
      var x = point.normalize().x;
      var x2 = x.redSqr();
      var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
      var y = rhs.redSqrt();
      return y.redSqr().cmp(rhs) === 0;
    };
    function Point(curve, x, z) {
      Base.BasePoint.call(this, curve, "projective");
      if (x === null && z === null) {
        this.x = this.curve.one;
        this.z = this.curve.zero;
      } else {
        this.x = new BN2(x, 16);
        this.z = new BN2(z, 16);
        if (!this.x.red)
          this.x = this.x.toRed(this.curve.red);
        if (!this.z.red)
          this.z = this.z.toRed(this.curve.red);
      }
    }
    inherits(Point, Base.BasePoint);
    MontCurve.prototype.decodePoint = function decodePoint(bytes, enc) {
      return this.point(utils.toArray(bytes, enc), 1);
    };
    MontCurve.prototype.point = function point(x, z) {
      return new Point(this, x, z);
    };
    MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
      return Point.fromJSON(this, obj);
    };
    Point.prototype.precompute = function precompute() {
    };
    Point.prototype._encode = function _encode() {
      return this.getX().toArray("be", this.curve.p.byteLength());
    };
    Point.fromJSON = function fromJSON(curve, obj) {
      return new Point(curve, obj[0], obj[1] || curve.one);
    };
    Point.prototype.inspect = function inspect() {
      if (this.isInfinity())
        return "<EC Point Infinity>";
      return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    };
    Point.prototype.isInfinity = function isInfinity() {
      return this.z.cmpn(0) === 0;
    };
    Point.prototype.dbl = function dbl() {
      var a = this.x.redAdd(this.z);
      var aa = a.redSqr();
      var b = this.x.redSub(this.z);
      var bb = b.redSqr();
      var c = aa.redSub(bb);
      var nx = aa.redMul(bb);
      var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
      return this.curve.point(nx, nz);
    };
    Point.prototype.add = function add() {
      throw new Error("Not supported on Montgomery curve");
    };
    Point.prototype.diffAdd = function diffAdd(p, diff) {
      var a = this.x.redAdd(this.z);
      var b = this.x.redSub(this.z);
      var c = p.x.redAdd(p.z);
      var d = p.x.redSub(p.z);
      var da = d.redMul(a);
      var cb = c.redMul(b);
      var nx = diff.z.redMul(da.redAdd(cb).redSqr());
      var nz = diff.x.redMul(da.redISub(cb).redSqr());
      return this.curve.point(nx, nz);
    };
    Point.prototype.mul = function mul(k) {
      var t = k.clone();
      var a = this;
      var b = this.curve.point(null, null);
      var c = this;
      for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1))
        bits.push(t.andln(1));
      for (var i = bits.length - 1; i >= 0; i--) {
        if (bits[i] === 0) {
          a = a.diffAdd(b, c);
          b = b.dbl();
        } else {
          b = a.diffAdd(b, c);
          a = a.dbl();
        }
      }
      return b;
    };
    Point.prototype.mulAdd = function mulAdd() {
      throw new Error("Not supported on Montgomery curve");
    };
    Point.prototype.jumlAdd = function jumlAdd() {
      throw new Error("Not supported on Montgomery curve");
    };
    Point.prototype.eq = function eq(other) {
      return this.getX().cmp(other.getX()) === 0;
    };
    Point.prototype.normalize = function normalize() {
      this.x = this.x.redMul(this.z.redInvm());
      this.z = this.curve.one;
      return this;
    };
    Point.prototype.getX = function getX() {
      this.normalize();
      return this.x.fromRed();
    };
  }
});

// node_modules/elliptic/lib/elliptic/curve/edwards.js
var require_edwards = __commonJS({
  "node_modules/elliptic/lib/elliptic/curve/edwards.js"(exports, module) {
    "use strict";
    var utils = require_utils2();
    var BN2 = require_bn();
    var inherits = require_inherits_browser();
    var Base = require_base();
    var assert2 = utils.assert;
    function EdwardsCurve(conf) {
      this.twisted = (conf.a | 0) !== 1;
      this.mOneA = this.twisted && (conf.a | 0) === -1;
      this.extended = this.mOneA;
      Base.call(this, "edwards", conf);
      this.a = new BN2(conf.a, 16).umod(this.red.m);
      this.a = this.a.toRed(this.red);
      this.c = new BN2(conf.c, 16).toRed(this.red);
      this.c2 = this.c.redSqr();
      this.d = new BN2(conf.d, 16).toRed(this.red);
      this.dd = this.d.redAdd(this.d);
      assert2(!this.twisted || this.c.fromRed().cmpn(1) === 0);
      this.oneC = (conf.c | 0) === 1;
    }
    inherits(EdwardsCurve, Base);
    module.exports = EdwardsCurve;
    EdwardsCurve.prototype._mulA = function _mulA(num) {
      if (this.mOneA)
        return num.redNeg();
      else
        return this.a.redMul(num);
    };
    EdwardsCurve.prototype._mulC = function _mulC(num) {
      if (this.oneC)
        return num;
      else
        return this.c.redMul(num);
    };
    EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
      return this.point(x, y, z, t);
    };
    EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
      x = new BN2(x, 16);
      if (!x.red)
        x = x.toRed(this.red);
      var x2 = x.redSqr();
      var rhs = this.c2.redSub(this.a.redMul(x2));
      var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));
      var y2 = rhs.redMul(lhs.redInvm());
      var y = y2.redSqrt();
      if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
        throw new Error("invalid point");
      var isOdd = y.fromRed().isOdd();
      if (odd && !isOdd || !odd && isOdd)
        y = y.redNeg();
      return this.point(x, y);
    };
    EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
      y = new BN2(y, 16);
      if (!y.red)
        y = y.toRed(this.red);
      var y2 = y.redSqr();
      var lhs = y2.redSub(this.c2);
      var rhs = y2.redMul(this.d).redMul(this.c2).redSub(this.a);
      var x2 = lhs.redMul(rhs.redInvm());
      if (x2.cmp(this.zero) === 0) {
        if (odd)
          throw new Error("invalid point");
        else
          return this.point(this.zero, y);
      }
      var x = x2.redSqrt();
      if (x.redSqr().redSub(x2).cmp(this.zero) !== 0)
        throw new Error("invalid point");
      if (x.fromRed().isOdd() !== odd)
        x = x.redNeg();
      return this.point(x, y);
    };
    EdwardsCurve.prototype.validate = function validate2(point) {
      if (point.isInfinity())
        return true;
      point.normalize();
      var x2 = point.x.redSqr();
      var y2 = point.y.redSqr();
      var lhs = x2.redMul(this.a).redAdd(y2);
      var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));
      return lhs.cmp(rhs) === 0;
    };
    function Point(curve, x, y, z, t) {
      Base.BasePoint.call(this, curve, "projective");
      if (x === null && y === null && z === null) {
        this.x = this.curve.zero;
        this.y = this.curve.one;
        this.z = this.curve.one;
        this.t = this.curve.zero;
        this.zOne = true;
      } else {
        this.x = new BN2(x, 16);
        this.y = new BN2(y, 16);
        this.z = z ? new BN2(z, 16) : this.curve.one;
        this.t = t && new BN2(t, 16);
        if (!this.x.red)
          this.x = this.x.toRed(this.curve.red);
        if (!this.y.red)
          this.y = this.y.toRed(this.curve.red);
        if (!this.z.red)
          this.z = this.z.toRed(this.curve.red);
        if (this.t && !this.t.red)
          this.t = this.t.toRed(this.curve.red);
        this.zOne = this.z === this.curve.one;
        if (this.curve.extended && !this.t) {
          this.t = this.x.redMul(this.y);
          if (!this.zOne)
            this.t = this.t.redMul(this.z.redInvm());
        }
      }
    }
    inherits(Point, Base.BasePoint);
    EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
      return Point.fromJSON(this, obj);
    };
    EdwardsCurve.prototype.point = function point(x, y, z, t) {
      return new Point(this, x, y, z, t);
    };
    Point.fromJSON = function fromJSON(curve, obj) {
      return new Point(curve, obj[0], obj[1], obj[2]);
    };
    Point.prototype.inspect = function inspect() {
      if (this.isInfinity())
        return "<EC Point Infinity>";
      return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
    };
    Point.prototype.isInfinity = function isInfinity() {
      return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
    };
    Point.prototype._extDbl = function _extDbl() {
      var a = this.x.redSqr();
      var b = this.y.redSqr();
      var c = this.z.redSqr();
      c = c.redIAdd(c);
      var d = this.curve._mulA(a);
      var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
      var g = d.redAdd(b);
      var f2 = g.redSub(c);
      var h = d.redSub(b);
      var nx = e.redMul(f2);
      var ny = g.redMul(h);
      var nt = e.redMul(h);
      var nz = f2.redMul(g);
      return this.curve.point(nx, ny, nz, nt);
    };
    Point.prototype._projDbl = function _projDbl() {
      var b = this.x.redAdd(this.y).redSqr();
      var c = this.x.redSqr();
      var d = this.y.redSqr();
      var nx;
      var ny;
      var nz;
      var e;
      var h;
      var j;
      if (this.curve.twisted) {
        e = this.curve._mulA(c);
        var f2 = e.redAdd(d);
        if (this.zOne) {
          nx = b.redSub(c).redSub(d).redMul(f2.redSub(this.curve.two));
          ny = f2.redMul(e.redSub(d));
          nz = f2.redSqr().redSub(f2).redSub(f2);
        } else {
          h = this.z.redSqr();
          j = f2.redSub(h).redISub(h);
          nx = b.redSub(c).redISub(d).redMul(j);
          ny = f2.redMul(e.redSub(d));
          nz = f2.redMul(j);
        }
      } else {
        e = c.redAdd(d);
        h = this.curve._mulC(this.z).redSqr();
        j = e.redSub(h).redSub(h);
        nx = this.curve._mulC(b.redISub(e)).redMul(j);
        ny = this.curve._mulC(e).redMul(c.redISub(d));
        nz = e.redMul(j);
      }
      return this.curve.point(nx, ny, nz);
    };
    Point.prototype.dbl = function dbl() {
      if (this.isInfinity())
        return this;
      if (this.curve.extended)
        return this._extDbl();
      else
        return this._projDbl();
    };
    Point.prototype._extAdd = function _extAdd(p) {
      var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
      var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
      var c = this.t.redMul(this.curve.dd).redMul(p.t);
      var d = this.z.redMul(p.z.redAdd(p.z));
      var e = b.redSub(a);
      var f2 = d.redSub(c);
      var g = d.redAdd(c);
      var h = b.redAdd(a);
      var nx = e.redMul(f2);
      var ny = g.redMul(h);
      var nt = e.redMul(h);
      var nz = f2.redMul(g);
      return this.curve.point(nx, ny, nz, nt);
    };
    Point.prototype._projAdd = function _projAdd(p) {
      var a = this.z.redMul(p.z);
      var b = a.redSqr();
      var c = this.x.redMul(p.x);
      var d = this.y.redMul(p.y);
      var e = this.curve.d.redMul(c).redMul(d);
      var f2 = b.redSub(e);
      var g = b.redAdd(e);
      var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
      var nx = a.redMul(f2).redMul(tmp);
      var ny;
      var nz;
      if (this.curve.twisted) {
        ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
        nz = f2.redMul(g);
      } else {
        ny = a.redMul(g).redMul(d.redSub(c));
        nz = this.curve._mulC(f2).redMul(g);
      }
      return this.curve.point(nx, ny, nz);
    };
    Point.prototype.add = function add(p) {
      if (this.isInfinity())
        return p;
      if (p.isInfinity())
        return this;
      if (this.curve.extended)
        return this._extAdd(p);
      else
        return this._projAdd(p);
    };
    Point.prototype.mul = function mul(k) {
      if (this._hasDoubles(k))
        return this.curve._fixedNafMul(this, k);
      else
        return this.curve._wnafMul(this, k);
    };
    Point.prototype.mulAdd = function mulAdd(k1, p, k2) {
      return this.curve._wnafMulAdd(1, [this, p], [k1, k2], 2, false);
    };
    Point.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
      return this.curve._wnafMulAdd(1, [this, p], [k1, k2], 2, true);
    };
    Point.prototype.normalize = function normalize() {
      if (this.zOne)
        return this;
      var zi = this.z.redInvm();
      this.x = this.x.redMul(zi);
      this.y = this.y.redMul(zi);
      if (this.t)
        this.t = this.t.redMul(zi);
      this.z = this.curve.one;
      this.zOne = true;
      return this;
    };
    Point.prototype.neg = function neg() {
      return this.curve.point(
        this.x.redNeg(),
        this.y,
        this.z,
        this.t && this.t.redNeg()
      );
    };
    Point.prototype.getX = function getX() {
      this.normalize();
      return this.x.fromRed();
    };
    Point.prototype.getY = function getY() {
      this.normalize();
      return this.y.fromRed();
    };
    Point.prototype.eq = function eq(other) {
      return this === other || this.getX().cmp(other.getX()) === 0 && this.getY().cmp(other.getY()) === 0;
    };
    Point.prototype.eqXToP = function eqXToP(x) {
      var rx = x.toRed(this.curve.red).redMul(this.z);
      if (this.x.cmp(rx) === 0)
        return true;
      var xc = x.clone();
      var t = this.curve.redN.redMul(this.z);
      for (; ; ) {
        xc.iadd(this.curve.n);
        if (xc.cmp(this.curve.p) >= 0)
          return false;
        rx.redIAdd(t);
        if (this.x.cmp(rx) === 0)
          return true;
      }
    };
    Point.prototype.toP = Point.prototype.normalize;
    Point.prototype.mixedAdd = Point.prototype.add;
  }
});

// node_modules/elliptic/lib/elliptic/curve/index.js
var require_curve = __commonJS({
  "node_modules/elliptic/lib/elliptic/curve/index.js"(exports) {
    "use strict";
    var curve = exports;
    curve.base = require_base();
    curve.short = require_short();
    curve.mont = require_mont();
    curve.edwards = require_edwards();
  }
});

// node_modules/hash.js/lib/hash/utils.js
var require_utils3 = __commonJS({
  "node_modules/hash.js/lib/hash/utils.js"(exports) {
    "use strict";
    var assert2 = require_minimalistic_assert();
    var inherits = require_inherits_browser();
    exports.inherits = inherits;
    function isSurrogatePair(msg, i) {
      if ((msg.charCodeAt(i) & 64512) !== 55296) {
        return false;
      }
      if (i < 0 || i + 1 >= msg.length) {
        return false;
      }
      return (msg.charCodeAt(i + 1) & 64512) === 56320;
    }
    function toArray(msg, enc) {
      if (Array.isArray(msg))
        return msg.slice();
      if (!msg)
        return [];
      var res = [];
      if (typeof msg === "string") {
        if (!enc) {
          var p = 0;
          for (var i = 0; i < msg.length; i++) {
            var c = msg.charCodeAt(i);
            if (c < 128) {
              res[p++] = c;
            } else if (c < 2048) {
              res[p++] = c >> 6 | 192;
              res[p++] = c & 63 | 128;
            } else if (isSurrogatePair(msg, i)) {
              c = 65536 + ((c & 1023) << 10) + (msg.charCodeAt(++i) & 1023);
              res[p++] = c >> 18 | 240;
              res[p++] = c >> 12 & 63 | 128;
              res[p++] = c >> 6 & 63 | 128;
              res[p++] = c & 63 | 128;
            } else {
              res[p++] = c >> 12 | 224;
              res[p++] = c >> 6 & 63 | 128;
              res[p++] = c & 63 | 128;
            }
          }
        } else if (enc === "hex") {
          msg = msg.replace(/[^a-z0-9]+/ig, "");
          if (msg.length % 2 !== 0)
            msg = "0" + msg;
          for (i = 0; i < msg.length; i += 2)
            res.push(parseInt(msg[i] + msg[i + 1], 16));
        }
      } else {
        for (i = 0; i < msg.length; i++)
          res[i] = msg[i] | 0;
      }
      return res;
    }
    exports.toArray = toArray;
    function toHex2(msg) {
      var res = "";
      for (var i = 0; i < msg.length; i++)
        res += zero2(msg[i].toString(16));
      return res;
    }
    exports.toHex = toHex2;
    function htonl(w) {
      var res = w >>> 24 | w >>> 8 & 65280 | w << 8 & 16711680 | (w & 255) << 24;
      return res >>> 0;
    }
    exports.htonl = htonl;
    function toHex32(msg, endian) {
      var res = "";
      for (var i = 0; i < msg.length; i++) {
        var w = msg[i];
        if (endian === "little")
          w = htonl(w);
        res += zero8(w.toString(16));
      }
      return res;
    }
    exports.toHex32 = toHex32;
    function zero2(word) {
      if (word.length === 1)
        return "0" + word;
      else
        return word;
    }
    exports.zero2 = zero2;
    function zero8(word) {
      if (word.length === 7)
        return "0" + word;
      else if (word.length === 6)
        return "00" + word;
      else if (word.length === 5)
        return "000" + word;
      else if (word.length === 4)
        return "0000" + word;
      else if (word.length === 3)
        return "00000" + word;
      else if (word.length === 2)
        return "000000" + word;
      else if (word.length === 1)
        return "0000000" + word;
      else
        return word;
    }
    exports.zero8 = zero8;
    function join32(msg, start, end, endian) {
      var len = end - start;
      assert2(len % 4 === 0);
      var res = new Array(len / 4);
      for (var i = 0, k = start; i < res.length; i++, k += 4) {
        var w;
        if (endian === "big")
          w = msg[k] << 24 | msg[k + 1] << 16 | msg[k + 2] << 8 | msg[k + 3];
        else
          w = msg[k + 3] << 24 | msg[k + 2] << 16 | msg[k + 1] << 8 | msg[k];
        res[i] = w >>> 0;
      }
      return res;
    }
    exports.join32 = join32;
    function split32(msg, endian) {
      var res = new Array(msg.length * 4);
      for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
        var m = msg[i];
        if (endian === "big") {
          res[k] = m >>> 24;
          res[k + 1] = m >>> 16 & 255;
          res[k + 2] = m >>> 8 & 255;
          res[k + 3] = m & 255;
        } else {
          res[k + 3] = m >>> 24;
          res[k + 2] = m >>> 16 & 255;
          res[k + 1] = m >>> 8 & 255;
          res[k] = m & 255;
        }
      }
      return res;
    }
    exports.split32 = split32;
    function rotr32(w, b) {
      return w >>> b | w << 32 - b;
    }
    exports.rotr32 = rotr32;
    function rotl32(w, b) {
      return w << b | w >>> 32 - b;
    }
    exports.rotl32 = rotl32;
    function sum32(a, b) {
      return a + b >>> 0;
    }
    exports.sum32 = sum32;
    function sum32_3(a, b, c) {
      return a + b + c >>> 0;
    }
    exports.sum32_3 = sum32_3;
    function sum32_4(a, b, c, d) {
      return a + b + c + d >>> 0;
    }
    exports.sum32_4 = sum32_4;
    function sum32_5(a, b, c, d, e) {
      return a + b + c + d + e >>> 0;
    }
    exports.sum32_5 = sum32_5;
    function sum64(buf, pos, ah, al) {
      var bh = buf[pos];
      var bl = buf[pos + 1];
      var lo = al + bl >>> 0;
      var hi = (lo < al ? 1 : 0) + ah + bh;
      buf[pos] = hi >>> 0;
      buf[pos + 1] = lo;
    }
    exports.sum64 = sum64;
    function sum64_hi(ah, al, bh, bl) {
      var lo = al + bl >>> 0;
      var hi = (lo < al ? 1 : 0) + ah + bh;
      return hi >>> 0;
    }
    exports.sum64_hi = sum64_hi;
    function sum64_lo(ah, al, bh, bl) {
      var lo = al + bl;
      return lo >>> 0;
    }
    exports.sum64_lo = sum64_lo;
    function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
      var carry = 0;
      var lo = al;
      lo = lo + bl >>> 0;
      carry += lo < al ? 1 : 0;
      lo = lo + cl >>> 0;
      carry += lo < cl ? 1 : 0;
      lo = lo + dl >>> 0;
      carry += lo < dl ? 1 : 0;
      var hi = ah + bh + ch + dh + carry;
      return hi >>> 0;
    }
    exports.sum64_4_hi = sum64_4_hi;
    function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
      var lo = al + bl + cl + dl;
      return lo >>> 0;
    }
    exports.sum64_4_lo = sum64_4_lo;
    function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
      var carry = 0;
      var lo = al;
      lo = lo + bl >>> 0;
      carry += lo < al ? 1 : 0;
      lo = lo + cl >>> 0;
      carry += lo < cl ? 1 : 0;
      lo = lo + dl >>> 0;
      carry += lo < dl ? 1 : 0;
      lo = lo + el >>> 0;
      carry += lo < el ? 1 : 0;
      var hi = ah + bh + ch + dh + eh + carry;
      return hi >>> 0;
    }
    exports.sum64_5_hi = sum64_5_hi;
    function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
      var lo = al + bl + cl + dl + el;
      return lo >>> 0;
    }
    exports.sum64_5_lo = sum64_5_lo;
    function rotr64_hi(ah, al, num) {
      var r = al << 32 - num | ah >>> num;
      return r >>> 0;
    }
    exports.rotr64_hi = rotr64_hi;
    function rotr64_lo(ah, al, num) {
      var r = ah << 32 - num | al >>> num;
      return r >>> 0;
    }
    exports.rotr64_lo = rotr64_lo;
    function shr64_hi(ah, al, num) {
      return ah >>> num;
    }
    exports.shr64_hi = shr64_hi;
    function shr64_lo(ah, al, num) {
      var r = ah << 32 - num | al >>> num;
      return r >>> 0;
    }
    exports.shr64_lo = shr64_lo;
  }
});

// node_modules/hash.js/lib/hash/common.js
var require_common = __commonJS({
  "node_modules/hash.js/lib/hash/common.js"(exports) {
    "use strict";
    var utils = require_utils3();
    var assert2 = require_minimalistic_assert();
    function BlockHash() {
      this.pending = null;
      this.pendingTotal = 0;
      this.blockSize = this.constructor.blockSize;
      this.outSize = this.constructor.outSize;
      this.hmacStrength = this.constructor.hmacStrength;
      this.padLength = this.constructor.padLength / 8;
      this.endian = "big";
      this._delta8 = this.blockSize / 8;
      this._delta32 = this.blockSize / 32;
    }
    exports.BlockHash = BlockHash;
    BlockHash.prototype.update = function update(msg, enc) {
      msg = utils.toArray(msg, enc);
      if (!this.pending)
        this.pending = msg;
      else
        this.pending = this.pending.concat(msg);
      this.pendingTotal += msg.length;
      if (this.pending.length >= this._delta8) {
        msg = this.pending;
        var r = msg.length % this._delta8;
        this.pending = msg.slice(msg.length - r, msg.length);
        if (this.pending.length === 0)
          this.pending = null;
        msg = utils.join32(msg, 0, msg.length - r, this.endian);
        for (var i = 0; i < msg.length; i += this._delta32)
          this._update(msg, i, i + this._delta32);
      }
      return this;
    };
    BlockHash.prototype.digest = function digest(enc) {
      this.update(this._pad());
      assert2(this.pending === null);
      return this._digest(enc);
    };
    BlockHash.prototype._pad = function pad() {
      var len = this.pendingTotal;
      var bytes = this._delta8;
      var k = bytes - (len + this.padLength) % bytes;
      var res = new Array(k + this.padLength);
      res[0] = 128;
      for (var i = 1; i < k; i++)
        res[i] = 0;
      len <<= 3;
      if (this.endian === "big") {
        for (var t = 8; t < this.padLength; t++)
          res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = len >>> 24 & 255;
        res[i++] = len >>> 16 & 255;
        res[i++] = len >>> 8 & 255;
        res[i++] = len & 255;
      } else {
        res[i++] = len & 255;
        res[i++] = len >>> 8 & 255;
        res[i++] = len >>> 16 & 255;
        res[i++] = len >>> 24 & 255;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        res[i++] = 0;
        for (t = 8; t < this.padLength; t++)
          res[i++] = 0;
      }
      return res;
    };
  }
});

// node_modules/hash.js/lib/hash/sha/common.js
var require_common2 = __commonJS({
  "node_modules/hash.js/lib/hash/sha/common.js"(exports) {
    "use strict";
    var utils = require_utils3();
    var rotr32 = utils.rotr32;
    function ft_1(s, x, y, z) {
      if (s === 0)
        return ch32(x, y, z);
      if (s === 1 || s === 3)
        return p32(x, y, z);
      if (s === 2)
        return maj32(x, y, z);
    }
    exports.ft_1 = ft_1;
    function ch32(x, y, z) {
      return x & y ^ ~x & z;
    }
    exports.ch32 = ch32;
    function maj32(x, y, z) {
      return x & y ^ x & z ^ y & z;
    }
    exports.maj32 = maj32;
    function p32(x, y, z) {
      return x ^ y ^ z;
    }
    exports.p32 = p32;
    function s0_256(x) {
      return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
    }
    exports.s0_256 = s0_256;
    function s1_256(x) {
      return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
    }
    exports.s1_256 = s1_256;
    function g0_256(x) {
      return rotr32(x, 7) ^ rotr32(x, 18) ^ x >>> 3;
    }
    exports.g0_256 = g0_256;
    function g1_256(x) {
      return rotr32(x, 17) ^ rotr32(x, 19) ^ x >>> 10;
    }
    exports.g1_256 = g1_256;
  }
});

// node_modules/hash.js/lib/hash/sha/1.js
var require__ = __commonJS({
  "node_modules/hash.js/lib/hash/sha/1.js"(exports, module) {
    "use strict";
    var utils = require_utils3();
    var common = require_common();
    var shaCommon = require_common2();
    var rotl32 = utils.rotl32;
    var sum32 = utils.sum32;
    var sum32_5 = utils.sum32_5;
    var ft_1 = shaCommon.ft_1;
    var BlockHash = common.BlockHash;
    var sha1_K = [
      1518500249,
      1859775393,
      2400959708,
      3395469782
    ];
    function SHA1() {
      if (!(this instanceof SHA1))
        return new SHA1();
      BlockHash.call(this);
      this.h = [
        1732584193,
        4023233417,
        2562383102,
        271733878,
        3285377520
      ];
      this.W = new Array(80);
    }
    utils.inherits(SHA1, BlockHash);
    module.exports = SHA1;
    SHA1.blockSize = 512;
    SHA1.outSize = 160;
    SHA1.hmacStrength = 80;
    SHA1.padLength = 64;
    SHA1.prototype._update = function _update(msg, start) {
      var W = this.W;
      for (var i = 0; i < 16; i++)
        W[i] = msg[start + i];
      for (; i < W.length; i++)
        W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
      var a = this.h[0];
      var b = this.h[1];
      var c = this.h[2];
      var d = this.h[3];
      var e = this.h[4];
      for (i = 0; i < W.length; i++) {
        var s = ~~(i / 20);
        var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
        e = d;
        d = c;
        c = rotl32(b, 30);
        b = a;
        a = t;
      }
      this.h[0] = sum32(this.h[0], a);
      this.h[1] = sum32(this.h[1], b);
      this.h[2] = sum32(this.h[2], c);
      this.h[3] = sum32(this.h[3], d);
      this.h[4] = sum32(this.h[4], e);
    };
    SHA1.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h, "big");
      else
        return utils.split32(this.h, "big");
    };
  }
});

// node_modules/hash.js/lib/hash/sha/256.js
var require__2 = __commonJS({
  "node_modules/hash.js/lib/hash/sha/256.js"(exports, module) {
    "use strict";
    var utils = require_utils3();
    var common = require_common();
    var shaCommon = require_common2();
    var assert2 = require_minimalistic_assert();
    var sum32 = utils.sum32;
    var sum32_4 = utils.sum32_4;
    var sum32_5 = utils.sum32_5;
    var ch32 = shaCommon.ch32;
    var maj32 = shaCommon.maj32;
    var s0_256 = shaCommon.s0_256;
    var s1_256 = shaCommon.s1_256;
    var g0_256 = shaCommon.g0_256;
    var g1_256 = shaCommon.g1_256;
    var BlockHash = common.BlockHash;
    var sha256_K = [
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ];
    function SHA256() {
      if (!(this instanceof SHA256))
        return new SHA256();
      BlockHash.call(this);
      this.h = [
        1779033703,
        3144134277,
        1013904242,
        2773480762,
        1359893119,
        2600822924,
        528734635,
        1541459225
      ];
      this.k = sha256_K;
      this.W = new Array(64);
    }
    utils.inherits(SHA256, BlockHash);
    module.exports = SHA256;
    SHA256.blockSize = 512;
    SHA256.outSize = 256;
    SHA256.hmacStrength = 192;
    SHA256.padLength = 64;
    SHA256.prototype._update = function _update(msg, start) {
      var W = this.W;
      for (var i = 0; i < 16; i++)
        W[i] = msg[start + i];
      for (; i < W.length; i++)
        W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);
      var a = this.h[0];
      var b = this.h[1];
      var c = this.h[2];
      var d = this.h[3];
      var e = this.h[4];
      var f2 = this.h[5];
      var g = this.h[6];
      var h = this.h[7];
      assert2(this.k.length === W.length);
      for (i = 0; i < W.length; i++) {
        var T1 = sum32_5(h, s1_256(e), ch32(e, f2, g), this.k[i], W[i]);
        var T2 = sum32(s0_256(a), maj32(a, b, c));
        h = g;
        g = f2;
        f2 = e;
        e = sum32(d, T1);
        d = c;
        c = b;
        b = a;
        a = sum32(T1, T2);
      }
      this.h[0] = sum32(this.h[0], a);
      this.h[1] = sum32(this.h[1], b);
      this.h[2] = sum32(this.h[2], c);
      this.h[3] = sum32(this.h[3], d);
      this.h[4] = sum32(this.h[4], e);
      this.h[5] = sum32(this.h[5], f2);
      this.h[6] = sum32(this.h[6], g);
      this.h[7] = sum32(this.h[7], h);
    };
    SHA256.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h, "big");
      else
        return utils.split32(this.h, "big");
    };
  }
});

// node_modules/hash.js/lib/hash/sha/224.js
var require__3 = __commonJS({
  "node_modules/hash.js/lib/hash/sha/224.js"(exports, module) {
    "use strict";
    var utils = require_utils3();
    var SHA256 = require__2();
    function SHA224() {
      if (!(this instanceof SHA224))
        return new SHA224();
      SHA256.call(this);
      this.h = [
        3238371032,
        914150663,
        812702999,
        4144912697,
        4290775857,
        1750603025,
        1694076839,
        3204075428
      ];
    }
    utils.inherits(SHA224, SHA256);
    module.exports = SHA224;
    SHA224.blockSize = 512;
    SHA224.outSize = 224;
    SHA224.hmacStrength = 192;
    SHA224.padLength = 64;
    SHA224.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h.slice(0, 7), "big");
      else
        return utils.split32(this.h.slice(0, 7), "big");
    };
  }
});

// node_modules/hash.js/lib/hash/sha/512.js
var require__4 = __commonJS({
  "node_modules/hash.js/lib/hash/sha/512.js"(exports, module) {
    "use strict";
    var utils = require_utils3();
    var common = require_common();
    var assert2 = require_minimalistic_assert();
    var rotr64_hi = utils.rotr64_hi;
    var rotr64_lo = utils.rotr64_lo;
    var shr64_hi = utils.shr64_hi;
    var shr64_lo = utils.shr64_lo;
    var sum64 = utils.sum64;
    var sum64_hi = utils.sum64_hi;
    var sum64_lo = utils.sum64_lo;
    var sum64_4_hi = utils.sum64_4_hi;
    var sum64_4_lo = utils.sum64_4_lo;
    var sum64_5_hi = utils.sum64_5_hi;
    var sum64_5_lo = utils.sum64_5_lo;
    var BlockHash = common.BlockHash;
    var sha512_K = [
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ];
    function SHA512() {
      if (!(this instanceof SHA512))
        return new SHA512();
      BlockHash.call(this);
      this.h = [
        1779033703,
        4089235720,
        3144134277,
        2227873595,
        1013904242,
        4271175723,
        2773480762,
        1595750129,
        1359893119,
        2917565137,
        2600822924,
        725511199,
        528734635,
        4215389547,
        1541459225,
        327033209
      ];
      this.k = sha512_K;
      this.W = new Array(160);
    }
    utils.inherits(SHA512, BlockHash);
    module.exports = SHA512;
    SHA512.blockSize = 1024;
    SHA512.outSize = 512;
    SHA512.hmacStrength = 192;
    SHA512.padLength = 128;
    SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
      var W = this.W;
      for (var i = 0; i < 32; i++)
        W[i] = msg[start + i];
      for (; i < W.length; i += 2) {
        var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);
        var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
        var c1_hi = W[i - 14];
        var c1_lo = W[i - 13];
        var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);
        var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
        var c3_hi = W[i - 32];
        var c3_lo = W[i - 31];
        W[i] = sum64_4_hi(
          c0_hi,
          c0_lo,
          c1_hi,
          c1_lo,
          c2_hi,
          c2_lo,
          c3_hi,
          c3_lo
        );
        W[i + 1] = sum64_4_lo(
          c0_hi,
          c0_lo,
          c1_hi,
          c1_lo,
          c2_hi,
          c2_lo,
          c3_hi,
          c3_lo
        );
      }
    };
    SHA512.prototype._update = function _update(msg, start) {
      this._prepareBlock(msg, start);
      var W = this.W;
      var ah = this.h[0];
      var al = this.h[1];
      var bh = this.h[2];
      var bl = this.h[3];
      var ch = this.h[4];
      var cl = this.h[5];
      var dh = this.h[6];
      var dl = this.h[7];
      var eh = this.h[8];
      var el = this.h[9];
      var fh = this.h[10];
      var fl = this.h[11];
      var gh = this.h[12];
      var gl = this.h[13];
      var hh = this.h[14];
      var hl = this.h[15];
      assert2(this.k.length === W.length);
      for (var i = 0; i < W.length; i += 2) {
        var c0_hi = hh;
        var c0_lo = hl;
        var c1_hi = s1_512_hi(eh, el);
        var c1_lo = s1_512_lo(eh, el);
        var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
        var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
        var c3_hi = this.k[i];
        var c3_lo = this.k[i + 1];
        var c4_hi = W[i];
        var c4_lo = W[i + 1];
        var T1_hi = sum64_5_hi(
          c0_hi,
          c0_lo,
          c1_hi,
          c1_lo,
          c2_hi,
          c2_lo,
          c3_hi,
          c3_lo,
          c4_hi,
          c4_lo
        );
        var T1_lo = sum64_5_lo(
          c0_hi,
          c0_lo,
          c1_hi,
          c1_lo,
          c2_hi,
          c2_lo,
          c3_hi,
          c3_lo,
          c4_hi,
          c4_lo
        );
        c0_hi = s0_512_hi(ah, al);
        c0_lo = s0_512_lo(ah, al);
        c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
        c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);
        var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
        var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);
        hh = gh;
        hl = gl;
        gh = fh;
        gl = fl;
        fh = eh;
        fl = el;
        eh = sum64_hi(dh, dl, T1_hi, T1_lo);
        el = sum64_lo(dl, dl, T1_hi, T1_lo);
        dh = ch;
        dl = cl;
        ch = bh;
        cl = bl;
        bh = ah;
        bl = al;
        ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
        al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
      }
      sum64(this.h, 0, ah, al);
      sum64(this.h, 2, bh, bl);
      sum64(this.h, 4, ch, cl);
      sum64(this.h, 6, dh, dl);
      sum64(this.h, 8, eh, el);
      sum64(this.h, 10, fh, fl);
      sum64(this.h, 12, gh, gl);
      sum64(this.h, 14, hh, hl);
    };
    SHA512.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h, "big");
      else
        return utils.split32(this.h, "big");
    };
    function ch64_hi(xh, xl, yh, yl, zh) {
      var r = xh & yh ^ ~xh & zh;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function ch64_lo(xh, xl, yh, yl, zh, zl) {
      var r = xl & yl ^ ~xl & zl;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function maj64_hi(xh, xl, yh, yl, zh) {
      var r = xh & yh ^ xh & zh ^ yh & zh;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function maj64_lo(xh, xl, yh, yl, zh, zl) {
      var r = xl & yl ^ xl & zl ^ yl & zl;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function s0_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 28);
      var c1_hi = rotr64_hi(xl, xh, 2);
      var c2_hi = rotr64_hi(xl, xh, 7);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function s0_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 28);
      var c1_lo = rotr64_lo(xl, xh, 2);
      var c2_lo = rotr64_lo(xl, xh, 7);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function s1_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 14);
      var c1_hi = rotr64_hi(xh, xl, 18);
      var c2_hi = rotr64_hi(xl, xh, 9);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function s1_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 14);
      var c1_lo = rotr64_lo(xh, xl, 18);
      var c2_lo = rotr64_lo(xl, xh, 9);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function g0_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 1);
      var c1_hi = rotr64_hi(xh, xl, 8);
      var c2_hi = shr64_hi(xh, xl, 7);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function g0_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 1);
      var c1_lo = rotr64_lo(xh, xl, 8);
      var c2_lo = shr64_lo(xh, xl, 7);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function g1_512_hi(xh, xl) {
      var c0_hi = rotr64_hi(xh, xl, 19);
      var c1_hi = rotr64_hi(xl, xh, 29);
      var c2_hi = shr64_hi(xh, xl, 6);
      var r = c0_hi ^ c1_hi ^ c2_hi;
      if (r < 0)
        r += 4294967296;
      return r;
    }
    function g1_512_lo(xh, xl) {
      var c0_lo = rotr64_lo(xh, xl, 19);
      var c1_lo = rotr64_lo(xl, xh, 29);
      var c2_lo = shr64_lo(xh, xl, 6);
      var r = c0_lo ^ c1_lo ^ c2_lo;
      if (r < 0)
        r += 4294967296;
      return r;
    }
  }
});

// node_modules/hash.js/lib/hash/sha/384.js
var require__5 = __commonJS({
  "node_modules/hash.js/lib/hash/sha/384.js"(exports, module) {
    "use strict";
    var utils = require_utils3();
    var SHA512 = require__4();
    function SHA384() {
      if (!(this instanceof SHA384))
        return new SHA384();
      SHA512.call(this);
      this.h = [
        3418070365,
        3238371032,
        1654270250,
        914150663,
        2438529370,
        812702999,
        355462360,
        4144912697,
        1731405415,
        4290775857,
        2394180231,
        1750603025,
        3675008525,
        1694076839,
        1203062813,
        3204075428
      ];
    }
    utils.inherits(SHA384, SHA512);
    module.exports = SHA384;
    SHA384.blockSize = 1024;
    SHA384.outSize = 384;
    SHA384.hmacStrength = 192;
    SHA384.padLength = 128;
    SHA384.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h.slice(0, 12), "big");
      else
        return utils.split32(this.h.slice(0, 12), "big");
    };
  }
});

// node_modules/hash.js/lib/hash/sha.js
var require_sha = __commonJS({
  "node_modules/hash.js/lib/hash/sha.js"(exports) {
    "use strict";
    exports.sha1 = require__();
    exports.sha224 = require__3();
    exports.sha256 = require__2();
    exports.sha384 = require__5();
    exports.sha512 = require__4();
  }
});

// node_modules/hash.js/lib/hash/ripemd.js
var require_ripemd = __commonJS({
  "node_modules/hash.js/lib/hash/ripemd.js"(exports) {
    "use strict";
    var utils = require_utils3();
    var common = require_common();
    var rotl32 = utils.rotl32;
    var sum32 = utils.sum32;
    var sum32_3 = utils.sum32_3;
    var sum32_4 = utils.sum32_4;
    var BlockHash = common.BlockHash;
    function RIPEMD160() {
      if (!(this instanceof RIPEMD160))
        return new RIPEMD160();
      BlockHash.call(this);
      this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
      this.endian = "little";
    }
    utils.inherits(RIPEMD160, BlockHash);
    exports.ripemd160 = RIPEMD160;
    RIPEMD160.blockSize = 512;
    RIPEMD160.outSize = 160;
    RIPEMD160.hmacStrength = 192;
    RIPEMD160.padLength = 64;
    RIPEMD160.prototype._update = function update(msg, start) {
      var A = this.h[0];
      var B = this.h[1];
      var C = this.h[2];
      var D = this.h[3];
      var E = this.h[4];
      var Ah = A;
      var Bh = B;
      var Ch = C;
      var Dh = D;
      var Eh = E;
      for (var j = 0; j < 80; j++) {
        var T = sum32(
          rotl32(
            sum32_4(A, f2(j, B, C, D), msg[r[j] + start], K(j)),
            s[j]
          ),
          E
        );
        A = E;
        E = D;
        D = rotl32(C, 10);
        C = B;
        B = T;
        T = sum32(
          rotl32(
            sum32_4(Ah, f2(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
            sh[j]
          ),
          Eh
        );
        Ah = Eh;
        Eh = Dh;
        Dh = rotl32(Ch, 10);
        Ch = Bh;
        Bh = T;
      }
      T = sum32_3(this.h[1], C, Dh);
      this.h[1] = sum32_3(this.h[2], D, Eh);
      this.h[2] = sum32_3(this.h[3], E, Ah);
      this.h[3] = sum32_3(this.h[4], A, Bh);
      this.h[4] = sum32_3(this.h[0], B, Ch);
      this.h[0] = T;
    };
    RIPEMD160.prototype._digest = function digest(enc) {
      if (enc === "hex")
        return utils.toHex32(this.h, "little");
      else
        return utils.split32(this.h, "little");
    };
    function f2(j, x, y, z) {
      if (j <= 15)
        return x ^ y ^ z;
      else if (j <= 31)
        return x & y | ~x & z;
      else if (j <= 47)
        return (x | ~y) ^ z;
      else if (j <= 63)
        return x & z | y & ~z;
      else
        return x ^ (y | ~z);
    }
    function K(j) {
      if (j <= 15)
        return 0;
      else if (j <= 31)
        return 1518500249;
      else if (j <= 47)
        return 1859775393;
      else if (j <= 63)
        return 2400959708;
      else
        return 2840853838;
    }
    function Kh(j) {
      if (j <= 15)
        return 1352829926;
      else if (j <= 31)
        return 1548603684;
      else if (j <= 47)
        return 1836072691;
      else if (j <= 63)
        return 2053994217;
      else
        return 0;
    }
    var r = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      7,
      4,
      13,
      1,
      10,
      6,
      15,
      3,
      12,
      0,
      9,
      5,
      2,
      14,
      11,
      8,
      3,
      10,
      14,
      4,
      9,
      15,
      8,
      1,
      2,
      7,
      0,
      6,
      13,
      11,
      5,
      12,
      1,
      9,
      11,
      10,
      0,
      8,
      12,
      4,
      13,
      3,
      7,
      15,
      14,
      5,
      6,
      2,
      4,
      0,
      5,
      9,
      7,
      12,
      2,
      10,
      14,
      1,
      3,
      8,
      11,
      6,
      15,
      13
    ];
    var rh = [
      5,
      14,
      7,
      0,
      9,
      2,
      11,
      4,
      13,
      6,
      15,
      8,
      1,
      10,
      3,
      12,
      6,
      11,
      3,
      7,
      0,
      13,
      5,
      10,
      14,
      15,
      8,
      12,
      4,
      9,
      1,
      2,
      15,
      5,
      1,
      3,
      7,
      14,
      6,
      9,
      11,
      8,
      12,
      2,
      10,
      0,
      4,
      13,
      8,
      6,
      4,
      1,
      3,
      11,
      15,
      0,
      5,
      12,
      2,
      13,
      9,
      7,
      10,
      14,
      12,
      15,
      10,
      4,
      1,
      5,
      8,
      7,
      6,
      2,
      13,
      14,
      0,
      3,
      9,
      11
    ];
    var s = [
      11,
      14,
      15,
      12,
      5,
      8,
      7,
      9,
      11,
      13,
      14,
      15,
      6,
      7,
      9,
      8,
      7,
      6,
      8,
      13,
      11,
      9,
      7,
      15,
      7,
      12,
      15,
      9,
      11,
      7,
      13,
      12,
      11,
      13,
      6,
      7,
      14,
      9,
      13,
      15,
      14,
      8,
      13,
      6,
      5,
      12,
      7,
      5,
      11,
      12,
      14,
      15,
      14,
      15,
      9,
      8,
      9,
      14,
      5,
      6,
      8,
      6,
      5,
      12,
      9,
      15,
      5,
      11,
      6,
      8,
      13,
      12,
      5,
      12,
      13,
      14,
      11,
      8,
      5,
      6
    ];
    var sh = [
      8,
      9,
      9,
      11,
      13,
      15,
      15,
      5,
      7,
      7,
      8,
      11,
      14,
      14,
      12,
      6,
      9,
      13,
      15,
      7,
      12,
      8,
      9,
      11,
      7,
      7,
      12,
      7,
      6,
      15,
      13,
      11,
      9,
      7,
      15,
      11,
      8,
      6,
      6,
      14,
      12,
      13,
      5,
      14,
      13,
      13,
      7,
      5,
      15,
      5,
      8,
      11,
      14,
      14,
      6,
      14,
      6,
      9,
      12,
      9,
      12,
      5,
      15,
      8,
      8,
      5,
      12,
      9,
      12,
      5,
      14,
      6,
      8,
      13,
      6,
      5,
      15,
      13,
      11,
      11
    ];
  }
});

// node_modules/hash.js/lib/hash/hmac.js
var require_hmac = __commonJS({
  "node_modules/hash.js/lib/hash/hmac.js"(exports, module) {
    "use strict";
    var utils = require_utils3();
    var assert2 = require_minimalistic_assert();
    function Hmac(hash3, key, enc) {
      if (!(this instanceof Hmac))
        return new Hmac(hash3, key, enc);
      this.Hash = hash3;
      this.blockSize = hash3.blockSize / 8;
      this.outSize = hash3.outSize / 8;
      this.inner = null;
      this.outer = null;
      this._init(utils.toArray(key, enc));
    }
    module.exports = Hmac;
    Hmac.prototype._init = function init(key) {
      if (key.length > this.blockSize)
        key = new this.Hash().update(key).digest();
      assert2(key.length <= this.blockSize);
      for (var i = key.length; i < this.blockSize; i++)
        key.push(0);
      for (i = 0; i < key.length; i++)
        key[i] ^= 54;
      this.inner = new this.Hash().update(key);
      for (i = 0; i < key.length; i++)
        key[i] ^= 106;
      this.outer = new this.Hash().update(key);
    };
    Hmac.prototype.update = function update(msg, enc) {
      this.inner.update(msg, enc);
      return this;
    };
    Hmac.prototype.digest = function digest(enc) {
      this.outer.update(this.inner.digest());
      return this.outer.digest(enc);
    };
  }
});

// node_modules/hash.js/lib/hash.js
var require_hash = __commonJS({
  "node_modules/hash.js/lib/hash.js"(exports) {
    var hash3 = exports;
    hash3.utils = require_utils3();
    hash3.common = require_common();
    hash3.sha = require_sha();
    hash3.ripemd = require_ripemd();
    hash3.hmac = require_hmac();
    hash3.sha1 = hash3.sha.sha1;
    hash3.sha256 = hash3.sha.sha256;
    hash3.sha224 = hash3.sha.sha224;
    hash3.sha384 = hash3.sha.sha384;
    hash3.sha512 = hash3.sha.sha512;
    hash3.ripemd160 = hash3.ripemd.ripemd160;
  }
});

// node_modules/elliptic/lib/elliptic/precomputed/secp256k1.js
var require_secp256k1 = __commonJS({
  "node_modules/elliptic/lib/elliptic/precomputed/secp256k1.js"(exports, module) {
    module.exports = {
      doubles: {
        step: 4,
        points: [
          [
            "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a",
            "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"
          ],
          [
            "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508",
            "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"
          ],
          [
            "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739",
            "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"
          ],
          [
            "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640",
            "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"
          ],
          [
            "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c",
            "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"
          ],
          [
            "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda",
            "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"
          ],
          [
            "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa",
            "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"
          ],
          [
            "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0",
            "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"
          ],
          [
            "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d",
            "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"
          ],
          [
            "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d",
            "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"
          ],
          [
            "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1",
            "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"
          ],
          [
            "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0",
            "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"
          ],
          [
            "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047",
            "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"
          ],
          [
            "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862",
            "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"
          ],
          [
            "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7",
            "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"
          ],
          [
            "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd",
            "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"
          ],
          [
            "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83",
            "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"
          ],
          [
            "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a",
            "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"
          ],
          [
            "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8",
            "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"
          ],
          [
            "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d",
            "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"
          ],
          [
            "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725",
            "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"
          ],
          [
            "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754",
            "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"
          ],
          [
            "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c",
            "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"
          ],
          [
            "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6",
            "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"
          ],
          [
            "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39",
            "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"
          ],
          [
            "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891",
            "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"
          ],
          [
            "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b",
            "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"
          ],
          [
            "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03",
            "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"
          ],
          [
            "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d",
            "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"
          ],
          [
            "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070",
            "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"
          ],
          [
            "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4",
            "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"
          ],
          [
            "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da",
            "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"
          ],
          [
            "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11",
            "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"
          ],
          [
            "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e",
            "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"
          ],
          [
            "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41",
            "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"
          ],
          [
            "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef",
            "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"
          ],
          [
            "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8",
            "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"
          ],
          [
            "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d",
            "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"
          ],
          [
            "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96",
            "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"
          ],
          [
            "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd",
            "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"
          ],
          [
            "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5",
            "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"
          ],
          [
            "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266",
            "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"
          ],
          [
            "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71",
            "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"
          ],
          [
            "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac",
            "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"
          ],
          [
            "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751",
            "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"
          ],
          [
            "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e",
            "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"
          ],
          [
            "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241",
            "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"
          ],
          [
            "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3",
            "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"
          ],
          [
            "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f",
            "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"
          ],
          [
            "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19",
            "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"
          ],
          [
            "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be",
            "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"
          ],
          [
            "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9",
            "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"
          ],
          [
            "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2",
            "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"
          ],
          [
            "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13",
            "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"
          ],
          [
            "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c",
            "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"
          ],
          [
            "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba",
            "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"
          ],
          [
            "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151",
            "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"
          ],
          [
            "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073",
            "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"
          ],
          [
            "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458",
            "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"
          ],
          [
            "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b",
            "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"
          ],
          [
            "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366",
            "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"
          ],
          [
            "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa",
            "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"
          ],
          [
            "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0",
            "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"
          ],
          [
            "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787",
            "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"
          ],
          [
            "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e",
            "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"
          ]
        ]
      },
      naf: {
        wnd: 7,
        points: [
          [
            "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9",
            "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"
          ],
          [
            "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4",
            "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"
          ],
          [
            "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc",
            "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"
          ],
          [
            "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe",
            "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"
          ],
          [
            "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb",
            "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"
          ],
          [
            "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8",
            "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"
          ],
          [
            "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e",
            "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"
          ],
          [
            "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34",
            "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"
          ],
          [
            "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c",
            "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"
          ],
          [
            "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5",
            "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"
          ],
          [
            "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f",
            "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"
          ],
          [
            "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714",
            "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"
          ],
          [
            "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729",
            "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"
          ],
          [
            "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db",
            "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"
          ],
          [
            "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4",
            "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"
          ],
          [
            "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5",
            "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"
          ],
          [
            "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479",
            "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"
          ],
          [
            "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d",
            "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"
          ],
          [
            "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f",
            "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"
          ],
          [
            "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb",
            "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"
          ],
          [
            "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9",
            "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"
          ],
          [
            "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963",
            "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"
          ],
          [
            "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74",
            "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"
          ],
          [
            "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530",
            "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"
          ],
          [
            "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b",
            "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"
          ],
          [
            "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247",
            "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"
          ],
          [
            "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1",
            "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"
          ],
          [
            "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120",
            "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"
          ],
          [
            "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435",
            "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"
          ],
          [
            "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18",
            "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"
          ],
          [
            "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8",
            "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"
          ],
          [
            "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb",
            "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"
          ],
          [
            "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f",
            "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"
          ],
          [
            "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143",
            "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"
          ],
          [
            "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba",
            "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"
          ],
          [
            "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45",
            "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"
          ],
          [
            "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a",
            "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"
          ],
          [
            "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e",
            "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"
          ],
          [
            "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8",
            "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"
          ],
          [
            "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c",
            "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"
          ],
          [
            "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519",
            "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"
          ],
          [
            "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab",
            "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"
          ],
          [
            "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca",
            "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"
          ],
          [
            "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf",
            "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"
          ],
          [
            "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610",
            "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"
          ],
          [
            "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4",
            "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"
          ],
          [
            "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c",
            "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"
          ],
          [
            "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940",
            "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"
          ],
          [
            "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980",
            "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"
          ],
          [
            "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3",
            "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"
          ],
          [
            "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf",
            "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"
          ],
          [
            "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63",
            "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"
          ],
          [
            "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448",
            "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"
          ],
          [
            "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf",
            "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"
          ],
          [
            "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5",
            "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"
          ],
          [
            "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6",
            "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"
          ],
          [
            "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5",
            "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"
          ],
          [
            "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99",
            "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"
          ],
          [
            "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51",
            "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"
          ],
          [
            "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5",
            "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"
          ],
          [
            "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5",
            "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"
          ],
          [
            "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997",
            "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"
          ],
          [
            "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881",
            "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"
          ],
          [
            "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5",
            "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"
          ],
          [
            "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66",
            "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"
          ],
          [
            "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726",
            "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"
          ],
          [
            "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede",
            "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"
          ],
          [
            "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94",
            "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"
          ],
          [
            "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31",
            "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"
          ],
          [
            "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51",
            "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"
          ],
          [
            "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252",
            "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"
          ],
          [
            "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5",
            "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"
          ],
          [
            "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b",
            "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"
          ],
          [
            "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4",
            "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"
          ],
          [
            "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f",
            "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"
          ],
          [
            "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889",
            "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"
          ],
          [
            "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246",
            "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"
          ],
          [
            "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984",
            "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"
          ],
          [
            "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a",
            "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"
          ],
          [
            "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030",
            "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"
          ],
          [
            "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197",
            "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"
          ],
          [
            "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593",
            "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"
          ],
          [
            "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef",
            "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"
          ],
          [
            "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38",
            "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"
          ],
          [
            "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a",
            "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"
          ],
          [
            "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111",
            "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"
          ],
          [
            "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502",
            "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"
          ],
          [
            "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea",
            "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"
          ],
          [
            "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26",
            "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"
          ],
          [
            "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986",
            "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"
          ],
          [
            "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e",
            "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"
          ],
          [
            "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4",
            "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"
          ],
          [
            "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda",
            "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"
          ],
          [
            "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859",
            "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"
          ],
          [
            "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f",
            "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"
          ],
          [
            "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c",
            "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"
          ],
          [
            "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942",
            "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"
          ],
          [
            "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a",
            "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"
          ],
          [
            "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80",
            "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"
          ],
          [
            "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d",
            "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"
          ],
          [
            "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1",
            "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"
          ],
          [
            "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63",
            "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"
          ],
          [
            "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352",
            "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"
          ],
          [
            "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193",
            "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"
          ],
          [
            "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00",
            "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"
          ],
          [
            "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58",
            "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"
          ],
          [
            "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7",
            "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"
          ],
          [
            "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8",
            "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"
          ],
          [
            "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e",
            "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"
          ],
          [
            "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d",
            "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"
          ],
          [
            "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b",
            "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"
          ],
          [
            "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f",
            "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"
          ],
          [
            "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6",
            "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"
          ],
          [
            "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297",
            "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"
          ],
          [
            "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a",
            "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"
          ],
          [
            "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c",
            "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"
          ],
          [
            "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52",
            "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"
          ],
          [
            "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb",
            "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"
          ],
          [
            "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065",
            "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"
          ],
          [
            "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917",
            "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"
          ],
          [
            "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9",
            "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"
          ],
          [
            "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3",
            "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"
          ],
          [
            "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57",
            "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"
          ],
          [
            "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66",
            "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"
          ],
          [
            "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8",
            "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"
          ],
          [
            "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721",
            "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"
          ],
          [
            "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180",
            "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"
          ]
        ]
      }
    };
  }
});

// node_modules/elliptic/lib/elliptic/curves.js
var require_curves = __commonJS({
  "node_modules/elliptic/lib/elliptic/curves.js"(exports) {
    "use strict";
    var curves = exports;
    var hash3 = require_hash();
    var curve = require_curve();
    var utils = require_utils2();
    var assert2 = utils.assert;
    function PresetCurve(options) {
      if (options.type === "short")
        this.curve = new curve.short(options);
      else if (options.type === "edwards")
        this.curve = new curve.edwards(options);
      else
        this.curve = new curve.mont(options);
      this.g = this.curve.g;
      this.n = this.curve.n;
      this.hash = options.hash;
      assert2(this.g.validate(), "Invalid curve");
      assert2(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
    }
    curves.PresetCurve = PresetCurve;
    function defineCurve(name, options) {
      Object.defineProperty(curves, name, {
        configurable: true,
        enumerable: true,
        get: function() {
          var curve2 = new PresetCurve(options);
          Object.defineProperty(curves, name, {
            configurable: true,
            enumerable: true,
            value: curve2
          });
          return curve2;
        }
      });
    }
    defineCurve("p192", {
      type: "short",
      prime: "p192",
      p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
      b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
      n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
      hash: hash3.sha256,
      gRed: false,
      g: [
        "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
        "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"
      ]
    });
    defineCurve("p224", {
      type: "short",
      prime: "p224",
      p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
      b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
      n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
      hash: hash3.sha256,
      gRed: false,
      g: [
        "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
        "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"
      ]
    });
    defineCurve("p256", {
      type: "short",
      prime: null,
      p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
      a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
      b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
      n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
      hash: hash3.sha256,
      gRed: false,
      g: [
        "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
        "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"
      ]
    });
    defineCurve("p384", {
      type: "short",
      prime: null,
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
      a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
      b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
      n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
      hash: hash3.sha384,
      gRed: false,
      g: [
        "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
        "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"
      ]
    });
    defineCurve("p521", {
      type: "short",
      prime: null,
      p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
      a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
      b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
      n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
      hash: hash3.sha512,
      gRed: false,
      g: [
        "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
        "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"
      ]
    });
    defineCurve("curve25519", {
      type: "mont",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "76d06",
      b: "1",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: hash3.sha256,
      gRed: false,
      g: [
        "9"
      ]
    });
    defineCurve("ed25519", {
      type: "edwards",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "-1",
      c: "1",
      // -121665 * (121666^(-1)) (mod P)
      d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: hash3.sha256,
      gRed: false,
      g: [
        "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
        // 4/5
        "6666666666666666666666666666666666666666666666666666666666666658"
      ]
    });
    var pre;
    try {
      pre = require_secp256k1();
    } catch (e) {
      pre = void 0;
    }
    defineCurve("secp256k1", {
      type: "short",
      prime: "k256",
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
      a: "0",
      b: "7",
      n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
      h: "1",
      hash: hash3.sha256,
      // Precomputed endomorphism
      beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
      lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
      basis: [
        {
          a: "3086d221a7d46bcde86c90e49284eb15",
          b: "-e4437ed6010e88286f547fa90abfe4c3"
        },
        {
          a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
          b: "3086d221a7d46bcde86c90e49284eb15"
        }
      ],
      gRed: false,
      g: [
        "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
        "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
        pre
      ]
    });
  }
});

// node_modules/hmac-drbg/lib/hmac-drbg.js
var require_hmac_drbg = __commonJS({
  "node_modules/hmac-drbg/lib/hmac-drbg.js"(exports, module) {
    "use strict";
    var hash3 = require_hash();
    var utils = require_utils();
    var assert2 = require_minimalistic_assert();
    function HmacDRBG(options) {
      if (!(this instanceof HmacDRBG))
        return new HmacDRBG(options);
      this.hash = options.hash;
      this.predResist = !!options.predResist;
      this.outLen = this.hash.outSize;
      this.minEntropy = options.minEntropy || this.hash.hmacStrength;
      this._reseed = null;
      this.reseedInterval = null;
      this.K = null;
      this.V = null;
      var entropy = utils.toArray(options.entropy, options.entropyEnc || "hex");
      var nonce = utils.toArray(options.nonce, options.nonceEnc || "hex");
      var pers = utils.toArray(options.pers, options.persEnc || "hex");
      assert2(
        entropy.length >= this.minEntropy / 8,
        "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
      );
      this._init(entropy, nonce, pers);
    }
    module.exports = HmacDRBG;
    HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
      var seed = entropy.concat(nonce).concat(pers);
      this.K = new Array(this.outLen / 8);
      this.V = new Array(this.outLen / 8);
      for (var i = 0; i < this.V.length; i++) {
        this.K[i] = 0;
        this.V[i] = 1;
      }
      this._update(seed);
      this._reseed = 1;
      this.reseedInterval = 281474976710656;
    };
    HmacDRBG.prototype._hmac = function hmac() {
      return new hash3.hmac(this.hash, this.K);
    };
    HmacDRBG.prototype._update = function update(seed) {
      var kmac = this._hmac().update(this.V).update([0]);
      if (seed)
        kmac = kmac.update(seed);
      this.K = kmac.digest();
      this.V = this._hmac().update(this.V).digest();
      if (!seed)
        return;
      this.K = this._hmac().update(this.V).update([1]).update(seed).digest();
      this.V = this._hmac().update(this.V).digest();
    };
    HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add, addEnc) {
      if (typeof entropyEnc !== "string") {
        addEnc = add;
        add = entropyEnc;
        entropyEnc = null;
      }
      entropy = utils.toArray(entropy, entropyEnc);
      add = utils.toArray(add, addEnc);
      assert2(
        entropy.length >= this.minEntropy / 8,
        "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
      );
      this._update(entropy.concat(add || []));
      this._reseed = 1;
    };
    HmacDRBG.prototype.generate = function generate(len, enc, add, addEnc) {
      if (this._reseed > this.reseedInterval)
        throw new Error("Reseed is required");
      if (typeof enc !== "string") {
        addEnc = add;
        add = enc;
        enc = null;
      }
      if (add) {
        add = utils.toArray(add, addEnc || "hex");
        this._update(add);
      }
      var temp = [];
      while (temp.length < len) {
        this.V = this._hmac().update(this.V).digest();
        temp = temp.concat(this.V);
      }
      var res = temp.slice(0, len);
      this._update(add);
      this._reseed++;
      return utils.encode(res, enc);
    };
  }
});

// node_modules/elliptic/lib/elliptic/ec/key.js
var require_key = __commonJS({
  "node_modules/elliptic/lib/elliptic/ec/key.js"(exports, module) {
    "use strict";
    var BN2 = require_bn();
    var utils = require_utils2();
    var assert2 = utils.assert;
    function KeyPair(ec, options) {
      this.ec = ec;
      this.priv = null;
      this.pub = null;
      if (options.priv)
        this._importPrivate(options.priv, options.privEnc);
      if (options.pub)
        this._importPublic(options.pub, options.pubEnc);
    }
    module.exports = KeyPair;
    KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
      if (pub instanceof KeyPair)
        return pub;
      return new KeyPair(ec, {
        pub,
        pubEnc: enc
      });
    };
    KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
      if (priv instanceof KeyPair)
        return priv;
      return new KeyPair(ec, {
        priv,
        privEnc: enc
      });
    };
    KeyPair.prototype.validate = function validate2() {
      var pub = this.getPublic();
      if (pub.isInfinity())
        return { result: false, reason: "Invalid public key" };
      if (!pub.validate())
        return { result: false, reason: "Public key is not a point" };
      if (!pub.mul(this.ec.curve.n).isInfinity())
        return { result: false, reason: "Public key * N != O" };
      return { result: true, reason: null };
    };
    KeyPair.prototype.getPublic = function getPublic(compact, enc) {
      if (typeof compact === "string") {
        enc = compact;
        compact = null;
      }
      if (!this.pub)
        this.pub = this.ec.g.mul(this.priv);
      if (!enc)
        return this.pub;
      return this.pub.encode(enc, compact);
    };
    KeyPair.prototype.getPrivate = function getPrivate(enc) {
      if (enc === "hex")
        return this.priv.toString(16, 2);
      else
        return this.priv;
    };
    KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
      this.priv = new BN2(key, enc || 16);
      this.priv = this.priv.umod(this.ec.curve.n);
    };
    KeyPair.prototype._importPublic = function _importPublic(key, enc) {
      if (key.x || key.y) {
        if (this.ec.curve.type === "mont") {
          assert2(key.x, "Need x coordinate");
        } else if (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") {
          assert2(key.x && key.y, "Need both x and y coordinate");
        }
        this.pub = this.ec.curve.point(key.x, key.y);
        return;
      }
      this.pub = this.ec.curve.decodePoint(key, enc);
    };
    KeyPair.prototype.derive = function derive(pub) {
      if (!pub.validate()) {
        assert2(pub.validate(), "public point not validated");
      }
      return pub.mul(this.priv).getX();
    };
    KeyPair.prototype.sign = function sign(msg, enc, options) {
      return this.ec.sign(msg, this, enc, options);
    };
    KeyPair.prototype.verify = function verify(msg, signature) {
      return this.ec.verify(msg, signature, this);
    };
    KeyPair.prototype.inspect = function inspect() {
      return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
    };
  }
});

// node_modules/elliptic/lib/elliptic/ec/signature.js
var require_signature = __commonJS({
  "node_modules/elliptic/lib/elliptic/ec/signature.js"(exports, module) {
    "use strict";
    var BN2 = require_bn();
    var utils = require_utils2();
    var assert2 = utils.assert;
    function Signature(options, enc) {
      if (options instanceof Signature)
        return options;
      if (this._importDER(options, enc))
        return;
      assert2(options.r && options.s, "Signature without r or s");
      this.r = new BN2(options.r, 16);
      this.s = new BN2(options.s, 16);
      if (options.recoveryParam === void 0)
        this.recoveryParam = null;
      else
        this.recoveryParam = options.recoveryParam;
    }
    module.exports = Signature;
    function Position() {
      this.place = 0;
    }
    function getLength(buf, p) {
      var initial = buf[p.place++];
      if (!(initial & 128)) {
        return initial;
      }
      var octetLen = initial & 15;
      if (octetLen === 0 || octetLen > 4) {
        return false;
      }
      var val = 0;
      for (var i = 0, off = p.place; i < octetLen; i++, off++) {
        val <<= 8;
        val |= buf[off];
        val >>>= 0;
      }
      if (val <= 127) {
        return false;
      }
      p.place = off;
      return val;
    }
    function rmPadding(buf) {
      var i = 0;
      var len = buf.length - 1;
      while (!buf[i] && !(buf[i + 1] & 128) && i < len) {
        i++;
      }
      if (i === 0) {
        return buf;
      }
      return buf.slice(i);
    }
    Signature.prototype._importDER = function _importDER(data, enc) {
      data = utils.toArray(data, enc);
      var p = new Position();
      if (data[p.place++] !== 48) {
        return false;
      }
      var len = getLength(data, p);
      if (len === false) {
        return false;
      }
      if (len + p.place !== data.length) {
        return false;
      }
      if (data[p.place++] !== 2) {
        return false;
      }
      var rlen = getLength(data, p);
      if (rlen === false) {
        return false;
      }
      var r = data.slice(p.place, rlen + p.place);
      p.place += rlen;
      if (data[p.place++] !== 2) {
        return false;
      }
      var slen = getLength(data, p);
      if (slen === false) {
        return false;
      }
      if (data.length !== slen + p.place) {
        return false;
      }
      var s = data.slice(p.place, slen + p.place);
      if (r[0] === 0) {
        if (r[1] & 128) {
          r = r.slice(1);
        } else {
          return false;
        }
      }
      if (s[0] === 0) {
        if (s[1] & 128) {
          s = s.slice(1);
        } else {
          return false;
        }
      }
      this.r = new BN2(r);
      this.s = new BN2(s);
      this.recoveryParam = null;
      return true;
    };
    function constructLength(arr, len) {
      if (len < 128) {
        arr.push(len);
        return;
      }
      var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
      arr.push(octets | 128);
      while (--octets) {
        arr.push(len >>> (octets << 3) & 255);
      }
      arr.push(len);
    }
    Signature.prototype.toDER = function toDER(enc) {
      var r = this.r.toArray();
      var s = this.s.toArray();
      if (r[0] & 128)
        r = [0].concat(r);
      if (s[0] & 128)
        s = [0].concat(s);
      r = rmPadding(r);
      s = rmPadding(s);
      while (!s[0] && !(s[1] & 128)) {
        s = s.slice(1);
      }
      var arr = [2];
      constructLength(arr, r.length);
      arr = arr.concat(r);
      arr.push(2);
      constructLength(arr, s.length);
      var backHalf = arr.concat(s);
      var res = [48];
      constructLength(res, backHalf.length);
      res = res.concat(backHalf);
      return utils.encode(res, enc);
    };
  }
});

// node_modules/elliptic/lib/elliptic/ec/index.js
var require_ec = __commonJS({
  "node_modules/elliptic/lib/elliptic/ec/index.js"(exports, module) {
    "use strict";
    var BN2 = require_bn();
    var HmacDRBG = require_hmac_drbg();
    var utils = require_utils2();
    var curves = require_curves();
    var rand = require_brorand();
    var assert2 = utils.assert;
    var KeyPair = require_key();
    var Signature = require_signature();
    function EC2(options) {
      if (!(this instanceof EC2))
        return new EC2(options);
      if (typeof options === "string") {
        assert2(
          Object.prototype.hasOwnProperty.call(curves, options),
          "Unknown curve " + options
        );
        options = curves[options];
      }
      if (options instanceof curves.PresetCurve)
        options = { curve: options };
      this.curve = options.curve.curve;
      this.n = this.curve.n;
      this.nh = this.n.ushrn(1);
      this.g = this.curve.g;
      this.g = options.curve.g;
      this.g.precompute(options.curve.n.bitLength() + 1);
      this.hash = options.hash || options.curve.hash;
    }
    module.exports = EC2;
    EC2.prototype.keyPair = function keyPair(options) {
      return new KeyPair(this, options);
    };
    EC2.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
      return KeyPair.fromPrivate(this, priv, enc);
    };
    EC2.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
      return KeyPair.fromPublic(this, pub, enc);
    };
    EC2.prototype.genKeyPair = function genKeyPair(options) {
      if (!options)
        options = {};
      var drbg = new HmacDRBG({
        hash: this.hash,
        pers: options.pers,
        persEnc: options.persEnc || "utf8",
        entropy: options.entropy || rand(this.hash.hmacStrength),
        entropyEnc: options.entropy && options.entropyEnc || "utf8",
        nonce: this.n.toArray()
      });
      var bytes = this.n.byteLength();
      var ns2 = this.n.sub(new BN2(2));
      for (; ; ) {
        var priv = new BN2(drbg.generate(bytes));
        if (priv.cmp(ns2) > 0)
          continue;
        priv.iaddn(1);
        return this.keyFromPrivate(priv);
      }
    };
    EC2.prototype._truncateToN = function _truncateToN(msg, truncOnly) {
      var delta = msg.byteLength() * 8 - this.n.bitLength();
      if (delta > 0)
        msg = msg.ushrn(delta);
      if (!truncOnly && msg.cmp(this.n) >= 0)
        return msg.sub(this.n);
      else
        return msg;
    };
    EC2.prototype.sign = function sign(msg, key, enc, options) {
      if (typeof enc === "object") {
        options = enc;
        enc = null;
      }
      if (!options)
        options = {};
      key = this.keyFromPrivate(key, enc);
      msg = this._truncateToN(new BN2(msg, 16));
      var bytes = this.n.byteLength();
      var bkey = key.getPrivate().toArray("be", bytes);
      var nonce = msg.toArray("be", bytes);
      var drbg = new HmacDRBG({
        hash: this.hash,
        entropy: bkey,
        nonce,
        pers: options.pers,
        persEnc: options.persEnc || "utf8"
      });
      var ns1 = this.n.sub(new BN2(1));
      for (var iter = 0; ; iter++) {
        var k = options.k ? options.k(iter) : new BN2(drbg.generate(this.n.byteLength()));
        k = this._truncateToN(k, true);
        if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
          continue;
        var kp = this.g.mul(k);
        if (kp.isInfinity())
          continue;
        var kpX = kp.getX();
        var r = kpX.umod(this.n);
        if (r.cmpn(0) === 0)
          continue;
        var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
        s = s.umod(this.n);
        if (s.cmpn(0) === 0)
          continue;
        var recoveryParam = (kp.getY().isOdd() ? 1 : 0) | (kpX.cmp(r) !== 0 ? 2 : 0);
        if (options.canonical && s.cmp(this.nh) > 0) {
          s = this.n.sub(s);
          recoveryParam ^= 1;
        }
        return new Signature({ r, s, recoveryParam });
      }
    };
    EC2.prototype.verify = function verify(msg, signature, key, enc) {
      msg = this._truncateToN(new BN2(msg, 16));
      key = this.keyFromPublic(key, enc);
      signature = new Signature(signature, "hex");
      var r = signature.r;
      var s = signature.s;
      if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
        return false;
      if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
        return false;
      var sinv = s.invm(this.n);
      var u1 = sinv.mul(msg).umod(this.n);
      var u2 = sinv.mul(r).umod(this.n);
      var p;
      if (!this.curve._maxwellTrick) {
        p = this.g.mulAdd(u1, key.getPublic(), u2);
        if (p.isInfinity())
          return false;
        return p.getX().umod(this.n).cmp(r) === 0;
      }
      p = this.g.jmulAdd(u1, key.getPublic(), u2);
      if (p.isInfinity())
        return false;
      return p.eqXToP(r);
    };
    EC2.prototype.recoverPubKey = function(msg, signature, j, enc) {
      assert2((3 & j) === j, "The recovery param is more than two bits");
      signature = new Signature(signature, enc);
      var n = this.n;
      var e = new BN2(msg);
      var r = signature.r;
      var s = signature.s;
      var isYOdd = j & 1;
      var isSecondKey = j >> 1;
      if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
        throw new Error("Unable to find sencond key candinate");
      if (isSecondKey)
        r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
      else
        r = this.curve.pointFromX(r, isYOdd);
      var rInv = signature.r.invm(n);
      var s1 = n.sub(e).mul(rInv).umod(n);
      var s2 = s.mul(rInv).umod(n);
      return this.g.mulAdd(s1, r, s2);
    };
    EC2.prototype.getKeyRecoveryParam = function(e, signature, Q, enc) {
      signature = new Signature(signature, enc);
      if (signature.recoveryParam !== null)
        return signature.recoveryParam;
      for (var i = 0; i < 4; i++) {
        var Qprime;
        try {
          Qprime = this.recoverPubKey(e, signature, i);
        } catch (e2) {
          continue;
        }
        if (Qprime.eq(Q))
          return i;
      }
      throw new Error("Unable to find valid recovery factor");
    };
  }
});

// node_modules/elliptic/lib/elliptic/eddsa/key.js
var require_key2 = __commonJS({
  "node_modules/elliptic/lib/elliptic/eddsa/key.js"(exports, module) {
    "use strict";
    var utils = require_utils2();
    var assert2 = utils.assert;
    var parseBytes = utils.parseBytes;
    var cachedProperty = utils.cachedProperty;
    function KeyPair(eddsa, params) {
      this.eddsa = eddsa;
      this._secret = parseBytes(params.secret);
      if (eddsa.isPoint(params.pub))
        this._pub = params.pub;
      else
        this._pubBytes = parseBytes(params.pub);
    }
    KeyPair.fromPublic = function fromPublic(eddsa, pub) {
      if (pub instanceof KeyPair)
        return pub;
      return new KeyPair(eddsa, { pub });
    };
    KeyPair.fromSecret = function fromSecret(eddsa, secret) {
      if (secret instanceof KeyPair)
        return secret;
      return new KeyPair(eddsa, { secret });
    };
    KeyPair.prototype.secret = function secret() {
      return this._secret;
    };
    cachedProperty(KeyPair, "pubBytes", function pubBytes() {
      return this.eddsa.encodePoint(this.pub());
    });
    cachedProperty(KeyPair, "pub", function pub() {
      if (this._pubBytes)
        return this.eddsa.decodePoint(this._pubBytes);
      return this.eddsa.g.mul(this.priv());
    });
    cachedProperty(KeyPair, "privBytes", function privBytes() {
      var eddsa = this.eddsa;
      var hash3 = this.hash();
      var lastIx = eddsa.encodingLength - 1;
      var a = hash3.slice(0, eddsa.encodingLength);
      a[0] &= 248;
      a[lastIx] &= 127;
      a[lastIx] |= 64;
      return a;
    });
    cachedProperty(KeyPair, "priv", function priv() {
      return this.eddsa.decodeInt(this.privBytes());
    });
    cachedProperty(KeyPair, "hash", function hash3() {
      return this.eddsa.hash().update(this.secret()).digest();
    });
    cachedProperty(KeyPair, "messagePrefix", function messagePrefix() {
      return this.hash().slice(this.eddsa.encodingLength);
    });
    KeyPair.prototype.sign = function sign(message) {
      assert2(this._secret, "KeyPair can only verify");
      return this.eddsa.sign(message, this);
    };
    KeyPair.prototype.verify = function verify(message, sig) {
      return this.eddsa.verify(message, sig, this);
    };
    KeyPair.prototype.getSecret = function getSecret(enc) {
      assert2(this._secret, "KeyPair is public only");
      return utils.encode(this.secret(), enc);
    };
    KeyPair.prototype.getPublic = function getPublic(enc) {
      return utils.encode(this.pubBytes(), enc);
    };
    module.exports = KeyPair;
  }
});

// node_modules/elliptic/lib/elliptic/eddsa/signature.js
var require_signature2 = __commonJS({
  "node_modules/elliptic/lib/elliptic/eddsa/signature.js"(exports, module) {
    "use strict";
    var BN2 = require_bn();
    var utils = require_utils2();
    var assert2 = utils.assert;
    var cachedProperty = utils.cachedProperty;
    var parseBytes = utils.parseBytes;
    function Signature(eddsa, sig) {
      this.eddsa = eddsa;
      if (typeof sig !== "object")
        sig = parseBytes(sig);
      if (Array.isArray(sig)) {
        sig = {
          R: sig.slice(0, eddsa.encodingLength),
          S: sig.slice(eddsa.encodingLength)
        };
      }
      assert2(sig.R && sig.S, "Signature without R or S");
      if (eddsa.isPoint(sig.R))
        this._R = sig.R;
      if (sig.S instanceof BN2)
        this._S = sig.S;
      this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
      this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
    }
    cachedProperty(Signature, "S", function S() {
      return this.eddsa.decodeInt(this.Sencoded());
    });
    cachedProperty(Signature, "R", function R() {
      return this.eddsa.decodePoint(this.Rencoded());
    });
    cachedProperty(Signature, "Rencoded", function Rencoded() {
      return this.eddsa.encodePoint(this.R());
    });
    cachedProperty(Signature, "Sencoded", function Sencoded() {
      return this.eddsa.encodeInt(this.S());
    });
    Signature.prototype.toBytes = function toBytes2() {
      return this.Rencoded().concat(this.Sencoded());
    };
    Signature.prototype.toHex = function toHex2() {
      return utils.encode(this.toBytes(), "hex").toUpperCase();
    };
    module.exports = Signature;
  }
});

// node_modules/elliptic/lib/elliptic/eddsa/index.js
var require_eddsa = __commonJS({
  "node_modules/elliptic/lib/elliptic/eddsa/index.js"(exports, module) {
    "use strict";
    var hash3 = require_hash();
    var curves = require_curves();
    var utils = require_utils2();
    var assert2 = utils.assert;
    var parseBytes = utils.parseBytes;
    var KeyPair = require_key2();
    var Signature = require_signature2();
    function EDDSA(curve) {
      assert2(curve === "ed25519", "only tested with ed25519 so far");
      if (!(this instanceof EDDSA))
        return new EDDSA(curve);
      curve = curves[curve].curve;
      this.curve = curve;
      this.g = curve.g;
      this.g.precompute(curve.n.bitLength() + 1);
      this.pointClass = curve.point().constructor;
      this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
      this.hash = hash3.sha512;
    }
    module.exports = EDDSA;
    EDDSA.prototype.sign = function sign(message, secret) {
      message = parseBytes(message);
      var key = this.keyFromSecret(secret);
      var r = this.hashInt(key.messagePrefix(), message);
      var R = this.g.mul(r);
      var Rencoded = this.encodePoint(R);
      var s_ = this.hashInt(Rencoded, key.pubBytes(), message).mul(key.priv());
      var S = r.add(s_).umod(this.curve.n);
      return this.makeSignature({ R, S, Rencoded });
    };
    EDDSA.prototype.verify = function verify(message, sig, pub) {
      message = parseBytes(message);
      sig = this.makeSignature(sig);
      var key = this.keyFromPublic(pub);
      var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
      var SG = this.g.mul(sig.S());
      var RplusAh = sig.R().add(key.pub().mul(h));
      return RplusAh.eq(SG);
    };
    EDDSA.prototype.hashInt = function hashInt() {
      var hash4 = this.hash();
      for (var i = 0; i < arguments.length; i++)
        hash4.update(arguments[i]);
      return utils.intFromLE(hash4.digest()).umod(this.curve.n);
    };
    EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
      return KeyPair.fromPublic(this, pub);
    };
    EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
      return KeyPair.fromSecret(this, secret);
    };
    EDDSA.prototype.makeSignature = function makeSignature(sig) {
      if (sig instanceof Signature)
        return sig;
      return new Signature(this, sig);
    };
    EDDSA.prototype.encodePoint = function encodePoint(point) {
      var enc = point.getY().toArray("le", this.encodingLength);
      enc[this.encodingLength - 1] |= point.getX().isOdd() ? 128 : 0;
      return enc;
    };
    EDDSA.prototype.decodePoint = function decodePoint(bytes) {
      bytes = utils.parseBytes(bytes);
      var lastIx = bytes.length - 1;
      var normed = bytes.slice(0, lastIx).concat(bytes[lastIx] & ~128);
      var xIsOdd = (bytes[lastIx] & 128) !== 0;
      var y = utils.intFromLE(normed);
      return this.curve.pointFromY(y, xIsOdd);
    };
    EDDSA.prototype.encodeInt = function encodeInt(num) {
      return num.toArray("le", this.encodingLength);
    };
    EDDSA.prototype.decodeInt = function decodeInt(bytes) {
      return utils.intFromLE(bytes);
    };
    EDDSA.prototype.isPoint = function isPoint(val) {
      return val instanceof this.pointClass;
    };
  }
});

// node_modules/elliptic/lib/elliptic.js
var require_elliptic = __commonJS({
  "node_modules/elliptic/lib/elliptic.js"(exports) {
    "use strict";
    var elliptic2 = exports;
    elliptic2.version = require_package().version;
    elliptic2.utils = require_utils2();
    elliptic2.rand = require_brorand();
    elliptic2.curve = require_curve();
    elliptic2.curves = require_curves();
    elliptic2.ec = require_ec();
    elliptic2.eddsa = require_eddsa();
  }
});

// node_modules/@fuels/vm-asm/dist/web/index.mjs
var wasm$1;
var cachedTextDecoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-8", { ignoreBOM: true, fatal: true }) : { decode: () => {
  throw Error("TextDecoder not available");
} };
if (typeof TextDecoder !== "undefined") {
  cachedTextDecoder.decode();
}
var cachedUint8Memory0 = null;
function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm$1.memory.buffer);
  }
  return cachedUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
function ret(value) {
  const ret2 = wasm$1.ret(value);
  return Instruction.__wrap(ret2);
}
function retd(addr, len) {
  const ret2 = wasm$1.retd(addr, len);
  return Instruction.__wrap(ret2);
}
function call(target_struct, fwd_coins, asset_id_addr, fwd_gas) {
  const ret2 = wasm$1.call(target_struct, fwd_coins, asset_id_addr, fwd_gas);
  return Instruction.__wrap(ret2);
}
function tr(contract_id_addr, amount, asset_id_addr) {
  const ret2 = wasm$1.tr(contract_id_addr, amount, asset_id_addr);
  return Instruction.__wrap(ret2);
}
function addi(dst, lhs, rhs) {
  const ret2 = wasm$1.addi(dst, lhs, rhs);
  return Instruction.__wrap(ret2);
}
function muli(dst, lhs, rhs) {
  const ret2 = wasm$1.muli(dst, lhs, rhs);
  return Instruction.__wrap(ret2);
}
function lw(dst, addr, offset) {
  const ret2 = wasm$1.lw(dst, addr, offset);
  return Instruction.__wrap(ret2);
}
function gtf(dst, arg, selector) {
  const ret2 = wasm$1.gtf(dst, arg, selector);
  return Instruction.__wrap(ret2);
}
function movi(dst, val) {
  const ret2 = wasm$1.movi(dst, val);
  return Instruction.__wrap(ret2);
}
var cachedInt32Memory0 = null;
function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm$1.memory.buffer);
  }
  return cachedInt32Memory0;
}
function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
var GMArgs = Object.freeze({
  /**
  *r" Get if caller is external.
  */
  IsCallerExternal: 1,
  "1": "IsCallerExternal",
  /**
  *r" Get caller's contract ID.
  */
  GetCaller: 2,
  "2": "GetCaller",
  /**
  *r" Get index of current predicate.
  */
  GetVerifyingPredicate: 3,
  "3": "GetVerifyingPredicate",
  /**
  *r" Get the Chain ID this VM is operating within
  */
  GetChainId: 4,
  "4": "GetChainId"
});
var GTFArgs = Object.freeze({
  /**
  *r" Set `$rA` to `tx.type`
  */
  Type: 1,
  "1": "Type",
  /**
  *r" Set `$rA` to `tx.gasPrice`
  */
  ScriptGasPrice: 2,
  "2": "ScriptGasPrice",
  /**
  *r" Set `$rA` to `tx.gasLimit`
  */
  ScriptGasLimit: 3,
  "3": "ScriptGasLimit",
  /**
  *r" Set `$rA` to `tx.maturity`
  */
  ScriptMaturity: 4,
  "4": "ScriptMaturity",
  /**
  *r" Set `$rA` to `tx.scriptLength`
  */
  ScriptLength: 5,
  "5": "ScriptLength",
  /**
  *r" Set `$rA` to `tx.scriptDataLength`
  */
  ScriptDataLength: 6,
  "6": "ScriptDataLength",
  /**
  *r" Set `$rA` to `tx.inputsCount`
  */
  ScriptInputsCount: 7,
  "7": "ScriptInputsCount",
  /**
  *r" Set `$rA` to `tx.outputsCount`
  */
  ScriptOutputsCount: 8,
  "8": "ScriptOutputsCount",
  /**
  *r" Set `$rA` to `tx.witnessesCount`
  */
  ScriptWitnessesCound: 9,
  "9": "ScriptWitnessesCound",
  /**
  *r" Set `$rA` to `Memory address of tx.receiptsRoot`
  */
  ScriptReceiptsRoot: 10,
  "10": "ScriptReceiptsRoot",
  /**
  *r" Set `$rA` to `Memory address of tx.script`
  */
  Script: 11,
  "11": "Script",
  /**
  *r" Set `$rA` to `Memory address of tx.scriptData`
  */
  ScriptData: 12,
  "12": "ScriptData",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB]`
  */
  ScriptInputAtIndex: 13,
  "13": "ScriptInputAtIndex",
  /**
  *r" Set `$rA` to `Memory address of t.outputs[$rB]`
  */
  ScriptOutputAtIndex: 14,
  "14": "ScriptOutputAtIndex",
  /**
  *r" Set `$rA` to `Memory address of tx.witnesses[$rB]`
  */
  ScriptWitnessAtIndex: 15,
  "15": "ScriptWitnessAtIndex",
  /**
  *r" Set `$rA` to `tx.gasPrice`
  */
  CreateGasPrice: 16,
  "16": "CreateGasPrice",
  /**
  *r" Set `$rA` to `tx.gasLimit`
  */
  CreateGasLimit: 17,
  "17": "CreateGasLimit",
  /**
  *r" Set `$rA` to `tx.maturity`
  */
  CreateMaturity: 18,
  "18": "CreateMaturity",
  /**
  *r" Set `$rA` to `tx.bytecodeLength`
  */
  CreateBytecodeLength: 19,
  "19": "CreateBytecodeLength",
  /**
  *r" Set `$rA` to `tx.bytecodeWitnessIndex`
  */
  CreateBytecodeWitnessIndex: 20,
  "20": "CreateBytecodeWitnessIndex",
  /**
  *r" Set `$rA` to `tx.storageSlotsCount`
  */
  CreateStorageSlotsCount: 21,
  "21": "CreateStorageSlotsCount",
  /**
  *r" Set `$rA` to `tx.inputsCount`
  */
  CreateInputsCount: 22,
  "22": "CreateInputsCount",
  /**
  *r" Set `$rA` to `tx.outputsCount`
  */
  CreateOutputsCount: 23,
  "23": "CreateOutputsCount",
  /**
  *r" Set `$rA` to `tx.witnessesCount`
  */
  CreateWitnessesCount: 24,
  "24": "CreateWitnessesCount",
  /**
  *r" Set `$rA` to `Memory address of tx.salt`
  */
  CreateSalt: 25,
  "25": "CreateSalt",
  /**
  *r" Set `$rA` to `Memory address of tx.storageSlots[$rB]`
  */
  CreateStorageSlotAtIndex: 26,
  "26": "CreateStorageSlotAtIndex",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB]`
  */
  CreateInputAtIndex: 27,
  "27": "CreateInputAtIndex",
  /**
  *r" Set `$rA` to `Memory address of t.outputs[$rB]`
  */
  CreateOutputAtIndex: 28,
  "28": "CreateOutputAtIndex",
  /**
  *r" Set `$rA` to `Memory address of tx.witnesses[$rB]`
  */
  CreateWitnessAtIndex: 29,
  "29": "CreateWitnessAtIndex",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].type`
  */
  InputType: 257,
  "257": "InputType",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].txID`
  */
  InputCoinTxId: 258,
  "258": "InputCoinTxId",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].outputIndex`
  */
  InputCoinOutputIndex: 259,
  "259": "InputCoinOutputIndex",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].owner`
  */
  InputCoinOwner: 260,
  "260": "InputCoinOwner",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].amount`
  */
  InputCoinAmount: 261,
  "261": "InputCoinAmount",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].asset_id`
  */
  InputCoinAssetId: 262,
  "262": "InputCoinAssetId",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].txPointer`
  */
  InputCoinTxPointer: 263,
  "263": "InputCoinTxPointer",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].witnessIndex`
  */
  InputCoinWitnessIndex: 264,
  "264": "InputCoinWitnessIndex",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].maturity`
  */
  InputCoinMaturity: 265,
  "265": "InputCoinMaturity",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].predicateLength`
  */
  InputCoinPredicateLength: 266,
  "266": "InputCoinPredicateLength",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].predicateDataLength`
  */
  InputCoinPredicateDataLength: 267,
  "267": "InputCoinPredicateDataLength",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].predicate`
  */
  InputCoinPredicate: 268,
  "268": "InputCoinPredicate",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].predicateData`
  */
  InputCoinPredicateData: 269,
  "269": "InputCoinPredicateData",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].predicateGasUsed`
  */
  InputCoinPredicateGasUsed: 270,
  "270": "InputCoinPredicateGasUsed",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].txID`
  */
  InputContractTxId: 271,
  "271": "InputContractTxId",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].outputIndex`
  */
  InputContractOutputIndex: 272,
  "272": "InputContractOutputIndex",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].balanceRoot`
  */
  InputContractBalanceRoot: 273,
  "273": "InputContractBalanceRoot",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].stateRoot`
  */
  InputContractStateRoot: 274,
  "274": "InputContractStateRoot",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].txPointer`
  */
  InputContractTxPointer: 275,
  "275": "InputContractTxPointer",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].contractID`
  */
  InputContractId: 276,
  "276": "InputContractId",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].sender`
  */
  InputMessageSender: 277,
  "277": "InputMessageSender",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].recipient`
  */
  InputMessageRecipient: 278,
  "278": "InputMessageRecipient",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].amount`
  */
  InputMessageAmount: 279,
  "279": "InputMessageAmount",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].nonce`
  */
  InputMessageNonce: 280,
  "280": "InputMessageNonce",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].witnessIndex`
  */
  InputMessageWitnessIndex: 281,
  "281": "InputMessageWitnessIndex",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].dataLength`
  */
  InputMessageDataLength: 282,
  "282": "InputMessageDataLength",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].predicateLength`
  */
  InputMessagePredicateLength: 283,
  "283": "InputMessagePredicateLength",
  /**
  *r" Set `$rA` to `tx.inputs[$rB].predicateDataLength`
  */
  InputMessagePredicateDataLength: 284,
  "284": "InputMessagePredicateDataLength",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].data`
  */
  InputMessageData: 285,
  "285": "InputMessageData",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].predicate`
  */
  InputMessagePredicate: 286,
  "286": "InputMessagePredicate",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].predicateData`
  */
  InputMessagePredicateData: 287,
  "287": "InputMessagePredicateData",
  /**
  *r" Set `$rA` to `Memory address of tx.inputs[$rB].predicateGasUsed`
  */
  InputMessagePredicateGasUsed: 288,
  "288": "InputMessagePredicateGasUsed",
  /**
  *r" Set `$rA` to `tx.outputs[$rB].type`
  */
  OutputType: 513,
  "513": "OutputType",
  /**
  *r" Set `$rA` to `Memory address of tx.outputs[$rB].to`
  */
  OutputCoinTo: 514,
  "514": "OutputCoinTo",
  /**
  *r" Set `$rA` to `tx.outputs[$rB].amount`
  */
  OutputCoinAmount: 515,
  "515": "OutputCoinAmount",
  /**
  *r" Set `$rA` to `Memory address of tx.outputs[$rB].asset_id`
  */
  OutputCoinAssetId: 516,
  "516": "OutputCoinAssetId",
  /**
  *r" Set `$rA` to `tx.outputs[$rB].inputIndex`
  */
  OutputContractInputIndex: 517,
  "517": "OutputContractInputIndex",
  /**
  *r" Set `$rA` to `Memory address of tx.outputs[$rB].balanceRoot`
  */
  OutputContractBalanceRoot: 518,
  "518": "OutputContractBalanceRoot",
  /**
  *r" Set `$rA` to `Memory address of tx.outputs[$rB].stateRoot`
  */
  OutputContractStateRoot: 519,
  "519": "OutputContractStateRoot",
  /**
  *r" Set `$rA` to `Memory address of tx.outputs[$rB].contractID`
  */
  OutputContractCreatedContractId: 520,
  "520": "OutputContractCreatedContractId",
  /**
  *r" Set `$rA` to `Memory address of tx.outputs[$rB].stateRoot`
  */
  OutputContractCreatedStateRoot: 521,
  "521": "OutputContractCreatedStateRoot",
  /**
  *r" Set `$rA` to `tx.witnesses[$rB].dataLength`
  */
  WitnessDataLength: 769,
  "769": "WitnessDataLength",
  /**
  *r" Set `$rA` to `Memory address of tx.witnesses[$rB].data`
  */
  WitnessData: 770,
  "770": "WitnessData"
});
var PanicReason = Object.freeze({
  /**
  *r" The byte can't be mapped to any known `PanicReason`.
  */
  UnknownPanicReason: 0,
  "0": "UnknownPanicReason",
  /**
  *r" Found `RVRT` instruction.
  */
  Revert: 1,
  "1": "Revert",
  /**
  *r" Execution ran out of gas.
  */
  OutOfGas: 2,
  "2": "OutOfGas",
  /**
  *r" The transaction validity is violated.
  */
  TransactionValidity: 3,
  "3": "TransactionValidity",
  /**
  *r" Attempt to write outside interpreter memory boundaries.
  */
  MemoryOverflow: 4,
  "4": "MemoryOverflow",
  /**
  *r" Overflow while executing arithmetic operation.
  *r" These errors are ignored using the WRAPPING flag.
  */
  ArithmeticOverflow: 5,
  "5": "ArithmeticOverflow",
  /**
  *r" Designed contract was not found in the storage.
  */
  ContractNotFound: 6,
  "6": "ContractNotFound",
  /**
  *r" Memory ownership rules are violated.
  */
  MemoryOwnership: 7,
  "7": "MemoryOwnership",
  /**
  *r" The asset ID balance isn't enough for the instruction.
  */
  NotEnoughBalance: 8,
  "8": "NotEnoughBalance",
  /**
  *r" The interpreter is expected to be in internal context.
  */
  ExpectedInternalContext: 9,
  "9": "ExpectedInternalContext",
  /**
  *r" The queried asset ID was not found in the state.
  */
  AssetIdNotFound: 10,
  "10": "AssetIdNotFound",
  /**
  *r" The provided input is not found in the transaction.
  */
  InputNotFound: 11,
  "11": "InputNotFound",
  /**
  *r" The provided output is not found in the transaction.
  */
  OutputNotFound: 12,
  "12": "OutputNotFound",
  /**
  *r" The provided witness is not found in the transaction.
  */
  WitnessNotFound: 13,
  "13": "WitnessNotFound",
  /**
  *r" The transaction maturity is not valid for this request.
  */
  TransactionMaturity: 14,
  "14": "TransactionMaturity",
  /**
  *r" The metadata identifier is invalid.
  */
  InvalidMetadataIdentifier: 15,
  "15": "InvalidMetadataIdentifier",
  /**
  *r" The call structure is not valid.
  */
  MalformedCallStructure: 16,
  "16": "MalformedCallStructure",
  /**
  *r" The provided register does not allow write operations.
  */
  ReservedRegisterNotWritable: 17,
  "17": "ReservedRegisterNotWritable",
  /**
  *r" The execution resulted in an erroneous state of the interpreter.
  */
  ErrorFlag: 18,
  "18": "ErrorFlag",
  /**
  *r" The provided immediate value is not valid for this instruction.
  */
  InvalidImmediateValue: 19,
  "19": "InvalidImmediateValue",
  /**
  *r" The provided transaction input is not of type `Coin`.
  */
  ExpectedCoinInput: 20,
  "20": "ExpectedCoinInput",
  /**
  *r" This entry is no longer used, and can be repurposed.
  */
  Unused0x15: 21,
  "21": "Unused0x15",
  /**
  *r" Two segments of the interpreter memory should not intersect for write operations.
  */
  MemoryWriteOverlap: 22,
  "22": "MemoryWriteOverlap",
  /**
  *r" The requested contract is not listed in the transaction inputs.
  */
  ContractNotInInputs: 23,
  "23": "ContractNotInInputs",
  /**
  *r" The internal asset ID balance overflowed with the provided instruction.
  */
  InternalBalanceOverflow: 24,
  "24": "InternalBalanceOverflow",
  /**
  *r" The maximum allowed contract size is violated.
  */
  ContractMaxSize: 25,
  "25": "ContractMaxSize",
  /**
  *r" This instruction expects the stack area to be unallocated for this call.
  */
  ExpectedUnallocatedStack: 26,
  "26": "ExpectedUnallocatedStack",
  /**
  *r" The maximum allowed number of static contracts was reached for this transaction.
  */
  MaxStaticContractsReached: 27,
  "27": "MaxStaticContractsReached",
  /**
  *r" The requested transfer amount cannot be zero.
  */
  TransferAmountCannotBeZero: 28,
  "28": "TransferAmountCannotBeZero",
  /**
  *r" The provided transaction output should be of type `Variable`.
  */
  ExpectedOutputVariable: 29,
  "29": "ExpectedOutputVariable",
  /**
  *r" The expected context of the stack parent is internal.
  */
  ExpectedParentInternalContext: 30,
  "30": "ExpectedParentInternalContext",
  /**
  *r" The jump instruction cannot move backwards in predicate verification.
  */
  IllegalJump: 31,
  "31": "IllegalJump",
  /**
  *r" The contract ID is already deployed and can't be overwritten.
  */
  ContractIdAlreadyDeployed: 32,
  "32": "ContractIdAlreadyDeployed",
  /**
  *r" The loaded contract mismatch expectations.
  */
  ContractMismatch: 33,
  "33": "ContractMismatch",
  /**
  *r" Attempting to send message data longer than `MAX_MESSAGE_DATA_LENGTH`
  */
  MessageDataTooLong: 34,
  "34": "MessageDataTooLong",
  /**
  *r" Mathimatically invalid arguments where given to an arithmetic instruction.
  *r" For instance, division by zero produces this.
  *r" These errors are ignored using the UNSAFEMATH flag.
  */
  ArithmeticError: 35,
  "35": "ArithmeticError",
  /**
  *r" The contract instruction is not allowed in predicates.
  */
  ContractInstructionNotAllowed: 36,
  "36": "ContractInstructionNotAllowed",
  /**
  *r" Transfer of zero coins is not allowed.
  */
  TransferZeroCoins: 37,
  "37": "TransferZeroCoins"
});
var CompareMode = Object.freeze({
  /**
  * Equality (`==`)
  */
  EQ: 0,
  "0": "EQ",
  /**
  * Inequality (`!=`)
  */
  NE: 1,
  "1": "NE",
  /**
  * Less than (`<`)
  */
  LT: 2,
  "2": "LT",
  /**
  * Greater than (`>`)
  */
  GT: 3,
  "3": "GT",
  /**
  * Less than or equals (`>=`)
  */
  LTE: 4,
  "4": "LTE",
  /**
  * Greater than or equals (`>=`)
  */
  GTE: 5,
  "5": "GTE",
  /**
  * Number of leading zeroes in lhs (`lzcnt`) (discards rhs)
  */
  LZC: 6,
  "6": "LZC"
});
var MathOp = Object.freeze({
  /**
  * Add
  */
  ADD: 0,
  "0": "ADD",
  /**
  * Subtract
  */
  SUB: 1,
  "1": "SUB",
  /**
  * Invert bits (discards rhs)
  */
  NOT: 2,
  "2": "NOT",
  /**
  * Bitwise or
  */
  OR: 3,
  "3": "OR",
  /**
  * Bitwise exclusive or
  */
  XOR: 4,
  "4": "XOR",
  /**
  * Bitwise and
  */
  AND: 5,
  "5": "AND",
  /**
  * Shift left
  */
  SHL: 6,
  "6": "SHL",
  /**
  * Shift right
  */
  SHR: 7,
  "7": "SHR"
});
var Instruction = class _Instruction {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_Instruction.prototype);
    obj.__wbg_ptr = ptr;
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm$1.__wbg_instruction_free(ptr);
  }
  /**
  * Convenience method for converting to bytes
  * @returns {Uint8Array}
  */
  to_bytes() {
    try {
      const retptr = wasm$1.__wbindgen_add_to_stack_pointer(-16);
      wasm$1.instruction_to_bytes(retptr, this.__wbg_ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v1 = getArrayU8FromWasm0(r0, r1).slice();
      wasm$1.__wbindgen_free(r0, r1 * 1);
      return v1;
    } finally {
      wasm$1.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
  * Size of an instruction in bytes
  * @returns {number}
  */
  static size() {
    const ret2 = wasm$1.instruction_size();
    return ret2 >>> 0;
  }
};
var RegId = class _RegId {
  static __wrap(ptr) {
    ptr = ptr >>> 0;
    const obj = Object.create(_RegId.prototype);
    obj.__wbg_ptr = ptr;
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.__wbg_ptr;
    this.__wbg_ptr = 0;
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm$1.__wbg_regid_free(ptr);
  }
  /**
  * Construct a register ID from the given value.
  *
  * Returns `None` if the value is outside the 6-bit value range.
  * @param {number} u
  * @returns {RegId | undefined}
  */
  static new_checked(u) {
    const ret2 = wasm$1.regid_new_checked(u);
    return ret2 === 0 ? void 0 : _RegId.__wrap(ret2);
  }
  /**
  * Received balance for this context.
  * @returns {RegId}
  */
  static bal() {
    const ret2 = wasm$1.regid_bal();
    return _RegId.__wrap(ret2);
  }
  /**
  * Remaining gas in the context.
  * @returns {RegId}
  */
  static cgas() {
    const ret2 = wasm$1.regid_cgas();
    return _RegId.__wrap(ret2);
  }
  /**
  * Error codes for particular operations.
  * @returns {RegId}
  */
  static err() {
    const ret2 = wasm$1.regid_err();
    return _RegId.__wrap(ret2);
  }
  /**
  * Flags register.
  * @returns {RegId}
  */
  static flag() {
    const ret2 = wasm$1.regid_flag();
    return _RegId.__wrap(ret2);
  }
  /**
  * Frame pointer. Memory address of beginning of current call frame.
  * @returns {RegId}
  */
  static fp() {
    const ret2 = wasm$1.regid_fp();
    return _RegId.__wrap(ret2);
  }
  /**
  * Remaining gas globally.
  * @returns {RegId}
  */
  static ggas() {
    const ret2 = wasm$1.regid_ggas();
    return _RegId.__wrap(ret2);
  }
  /**
  * Heap pointer. Memory address below the current bottom of the heap (points to free
  * memory).
  * @returns {RegId}
  */
  static hp() {
    const ret2 = wasm$1.regid_hp();
    return _RegId.__wrap(ret2);
  }
  /**
  * Instructions start. Pointer to the start of the currently-executing code.
  * @returns {RegId}
  */
  static is() {
    const ret2 = wasm$1.regid_is();
    return _RegId.__wrap(ret2);
  }
  /**
  * Contains overflow/underflow of addition, subtraction, and multiplication.
  * @returns {RegId}
  */
  static of() {
    const ret2 = wasm$1.regid_of();
    return _RegId.__wrap(ret2);
  }
  /**
  * Contains one (1), for convenience.
  * @returns {RegId}
  */
  static one() {
    const ret2 = wasm$1.regid_one();
    return _RegId.__wrap(ret2);
  }
  /**
  * The program counter. Memory address of the current instruction.
  * @returns {RegId}
  */
  static pc() {
    const ret2 = wasm$1.regid_pc();
    return _RegId.__wrap(ret2);
  }
  /**
  * Return value or pointer.
  * @returns {RegId}
  */
  static ret() {
    const ret2 = wasm$1.regid_ret();
    return _RegId.__wrap(ret2);
  }
  /**
  * Return value length in bytes.
  * @returns {RegId}
  */
  static retl() {
    const ret2 = wasm$1.regid_retl();
    return _RegId.__wrap(ret2);
  }
  /**
  * Stack pointer. Memory address on top of current writable stack area (points to
  * free memory).
  * @returns {RegId}
  */
  static sp() {
    const ret2 = wasm$1.regid_sp();
    return _RegId.__wrap(ret2);
  }
  /**
  * Stack start pointer. Memory address of bottom of current writable stack area.
  * @returns {RegId}
  */
  static spp() {
    const ret2 = wasm$1.regid_spp();
    return _RegId.__wrap(ret2);
  }
  /**
  * Smallest writable register.
  * @returns {RegId}
  */
  static writable() {
    const ret2 = wasm$1.regid_writable();
    return _RegId.__wrap(ret2);
  }
  /**
  * Contains zero (0), for convenience.
  * @returns {RegId}
  */
  static zero() {
    const ret2 = wasm$1.regid_zero();
    return _RegId.__wrap(ret2);
  }
  /**
  * Construct a register ID from the given value.
  *
  * The given value will be masked to 6 bits.
  * @param {number} u
  */
  constructor(u) {
    const ret2 = wasm$1.regid_new_typescript(u);
    return _RegId.__wrap(ret2);
  }
  /**
  * A const alternative to the `Into<u8>` implementation.
  * @returns {number}
  */
  to_u8() {
    const ptr = this.__destroy_into_raw();
    const ret2 = wasm$1.regid_to_u8(ptr);
    return ret2;
  }
};
async function __wbg_load(module, imports) {
  if (typeof Response === "function" && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === "function") {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get("Content-Type") != "application/wasm") {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return { instance, module };
    } else {
      return instance;
    }
  }
}
function __wbg_get_imports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  return imports;
}
function __wbg_finalize_init(instance, module) {
  wasm$1 = instance.exports;
  __wbg_init.__wbindgen_wasm_module = module;
  cachedInt32Memory0 = null;
  cachedUint8Memory0 = null;
  return wasm$1;
}
async function __wbg_init(input) {
  if (wasm$1 !== void 0)
    return wasm$1;
  const imports = __wbg_get_imports();
  const { instance, module } = await __wbg_load(await input, imports);
  return __wbg_finalize_init(instance, module);
}
function _loadWasmModule(sync, filepath, src, imports) {
  function _instantiateOrCompile(source, imports2, stream) {
    var instantiateFunc = stream ? WebAssembly.instantiateStreaming : WebAssembly.instantiate;
    var compileFunc = stream ? WebAssembly.compileStreaming : WebAssembly.compile;
    if (imports2) {
      return instantiateFunc(source, imports2);
    } else {
      return compileFunc(source);
    }
  }
  var buf = null;
  var isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
  if (isNode) {
    buf = Buffer.from(src, "base64");
  } else {
    var raw = globalThis.atob(src);
    var rawLength = raw.length;
    buf = new Uint8Array(new ArrayBuffer(rawLength));
    for (var i = 0; i < rawLength; i++) {
      buf[i] = raw.charCodeAt(i);
    }
  }
  if (sync) {
    var mod = new WebAssembly.Module(buf);
    return imports ? new WebAssembly.Instance(mod, imports) : mod;
  } else {
    return _instantiateOrCompile(buf, imports, false);
  }
}
function wasm(imports) {
  return _loadWasmModule(1, null, "AGFzbQEAAAABVA5gA39/fwF/YAF/AX9gAn9/AX9gBH9/f38Bf2ACf38AYAABf2ABfwBgBX9/f39/AX9gA39/fwBgAABgAX8BfmACfn8Bf2AFf39/f38AYAR/f39/AAIYAQN3YmcQX193YmluZGdlbl90aHJvdwAEA4AC/gEBBgIEAQIDAwMDAwMDAwMDAgsAAAAAAAAAAAAAAAAAAAAAAAAAAAYEAwMDAwMDBQMDAgICAgICAwMDAwMDAwMDAwMDAwMDAwMDBAMDAQEBAQEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAwAAg0CAgQCAgICAgICAgICAQIBAQEBAQEEBAEBAQEBAQEBAQEBAQIBBgUAAgkBBAQEAwQGBAEEAQEBBAYFBQUFBQUFBQUFBQUFBQUFBQEBBggFBAYBAQQCCAECBAECAQEEAQICAgIJAQQJCQEBAQEEAAICAQEFCgoKBgIIAgMDAgcABwABAgcHBwQFAXABFhYFAwEAEQYJAX8BQYCAwAALB5JNugUGbWVtb3J5AgAOX193YmdfYWRkX2ZyZWUAsQESYWRkX25ld190eXBlc2NyaXB0AHEGYWRkX3JhAJEBBmFkZF9yYgCLAQZhZGRfcmMAjAEDYWRkAHADYW5kAFQDZGl2AFUCZXEAVgNleHAAVwJndABYAmx0AFkEbWxvZwBaBG1yb28AWwRtb2RfAFwFbW92ZV8AfANtdWwAXQNub3QAfQJvcgBeA3NsbABfA3NybABgA3N1YgBhA3hvcgBiBG1sZHYAOgNyZXQAkgEEcmV0ZAB+E2Fsb2NfbmV3X3R5cGVzY3JpcHQAnQEEYWxvYwCTAQNtY2wAfwNtY3AAYwNtZXEAOxNiaHNoX25ld190eXBlc2NyaXB0AIcBBGJoc2gAgAEEYmhlaQCUAQRidXJuAIEBE2NhbGxfbmV3X3R5cGVzY3JpcHQATAdjYWxsX3JkAJUBBGNhbGwAPANjY3AAPQRjcm9vAIIBBGNzaXoAgwECY2IAlgEDbGRjAGQDbG9nAD4EbG9nZAA/BG1pbnQAhAEEcnZydACXAQRzY3dxAGUDc3J3AGYEc3J3cQBAA3N3dwBnBHN3d3EAQQJ0cgBoA3RybwBCBGVjazEAaQRlY3IxAGoEZWQxOQBrBGsyNTYAbARzMjU2AG0EdGltZQCFARNub29wX25ld190eXBlc2NyaXB0AMcBBG5vb3AAnwEEZmxhZwCYAQNiYWwAbgNqbXAAmQEDam5lAG8Dc21vAEMTYWRkaV9uZXdfdHlwZXNjcmlwdABzCmFkZGlfaW1tMTIAjQEEYWRkaQATBGFuZGkAFARkaXZpABUEZXhwaQAWBG1vZGkAFwRtdWxpABgDb3JpABkEc2xsaQAaBHNybGkAGwRzdWJpABwEeG9yaQAdBGpuZWkAHgJsYgAfAmx3ACACc2IAIQJzdwAiBG1jcGkAIwNndGYAJARtY2xpADIRZ21fbmV3X3R5cGVzY3JpcHQAeQhnbV9pbW0xOACJAQJnbQAzBG1vdmkANARqbnppADUEam1wZgA2BGptcGIANwRqbnpmACUEam56YgAmBGpuZWYABwRqbmViAAgCamkATRNjZmVpX25ld190eXBlc2NyaXB0AIgBCmNmZWlfaW1tMjQAigEEY2ZlaQBOBGNmc2kATwNjZmUAmgEDY2ZzAJsBBHBzaGwAUARwc2hoAFEEcG9wbABSBHBvcGgAUwR3ZGNtAAkEd3FjbQAKBHdkb3AACwR3cW9wAAwEd2RtbAANBHdxbWwADgR3ZGR2AA8Ed3FkdgAQBHdkbWQARAR3cW1kAEUEd2RhbQBGBHdxYW0ARwR3ZG1tAEgEd3FtbQBJCm1jbGlfaW1tMTgAiQEKbW92aV9pbW0xOACJAQpqbnppX2ltbTE4AIkBCmptcGZfaW1tMTgAiQEKam1wYl9pbW0xOACJAQhqaV9pbW0yNACKAQpjZnNpX2ltbTI0AIoBCnBzaGxfaW1tMjQAigEKcHNoaF9pbW0yNACKAQpwb3BsX2ltbTI0AIoBCnBvcGhfaW1tMjQAigETbWNsaV9uZXdfdHlwZXNjcmlwdAB5E21vdmlfbmV3X3R5cGVzY3JpcHQAeRNqbnppX25ld190eXBlc2NyaXB0AHkTam1wZl9uZXdfdHlwZXNjcmlwdAB5E2ptcGJfbmV3X3R5cGVzY3JpcHQAeRJub3RfbmV3X3R5cGVzY3JpcHQAhwETcmV0ZF9uZXdfdHlwZXNjcmlwdACHARNtb3ZlX25ld190eXBlc2NyaXB0AIcBEm1jbF9uZXdfdHlwZXNjcmlwdACHARNidXJuX25ld190eXBlc2NyaXB0AIcBE2Nyb29fbmV3X3R5cGVzY3JpcHQAhwETY3Npel9uZXdfdHlwZXNjcmlwdACHARNtaW50X25ld190eXBlc2NyaXB0AIcBE3RpbWVfbmV3X3R5cGVzY3JpcHQAhwERamlfbmV3X3R5cGVzY3JpcHQAiAETY2ZzaV9uZXdfdHlwZXNjcmlwdACIARNwc2hsX25ld190eXBlc2NyaXB0AIgBE3BzaGhfbmV3X3R5cGVzY3JpcHQAiAETcG9wbF9uZXdfdHlwZXNjcmlwdACIARNwb3BoX25ld190eXBlc2NyaXB0AIgBE2FuZGlfbmV3X3R5cGVzY3JpcHQAcxNkaXZpX25ld190eXBlc2NyaXB0AHMTZXhwaV9uZXdfdHlwZXNjcmlwdABzE21vZGlfbmV3X3R5cGVzY3JpcHQAcxNtdWxpX25ld190eXBlc2NyaXB0AHMSb3JpX25ld190eXBlc2NyaXB0AHMTc2xsaV9uZXdfdHlwZXNjcmlwdABzE3NybGlfbmV3X3R5cGVzY3JpcHQAcxNzdWJpX25ld190eXBlc2NyaXB0AHMTeG9yaV9uZXdfdHlwZXNjcmlwdABzE2puZWlfbmV3X3R5cGVzY3JpcHQAcxFsYl9uZXdfdHlwZXNjcmlwdABzEWx3X25ld190eXBlc2NyaXB0AHMRc2JfbmV3X3R5cGVzY3JpcHQAcxFzd19uZXdfdHlwZXNjcmlwdABzE21jcGlfbmV3X3R5cGVzY3JpcHQAcxJndGZfbmV3X3R5cGVzY3JpcHQAcxNqbnpmX25ld190eXBlc2NyaXB0AHMTam56Yl9uZXdfdHlwZXNjcmlwdABzCmFuZGlfaW1tMTIAjQEKZGl2aV9pbW0xMgCNAQpleHBpX2ltbTEyAI0BCm1vZGlfaW1tMTIAjQEKbXVsaV9pbW0xMgCNAQlvcmlfaW1tMTIAjQEKc2xsaV9pbW0xMgCNAQpzcmxpX2ltbTEyAI0BCnN1YmlfaW1tMTIAjQEKeG9yaV9pbW0xMgCNAQpqbmVpX2ltbTEyAI0BCGxiX2ltbTEyAI0BCGx3X2ltbTEyAI0BCHNiX2ltbTEyAI0BCHN3X2ltbTEyAI0BCm1jcGlfaW1tMTIAjQEJZ3RmX2ltbTEyAI0BCmpuemZfaW1tMTIAjQEKam56Yl9pbW0xMgCNARJhbmRfbmV3X3R5cGVzY3JpcHQAcRJkaXZfbmV3X3R5cGVzY3JpcHQAcRFlcV9uZXdfdHlwZXNjcmlwdABxEmV4cF9uZXdfdHlwZXNjcmlwdABxEWd0X25ld190eXBlc2NyaXB0AHERbHRfbmV3X3R5cGVzY3JpcHQAcRNtbG9nX25ld190eXBlc2NyaXB0AHETbXJvb19uZXdfdHlwZXNjcmlwdABxEm1vZF9uZXdfdHlwZXNjcmlwdABxEm11bF9uZXdfdHlwZXNjcmlwdABxEW9yX25ld190eXBlc2NyaXB0AHESc2xsX25ld190eXBlc2NyaXB0AHESc3JsX25ld190eXBlc2NyaXB0AHESc3ViX25ld190eXBlc2NyaXB0AHESeG9yX25ld190eXBlc2NyaXB0AHESbWNwX25ld190eXBlc2NyaXB0AHESbGRjX25ld190eXBlc2NyaXB0AHETc2N3cV9uZXdfdHlwZXNjcmlwdABxEnNyd19uZXdfdHlwZXNjcmlwdABxEnN3d19uZXdfdHlwZXNjcmlwdABxEXRyX25ld190eXBlc2NyaXB0AHETZWNrMV9uZXdfdHlwZXNjcmlwdABxE2VjcjFfbmV3X3R5cGVzY3JpcHQAcRNlZDE5X25ld190eXBlc2NyaXB0AHETazI1Nl9uZXdfdHlwZXNjcmlwdABxE3MyNTZfbmV3X3R5cGVzY3JpcHQAcRJiYWxfbmV3X3R5cGVzY3JpcHQAcRJqbmVfbmV3X3R5cGVzY3JpcHQAcRJyZXRfbmV3X3R5cGVzY3JpcHQAnQETYmhlaV9uZXdfdHlwZXNjcmlwdACdARFjYl9uZXdfdHlwZXNjcmlwdACdARNydnJ0X25ld190eXBlc2NyaXB0AJ0BE2ZsYWdfbmV3X3R5cGVzY3JpcHQAnQESam1wX25ld190eXBlc2NyaXB0AJ0BEmNmZV9uZXdfdHlwZXNjcmlwdACdARJjZnNfbmV3X3R5cGVzY3JpcHQAnQEGYW5kX3JiAIsBBmRpdl9yYgCLAQVlcV9yYgCLAQZleHBfcmIAiwEFZ3RfcmIAiwEFbHRfcmIAiwEHbWxvZ19yYgCLAQdtcm9vX3JiAIsBBm1vZF9yYgCLAQdtb3ZlX3JiAIsBBm11bF9yYgCLAQZub3RfcmIAiwEFb3JfcmIAiwEGc2xsX3JiAIsBBnNybF9yYgCLAQZzdWJfcmIAiwEGeG9yX3JiAIsBB21sZHZfcmIAiwEHcmV0ZF9yYgCLAQZtY2xfcmIAiwEGbWNwX3JiAIsBBm1lcV9yYgCLAQdiaHNoX3JiAIsBB2J1cm5fcmIAiwEHY2FsbF9yYgCLAQZjY3BfcmIAiwEHY3Jvb19yYgCLAQdjc2l6X3JiAIsBBmxkY19yYgCLAQZsb2dfcmIAiwEHbG9nZF9yYgCLAQdtaW50X3JiAIsBB3Njd3FfcmIAiwEGc3J3X3JiAIsBB3Nyd3FfcmIAiwEGc3d3X3JiAIsBB3N3d3FfcmIAiwEFdHJfcmIAiwEGdHJvX3JiAIsBB2VjazFfcmIAiwEHZWNyMV9yYgCLAQdlZDE5X3JiAIsBB2syNTZfcmIAiwEHczI1Nl9yYgCLAQd0aW1lX3JiAIsBBmJhbF9yYgCLAQZqbmVfcmIAiwEGc21vX3JiAIsBB2FkZGlfcmIAiwEHYW5kaV9yYgCLAQdkaXZpX3JiAIsBB2V4cGlfcmIAiwEHbW9kaV9yYgCLAQdtdWxpX3JiAIsBBm9yaV9yYgCLAQdzbGxpX3JiAIsBB3NybGlfcmIAiwEHc3ViaV9yYgCLAQd4b3JpX3JiAIsBB2puZWlfcmIAiwEFbGJfcmIAiwEFbHdfcmIAiwEFc2JfcmIAiwEFc3dfcmIAiwEHbWNwaV9yYgCLAQZndGZfcmIAiwEHam56Zl9yYgCLAQdqbnpiX3JiAIsBB2puZWZfcmIAiwEHam5lYl9yYgCLAQd3ZGNtX3JiAIsBB3dxY21fcmIAiwEHd2RvcF9yYgCLAQd3cW9wX3JiAIsBB3dkbWxfcmIAiwEHd3FtbF9yYgCLAQd3ZGR2X3JiAIsBB3dxZHZfcmIAiwEHd2RtZF9yYgCLAQd3cW1kX3JiAIsBB3dkYW1fcmIAiwEHd3FhbV9yYgCLAQd3ZG1tX3JiAIsBB3dxbW1fcmIAiwEGYW5kX3JhAJEBBmRpdl9yYQCRAQVlcV9yYQCRAQZleHBfcmEAkQEFZ3RfcmEAkQEFbHRfcmEAkQEHbWxvZ19yYQCRAQdtcm9vX3JhAJEBBm1vZF9yYQCRAQdtb3ZlX3JhAJEBBm11bF9yYQCRAQZub3RfcmEAkQEFb3JfcmEAkQEGc2xsX3JhAJEBBnNybF9yYQCRAQZzdWJfcmEAkQEGeG9yX3JhAJEBB21sZHZfcmEAkQEGcmV0X3JhAJEBB3JldGRfcmEAkQEHYWxvY19yYQCRAQZtY2xfcmEAkQEGbWNwX3JhAJEBBm1lcV9yYQCRAQdiaHNoX3JhAJEBB2JoZWlfcmEAkQEHYnVybl9yYQCRAQdjYWxsX3JhAJEBBmNjcF9yYQCRAQdjcm9vX3JhAJEBB2NzaXpfcmEAkQEFY2JfcmEAkQEGbGRjX3JhAJEBBmxvZ19yYQCRAQdsb2dkX3JhAJEBB21pbnRfcmEAkQEHcnZydF9yYQCRAQdzY3dxX3JhAJEBBnNyd19yYQCRAQdzcndxX3JhAJEBBnN3d19yYQCRAQdzd3dxX3JhAJEBBXRyX3JhAJEBBnRyb19yYQCRAQdlY2sxX3JhAJEBB2VjcjFfcmEAkQEHZWQxOV9yYQCRAQdrMjU2X3JhAJEBB3MyNTZfcmEAkQEHdGltZV9yYQCRAQdmbGFnX3JhAJEBBmJhbF9yYQCRAQZqbXBfcmEAkQEGam5lX3JhAJEBBnNtb19yYQCRAQdhZGRpX3JhAJEBB2FuZGlfcmEAkQEHZGl2aV9yYQCRAQdleHBpX3JhAJEBB21vZGlfcmEAkQEHbXVsaV9yYQCRAQZvcmlfcmEAkQEHc2xsaV9yYQCRAQdzcmxpX3JhAJEBB3N1YmlfcmEAkQEHeG9yaV9yYQCRAQdqbmVpX3JhAJEBBWxiX3JhAJEBBWx3X3JhAJEBBXNiX3JhAJEBBXN3X3JhAJEBB21jcGlfcmEAkQEGZ3RmX3JhAJEBB21jbGlfcmEAkQEFZ21fcmEAkQEHbW92aV9yYQCRAQdqbnppX3JhAJEBB2ptcGZfcmEAkQEHam1wYl9yYQCRAQdqbnpmX3JhAJEBB2puemJfcmEAkQEHam5lZl9yYQCRAQdqbmViX3JhAJEBBmNmZV9yYQCRAQZjZnNfcmEAkQEHd2RjbV9yYQCRAQd3cWNtX3JhAJEBB3dkb3BfcmEAkQEHd3FvcF9yYQCRAQd3ZG1sX3JhAJEBB3dxbWxfcmEAkQEHd2Rkdl9yYQCRAQd3cWR2X3JhAJEBB3dkbWRfcmEAkQEHd3FtZF9yYQCRAQd3ZGFtX3JhAJEBB3dxYW1fcmEAkQEHd2RtbV9yYQCRAQd3cW1tX3JhAJEBE21sZHZfbmV3X3R5cGVzY3JpcHQATBJtZXFfbmV3X3R5cGVzY3JpcHQATBJjY3BfbmV3X3R5cGVzY3JpcHQATBJsb2dfbmV3X3R5cGVzY3JpcHQATBNsb2dkX25ld190eXBlc2NyaXB0AEwTc3J3cV9uZXdfdHlwZXNjcmlwdABME3N3d3FfbmV3X3R5cGVzY3JpcHQATBJ0cm9fbmV3X3R5cGVzY3JpcHQATBJzbW9fbmV3X3R5cGVzY3JpcHQATBNqbmVmX25ld190eXBlc2NyaXB0AEwTam5lYl9uZXdfdHlwZXNjcmlwdABME3dkY21fbmV3X3R5cGVzY3JpcHQATBN3cWNtX25ld190eXBlc2NyaXB0AEwTd2RvcF9uZXdfdHlwZXNjcmlwdABME3dxb3BfbmV3X3R5cGVzY3JpcHQATBN3ZG1sX25ld190eXBlc2NyaXB0AEwTd3FtbF9uZXdfdHlwZXNjcmlwdABME3dkZHZfbmV3X3R5cGVzY3JpcHQATBN3cWR2X25ld190eXBlc2NyaXB0AEwTd2RtZF9uZXdfdHlwZXNjcmlwdABME3dxbWRfbmV3X3R5cGVzY3JpcHQATBN3ZGFtX25ld190eXBlc2NyaXB0AEwTd3FhbV9uZXdfdHlwZXNjcmlwdABME3dkbW1fbmV3X3R5cGVzY3JpcHQATBN3cW1tX25ld190eXBlc2NyaXB0AEwHbWxkdl9yZACVAQZtZXFfcmQAlQEGY2NwX3JkAJUBBmxvZ19yZACVAQdsb2dkX3JkAJUBB3Nyd3FfcmQAlQEHc3d3cV9yZACVAQZ0cm9fcmQAlQEGc21vX3JkAJUBCmpuZWZfaW1tMDYAlQEKam5lYl9pbW0wNgCVAQp3ZGNtX2ltbTA2AJUBCndxY21faW1tMDYAlQEKd2RvcF9pbW0wNgCVAQp3cW9wX2ltbTA2AJUBCndkbWxfaW1tMDYAlQEKd3FtbF9pbW0wNgCVAQp3ZGR2X2ltbTA2AJUBCndxZHZfaW1tMDYAlQEHd2RtZF9yZACVAQd3cW1kX3JkAJUBB3dkYW1fcmQAlQEHd3FhbV9yZACVAQd3ZG1tX3JkAJUBB3dxbW1fcmQAlQEOX193YmdfYW5kX2ZyZWUAsQEOX193YmdfZGl2X2ZyZWUAsQENX193YmdfZXFfZnJlZQCxAQ5fX3diZ19leHBfZnJlZQCxAQ1fX3diZ19ndF9mcmVlALEBDV9fd2JnX2x0X2ZyZWUAsQEPX193YmdfbWxvZ19mcmVlALEBD19fd2JnX21yb29fZnJlZQCxAQ5fX3diZ19tb2RfZnJlZQCxAQ9fX3diZ19tb3ZlX2ZyZWUAsQEOX193YmdfbXVsX2ZyZWUAsQEOX193Ymdfbm90X2ZyZWUAsQENX193Ymdfb3JfZnJlZQCxAQ5fX3diZ19zbGxfZnJlZQCxAQ5fX3diZ19zcmxfZnJlZQCxAQ5fX3diZ19zdWJfZnJlZQCxAQ5fX3diZ194b3JfZnJlZQCxAQ9fX3diZ19tbGR2X2ZyZWUAsQEOX193YmdfcmV0X2ZyZWUAsQEPX193YmdfcmV0ZF9mcmVlALEBD19fd2JnX2Fsb2NfZnJlZQCxAQ5fX3diZ19tY2xfZnJlZQCxAQ5fX3diZ19tY3BfZnJlZQCxAQ5fX3diZ19tZXFfZnJlZQCxAQ9fX3diZ19iaHNoX2ZyZWUAsQEPX193YmdfYmhlaV9mcmVlALEBD19fd2JnX2J1cm5fZnJlZQCxAQ9fX3diZ19jYWxsX2ZyZWUAsQEOX193YmdfY2NwX2ZyZWUAsQEPX193YmdfY3Jvb19mcmVlALEBD19fd2JnX2NzaXpfZnJlZQCxAQ1fX3diZ19jYl9mcmVlALEBDl9fd2JnX2xkY19mcmVlALEBDl9fd2JnX2xvZ19mcmVlALEBD19fd2JnX2xvZ2RfZnJlZQCxAQ9fX3diZ19taW50X2ZyZWUAsQEPX193YmdfcnZydF9mcmVlALEBD19fd2JnX3Njd3FfZnJlZQCxAQ5fX3diZ19zcndfZnJlZQCxAQ9fX3diZ19zcndxX2ZyZWUAsQEOX193Ymdfc3d3X2ZyZWUAsQEPX193Ymdfc3d3cV9mcmVlALEBDV9fd2JnX3RyX2ZyZWUAsQEOX193YmdfdHJvX2ZyZWUAsQEPX193YmdfZWNrMV9mcmVlALEBD19fd2JnX2VjcjFfZnJlZQCxAQ9fX3diZ19lZDE5X2ZyZWUAsQEPX193YmdfazI1Nl9mcmVlALEBD19fd2JnX3MyNTZfZnJlZQCxAQ9fX3diZ190aW1lX2ZyZWUAsQEPX193Ymdfbm9vcF9mcmVlALEBD19fd2JnX2ZsYWdfZnJlZQCxAQ5fX3diZ19iYWxfZnJlZQCxAQ5fX3diZ19qbXBfZnJlZQCxAQ5fX3diZ19qbmVfZnJlZQCxAQ5fX3diZ19zbW9fZnJlZQCxAQ9fX3diZ19hZGRpX2ZyZWUAsQEPX193YmdfYW5kaV9mcmVlALEBD19fd2JnX2RpdmlfZnJlZQCxAQ9fX3diZ19leHBpX2ZyZWUAsQEPX193YmdfbW9kaV9mcmVlALEBD19fd2JnX211bGlfZnJlZQCxAQ5fX3diZ19vcmlfZnJlZQCxAQ9fX3diZ19zbGxpX2ZyZWUAsQEPX193Ymdfc3JsaV9mcmVlALEBD19fd2JnX3N1YmlfZnJlZQCxAQ9fX3diZ194b3JpX2ZyZWUAsQEPX193Ymdfam5laV9mcmVlALEBDV9fd2JnX2xiX2ZyZWUAsQENX193YmdfbHdfZnJlZQCxAQ1fX3diZ19zYl9mcmVlALEBDV9fd2JnX3N3X2ZyZWUAsQEPX193YmdfbWNwaV9mcmVlALEBDl9fd2JnX2d0Zl9mcmVlALEBD19fd2JnX21jbGlfZnJlZQCxAQ1fX3diZ19nbV9mcmVlALEBD19fd2JnX21vdmlfZnJlZQCxAQ9fX3diZ19qbnppX2ZyZWUAsQEPX193Ymdfam1wZl9mcmVlALEBD19fd2JnX2ptcGJfZnJlZQCxAQ9fX3diZ19qbnpmX2ZyZWUAsQEPX193Ymdfam56Yl9mcmVlALEBD19fd2JnX2puZWZfZnJlZQCxAQ9fX3diZ19qbmViX2ZyZWUAsQENX193YmdfamlfZnJlZQCxAQ9fX3diZ19jZmVpX2ZyZWUAsQEPX193YmdfY2ZzaV9mcmVlALEBDl9fd2JnX2NmZV9mcmVlALEBDl9fd2JnX2Nmc19mcmVlALEBD19fd2JnX3BzaGxfZnJlZQCxAQ9fX3diZ19wc2hoX2ZyZWUAsQEPX193YmdfcG9wbF9mcmVlALEBD19fd2JnX3BvcGhfZnJlZQCxAQ9fX3diZ193ZGNtX2ZyZWUAsQEPX193Ymdfd3FjbV9mcmVlALEBD19fd2JnX3dkb3BfZnJlZQCxAQ9fX3diZ193cW9wX2ZyZWUAsQEPX193Ymdfd2RtbF9mcmVlALEBD19fd2JnX3dxbWxfZnJlZQCxAQ9fX3diZ193ZGR2X2ZyZWUAsQEPX193Ymdfd3Fkdl9mcmVlALEBD19fd2JnX3dkbWRfZnJlZQCxAQ9fX3diZ193cW1kX2ZyZWUAsQEPX193Ymdfd2RhbV9mcmVlALEBD19fd2JnX3dxYW1fZnJlZQCxAQ9fX3diZ193ZG1tX2ZyZWUAsQEPX193Ymdfd3FtbV9mcmVlALEBBmFuZF9yYwCMAQZkaXZfcmMAjAEFZXFfcmMAjAEGZXhwX3JjAIwBBWd0X3JjAIwBBWx0X3JjAIwBB21sb2dfcmMAjAEHbXJvb19yYwCMAQZtb2RfcmMAjAEGbXVsX3JjAIwBBW9yX3JjAIwBBnNsbF9yYwCMAQZzcmxfcmMAjAEGc3ViX3JjAIwBBnhvcl9yYwCMAQdtbGR2X3JjAIwBBm1jcF9yYwCMAQZtZXFfcmMAjAEHY2FsbF9yYwCMAQZjY3BfcmMAjAEGbGRjX3JjAIwBBmxvZ19yYwCMAQdsb2dkX3JjAIwBB3Njd3FfcmMAjAEGc3J3X3JjAIwBB3Nyd3FfcmMAjAEGc3d3X3JjAIwBB3N3d3FfcmMAjAEFdHJfcmMAjAEGdHJvX3JjAIwBB2VjazFfcmMAjAEHZWNyMV9yYwCMAQdlZDE5X3JjAIwBB2syNTZfcmMAjAEHczI1Nl9yYwCMAQZiYWxfcmMAjAEGam5lX3JjAIwBBnNtb19yYwCMAQdqbmVmX3JjAIwBB2puZWJfcmMAjAEHd2RjbV9yYwCMAQd3cWNtX3JjAIwBB3dkb3BfcmMAjAEHd3FvcF9yYwCMAQd3ZG1sX3JjAIwBB3dxbWxfcmMAjAEHd2Rkdl9yYwCMAQd3cWR2X3JjAIwBB3dkbWRfcmMAjAEHd3FtZF9yYwCMAQd3ZGFtX3JjAIwBB3dxYW1fcmMAjAEHd2RtbV9yYwCMAQd3cW1tX3JjAIwBEF9fd2JnX2ltbTA2X2ZyZWUAsQERcmVnaWRfbmV3X2NoZWNrZWQAowEJcmVnaWRfYmFsALIBCnJlZ2lkX2NnYXMAswEJcmVnaWRfZXJyALQBCnJlZ2lkX2ZsYWcAtQEIcmVnaWRfZnAAtgEKcmVnaWRfZ2dhcwC3AQhyZWdpZF9ocAC4AQhyZWdpZF9pcwC5AQhyZWdpZF9vZgC6AQlyZWdpZF9vbmUAuwEIcmVnaWRfcGMAvAEJcmVnaWRfcmV0AL0BCnJlZ2lkX3JldGwAvgEIcmVnaWRfc3AAvwEJcmVnaWRfc3BwAMABDnJlZ2lkX3dyaXRhYmxlAMEBCnJlZ2lkX3plcm8AwgEUcmVnaWRfbmV3X3R5cGVzY3JpcHQArQELcmVnaWRfdG9fdTgAqwEQX193YmdfcmVnaWRfZnJlZQCxARBfX3diZ19pbW0xMl9mcmVlALEBEF9fd2JnX2ltbTE4X2ZyZWUAsQEQX193YmdfaW1tMjRfZnJlZQCxARZfX3diZ19jb21wYXJlYXJnc19mcmVlALEBGl9fd2JnX2dldF9jb21wYXJlYXJnc19tb2RlAMMBGl9fd2JnX3NldF9jb21wYXJlYXJnc19tb2RlAKQBIl9fd2JnX2dldF9jb21wYXJlYXJnc19pbmRpcmVjdF9yaHMArgEiX193Ymdfc2V0X2NvbXBhcmVhcmdzX2luZGlyZWN0X3JocwCqARJjb21wYXJlYXJnc190b19pbW0AkAEUY29tcGFyZWFyZ3NfZnJvbV9pbW0AhgEVX193YmdfZ2V0X21hdGhhcmdzX29wAMMBFV9fd2JnX3NldF9tYXRoYXJnc19vcAClAR5fX3diZ19nZXRfZGl2YXJnc19pbmRpcmVjdF9yaHMAwwEeX193Ymdfc2V0X2RpdmFyZ3NfaW5kaXJlY3RfcmhzAKwBH19fd2JnX2dldF9tYXRoYXJnc19pbmRpcmVjdF9yaHMArgEeX193YmdfZ2V0X211bGFyZ3NfaW5kaXJlY3RfcmhzAK4BHl9fd2JnX2dldF9tdWxhcmdzX2luZGlyZWN0X2xocwDDAR9fX3diZ19zZXRfbWF0aGFyZ3NfaW5kaXJlY3RfcmhzAKoBHl9fd2JnX3NldF9tdWxhcmdzX2luZGlyZWN0X3JocwCqAR5fX3diZ19zZXRfbXVsYXJnc19pbmRpcmVjdF9saHMArAETX193YmdfbWF0aGFyZ3NfZnJlZQCxARJfX3diZ19tdWxhcmdzX2ZyZWUAsQESX193YmdfZGl2YXJnc19mcmVlALEBDGdtX2Zyb21fYXJncwB6DWd0Zl9mcm9tX2FyZ3MAdgdnbV9hcmdzAHcIZ3RmX2FyZ3MAcg53ZGNtX2Zyb21fYXJncwA4Dndkb3BfZnJvbV9hcmdzADgOd2RtbF9mcm9tX2FyZ3MAOQ53ZGR2X2Zyb21fYXJncwBLCXdkY21fYXJncwApCXdxY21fYXJncwAqCXdkb3BfYXJncwAr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QRBBCBDNAUEFayAASxtBCBDNASIDakEQQQgQzQFqQQRrEAEiAkUNACACEOoBIQACQCABQQFrIgQgAnFFBEAgACEBDAELIAIgBGpBACABa3EQ6gEhAkEQQQgQzQEhBCAAEOEBIAIgAUEAIAIgAGsgBE0baiIBIABrIgJrIQQgABDVAUUEQCABIAQQsAEgACACELABIAAgAhAEDAELIAAoAgAhACABIAQ2AgQgASAAIAJqNgIACyABENUBDQEgARDhASICQRBBCBDNASADak0NASABIAMQ5wEhACABIAMQsAEgACACIANrIgMQsAEgACADEAQMAQsgBA8LIAEQ6QEgARDVARoLEAAgACABIAIgA0HTABD2AQsQACAAIAEgAiADQdQAEPYBCxAAIAAgASACIANB3gAQ9gELEAAgACABIAIgA0HfABD2AQsQACAAIAEgAiADQeAAEPYBCxAAIAAgASACIANB4QAQ9gELEAAgACABIAIgA0HiABD2AQsQACAAIAEgAiADQeMAEPYBCxAAIAAgASACIANB5AAQ9gELEAAgACABIAIgA0HlABD2AQuQBAEFfyMAQRBrIgMkACAAKAIAIQACQCABQf8ATQRAIAAoAggiAiAAKAIARgRAIwBBIGsiBCQAAkACQCACQQFqIgJFDQBBCCAAKAIAIgVBAXQiBiACIAIgBkkbIgIgAkEITRsiAkF/c0EfdiEGAkAgBQRAIARBATYCGCAEIAU2AhQgBCAAQQRqKAIANgIQDAELIARBADYCGAsgBCACIAYgBEEQahB4IAQoAgQhBSAEKAIARQRAIAAgAjYCACAAIAU2AgQMAgsgBEEIaigCACICQYGAgIB4Rg0BIAJFDQAgBSACEOUBAAsQogEACyAEQSBqJAAgACgCCCECCyAAIAJBAWo2AgggACgCBCACaiABOgAADAELIANBADYCDAJ/IAFBgBBPBEAgAUGAgARPBEAgAyABQT9xQYABcjoADyADIAFBBnZBP3FBgAFyOgAOIAMgAUEMdkE/cUGAAXI6AA0gAyABQRJ2QQdxQfABcjoADEEEDAILIAMgAUE/cUGAAXI6AA4gAyABQQx2QeABcjoADCADIAFBBnZBP3FBgAFyOgANQQMMAQsgAyABQT9xQYABcjoADSADIAFBBnZBwAFyOgAMQQILIQEgASAAKAIAIAAoAggi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", imports);
}
async function initWasm() {
  return await __wbg_init(wasm());
}
initWasm();

// node_modules/@fuel-ts/program/dist/index.mjs
var PANIC_REASONS = [
  "Success",
  "Revert",
  "OutOfGas",
  "TransactionValidity",
  "MemoryOverflow",
  "ArithmeticOverflow",
  "ContractNotFound",
  "MemoryOwnership",
  "NotEnoughBalance",
  "ExpectedInternalContext",
  "AssetIdNotFound",
  "InputNotFound",
  "OutputNotFound",
  "WitnessNotFound",
  "TransactionMaturity",
  "InvalidMetadataIdentifier",
  "MalformedCallStructure",
  "ReservedRegisterNotWritable",
  "ErrorFlag",
  "InvalidImmediateValue",
  "ExpectedCoinInput",
  "MaxMemoryAccess",
  "MemoryWriteOverlap",
  "ContractNotInInputs",
  "InternalBalanceOverflow",
  "ContractMaxSize",
  "ExpectedUnallocatedStack",
  "MaxStaticContractsReached",
  "TransferAmountCannotBeZero",
  "ExpectedOutputVariable",
  "ExpectedParentInternalContext",
  "IllegalJump",
  "NonZeroMessageOutputRecipient",
  "ZeroedMessageOutputRecipient"
];
var PANIC_DOC_URL = "https://docs.rs/fuel-asm/latest/fuel_asm/enum.PanicReason.html";
var getFailureReason = (reason) => {
  if (PANIC_REASONS.includes(reason)) {
    return reason;
  }
  return reason === "Revert(123)" ? "MismatchedSelector" : "unknown";
};
var getDocs = (status) => {
  if ((status == null ? void 0 : status.type) === "FailureStatus") {
    const reason = getFailureReason(status.reason);
    return {
      doc: reason !== "unknown" ? `${PANIC_DOC_URL}#variant.${reason}` : PANIC_DOC_URL,
      reason
    };
  }
  return { doc: PANIC_DOC_URL, reason: "unknown" };
};
function assert(condition, message) {
  if (!condition) {
    throw new FuelError(ErrorCode.TRANSACTION_ERROR, message);
  }
}
var REVERT_MAP = {
  [FAILED_REQUIRE_SIGNAL]: "RequireFailed",
  [FAILED_TRANSFER_TO_ADDRESS_SIGNAL]: "TransferToAddressFailed",
  [FAILED_SEND_MESSAGE_SIGNAL]: "SendMessageFailed",
  [FAILED_ASSERT_EQ_SIGNAL]: "AssertEqFailed",
  [FAILED_ASSERT_SIGNAL]: "AssertFailed",
  [FAILED_UNKNOWN_SIGNAL]: "Unknown"
};
var decodeRevertErrorCode = (receipt) => {
  const signalHex = receipt.val.toHex();
  return REVERT_MAP[signalHex] ? REVERT_MAP[signalHex] : void 0;
};
var RevertError = class extends Error {
  /**
   * Creates a new instance of RevertError.
   *
   * @param receipt - The transaction revert receipt.
   * @param reason - The revert reason.
   */
  constructor(receipt, reason) {
    super(`The script reverted with reason ${reason}`);
    /**
     * The receipt associated with the revert error.
     */
    __publicField(this, "receipt");
    this.name = "RevertError";
    this.receipt = receipt;
  }
  /**
   * Returns a string representation of the RevertError.
   *
   * @returns The string representation of the error.
   */
  toString() {
    const { id, ...r } = this.receipt;
    return `${this.name}: ${this.message}
    ${id}: ${JSON.stringify(r)}`;
  }
};
var RequireRevertError = class extends RevertError {
  /**
   * Creates a new instance of RequireRevertError.
   *
   * @param receipt - The transaction revert receipt.
   * @param reason - The revert reason.
   */
  constructor(receipt, reason) {
    super(receipt, reason);
    this.name = "RequireRevertError";
  }
};
var TransferToAddressRevertError = class extends RevertError {
  /**
   * Creates a new instance of TransferToAddressRevertError.
   *
   * @param receipt - The transaction revert receipt.
   * @param reason - The revert reason.
   */
  constructor(receipt, reason) {
    super(receipt, reason);
    this.name = "TransferToAddressRevertError";
  }
};
var SendMessageRevertError = class extends RevertError {
  /**
   * Creates a new instance of SendMessageRevertError.
   *
   * @param receipt - The transaction revert receipt.
   * @param reason - The revert reason.
   */
  constructor(receipt, reason) {
    super(receipt, reason);
    this.name = "SendMessageRevertError";
  }
};
var AssertFailedRevertError = class extends RevertError {
  /**
   * Creates a new instance of AssertFailedRevertError.
   *
   * @param receipt - The transaction revert receipt.
   * @param reason - The revert reason.
   */
  constructor(receipt, reason) {
    super(receipt, reason);
    this.name = "AssertFailedRevertError";
  }
};
var revertErrorFactory = (receipt) => {
  const reason = decodeRevertErrorCode(receipt);
  if (!reason) {
    return void 0;
  }
  switch (reason) {
    case "RequireFailed":
      return new RequireRevertError(receipt, reason);
    case "TransferToAddressFailed":
      return new TransferToAddressRevertError(receipt, reason);
    case "SendMessageFailed":
      return new SendMessageRevertError(receipt, reason);
    case "AssertFailed":
      return new AssertFailedRevertError(receipt, reason);
    default:
      return new RevertError(receipt, reason);
  }
};
var { warn } = console;
var getRevertReceipts = (receipts) => receipts.filter((r) => r.type === ReceiptType.Revert);
var RevertErrorCodes = class {
  constructor(receipts) {
    __publicField(this, "revertReceipts");
    this.revertReceipts = getRevertReceipts(receipts);
  }
  assert(detailedError) {
    const revertError = this.getError();
    if (revertError) {
      revertError.cause = detailedError;
      throw revertError;
    }
  }
  getError() {
    if (!this.revertReceipts.length) {
      return void 0;
    }
    if (this.revertReceipts.length !== 1) {
      warn(
        "Multiple revert receipts found, expected one. Receipts:",
        JSON.stringify(this.revertReceipts)
      );
    }
    return revertErrorFactory(this.revertReceipts[0]);
  }
};
var bigintReplacer = (key, value) => typeof value === "bigint" ? value.toString() : value;
var ScriptResultDecoderError = class extends Error {
  constructor(result, message, logs) {
    var _a2;
    let docLink = "";
    if ((_a2 = result == null ? void 0 : result.gqlTransaction) == null ? void 0 : _a2.status) {
      docLink = `${JSON.stringify(getDocs(result.gqlTransaction.status), null, 2)}

`;
    }
    const logsText = logs.length ? `Logs:
${JSON.stringify(logs, null, 2)}

` : "";
    const receiptsText = `Receipts:
${JSON.stringify(
      result.receipts.map(({ type, ...r }) => ({ type: ReceiptType[type], ...r })),
      bigintReplacer,
      2
    )}`;
    super(`${message}

${docLink}${logsText}${receiptsText}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __publicField(this, "logs");
    this.logs = logs;
    new RevertErrorCodes(result.receipts).assert(this);
  }
};
var _operations, _a;
var InstructionSet = (_a = class {
  constructor(...args) {
    __privateAdd(this, _operations, void 0);
    __privateSet(this, _operations, args || []);
  }
  entries() {
    return __privateGet(this, _operations);
  }
  push(...args) {
    __privateGet(this, _operations).push(...args);
  }
  concat(ops) {
    return __privateGet(this, _operations).concat(ops);
  }
  extend(ops) {
    __privateGet(this, _operations).push(...ops);
  }
  toBytes() {
    return concatBytes(
      __privateGet(this, _operations).reduce((instructions, line) => {
        instructions.push(line.to_bytes());
        return instructions;
      }, [])
    );
  }
  toHex() {
    return hexlify(this.toBytes());
  }
  toString() {
    return `Program:
${JSON.stringify(__privateGet(this, _operations), null, 2)}`;
  }
  byteLength() {
    return this.toBytes().byteLength;
  }
}, _operations = new WeakMap(), _a);
var calculateScriptDataBaseOffset = (maxInputs) => SCRIPT_FIXED_SIZE + calculateVmTxMemory({ maxInputs });
var POINTER_DATA_OFFSET = WORD_SIZE + ASSET_ID_LEN + CONTRACT_ID_LEN + WORD_SIZE + WORD_SIZE;
function callResultToScriptResult(callResult) {
  const receipts = [...callResult.receipts];
  let scriptResultReceipt;
  let returnReceipt;
  receipts.forEach((receipt) => {
    if (receipt.type === ReceiptType.ScriptResult) {
      scriptResultReceipt = receipt;
    } else if (receipt.type === ReceiptType.Return || receipt.type === ReceiptType.ReturnData || receipt.type === ReceiptType.Revert) {
      returnReceipt = receipt;
    }
  });
  if (!scriptResultReceipt) {
    throw new FuelError(
      ErrorCode.TRANSACTION_ERROR,
      `The script call result does not contain a 'scriptResultReceipt'.`
    );
  }
  if (!returnReceipt) {
    throw new FuelError(
      ErrorCode.TRANSACTION_ERROR,
      `The script call result does not contain a 'returnReceipt'.`
    );
  }
  const scriptResult = {
    code: scriptResultReceipt.result,
    gasUsed: scriptResultReceipt.gasUsed,
    receipts,
    scriptResultReceipt,
    returnReceipt,
    callResult
  };
  return scriptResult;
}
function decodeCallResult(callResult, decoder, logs = []) {
  try {
    const scriptResult = callResultToScriptResult(callResult);
    return decoder(scriptResult);
  } catch (error) {
    throw new ScriptResultDecoderError(
      callResult,
      error.message,
      logs
    );
  }
}
function callResultToInvocationResult(callResult, call2, logs) {
  return decodeCallResult(
    callResult,
    (scriptResult) => {
      if (scriptResult.returnReceipt.type === ReceiptType.Revert) {
        throw new FuelError(
          ErrorCode.SCRIPT_REVERTED,
          `Script Reverted. Logs: ${JSON.stringify(logs)}`
        );
      }
      if (scriptResult.returnReceipt.type !== ReceiptType.Return && scriptResult.returnReceipt.type !== ReceiptType.ReturnData) {
        const { type } = scriptResult.returnReceipt;
        throw new FuelError(
          ErrorCode.SCRIPT_REVERTED,
          `Script Return Type [${type}] Invalid. Logs: ${JSON.stringify({
            logs,
            receipt: scriptResult.returnReceipt
          })}`
        );
      }
      let value;
      if (scriptResult.returnReceipt.type === ReceiptType.Return) {
        value = scriptResult.returnReceipt.val;
      }
      if (scriptResult.returnReceipt.type === ReceiptType.ReturnData) {
        const decoded = call2.func.decodeOutput(scriptResult.returnReceipt.data);
        value = decoded[0];
      }
      return value;
    },
    logs
  );
}
var ScriptRequest = class {
  /**
   * Creates an instance of the ScriptRequest class.
   *
   * @param bytes - The bytes of the script.
   * @param scriptDataEncoder - The script data encoder function.
   * @param scriptResultDecoder - The script result decoder function.
   */
  constructor(bytes, scriptDataEncoder, scriptResultDecoder2) {
    /**
     * The bytes of the script.
     */
    __publicField(this, "bytes");
    /**
     * A function to encode the script data.
     */
    __publicField(this, "scriptDataEncoder");
    /**
     * A function to decode the script result.
     */
    __publicField(this, "scriptResultDecoder");
    this.bytes = getBytesCopy(bytes);
    this.scriptDataEncoder = scriptDataEncoder;
    this.scriptResultDecoder = scriptResultDecoder2;
  }
  /**
   * Gets the script data offset for the given bytes.
   *
   * @param byteLength - The byte length of the script.
   * @param maxInputs - The maxInputs value from the chain's consensus params.
   * @returns The script data offset.
   */
  static getScriptDataOffsetWithScriptBytes(byteLength, maxInputs) {
    const scriptDataBaseOffset = calculateVmTxMemory({ maxInputs }) + SCRIPT_FIXED_SIZE;
    return scriptDataBaseOffset + byteLength;
  }
  /**
   * Gets the script data offset.
   *
   * @param maxInputs - The maxInputs value from the chain's consensus params.
   * @returns The script data offset.
   */
  getScriptDataOffset(maxInputs) {
    return ScriptRequest.getScriptDataOffsetWithScriptBytes(this.bytes.length, maxInputs);
  }
  /**
   * Encodes the data for a script call.
   *
   * @param data - The script data.
   * @returns The encoded data.
   */
  encodeScriptData(data) {
    const callScript = this.scriptDataEncoder(data);
    if (ArrayBuffer.isView(callScript)) {
      return callScript;
    }
    this.bytes = getBytesCopy(callScript.script);
    return callScript.data;
  }
  /**
   * Decodes the result of a script call.
   *
   * @param callResult - The CallResult from the script call.
   * @param logs - Optional logs associated with the decoding.
   * @returns The decoded result.
   */
  decodeCallResult(callResult, logs = []) {
    return decodeCallResult(callResult, this.scriptResultDecoder, logs);
  }
};
var DEFAULT_OPCODE_PARAMS = {
  assetIdOffset: 0,
  amountOffset: 0,
  gasForwardedOffset: 0,
  callDataOffset: 0
};
var SCRIPT_WRAPPER_CONTRACT_ID = ZeroBytes32;
var getSingleCallInstructions = ({ callDataOffset, gasForwardedOffset, amountOffset, assetIdOffset }, outputInfo) => {
  const inst = new InstructionSet(
    movi(16, callDataOffset),
    movi(17, amountOffset),
    lw(17, 17, 0),
    movi(18, assetIdOffset)
  );
  if (gasForwardedOffset) {
    inst.push(
      movi(19, gasForwardedOffset),
      lw(19, 19, 0),
      call(16, 17, 18, 19)
    );
  } else {
    inst.push(call(16, 17, 18, RegId.cgas().to_u8()));
  }
  if (outputInfo.isHeap) {
    inst.extend([
      // The RET register contains the pointer address of the `CALL` return (a stack
      // address).
      // The RETL register contains the length of the `CALL` return (=24 because the Vec/Bytes
      // struct takes 3 WORDs). We don't actually need it unless the Vec/Bytes struct encoding
      // changes in the compiler.
      // Load the word located at the address contained in RET, it's a word that
      // translates to a heap address. 0x15 is a free register.
      lw(21, RegId.ret().to_u8(), 0),
      // We know a Vec/Bytes struct has its third WORD contain the length of the underlying
      // vector, so use a 2 offset to store the length in 0x16, which is a free register.
      lw(22, RegId.ret().to_u8(), 2),
      // The in-memory size of the type is (in-memory size of the inner type) * length
      muli(22, 22, outputInfo.encodedLength),
      retd(21, 22)
    ]);
  }
  return inst;
};
function getInstructions(offsets, outputs) {
  if (!offsets.length) {
    return new Uint8Array();
  }
  const multiCallInstructions = new InstructionSet();
  for (let i = 0; i < offsets.length; i += 1) {
    multiCallInstructions.extend(getSingleCallInstructions(offsets[i], outputs[i]).entries());
  }
  multiCallInstructions.push(ret(1));
  return multiCallInstructions.toBytes();
}
var isReturnType = (type) => type === ReceiptType.Return || type === ReceiptType.ReturnData;
var getMainCallReceipt = (receipts, contractId) => receipts.find(
  ({ type, from, to }) => type === ReceiptType.Call && from === SCRIPT_WRAPPER_CONTRACT_ID && to === contractId
);
var scriptResultDecoder = (contractId, isOutputDataHeap) => (result) => {
  if (toNumber(result.code) !== 0) {
    throw new FuelError(
      ErrorCode.TRANSACTION_ERROR,
      `Execution of the script associated with contract ${contractId} resulted in a non-zero exit code: ${result.code}.`
    );
  }
  const mainCallResult = getMainCallReceipt(
    result.receipts,
    contractId.toB256()
  );
  const mainCallInstructionStart = bn(mainCallResult == null ? void 0 : mainCallResult.is);
  const receipts = result.receipts;
  return receipts.filter(({ type }) => isReturnType(type)).flatMap((receipt, index, filtered) => {
    var _a2;
    if (!mainCallInstructionStart.eq(bn(receipt.is))) {
      return [];
    }
    if (receipt.type === ReceiptType.Return) {
      return [new U64Coder().encode(receipt.val)];
    }
    if (receipt.type === ReceiptType.ReturnData) {
      const encodedScriptReturn = getBytesCopy(receipt.data);
      if (isOutputDataHeap && isReturnType((_a2 = filtered[index + 1]) == null ? void 0 : _a2.type)) {
        const nextReturnData = filtered[index + 1];
        return concatBytes([encodedScriptReturn, getBytesCopy(nextReturnData.data)]);
      }
      return [encodedScriptReturn];
    }
    return [new Uint8Array()];
  });
};
var decodeContractCallScriptResult = (callResult, contractId, isOutputDataHeap, logs = []) => decodeCallResult(callResult, scriptResultDecoder(contractId, isOutputDataHeap), logs);
var getCallInstructionsLength = (contractCalls) => contractCalls.reduce(
  (sum, call2) => {
    const offset = { ...DEFAULT_OPCODE_PARAMS };
    if (call2.gas) {
      offset.gasForwardedOffset = 1;
    }
    const output = {
      isHeap: call2.isOutputDataHeap,
      encodedLength: call2.outputEncodedLength
    };
    return sum + getSingleCallInstructions(offset, output).byteLength();
  },
  Instruction.size()
  // placeholder for single RET instruction which is added later
);
var getFunctionOutputInfos = (functionScopes) => functionScopes.map((funcScope) => {
  const { func } = funcScope.getCallConfig();
  return {
    isHeap: func.outputMetadata.isHeapType,
    encodedLength: func.outputMetadata.encodedLength
  };
});
var getContractCallScript = (functionScopes, maxInputs) => new ScriptRequest(
  // Script to call the contract, start with stub size matching length of calls
  getInstructions(
    new Array(functionScopes.length).fill(DEFAULT_OPCODE_PARAMS),
    getFunctionOutputInfos(functionScopes)
  ),
  (contractCalls) => {
    var _a2;
    const TOTAL_CALLS = contractCalls.length;
    if (TOTAL_CALLS === 0) {
      return { data: new Uint8Array(), script: new Uint8Array() };
    }
    const callInstructionsLength = getCallInstructionsLength(contractCalls);
    const paddingLength = (8 - callInstructionsLength % 8) % 8;
    const paddedInstructionsLength = callInstructionsLength + paddingLength;
    const dataOffset = calculateScriptDataBaseOffset(maxInputs.toNumber()) + paddedInstructionsLength;
    const paramOffsets = [];
    let segmentOffset = dataOffset;
    const outputInfos = [];
    const scriptData = [];
    for (let i = 0; i < TOTAL_CALLS; i += 1) {
      const call2 = contractCalls[i];
      outputInfos.push({
        isHeap: call2.isOutputDataHeap,
        encodedLength: call2.outputEncodedLength
      });
      paramOffsets.push({
        gasForwardedOffset: call2.gas ? segmentOffset + WORD_SIZE + ASSET_ID_LEN + CONTRACT_ID_LEN + WORD_SIZE : 0,
        amountOffset: segmentOffset,
        assetIdOffset: segmentOffset + WORD_SIZE,
        callDataOffset: segmentOffset + WORD_SIZE + ASSET_ID_LEN
      });
      scriptData.push(new U64Coder().encode(call2.amount || 0));
      scriptData.push(new B256Coder().encode(((_a2 = call2.assetId) == null ? void 0 : _a2.toString()) || BaseAssetId));
      scriptData.push(call2.contractId.toBytes());
      scriptData.push(new U64Coder().encode(call2.fnSelector));
      let gasForwardedSize = 0;
      if (call2.gas) {
        scriptData.push(new U64Coder().encode(call2.gas));
        gasForwardedSize = WORD_SIZE;
      }
      if (call2.isInputDataPointer) {
        const pointerInputOffset = segmentOffset + POINTER_DATA_OFFSET + gasForwardedSize;
        scriptData.push(new U64Coder().encode(pointerInputOffset));
      }
      const args = getBytesCopy(call2.data);
      scriptData.push(args);
      segmentOffset = dataOffset + concatBytes(scriptData).byteLength;
    }
    const script = getInstructions(paramOffsets, outputInfos);
    const finalScriptData = concatBytes(scriptData);
    return { data: finalScriptData, script };
  },
  () => [new Uint8Array()]
);
function getGasUsage(callResult) {
  const scriptResult = callResult.receipts.find((r) => r.type === ReceiptType.ScriptResult);
  return (scriptResult == null ? void 0 : scriptResult.gasUsed) || bn(0);
}
var InvocationResult = class {
  /**
   * Constructs an instance of InvocationResult.
   *
   * @param funcScopes - The function scopes.
   * @param callResult - The call result.
   * @param isMultiCall - Whether it's a multi-call.
   */
  constructor(funcScopes, callResult, isMultiCall) {
    __publicField(this, "functionScopes");
    __publicField(this, "isMultiCall");
    __publicField(this, "gasUsed");
    __publicField(this, "value");
    this.functionScopes = Array.isArray(funcScopes) ? funcScopes : [funcScopes];
    this.isMultiCall = isMultiCall;
    this.value = this.getDecodedValue(callResult);
    this.gasUsed = getGasUsage(callResult);
  }
  /**
   * Gets the first call config.
   *
   * @returns The first call config.
   */
  getFirstCallConfig() {
    if (!this.functionScopes[0]) {
      return void 0;
    }
    return this.functionScopes[0].getCallConfig();
  }
  /**
   * Decodes the value from the call result.
   *
   * @param callResult - The call result.
   * @returns The decoded value.
   */
  getDecodedValue(callResult) {
    const logs = this.getDecodedLogs(callResult.receipts);
    const callConfig = this.getFirstCallConfig();
    if (this.functionScopes.length === 1 && callConfig && "bytes" in callConfig.program) {
      return callResultToInvocationResult(callResult, callConfig, logs);
    }
    const encodedResults = decodeContractCallScriptResult(
      callResult,
      (callConfig == null ? void 0 : callConfig.program).id,
      (callConfig == null ? void 0 : callConfig.func.outputMetadata.isHeapType) || false,
      logs
    );
    const returnValues = encodedResults.map((encodedResult, i) => {
      var _a2;
      const { func } = this.functionScopes[i].getCallConfig();
      return (_a2 = func.decodeOutput(encodedResult)) == null ? void 0 : _a2[0];
    });
    return this.isMultiCall ? returnValues : returnValues == null ? void 0 : returnValues[0];
  }
  /**
   * Decodes the logs from the receipts.
   *
   * @param receipts - The transaction result receipts.
   * @returns The decoded logs.
   */
  getDecodedLogs(receipts) {
    const callConfig = this.getFirstCallConfig();
    if (!callConfig) {
      return [];
    }
    const { program } = callConfig;
    return getDecodedLogs(receipts, program.interface);
  }
};
var FunctionInvocationResult = class extends InvocationResult {
  /**
   * Constructs an instance of FunctionInvocationResult.
   *
   * @param funcScopes - The function scopes.
   * @param transactionResponse - The transaction response.
   * @param transactionResult - The transaction result.
   * @param program - The program.
   * @param isMultiCall - Whether it's a multi-call.
   */
  constructor(funcScopes, transactionResponse, transactionResult, program, isMultiCall) {
    super(funcScopes, transactionResult, isMultiCall);
    __publicField(this, "transactionId");
    __publicField(this, "transactionResponse");
    __publicField(this, "transactionResult");
    __publicField(this, "program");
    __publicField(this, "logs");
    this.transactionResponse = transactionResponse;
    this.transactionResult = transactionResult;
    this.transactionId = this.transactionResponse.id;
    this.program = program;
    this.logs = this.getDecodedLogs(transactionResult.receipts);
  }
  /**
   * Builds an instance of FunctionInvocationResult.
   *
   * @param funcScope - The function scope.
   * @param transactionResponse - The transaction response.
   * @param isMultiCall - Whether it's a multi-call.
   * @param program - The program.
   * @returns The function invocation result.
   */
  static async build(funcScope, transactionResponse, isMultiCall, program) {
    const txResult = await transactionResponse.waitForResult();
    const fnResult = new FunctionInvocationResult(
      funcScope,
      transactionResponse,
      txResult,
      program,
      isMultiCall
    );
    return fnResult;
  }
};
var InvocationCallResult = class extends InvocationResult {
  /**
   * Constructs an instance of InvocationCallResult.
   *
   * @param funcScopes - The function scopes.
   * @param callResult - The call result.
   * @param isMultiCall - Whether it's a multi-call.
   */
  constructor(funcScopes, callResult, isMultiCall) {
    super(funcScopes, callResult, isMultiCall);
    __publicField(this, "callResult");
    this.callResult = callResult;
  }
  /**
   * Builds an instance of InvocationCallResult.
   *
   * @param funcScopes - The function scopes.
   * @param callResult - The call result.
   * @param isMultiCall - Whether it's a multi-call.
   * @returns The invocation call result.
   */
  static async build(funcScopes, callResult, isMultiCall) {
    const fnResult = await new InvocationCallResult(funcScopes, callResult, isMultiCall);
    return fnResult;
  }
};
function createContractCall(funcScope, offset) {
  const { program, args, forward, func, callParameters } = funcScope.getCallConfig();
  const DATA_POINTER_OFFSET = funcScope.getCallConfig().func.isInputDataPointer ? POINTER_DATA_OFFSET : 0;
  const data = func.encodeArguments(args, offset + DATA_POINTER_OFFSET);
  return {
    contractId: program.id,
    fnSelector: func.selector,
    data,
    isInputDataPointer: func.isInputDataPointer,
    isOutputDataHeap: func.outputMetadata.isHeapType,
    outputEncodedLength: func.outputMetadata.encodedLength,
    assetId: forward == null ? void 0 : forward.assetId,
    amount: forward == null ? void 0 : forward.amount,
    gas: callParameters == null ? void 0 : callParameters.gasLimit
  };
}
var BaseInvocationScope = class {
  /**
   * Constructs an instance of BaseInvocationScope.
   *
   * @param program - The abstract program to be invoked.
   * @param isMultiCall - A flag indicating whether the invocation is a multi-call.
   */
  constructor(program, isMultiCall) {
    __publicField(this, "transactionRequest");
    __publicField(this, "program");
    __publicField(this, "functionInvocationScopes", []);
    __publicField(this, "txParameters");
    __publicField(this, "requiredCoins", []);
    __publicField(this, "isMultiCall", false);
    this.program = program;
    this.isMultiCall = isMultiCall;
    const provider = program.provider;
    const { maxGasPerTx } = provider.getGasConfig();
    this.transactionRequest = new ScriptTransactionRequest({
      gasLimit: maxGasPerTx
    });
  }
  /**
   * Getter for the contract calls.
   *
   * @returns An array of contract calls.
   */
  get calls() {
    const provider = this.getProvider();
    const consensusParams = provider.getChain().consensusParameters;
    if (!consensusParams) {
      throw new FuelError(
        FuelError.CODES.CHAIN_INFO_CACHE_EMPTY,
        "Provider chain info cache is empty. Please make sure to initialize the `Provider` properly by running `await Provider.create()``"
      );
    }
    const maxInputs = consensusParams.maxInputs;
    const script = getContractCallScript(this.functionInvocationScopes, maxInputs);
    return this.functionInvocationScopes.map(
      (funcScope) => createContractCall(funcScope, script.getScriptDataOffset(maxInputs.toNumber()))
    );
  }
  /**
   * Updates the script request with the current contract calls.
   */
  updateScriptRequest() {
    const maxInputs = this.program.provider.getChain().consensusParameters.maxInputs;
    const contractCallScript = getContractCallScript(this.functionInvocationScopes, maxInputs);
    this.transactionRequest.setScript(contractCallScript, this.calls);
  }
  /**
   * Updates the transaction request with the current input/output.
   */
  updateContractInputAndOutput() {
    const calls = this.calls;
    calls.forEach((c) => {
      if (c.contractId) {
        this.transactionRequest.addContractInputAndOutput(c.contractId);
      }
    });
  }
  /**
   * Gets the required coins for the transaction.
   *
   * @returns An array of required coin quantities.
   */
  getRequiredCoins() {
    const { gasPriceFactor } = this.getProvider().getGasConfig();
    const assets = this.calls.map((call2) => ({
      assetId: String(call2.assetId),
      amount: bn(call2.amount || 0)
    })).concat(this.transactionRequest.calculateFee(gasPriceFactor)).filter(({ assetId, amount }) => assetId && !bn(amount).isZero());
    return assets;
  }
  /**
   * Updates the required coins for the transaction.
   */
  updateRequiredCoins() {
    const assets = this.getRequiredCoins();
    const reduceForwardCoins = (requiredCoins, { assetId, amount }) => {
      var _a2;
      const currentAmount = ((_a2 = requiredCoins.get(assetId)) == null ? void 0 : _a2.amount) || bn(0);
      return requiredCoins.set(assetId, {
        assetId: String(assetId),
        amount: currentAmount.add(amount)
      });
    };
    this.requiredCoins = Array.from(
      assets.reduce(reduceForwardCoins, /* @__PURE__ */ new Map()).values()
    );
  }
  /**
   * Adds a single call to the invocation scope.
   *
   * @param funcScope - The function scope to add.
   * @returns The current instance of the class.
   */
  addCall(funcScope) {
    this.addCalls([funcScope]);
    return this;
  }
  /**
   * Adds multiple calls to the invocation scope.
   *
   * @param funcScopes - An array of function scopes to add.
   * @returns The current instance of the class.
   */
  addCalls(funcScopes) {
    this.functionInvocationScopes.push(...funcScopes);
    this.updateContractInputAndOutput();
    this.updateRequiredCoins();
    return this;
  }
  /**
   * Prepares the transaction by updating the script request, required coins, and checking the gas limit.
   */
  async prepareTransaction() {
    await initWasm();
    this.updateScriptRequest();
    this.updateRequiredCoins();
    this.checkGasLimitTotal();
    if (this.program.account) {
      await this.fundWithRequiredCoins();
    }
  }
  /**
   * Checks if the total gas limit is within the acceptable range.
   */
  checkGasLimitTotal() {
    const gasLimitOnCalls = this.calls.reduce((total, call2) => total.add(call2.gas || 0), bn(0));
    if (gasLimitOnCalls.gt(this.transactionRequest.gasLimit)) {
      throw new FuelError(
        ErrorCode.TRANSACTION_ERROR,
        "Transaction's gasLimit must be equal to or greater than the combined forwarded gas of all calls."
      );
    }
  }
  /**
   * Gets the transaction cost ny dry running the transaction.
   *
   * @param options - Optional transaction cost options.
   * @returns The transaction cost details.
   */
  async getTransactionCost(options) {
    const provider = this.getProvider();
    await this.prepareTransaction();
    const request = transactionRequestify(this.transactionRequest);
    request.gasPrice = bn(toNumber(request.gasPrice) || toNumber((options == null ? void 0 : options.gasPrice) || 0));
    const txCost = await provider.getTransactionCost(request, options == null ? void 0 : options.tolerance);
    return txCost;
  }
  /**
   * Funds the transaction with the required coins.
   *
   * @returns The current instance of the class.
   */
  async fundWithRequiredCoins() {
    var _a2;
    this.transactionRequest.inputs = this.transactionRequest.inputs.filter(
      (i) => i.type !== InputType.Coin
    );
    const resources = await ((_a2 = this.program.account) == null ? void 0 : _a2.getResourcesToSpend(this.requiredCoins));
    this.transactionRequest.addResources(resources || []);
    return this;
  }
  /**
   * Sets the transaction parameters.
   *
   * @param txParams - The transaction parameters to set.
   * @returns The current instance of the class.
   */
  txParams(txParams) {
    var _a2;
    this.txParameters = txParams;
    const request = this.transactionRequest;
    request.gasLimit = bn(txParams.gasLimit || request.gasLimit);
    request.gasPrice = bn(txParams.gasPrice || request.gasPrice);
    request.addVariableOutputs(((_a2 = this.txParameters) == null ? void 0 : _a2.variableOutputs) || 0);
    return this;
  }
  /**
   * Adds contracts to the invocation scope.
   *
   * @param contracts - An array of contracts to add.
   * @returns The current instance of the class.
   */
  addContracts(contracts) {
    contracts.forEach((contract) => {
      this.transactionRequest.addContractInputAndOutput(contract.id);
      this.program.interface.updateExternalLoggedTypes(contract.id.toB256(), contract.interface);
    });
    return this;
  }
  /**
   * Prepares and returns the transaction request object.
   *
   * @returns The prepared transaction request.
   */
  async getTransactionRequest() {
    await this.prepareTransaction();
    return this.transactionRequest;
  }
  /**
   * Submits a transaction.
   *
   * @returns The result of the function invocation.
   */
  async call() {
    assert(this.program.account, "Wallet is required!");
    const transactionRequest = await this.getTransactionRequest();
    const response = await this.program.account.sendTransaction(transactionRequest);
    return FunctionInvocationResult.build(
      this.functionInvocationScopes,
      response,
      this.isMultiCall,
      this.program
    );
  }
  /**
   * Simulates a transaction.
   *
   * @returns The result of the invocation call.
   */
  async simulate() {
    assert(this.program.account, "Wallet is required!");
    const isUnlockedWallet = this.program.account.populateTransactionWitnessesSignature;
    if (!isUnlockedWallet) {
      return this.dryRun();
    }
    const transactionRequest = await this.getTransactionRequest();
    const result = await this.program.account.simulateTransaction(transactionRequest);
    return InvocationCallResult.build(this.functionInvocationScopes, result, this.isMultiCall);
  }
  /**
   * Executes a transaction in dry run mode.
   *
   * @returns The result of the invocation call.
   */
  async dryRun() {
    const provider = this.getProvider();
    const transactionRequest = await this.getTransactionRequest();
    const request = transactionRequestify(transactionRequest);
    const response = await provider.call(request, {
      utxoValidation: false
    });
    const result = await InvocationCallResult.build(
      this.functionInvocationScopes,
      response,
      this.isMultiCall
    );
    return result;
  }
  getProvider() {
    const provider = this.program.provider;
    return provider;
  }
};
var FunctionInvocationScope = class extends BaseInvocationScope {
  /**
   * Constructs an instance of FunctionInvocationScope.
   *
   * @param program - The program.
   * @param func - The function fragment.
   * @param args - The arguments.
   */
  constructor(program, func, args) {
    super(program, false);
    __publicField(this, "func");
    __publicField(this, "callParameters");
    __publicField(this, "forward");
    __publicField(this, "args");
    this.func = func;
    this.args = args || [];
    this.setArguments(...args);
    super.addCall(this);
  }
  /**
   * Gets the call configuration.
   *
   * @returns The call configuration.
   */
  getCallConfig() {
    return {
      func: this.func,
      program: this.program,
      callParameters: this.callParameters,
      txParameters: this.txParameters,
      forward: this.forward,
      args: this.args
    };
  }
  /**
   * Sets the arguments for the function invocation.
   *
   * @param args - The arguments.
   * @returns The instance of FunctionInvocationScope.
   */
  setArguments(...args) {
    this.args = args || [];
    return this;
  }
  /**
   * Sets the call parameters for the function invocation.
   *
   * @param callParams - The call parameters.
   * @returns The instance of FunctionInvocationScope.
   * @throws If the function is not payable and forward is set.
   */
  callParams(callParams) {
    this.callParameters = callParams;
    if (callParams == null ? void 0 : callParams.forward) {
      if (!this.func.attributes.find((attr) => attr.name === "payable")) {
        throw new FuelError(
          ErrorCode.TRANSACTION_ERROR,
          `The target function ${this.func.name} cannot accept forwarded funds as it's not marked as 'payable'.`
        );
      }
      this.forward = coinQuantityfy(callParams.forward);
    }
    this.setArguments(...this.args);
    this.updateRequiredCoins();
    return this;
  }
};
var MultiCallInvocationScope = class extends BaseInvocationScope {
  /**
   * Constructs an instance of MultiCallInvocationScope.
   *
   * @param contract - The contract.
   * @param funcScopes - An array of function invocation scopes.
   */
  constructor(contract, funcScopes) {
    super(contract, true);
    this.addCalls(funcScopes);
    this.validateHeapTypeReturnCalls();
  }
  /**
   * Adds a single function invocation scope to the multi-call invocation scope.
   *
   * @param funcScope - The function invocation scope.
   * @returns The instance of MultiCallInvocationScope.
   */
  addCall(funcScope) {
    return super.addCalls([funcScope]);
  }
  /**
   * Adds multiple function invocation scopes to the multi-call invocation scope.
   *
   * @param funcScopes - An array of function invocation scopes.
   * @returns The instance of MultiCallInvocationScope.
   */
  addCalls(funcScopes) {
    return super.addCalls(funcScopes);
  }
  validateHeapTypeReturnCalls() {
    let heapOutputIndex = -1;
    let numberOfHeaps = 0;
    this.calls.forEach((call2, callIndex) => {
      const { isOutputDataHeap } = call2;
      if (isOutputDataHeap) {
        heapOutputIndex = callIndex;
        if (++numberOfHeaps > 1) {
          throw new FuelError(
            ErrorCode.INVALID_MULTICALL,
            "A multicall can have only one call that returns a heap type."
          );
        }
      }
    });
    const hasHeapTypeReturn = heapOutputIndex !== -1;
    const isOnLastCall = heapOutputIndex === this.calls.length - 1;
    if (hasHeapTypeReturn && !isOnLastCall) {
      throw new FuelError(
        ErrorCode.INVALID_MULTICALL,
        "In a multicall, the contract call returning a heap type must be the last call."
      );
    }
  }
};
var Contract = class {
  /**
   * Creates an instance of the Contract class.
   *
   * @param id - The contract's address.
   * @param abi - The contract's ABI (JSON ABI or Interface instance).
   * @param accountOrProvider - The account or provider for interaction.
   */
  constructor(id, abi, accountOrProvider) {
    /**
     * The unique contract identifier.
     */
    __publicField(this, "id");
    /**
     * The provider for interacting with the contract.
     */
    __publicField(this, "provider");
    /**
     * The contract's ABI interface.
     */
    __publicField(this, "interface");
    /**
     * The account associated with the contract, if available.
     */
    __publicField(this, "account");
    /**
     * A collection of functions available on the contract.
     */
    __publicField(this, "functions", {});
    this.interface = abi instanceof Interface ? abi : new Interface(abi);
    this.id = Address.fromAddressOrString(id);
    if (accountOrProvider && "provider" in accountOrProvider) {
      this.provider = accountOrProvider.provider;
      this.account = accountOrProvider;
    } else {
      this.provider = accountOrProvider;
      this.account = null;
    }
    Object.keys(this.interface.functions).forEach((name) => {
      const fragment = this.interface.getFunction(name);
      Object.defineProperty(this.functions, fragment.name, {
        value: this.buildFunction(fragment),
        writable: false
      });
    });
  }
  /**
   * Build a function invocation scope for the provided function fragment.
   *
   * @param func - The function fragment to build a scope for.
   * @returns A function that creates a FunctionInvocationScope.
   */
  buildFunction(func) {
    return (...args) => new FunctionInvocationScope(this, func, args);
  }
  /**
   * Create a multi-call invocation scope for the provided function invocation scopes.
   *
   * @param calls - An array of FunctionInvocationScopes to execute in a batch.
   * @returns A MultiCallInvocationScope instance.
   */
  multiCall(calls) {
    return new MultiCallInvocationScope(this, calls);
  }
  /**
   * Get the balance for a given asset ID for this contract.
   *
   * @param assetId - The specified asset ID.
   * @returns The balance of the contract for the specified asset.
   */
  // #region contract-balance-1
  getBalance(assetId) {
    return this.provider.getContractBalance(this.id, assetId);
  }
  // #endregion contract-balance-1
};

// node_modules/@fuel-ts/merkle/dist/index.mjs
var EMPTY = "0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
function hash(data) {
  return sha256(data);
}
var Node = class {
  constructor(left, right, parent, hash22, data, index = 0) {
    __publicField(this, "left");
    __publicField(this, "right");
    __publicField(this, "parent");
    __publicField(this, "hash");
    __publicField(this, "data");
    __publicField(this, "index");
    this.left = left;
    this.right = right;
    this.parent = parent;
    this.hash = hash22;
    this.data = data;
    this.index = index;
  }
};
var node_default = Node;
function hashLeaf(data) {
  return hash("0x00".concat(data.slice(2)));
}
function hashNode(left, right) {
  return hash("0x01".concat(left.slice(2)).concat(right.slice(2)));
}
function calcRoot(data) {
  if (!data.length) {
    return EMPTY;
  }
  const nodes = [];
  for (let i = 0; i < data.length; i += 1) {
    const hashed = hashLeaf(data[i]);
    nodes.push(new node_default(-1, -1, -1, hashed, data[i]));
  }
  let pNodes = nodes;
  let size = nodes.length + 1 >> 1;
  let odd = nodes.length & 1;
  while (true) {
    let i = 0;
    for (; i < size - odd; i += 1) {
      const j = i << 1;
      const hashed = hashNode(pNodes[j].hash, pNodes[j + 1].hash);
      nodes[i] = new node_default(pNodes[j].index, pNodes[j + 1].index, -1, hashed, "");
    }
    if (odd === 1) {
      nodes[i] = pNodes[i << 1];
    }
    if (size === 1) {
      break;
    }
    odd = size & 1;
    size = size + 1 >> 1;
    pNodes = nodes;
  }
  return nodes[0].hash;
}
var leafPrefix = "0x00";
var nodePrefix = "0x01";
function hashLeaf2(key, data) {
  const value = "0x00".concat(key.slice(2)).concat(hash(data).slice(2));
  return [hash(value), value];
}
function hashNode2(left, right) {
  const value = "0x01".concat(left.slice(2)).concat(right.slice(2));
  return [hash(value), value];
}
function parseLeaf(data) {
  const len = nodePrefix.length;
  return ["0x".concat(data.slice(len, len + 64)), "0x".concat(data.slice(len + 64))];
}
function parseNode(data) {
  const len = nodePrefix.length;
  return ["0x".concat(data.slice(len, len + 64)), "0x".concat(data.slice(len + 64))];
}
function isLeaf(data) {
  return data.slice(0, 4) === leafPrefix;
}
var SparseCompactMerkleProof = class {
  constructor(SideNodes, NonMembershipLeafData, Bitmask, NumSideNodes, SiblingData) {
    __publicField(this, "SideNodes");
    __publicField(this, "NonMembershipLeafData");
    __publicField(this, "BitMask");
    __publicField(this, "NumSideNodes");
    __publicField(this, "SiblingData");
    this.SideNodes = SideNodes;
    this.NonMembershipLeafData = NonMembershipLeafData;
    this.BitMask = Bitmask;
    this.NumSideNodes = NumSideNodes;
    this.SiblingData = SiblingData;
  }
};
var sparseCompactMerkleProof_default = SparseCompactMerkleProof;
var SparseMerkleProof = class {
  constructor(sideNodes, NonMembershipLeafData, SiblingData) {
    __publicField(this, "SideNodes");
    __publicField(this, "NonMembershipLeafData");
    __publicField(this, "SiblingData");
    this.SideNodes = sideNodes;
    this.NonMembershipLeafData = NonMembershipLeafData;
    this.SiblingData = SiblingData;
  }
};
var sparseMerkleProof_default = SparseMerkleProof;
var ZERO = "0x0000000000000000000000000000000000000000000000000000000000000000";
var MAX_HEIGHT = 256;
function getBitAtFromMSB(data, position) {
  const slicedData = data.slice(2);
  const byte = "0x".concat(
    slicedData.slice(Math.floor(position / 8) * 2, Math.floor(position / 8) * 2 + 2)
  );
  const bits = Number(byte) & 1 << 8 - 1 - position % 8;
  if (bits > 0) {
    return 1;
  }
  return 0;
}
function reverseSideNodes(sideNodes) {
  let left = 0;
  let right = sideNodes.length - 1;
  const reversedSideNodes = sideNodes;
  while (left < right) {
    [reversedSideNodes[left], reversedSideNodes[right]] = [
      reversedSideNodes[right],
      reversedSideNodes[left]
    ];
    left += 1;
    right -= 1;
  }
  return reversedSideNodes;
}
function countCommonPrefix(data1, data2) {
  let count = 0;
  for (let i = 0; i < MAX_HEIGHT; i += 1) {
    if (getBitAtFromMSB(data1, i) === getBitAtFromMSB(data2, i)) {
      count += 1;
    } else {
      break;
    }
  }
  return count;
}
function compactProof(proof) {
  const bitMask = [];
  const compactedSideNodes = [];
  let node;
  for (let i = 0; i < proof.SideNodes.length; i += 1) {
    node = proof.SideNodes[i];
    if (node === ZERO) {
      bitMask.push(0);
    } else {
      compactedSideNodes.push(node);
      bitMask.push(1);
    }
  }
  const compactedProof = new sparseCompactMerkleProof_default(
    compactedSideNodes,
    proof.NonMembershipLeafData,
    bitMask,
    proof.SideNodes.length,
    proof.SiblingData
  );
  return compactedProof;
}
var SparseMerkleTree = class {
  constructor() {
    __publicField(this, "ms");
    __publicField(this, "root");
    const ms = {};
    this.ms = ms;
    this.root = ZERO;
    this.ms[this.root] = ZERO;
  }
  get(key) {
    return this.ms[key];
  }
  set(key, value) {
    this.ms[key] = value;
  }
  setRoot(root) {
    this.root = root;
  }
  sideNodesForRoot(key, root) {
    const sideNodes = [];
    if (root === ZERO) {
      return [sideNodes, ZERO, "", ""];
    }
    let currentData = this.get(root);
    if (isLeaf(currentData)) {
      return [sideNodes, root, currentData, ""];
    }
    let leftNode;
    let rightNode;
    let nodeHash = "";
    let sideNode = "";
    for (let i = 0; i < MAX_HEIGHT; i += 1) {
      [leftNode, rightNode] = parseNode(currentData);
      if (getBitAtFromMSB(key, i) === 1) {
        sideNode = leftNode;
        nodeHash = rightNode;
      } else {
        sideNode = rightNode;
        nodeHash = leftNode;
      }
      sideNodes.push(sideNode);
      if (nodeHash === ZERO) {
        currentData = "";
        break;
      }
      currentData = this.get(nodeHash);
      if (isLeaf(currentData)) {
        break;
      }
    }
    const siblingData = this.get(sideNode);
    return [reverseSideNodes(sideNodes), nodeHash, currentData, siblingData];
  }
  deleteWithSideNodes(key, sideNodes, oldLeafHash, oldLeafData) {
    if (oldLeafHash === ZERO) {
      return this.root;
    }
    const [actualPath] = parseLeaf(oldLeafData);
    if (actualPath !== key) {
      return this.root;
    }
    let currentHash = "";
    let currentData = "";
    let sideNode = "";
    let sideNodeValue = "";
    let nonPlaceholderReached = false;
    for (let i = 0; i < sideNodes.length; i += 1) {
      if (sideNodes[i] === "") {
        continue;
      }
      sideNode = sideNodes[i];
      if (currentData === "") {
        sideNodeValue = this.get(sideNode);
        if (isLeaf(sideNodeValue)) {
          currentHash = sideNode;
          currentData = sideNode;
          continue;
        } else {
          currentData = ZERO;
          nonPlaceholderReached = true;
        }
      }
      if (!nonPlaceholderReached && sideNode === ZERO) {
        continue;
      } else if (!nonPlaceholderReached) {
        nonPlaceholderReached = true;
      }
      if (getBitAtFromMSB(key, sideNodes.length - 1 - i) === 1) {
        [currentHash, currentData] = hashNode2(sideNode, currentData);
      } else {
        [currentHash, currentData] = hashNode2(currentData, sideNode);
      }
      this.set(currentHash, currentData);
      currentData = currentHash;
    }
    if (currentHash === "") {
      currentHash = ZERO;
    }
    return currentHash;
  }
  updateWithSideNodes(key, value, sideNodes, oldLeafHash, oldLeafData) {
    let currentHash;
    let currentData;
    this.set(hash(value), value);
    [currentHash, currentData] = hashLeaf2(key, value);
    this.set(currentHash, currentData);
    currentData = currentHash;
    let commonPrefixCount;
    if (oldLeafHash === ZERO) {
      commonPrefixCount = MAX_HEIGHT;
    } else {
      const [actualPath] = parseLeaf(oldLeafData);
      commonPrefixCount = countCommonPrefix(key, actualPath);
    }
    if (commonPrefixCount !== MAX_HEIGHT) {
      if (getBitAtFromMSB(key, commonPrefixCount) === 1) {
        [currentHash, currentData] = hashNode2(oldLeafHash, currentData);
      } else {
        [currentHash, currentData] = hashNode2(currentData, oldLeafHash);
      }
      this.set(currentHash, currentData);
      currentData = currentHash;
    }
    for (let i = 0; i < MAX_HEIGHT; i += 1) {
      let sideNode;
      const offsetOfSideNodes = MAX_HEIGHT - sideNodes.length;
      if (i - offsetOfSideNodes < 0 || sideNodes[i - offsetOfSideNodes] === "") {
        if (commonPrefixCount !== MAX_HEIGHT && commonPrefixCount > MAX_HEIGHT - 1 - i) {
          sideNode = ZERO;
        } else {
          continue;
        }
      } else {
        sideNode = sideNodes[i - offsetOfSideNodes];
      }
      if (getBitAtFromMSB(key, MAX_HEIGHT - 1 - i) === 1) {
        [currentHash, currentData] = hashNode2(sideNode, currentData);
      } else {
        [currentHash, currentData] = hashNode2(currentData, sideNode);
      }
      this.set(currentHash, currentData);
      currentData = currentHash;
    }
    return currentHash;
  }
  update(key, value) {
    const [sideNodes, oldLeafHash, oldLeafData] = this.sideNodesForRoot(key, this.root);
    const newRoot = this.updateWithSideNodes(key, value, sideNodes, oldLeafHash, oldLeafData);
    this.setRoot(newRoot);
  }
  delete(key) {
    const [sideNodes, oldLeafHash, oldLeafData] = this.sideNodesForRoot(key, this.root);
    const newRoot = this.deleteWithSideNodes(key, sideNodes, oldLeafHash, oldLeafData);
    this.setRoot(newRoot);
  }
  prove(key) {
    const [sideNodes, leafHash, leafData, siblingData] = this.sideNodesForRoot(key, this.root);
    const nonEmptySideNodes = [];
    for (let i = 0; i < sideNodes.length; i += 1) {
      if (sideNodes[i] !== "") {
        nonEmptySideNodes.push(sideNodes[i]);
      }
    }
    let nonMembershipLeafData = "";
    if (leafHash !== ZERO) {
      const [actualPath] = parseLeaf(leafData);
      if (actualPath !== key) {
        nonMembershipLeafData = leafData;
      }
    }
    const proof = new sparseMerkleProof_default(nonEmptySideNodes, nonMembershipLeafData, siblingData);
    return proof;
  }
  proveCompacted(key) {
    const proof = this.prove(key);
    const compactedProof = compactProof(proof);
    return compactedProof;
  }
};

// node_modules/@fuel-ts/contract/dist/index.mjs
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var util_exports = {};
__export(util_exports, {
  getContractId: () => getContractId,
  getContractRoot: () => getContractRoot,
  getContractStorageRoot: () => getContractStorageRoot,
  hexlifyWithPrefix: () => hexlifyWithPrefix
});
var getContractRoot = (bytecode) => {
  const chunkSize = 16 * 1024;
  const bytes = getBytesCopy(bytecode);
  const chunks = chunkAndPadBytes(bytes, chunkSize);
  return calcRoot(chunks.map((c) => hexlify(c)));
};
var getContractStorageRoot = (storageSlots) => {
  const tree = new SparseMerkleTree();
  storageSlots.forEach(({ key, value }) => tree.update(sha256(key), value));
  return tree.root;
};
var getContractId = (bytecode, salt, stateRoot) => {
  const root = getContractRoot(getBytesCopy(bytecode));
  const contractId = sha256(concat(["0x4655454C", salt, root, stateRoot]));
  return contractId;
};
var hexlifyWithPrefix = (value) => {
  if (value.startsWith("0x"))
    return hexlify(value);
  return hexlify(`0x${value}`);
};
var ContractFactory = class {
  /**
   * Create a ContractFactory instance.
   *
   * @param bytecode - The bytecode of the contract.
   * @param abi - The contract's ABI (Application Binary Interface).
   * @param accountOrProvider - An account or provider to be associated with the factory.
   */
  constructor(bytecode, abi, accountOrProvider = null) {
    __publicField(this, "bytecode");
    __publicField(this, "interface");
    __publicField(this, "provider");
    __publicField(this, "account");
    this.bytecode = getBytesCopy(bytecode);
    if (abi instanceof Interface) {
      this.interface = abi;
    } else {
      this.interface = new Interface(abi);
    }
    if (accountOrProvider && "provider" in accountOrProvider) {
      this.provider = accountOrProvider.provider;
      this.account = accountOrProvider;
    } else {
      this.provider = accountOrProvider;
      this.account = null;
    }
  }
  /**
   * Connect the factory to a provider.
   *
   * @param provider - The provider to be associated with the factory.
   * @returns A new ContractFactory instance.
   */
  connect(provider) {
    return new ContractFactory(this.bytecode, this.interface, provider);
  }
  /**
   * Create a transaction request to deploy a contract with the specified options.
   *
   * @param deployContractOptions - Options for deploying the contract.
   * @returns The CreateTransactionRequest object for deploying the contract.
   */
  createTransactionRequest(deployContractOptions) {
    var _a2;
    const storageSlots = (_a2 = deployContractOptions == null ? void 0 : deployContractOptions.storageSlots) == null ? void 0 : _a2.map(({ key, value }) => ({
      key: hexlifyWithPrefix(key),
      value: hexlifyWithPrefix(value)
    })).sort(({ key: keyA }, { key: keyB }) => keyA.localeCompare(keyB));
    const options = {
      salt: randomBytes2(32),
      ...deployContractOptions,
      storageSlots: storageSlots || []
    };
    if (!this.provider) {
      throw new FuelError(
        ErrorCode.MISSING_PROVIDER,
        "Cannot create transaction request without provider"
      );
    }
    const { maxGasPerTx } = this.provider.getGasConfig();
    const stateRoot = options.stateRoot || getContractStorageRoot(options.storageSlots);
    const contractId = getContractId(this.bytecode, options.salt, stateRoot);
    const transactionRequest = new CreateTransactionRequest({
      gasPrice: 0,
      gasLimit: maxGasPerTx,
      bytecodeWitnessIndex: 0,
      witnesses: [this.bytecode],
      ...options
    });
    transactionRequest.addContractCreatedOutput(contractId, stateRoot);
    return {
      contractId,
      transactionRequest
    };
  }
  /**
   * Deploy a contract with the specified options.
   *
   * @param deployContractOptions - Options for deploying the contract.
   * @returns A promise that resolves to the deployed contract instance.
   */
  async deployContract(deployContractOptions = {}) {
    if (!this.account) {
      throw new FuelError(ErrorCode.ACCOUNT_REQUIRED, "Cannot deploy Contract without account.");
    }
    const { configurableConstants } = deployContractOptions;
    if (configurableConstants) {
      this.setConfigurableConstants(configurableConstants);
    }
    const { contractId, transactionRequest } = this.createTransactionRequest(deployContractOptions);
    await this.account.fund(transactionRequest);
    const response = await this.account.sendTransaction(transactionRequest);
    await response.wait();
    return new Contract(contractId, this.interface, this.account);
  }
  /**
   * Set configurable constants of the contract with the specified values.
   *
   * @param configurableConstants - An object containing configurable names and their values.
   */
  setConfigurableConstants(configurableConstants) {
    try {
      const hasConfigurable = Object.keys(this.interface.configurables).length;
      if (!hasConfigurable) {
        throw new Error("Contract does not have configurables to be set");
      }
      Object.entries(configurableConstants).forEach(([key, value]) => {
        if (!this.interface.configurables[key]) {
          throw new Error(`Contract does not have a configurable named: '${key}'`);
        }
        const { offset } = this.interface.configurables[key];
        const encoded = this.interface.encodeConfigurable(key, value);
        const bytes = getBytesCopy(this.bytecode);
        bytes.set(encoded, offset);
        this.bytecode = bytes;
      });
    } catch (err) {
      throw new FuelError(
        ErrorCode.INVALID_CONFIGURABLE_CONSTANTS,
        `Error setting configurable constants on contract: ${err.message}.`
      );
    }
  }
};

// node_modules/@fuel-ts/hasher/dist/index.mjs
function hashMessage(msg) {
  return sha256(bufferFromString2(msg, "utf-8"));
}
function uint64ToBytesBE(value) {
  const bigIntValue = BigInt(value);
  const buffer = new ArrayBuffer(8);
  const dataView = new DataView(buffer);
  dataView.setBigUint64(0, bigIntValue, false);
  return new Uint8Array(dataView.buffer);
}
function hashTransaction(transactionRequestLike, chainId) {
  const transactionRequest = transactionRequestify(transactionRequestLike);
  const transaction = transactionRequest.toTransaction();
  if (transaction.type === TransactionType.Script) {
    transaction.receiptsRoot = ZeroBytes32;
  }
  transaction.inputs = transaction.inputs.map((input) => {
    const inputClone = clone_default(input);
    switch (inputClone.type) {
      case InputType.Coin: {
        inputClone.txPointer = {
          blockHeight: 0,
          txIndex: 0
        };
        inputClone.predicateGasUsed = bn(0);
        return inputClone;
      }
      case InputType.Message: {
        inputClone.predicateGasUsed = bn(0);
        return inputClone;
      }
      case InputType.Contract: {
        inputClone.txPointer = {
          blockHeight: 0,
          txIndex: 0
        };
        inputClone.utxoID = {
          transactionId: ZeroBytes32,
          outputIndex: 0
        };
        inputClone.balanceRoot = ZeroBytes32;
        inputClone.stateRoot = ZeroBytes32;
        return inputClone;
      }
      default:
        return inputClone;
    }
  });
  transaction.outputs = transaction.outputs.map((output) => {
    const outputClone = clone_default(output);
    switch (outputClone.type) {
      case OutputType.Contract: {
        outputClone.balanceRoot = ZeroBytes32;
        outputClone.stateRoot = ZeroBytes32;
        return outputClone;
      }
      case OutputType.Change: {
        outputClone.amount = bn(0);
        return outputClone;
      }
      case OutputType.Variable: {
        outputClone.to = ZeroBytes32;
        outputClone.amount = bn(0);
        outputClone.assetId = ZeroBytes32;
        return outputClone;
      }
      default:
        return outputClone;
    }
  });
  transaction.witnessesCount = 0;
  transaction.witnesses = [];
  const chainIdBytes = uint64ToBytesBE(chainId);
  const concatenatedData = concat([chainIdBytes, new TransactionCoder().encode(transaction)]);
  return sha256(concatenatedData);
}
function hash2(data) {
  return sha256(data);
}

// node_modules/@fuel-ts/signer/dist/index.mjs
var elliptic = __toESM(require_elliptic(), 1);
var { ec: EC } = elliptic;
function getCurve() {
  return new EC("secp256k1");
}
var Signer = class {
  /**
   * Create a Signer instance from a given private key
   *
   * @param privateKey - The private key to use for signing
   * @returns A new Signer instance
   */
  constructor(privateKey) {
    __publicField(this, "address");
    __publicField(this, "publicKey");
    __publicField(this, "compressedPublicKey");
    __publicField(this, "privateKey");
    if (typeof privateKey === "string") {
      if (privateKey.match(/^[0-9a-f]*$/i) && privateKey.length === 64) {
        privateKey = `0x${privateKey}`;
      }
    }
    const privateKeyBytes = getBytesCopy(privateKey);
    const keyPair = getCurve().keyFromPrivate(privateKeyBytes, "hex");
    this.compressedPublicKey = hexlify(Uint8Array.from(keyPair.getPublic(true, "array")));
    this.publicKey = hexlify(Uint8Array.from(keyPair.getPublic(false, "array").slice(1)));
    this.privateKey = hexlify(privateKeyBytes);
    this.address = Address.fromPublicKey(this.publicKey);
  }
  /**
   * Sign data using the Signer instance
   *
   * Signature is a 64 byte array of the concatenated r and s values with the compressed recoveryParam byte. [Read more](FuelLabs/fuel-specs/specs/protocol/cryptographic_primitives.md#public-key-cryptography)
   *
   * @param data - The data to be sign
   * @returns hashed signature
   */
  sign(data) {
    const keyPair = getCurve().keyFromPrivate(getBytesCopy(this.privateKey), "hex");
    const signature = keyPair.sign(getBytesCopy(data), {
      canonical: true
    });
    const r = toBytes(signature.r, 32);
    const s = toBytes(signature.s, 32);
    s[0] |= (signature.recoveryParam || 0) << 7;
    return concat([r, s]);
  }
  /**
   * Add point on the current elliptic curve
   *
   * @param point - Point to add on the curve
   * @returns compressed point on the curve
   */
  addPoint(point) {
    const p0 = getCurve().keyFromPublic(getBytesCopy(this.compressedPublicKey));
    const p1 = getCurve().keyFromPublic(getBytesCopy(point));
    const result = p0.getPublic().add(p1.getPublic());
    return hexlify(Uint8Array.from(result.encode("array", true)));
  }
  /**
   * Recover the public key from a signature performed with [`sign`](#sign).
   *
   * @param data - Data
   * @param signature - hashed signature
   * @returns public key from signature from the
   */
  static recoverPublicKey(data, signature) {
    const signedMessageBytes = getBytesCopy(signature);
    const r = signedMessageBytes.slice(0, 32);
    const s = signedMessageBytes.slice(32, 64);
    const recoveryParam = (s[0] & 128) >> 7;
    s[0] &= 127;
    const publicKey = getCurve().recoverPubKey(getBytesCopy(data), { r, s }, recoveryParam).encode("array", false).slice(1);
    return hexlify(Uint8Array.from(publicKey));
  }
  /**
   * Recover the address from a signature performed with [`sign`](#sign).
   *
   * @param data - Data
   * @param signature - Signature
   * @returns Address from signature
   */
  static recoverAddress(data, signature) {
    return Address.fromPublicKey(Signer.recoverPublicKey(data, signature));
  }
  /**
   * Generate a random privateKey
   *
   * @param entropy - Adds extra entropy to generate the privateKey
   * @returns random 32-byte hashed
   */
  static generatePrivateKey(entropy) {
    return entropy ? hash2(concat([randomBytes2(32), getBytesCopy(entropy)])) : randomBytes2(32);
  }
  /**
   * Extended publicKey from a compact publicKey
   *
   * @param publicKey - Compact publicKey
   * @returns extended publicKey
   */
  static extendPublicKey(publicKey) {
    const keyPair = getCurve().keyFromPublic(getBytesCopy(publicKey));
    return hexlify(Uint8Array.from(keyPair.getPublic(false, "array").slice(1)));
  }
};
var signer_default = Signer;

// node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues = typeof crypto !== "undefined" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto);
    if (!getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
  }
  return getRandomValues(rnds8);
}

// node_modules/uuid/dist/esm-browser/regex.js
var regex_default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === "string" && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

// node_modules/uuid/dist/esm-browser/parse.js
function parse(uuid) {
  if (!validate_default(uuid)) {
    throw TypeError("Invalid UUID");
  }
  let v;
  const arr = new Uint8Array(16);
  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 255;
  arr[2] = v >>> 8 & 255;
  arr[3] = v & 255;
  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 255;
  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 255;
  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 255;
  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 1099511627776 & 255;
  arr[11] = v / 4294967296 & 255;
  arr[12] = v >>> 24 & 255;
  arr[13] = v >>> 16 & 255;
  arr[14] = v >>> 8 & 255;
  arr[15] = v & 255;
  return arr;
}
var parse_default = parse;

// node_modules/uuid/dist/esm-browser/v35.js
function stringToBytes(str) {
  str = unescape(encodeURIComponent(str));
  const bytes = [];
  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}
var DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
var URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
function v35(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    var _namespace;
    if (typeof value === "string") {
      value = stringToBytes(value);
    }
    if (typeof namespace === "string") {
      namespace = parse_default(namespace);
    }
    if (((_namespace = namespace) === null || _namespace === void 0 ? void 0 : _namespace.length) !== 16) {
      throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
    }
    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 15 | version;
    bytes[8] = bytes[8] & 63 | 128;
    if (buf) {
      offset = offset || 0;
      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }
      return buf;
    }
    return unsafeStringify(bytes);
  }
  try {
    generateUUID.name = name;
  } catch (err) {
  }
  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

// node_modules/uuid/dist/esm-browser/md5.js
function md5(bytes) {
  if (typeof bytes === "string") {
    const msg = unescape(encodeURIComponent(bytes));
    bytes = new Uint8Array(msg.length);
    for (let i = 0; i < msg.length; ++i) {
      bytes[i] = msg.charCodeAt(i);
    }
  }
  return md5ToHexEncodedArray(wordsToMd5(bytesToWords(bytes), bytes.length * 8));
}
function md5ToHexEncodedArray(input) {
  const output = [];
  const length32 = input.length * 32;
  const hexTab = "0123456789abcdef";
  for (let i = 0; i < length32; i += 8) {
    const x = input[i >> 5] >>> i % 32 & 255;
    const hex = parseInt(hexTab.charAt(x >>> 4 & 15) + hexTab.charAt(x & 15), 16);
    output.push(hex);
  }
  return output;
}
function getOutputLength(inputLength8) {
  return (inputLength8 + 64 >>> 9 << 4) + 14 + 1;
}
function wordsToMd5(x, len) {
  x[len >> 5] |= 128 << len % 32;
  x[getOutputLength(len) - 1] = len;
  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;
    a = md5ff(a, b, c, d, x[i], 7, -680876936);
    d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, x[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = md5gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, x[i], 20, -373897302);
    a = md5gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = md5gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = md5hh(a, b, c, d, x[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, x[i], 11, -358537222);
    c = md5hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = md5ii(a, b, c, d, x[i], 6, -198630844);
    d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }
  return [a, b, c, d];
}
function bytesToWords(input) {
  if (input.length === 0) {
    return [];
  }
  const length8 = input.length * 8;
  const output = new Uint32Array(getOutputLength(length8));
  for (let i = 0; i < length8; i += 8) {
    output[i >> 5] |= (input[i / 8] & 255) << i % 32;
  }
  return output;
}
function safeAdd(x, y) {
  const lsw = (x & 65535) + (y & 65535);
  const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
  return msw << 16 | lsw & 65535;
}
function bitRotateLeft(num, cnt) {
  return num << cnt | num >>> 32 - cnt;
}
function md5cmn(q, a, b, x, s, t) {
  return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
}
function md5ff(a, b, c, d, x, s, t) {
  return md5cmn(b & c | ~b & d, a, b, x, s, t);
}
function md5gg(a, b, c, d, x, s, t) {
  return md5cmn(b & d | c & ~d, a, b, x, s, t);
}
function md5hh(a, b, c, d, x, s, t) {
  return md5cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5ii(a, b, c, d, x, s, t) {
  return md5cmn(c ^ (b | ~d), a, b, x, s, t);
}
var md5_default = md5;

// node_modules/uuid/dist/esm-browser/v3.js
var v3 = v35("v3", 48, md5_default);

// node_modules/uuid/dist/esm-browser/native.js
var randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
var native_default = {
  randomUUID
};

// node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  if (native_default.randomUUID && !buf && !options) {
    return native_default.randomUUID();
  }
  options = options || {};
  const rnds = options.random || (options.rng || rng)();
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  if (buf) {
    offset = offset || 0;
    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return unsafeStringify(rnds);
}
var v4_default = v4;

// node_modules/uuid/dist/esm-browser/sha1.js
function f(s, x, y, z) {
  switch (s) {
    case 0:
      return x & y ^ ~x & z;
    case 1:
      return x ^ y ^ z;
    case 2:
      return x & y ^ x & z ^ y & z;
    case 3:
      return x ^ y ^ z;
  }
}
function ROTL(x, n) {
  return x << n | x >>> 32 - n;
}
function sha1(bytes) {
  const K = [1518500249, 1859775393, 2400959708, 3395469782];
  const H = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
  if (typeof bytes === "string") {
    const msg = unescape(encodeURIComponent(bytes));
    bytes = [];
    for (let i = 0; i < msg.length; ++i) {
      bytes.push(msg.charCodeAt(i));
    }
  } else if (!Array.isArray(bytes)) {
    bytes = Array.prototype.slice.call(bytes);
  }
  bytes.push(128);
  const l = bytes.length / 4 + 2;
  const N = Math.ceil(l / 16);
  const M = new Array(N);
  for (let i = 0; i < N; ++i) {
    const arr = new Uint32Array(16);
    for (let j = 0; j < 16; ++j) {
      arr[j] = bytes[i * 64 + j * 4] << 24 | bytes[i * 64 + j * 4 + 1] << 16 | bytes[i * 64 + j * 4 + 2] << 8 | bytes[i * 64 + j * 4 + 3];
    }
    M[i] = arr;
  }
  M[N - 1][14] = (bytes.length - 1) * 8 / Math.pow(2, 32);
  M[N - 1][14] = Math.floor(M[N - 1][14]);
  M[N - 1][15] = (bytes.length - 1) * 8 & 4294967295;
  for (let i = 0; i < N; ++i) {
    const W = new Uint32Array(80);
    for (let t = 0; t < 16; ++t) {
      W[t] = M[i][t];
    }
    for (let t = 16; t < 80; ++t) {
      W[t] = ROTL(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);
    }
    let a = H[0];
    let b = H[1];
    let c = H[2];
    let d = H[3];
    let e = H[4];
    for (let t = 0; t < 80; ++t) {
      const s = Math.floor(t / 20);
      const T = ROTL(a, 5) + f(s, b, c, d) + e + K[s] + W[t] >>> 0;
      e = d;
      d = c;
      c = ROTL(b, 30) >>> 0;
      b = a;
      a = T;
    }
    H[0] = H[0] + a >>> 0;
    H[1] = H[1] + b >>> 0;
    H[2] = H[2] + c >>> 0;
    H[3] = H[3] + d >>> 0;
    H[4] = H[4] + e >>> 0;
  }
  return [H[0] >> 24 & 255, H[0] >> 16 & 255, H[0] >> 8 & 255, H[0] & 255, H[1] >> 24 & 255, H[1] >> 16 & 255, H[1] >> 8 & 255, H[1] & 255, H[2] >> 24 & 255, H[2] >> 16 & 255, H[2] >> 8 & 255, H[2] & 255, H[3] >> 24 & 255, H[3] >> 16 & 255, H[3] >> 8 & 255, H[3] & 255, H[4] >> 24 & 255, H[4] >> 16 & 255, H[4] >> 8 & 255, H[4] & 255];
}
var sha1_default = sha1;

// node_modules/uuid/dist/esm-browser/v5.js
var v5 = v35("v5", 80, sha1_default);

// node_modules/@fuel-ts/wordlists/dist/index.mjs
var english = [
  "abandon",
  "ability",
  "able",
  "about",
  "above",
  "absent",
  "absorb",
  "abstract",
  "absurd",
  "abuse",
  "access",
  "accident",
  "account",
  "accuse",
  "achieve",
  "acid",
  "acoustic",
  "acquire",
  "across",
  "act",
  "action",
  "actor",
  "actress",
  "actual",
  "adapt",
  "add",
  "addict",
  "address",
  "adjust",
  "admit",
  "adult",
  "advance",
  "advice",
  "aerobic",
  "affair",
  "afford",
  "afraid",
  "again",
  "age",
  "agent",
  "agree",
  "ahead",
  "aim",
  "air",
  "airport",
  "aisle",
  "alarm",
  "album",
  "alcohol",
  "alert",
  "alien",
  "all",
  "alley",
  "allow",
  "almost",
  "alone",
  "alpha",
  "already",
  "also",
  "alter",
  "always",
  "amateur",
  "amazing",
  "among",
  "amount",
  "amused",
  "analyst",
  "anchor",
  "ancient",
  "anger",
  "angle",
  "angry",
  "animal",
  "ankle",
  "announce",
  "annual",
  "another",
  "answer",
  "antenna",
  "antique",
  "anxiety",
  "any",
  "apart",
  "apology",
  "appear",
  "apple",
  "approve",
  "april",
  "arch",
  "arctic",
  "area",
  "arena",
  "argue",
  "arm",
  "armed",
  "armor",
  "army",
  "around",
  "arrange",
  "arrest",
  "arrive",
  "arrow",
  "art",
  "artefact",
  "artist",
  "artwork",
  "ask",
  "aspect",
  "assault",
  "asset",
  "assist",
  "assume",
  "asthma",
  "athlete",
  "atom",
  "attack",
  "attend",
  "attitude",
  "attract",
  "auction",
  "audit",
  "august",
  "aunt",
  "author",
  "auto",
  "autumn",
  "average",
  "avocado",
  "avoid",
  "awake",
  "aware",
  "away",
  "awesome",
  "awful",
  "awkward",
  "axis",
  "baby",
  "bachelor",
  "bacon",
  "badge",
  "bag",
  "balance",
  "balcony",
  "ball",
  "bamboo",
  "banana",
  "banner",
  "bar",
  "barely",
  "bargain",
  "barrel",
  "base",
  "basic",
  "basket",
  "battle",
  "beach",
  "bean",
  "beauty",
  "because",
  "become",
  "beef",
  "before",
  "begin",
  "behave",
  "behind",
  "believe",
  "below",
  "belt",
  "bench",
  "benefit",
  "best",
  "betray",
  "better",
  "between",
  "beyond",
  "bicycle",
  "bid",
  "bike",
  "bind",
  "biology",
  "bird",
  "birth",
  "bitter",
  "black",
  "blade",
  "blame",
  "blanket",
  "blast",
  "bleak",
  "bless",
  "blind",
  "blood",
  "blossom",
  "blouse",
  "blue",
  "blur",
  "blush",
  "board",
  "boat",
  "body",
  "boil",
  "bomb",
  "bone",
  "bonus",
  "book",
  "boost",
  "border",
  "boring",
  "borrow",
  "boss",
  "bottom",
  "bounce",
  "box",
  "boy",
  "bracket",
  "brain",
  "brand",
  "brass",
  "brave",
  "bread",
  "breeze",
  "brick",
  "bridge",
  "brief",
  "bright",
  "bring",
  "brisk",
  "broccoli",
  "broken",
  "bronze",
  "broom",
  "brother",
  "brown",
  "brush",
  "bubble",
  "buddy",
  "budget",
  "buffalo",
  "build",
  "bulb",
  "bulk",
  "bullet",
  "bundle",
  "bunker",
  "burden",
  "burger",
  "burst",
  "bus",
  "business",
  "busy",
  "butter",
  "buyer",
  "buzz",
  "cabbage",
  "cabin",
  "cable",
  "cactus",
  "cage",
  "cake",
  "call",
  "calm",
  "camera",
  "camp",
  "can",
  "canal",
  "cancel",
  "candy",
  "cannon",
  "canoe",
  "canvas",
  "canyon",
  "capable",
  "capital",
  "captain",
  "car",
  "carbon",
  "card",
  "cargo",
  "carpet",
  "carry",
  "cart",
  "case",
  "cash",
  "casino",
  "castle",
  "casual",
  "cat",
  "catalog",
  "catch",
  "category",
  "cattle",
  "caught",
  "cause",
  "caution",
  "cave",
  "ceiling",
  "celery",
  "cement",
  "census",
  "century",
  "cereal",
  "certain",
  "chair",
  "chalk",
  "champion",
  "change",
  "chaos",
  "chapter",
  "charge",
  "chase",
  "chat",
  "cheap",
  "check",
  "cheese",
  "chef",
  "cherry",
  "chest",
  "chicken",
  "chief",
  "child",
  "chimney",
  "choice",
  "choose",
  "chronic",
  "chuckle",
  "chunk",
  "churn",
  "cigar",
  "cinnamon",
  "circle",
  "citizen",
  "city",
  "civil",
  "claim",
  "clap",
  "clarify",
  "claw",
  "clay",
  "clean",
  "clerk",
  "clever",
  "click",
  "client",
  "cliff",
  "climb",
  "clinic",
  "clip",
  "clock",
  "clog",
  "close",
  "cloth",
  "cloud",
  "clown",
  "club",
  "clump",
  "cluster",
  "clutch",
  "coach",
  "coast",
  "coconut",
  "code",
  "coffee",
  "coil",
  "coin",
  "collect",
  "color",
  "column",
  "combine",
  "come",
  "comfort",
  "comic",
  "common",
  "company",
  "concert",
  "conduct",
  "confirm",
  "congress",
  "connect",
  "consider",
  "control",
  "convince",
  "cook",
  "cool",
  "copper",
  "copy",
  "coral",
  "core",
  "corn",
  "correct",
  "cost",
  "cotton",
  "couch",
  "country",
  "couple",
  "course",
  "cousin",
  "cover",
  "coyote",
  "crack",
  "cradle",
  "craft",
  "cram",
  "crane",
  "crash",
  "crater",
  "crawl",
  "crazy",
  "cream",
  "credit",
  "creek",
  "crew",
  "cricket",
  "crime",
  "crisp",
  "critic",
  "crop",
  "cross",
  "crouch",
  "crowd",
  "crucial",
  "cruel",
  "cruise",
  "crumble",
  "crunch",
  "crush",
  "cry",
  "crystal",
  "cube",
  "culture",
  "cup",
  "cupboard",
  "curious",
  "current",
  "curtain",
  "curve",
  "cushion",
  "custom",
  "cute",
  "cycle",
  "dad",
  "damage",
  "damp",
  "dance",
  "danger",
  "daring",
  "dash",
  "daughter",
  "dawn",
  "day",
  "deal",
  "debate",
  "debris",
  "decade",
  "december",
  "decide",
  "decline",
  "decorate",
  "decrease",
  "deer",
  "defense",
  "define",
  "defy",
  "degree",
  "delay",
  "deliver",
  "demand",
  "demise",
  "denial",
  "dentist",
  "deny",
  "depart",
  "depend",
  "deposit",
  "depth",
  "deputy",
  "derive",
  "describe",
  "desert",
  "design",
  "desk",
  "despair",
  "destroy",
  "detail",
  "detect",
  "develop",
  "device",
  "devote",
  "diagram",
  "dial",
  "diamond",
  "diary",
  "dice",
  "diesel",
  "diet",
  "differ",
  "digital",
  "dignity",
  "dilemma",
  "dinner",
  "dinosaur",
  "direct",
  "dirt",
  "disagree",
  "discover",
  "disease",
  "dish",
  "dismiss",
  "disorder",
  "display",
  "distance",
  "divert",
  "divide",
  "divorce",
  "dizzy",
  "doctor",
  "document",
  "dog",
  "doll",
  "dolphin",
  "domain",
  "donate",
  "donkey",
  "donor",
  "door",
  "dose",
  "double",
  "dove",
  "draft",
  "dragon",
  "drama",
  "drastic",
  "draw",
  "dream",
  "dress",
  "drift",
  "drill",
  "drink",
  "drip",
  "drive",
  "drop",
  "drum",
  "dry",
  "duck",
  "dumb",
  "dune",
  "during",
  "dust",
  "dutch",
  "duty",
  "dwarf",
  "dynamic",
  "eager",
  "eagle",
  "early",
  "earn",
  "earth",
  "easily",
  "east",
  "easy",
  "echo",
  "ecology",
  "economy",
  "edge",
  "edit",
  "educate",
  "effort",
  "egg",
  "eight",
  "either",
  "elbow",
  "elder",
  "electric",
  "elegant",
  "element",
  "elephant",
  "elevator",
  "elite",
  "else",
  "embark",
  "embody",
  "embrace",
  "emerge",
  "emotion",
  "employ",
  "empower",
  "empty",
  "enable",
  "enact",
  "end",
  "endless",
  "endorse",
  "enemy",
  "energy",
  "enforce",
  "engage",
  "engine",
  "enhance",
  "enjoy",
  "enlist",
  "enough",
  "enrich",
  "enroll",
  "ensure",
  "enter",
  "entire",
  "entry",
  "envelope",
  "episode",
  "equal",
  "equip",
  "era",
  "erase",
  "erode",
  "erosion",
  "error",
  "erupt",
  "escape",
  "essay",
  "essence",
  "estate",
  "eternal",
  "ethics",
  "evidence",
  "evil",
  "evoke",
  "evolve",
  "exact",
  "example",
  "excess",
  "exchange",
  "excite",
  "exclude",
  "excuse",
  "execute",
  "exercise",
  "exhaust",
  "exhibit",
  "exile",
  "exist",
  "exit",
  "exotic",
  "expand",
  "expect",
  "expire",
  "explain",
  "expose",
  "express",
  "extend",
  "extra",
  "eye",
  "eyebrow",
  "fabric",
  "face",
  "faculty",
  "fade",
  "faint",
  "faith",
  "fall",
  "false",
  "fame",
  "family",
  "famous",
  "fan",
  "fancy",
  "fantasy",
  "farm",
  "fashion",
  "fat",
  "fatal",
  "father",
  "fatigue",
  "fault",
  "favorite",
  "feature",
  "february",
  "federal",
  "fee",
  "feed",
  "feel",
  "female",
  "fence",
  "festival",
  "fetch",
  "fever",
  "few",
  "fiber",
  "fiction",
  "field",
  "figure",
  "file",
  "film",
  "filter",
  "final",
  "find",
  "fine",
  "finger",
  "finish",
  "fire",
  "firm",
  "first",
  "fiscal",
  "fish",
  "fit",
  "fitness",
  "fix",
  "flag",
  "flame",
  "flash",
  "flat",
  "flavor",
  "flee",
  "flight",
  "flip",
  "float",
  "flock",
  "floor",
  "flower",
  "fluid",
  "flush",
  "fly",
  "foam",
  "focus",
  "fog",
  "foil",
  "fold",
  "follow",
  "food",
  "foot",
  "force",
  "forest",
  "forget",
  "fork",
  "fortune",
  "forum",
  "forward",
  "fossil",
  "foster",
  "found",
  "fox",
  "fragile",
  "frame",
  "frequent",
  "fresh",
  "friend",
  "fringe",
  "frog",
  "front",
  "frost",
  "frown",
  "frozen",
  "fruit",
  "fuel",
  "fun",
  "funny",
  "furnace",
  "fury",
  "future",
  "gadget",
  "gain",
  "galaxy",
  "gallery",
  "game",
  "gap",
  "garage",
  "garbage",
  "garden",
  "garlic",
  "garment",
  "gas",
  "gasp",
  "gate",
  "gather",
  "gauge",
  "gaze",
  "general",
  "genius",
  "genre",
  "gentle",
  "genuine",
  "gesture",
  "ghost",
  "giant",
  "gift",
  "giggle",
  "ginger",
  "giraffe",
  "girl",
  "give",
  "glad",
  "glance",
  "glare",
  "glass",
  "glide",
  "glimpse",
  "globe",
  "gloom",
  "glory",
  "glove",
  "glow",
  "glue",
  "goat",
  "goddess",
  "gold",
  "good",
  "goose",
  "gorilla",
  "gospel",
  "gossip",
  "govern",
  "gown",
  "grab",
  "grace",
  "grain",
  "grant",
  "grape",
  "grass",
  "gravity",
  "great",
  "green",
  "grid",
  "grief",
  "grit",
  "grocery",
  "group",
  "grow",
  "grunt",
  "guard",
  "guess",
  "guide",
  "guilt",
  "guitar",
  "gun",
  "gym",
  "habit",
  "hair",
  "half",
  "hammer",
  "hamster",
  "hand",
  "happy",
  "harbor",
  "hard",
  "harsh",
  "harvest",
  "hat",
  "have",
  "hawk",
  "hazard",
  "head",
  "health",
  "heart",
  "heavy",
  "hedgehog",
  "height",
  "hello",
  "helmet",
  "help",
  "hen",
  "hero",
  "hidden",
  "high",
  "hill",
  "hint",
  "hip",
  "hire",
  "history",
  "hobby",
  "hockey",
  "hold",
  "hole",
  "holiday",
  "hollow",
  "home",
  "honey",
  "hood",
  "hope",
  "horn",
  "horror",
  "horse",
  "hospital",
  "host",
  "hotel",
  "hour",
  "hover",
  "hub",
  "huge",
  "human",
  "humble",
  "humor",
  "hundred",
  "hungry",
  "hunt",
  "hurdle",
  "hurry",
  "hurt",
  "husband",
  "hybrid",
  "ice",
  "icon",
  "idea",
  "identify",
  "idle",
  "ignore",
  "ill",
  "illegal",
  "illness",
  "image",
  "imitate",
  "immense",
  "immune",
  "impact",
  "impose",
  "improve",
  "impulse",
  "inch",
  "include",
  "income",
  "increase",
  "index",
  "indicate",
  "indoor",
  "industry",
  "infant",
  "inflict",
  "inform",
  "inhale",
  "inherit",
  "initial",
  "inject",
  "injury",
  "inmate",
  "inner",
  "innocent",
  "input",
  "inquiry",
  "insane",
  "insect",
  "inside",
  "inspire",
  "install",
  "intact",
  "interest",
  "into",
  "invest",
  "invite",
  "involve",
  "iron",
  "island",
  "isolate",
  "issue",
  "item",
  "ivory",
  "jacket",
  "jaguar",
  "jar",
  "jazz",
  "jealous",
  "jeans",
  "jelly",
  "jewel",
  "job",
  "join",
  "joke",
  "journey",
  "joy",
  "judge",
  "juice",
  "jump",
  "jungle",
  "junior",
  "junk",
  "just",
  "kangaroo",
  "keen",
  "keep",
  "ketchup",
  "key",
  "kick",
  "kid",
  "kidney",
  "kind",
  "kingdom",
  "kiss",
  "kit",
  "kitchen",
  "kite",
  "kitten",
  "kiwi",
  "knee",
  "knife",
  "knock",
  "know",
  "lab",
  "label",
  "labor",
  "ladder",
  "lady",
  "lake",
  "lamp",
  "language",
  "laptop",
  "large",
  "later",
  "latin",
  "laugh",
  "laundry",
  "lava",
  "law",
  "lawn",
  "lawsuit",
  "layer",
  "lazy",
  "leader",
  "leaf",
  "learn",
  "leave",
  "lecture",
  "left",
  "leg",
  "legal",
  "legend",
  "leisure",
  "lemon",
  "lend",
  "length",
  "lens",
  "leopard",
  "lesson",
  "letter",
  "level",
  "liar",
  "liberty",
  "library",
  "license",
  "life",
  "lift",
  "light",
  "like",
  "limb",
  "limit",
  "link",
  "lion",
  "liquid",
  "list",
  "little",
  "live",
  "lizard",
  "load",
  "loan",
  "lobster",
  "local",
  "lock",
  "logic",
  "lonely",
  "long",
  "loop",
  "lottery",
  "loud",
  "lounge",
  "love",
  "loyal",
  "lucky",
  "luggage",
  "lumber",
  "lunar",
  "lunch",
  "luxury",
  "lyrics",
  "machine",
  "mad",
  "magic",
  "magnet",
  "maid",
  "mail",
  "main",
  "major",
  "make",
  "mammal",
  "man",
  "manage",
  "mandate",
  "mango",
  "mansion",
  "manual",
  "maple",
  "marble",
  "march",
  "margin",
  "marine",
  "market",
  "marriage",
  "mask",
  "mass",
  "master",
  "match",
  "material",
  "math",
  "matrix",
  "matter",
  "maximum",
  "maze",
  "meadow",
  "mean",
  "measure",
  "meat",
  "mechanic",
  "medal",
  "media",
  "melody",
  "melt",
  "member",
  "memory",
  "mention",
  "menu",
  "mercy",
  "merge",
  "merit",
  "merry",
  "mesh",
  "message",
  "metal",
  "method",
  "middle",
  "midnight",
  "milk",
  "million",
  "mimic",
  "mind",
  "minimum",
  "minor",
  "minute",
  "miracle",
  "mirror",
  "misery",
  "miss",
  "mistake",
  "mix",
  "mixed",
  "mixture",
  "mobile",
  "model",
  "modify",
  "mom",
  "moment",
  "monitor",
  "monkey",
  "monster",
  "month",
  "moon",
  "moral",
  "more",
  "morning",
  "mosquito",
  "mother",
  "motion",
  "motor",
  "mountain",
  "mouse",
  "move",
  "movie",
  "much",
  "muffin",
  "mule",
  "multiply",
  "muscle",
  "museum",
  "mushroom",
  "music",
  "must",
  "mutual",
  "myself",
  "mystery",
  "myth",
  "naive",
  "name",
  "napkin",
  "narrow",
  "nasty",
  "nation",
  "nature",
  "near",
  "neck",
  "need",
  "negative",
  "neglect",
  "neither",
  "nephew",
  "nerve",
  "nest",
  "net",
  "network",
  "neutral",
  "never",
  "news",
  "next",
  "nice",
  "night",
  "noble",
  "noise",
  "nominee",
  "noodle",
  "normal",
  "north",
  "nose",
  "notable",
  "note",
  "nothing",
  "notice",
  "novel",
  "now",
  "nuclear",
  "number",
  "nurse",
  "nut",
  "oak",
  "obey",
  "object",
  "oblige",
  "obscure",
  "observe",
  "obtain",
  "obvious",
  "occur",
  "ocean",
  "october",
  "odor",
  "off",
  "offer",
  "office",
  "often",
  "oil",
  "okay",
  "old",
  "olive",
  "olympic",
  "omit",
  "once",
  "one",
  "onion",
  "online",
  "only",
  "open",
  "opera",
  "opinion",
  "oppose",
  "option",
  "orange",
  "orbit",
  "orchard",
  "order",
  "ordinary",
  "organ",
  "orient",
  "original",
  "orphan",
  "ostrich",
  "other",
  "outdoor",
  "outer",
  "output",
  "outside",
  "oval",
  "oven",
  "over",
  "own",
  "owner",
  "oxygen",
  "oyster",
  "ozone",
  "pact",
  "paddle",
  "page",
  "pair",
  "palace",
  "palm",
  "panda",
  "panel",
  "panic",
  "panther",
  "paper",
  "parade",
  "parent",
  "park",
  "parrot",
  "party",
  "pass",
  "patch",
  "path",
  "patient",
  "patrol",
  "pattern",
  "pause",
  "pave",
  "payment",
  "peace",
  "peanut",
  "pear",
  "peasant",
  "pelican",
  "pen",
  "penalty",
  "pencil",
  "people",
  "pepper",
  "perfect",
  "permit",
  "person",
  "pet",
  "phone",
  "photo",
  "phrase",
  "physical",
  "piano",
  "picnic",
  "picture",
  "piece",
  "pig",
  "pigeon",
  "pill",
  "pilot",
  "pink",
  "pioneer",
  "pipe",
  "pistol",
  "pitch",
  "pizza",
  "place",
  "planet",
  "plastic",
  "plate",
  "play",
  "please",
  "pledge",
  "pluck",
  "plug",
  "plunge",
  "poem",
  "poet",
  "point",
  "polar",
  "pole",
  "police",
  "pond",
  "pony",
  "pool",
  "popular",
  "portion",
  "position",
  "possible",
  "post",
  "potato",
  "pottery",
  "poverty",
  "powder",
  "power",
  "practice",
  "praise",
  "predict",
  "prefer",
  "prepare",
  "present",
  "pretty",
  "prevent",
  "price",
  "pride",
  "primary",
  "print",
  "priority",
  "prison",
  "private",
  "prize",
  "problem",
  "process",
  "produce",
  "profit",
  "program",
  "project",
  "promote",
  "proof",
  "property",
  "prosper",
  "protect",
  "proud",
  "provide",
  "public",
  "pudding",
  "pull",
  "pulp",
  "pulse",
  "pumpkin",
  "punch",
  "pupil",
  "puppy",
  "purchase",
  "purity",
  "purpose",
  "purse",
  "push",
  "put",
  "puzzle",
  "pyramid",
  "quality",
  "quantum",
  "quarter",
  "question",
  "quick",
  "quit",
  "quiz",
  "quote",
  "rabbit",
  "raccoon",
  "race",
  "rack",
  "radar",
  "radio",
  "rail",
  "rain",
  "raise",
  "rally",
  "ramp",
  "ranch",
  "random",
  "range",
  "rapid",
  "rare",
  "rate",
  "rather",
  "raven",
  "raw",
  "razor",
  "ready",
  "real",
  "reason",
  "rebel",
  "rebuild",
  "recall",
  "receive",
  "recipe",
  "record",
  "recycle",
  "reduce",
  "reflect",
  "reform",
  "refuse",
  "region",
  "regret",
  "regular",
  "reject",
  "relax",
  "release",
  "relief",
  "rely",
  "remain",
  "remember",
  "remind",
  "remove",
  "render",
  "renew",
  "rent",
  "reopen",
  "repair",
  "repeat",
  "replace",
  "report",
  "require",
  "rescue",
  "resemble",
  "resist",
  "resource",
  "response",
  "result",
  "retire",
  "retreat",
  "return",
  "reunion",
  "reveal",
  "review",
  "reward",
  "rhythm",
  "rib",
  "ribbon",
  "rice",
  "rich",
  "ride",
  "ridge",
  "rifle",
  "right",
  "rigid",
  "ring",
  "riot",
  "ripple",
  "risk",
  "ritual",
  "rival",
  "river",
  "road",
  "roast",
  "robot",
  "robust",
  "rocket",
  "romance",
  "roof",
  "rookie",
  "room",
  "rose",
  "rotate",
  "rough",
  "round",
  "route",
  "royal",
  "rubber",
  "rude",
  "rug",
  "rule",
  "run",
  "runway",
  "rural",
  "sad",
  "saddle",
  "sadness",
  "safe",
  "sail",
  "salad",
  "salmon",
  "salon",
  "salt",
  "salute",
  "same",
  "sample",
  "sand",
  "satisfy",
  "satoshi",
  "sauce",
  "sausage",
  "save",
  "say",
  "scale",
  "scan",
  "scare",
  "scatter",
  "scene",
  "scheme",
  "school",
  "science",
  "scissors",
  "scorpion",
  "scout",
  "scrap",
  "screen",
  "script",
  "scrub",
  "sea",
  "search",
  "season",
  "seat",
  "second",
  "secret",
  "section",
  "security",
  "seed",
  "seek",
  "segment",
  "select",
  "sell",
  "seminar",
  "senior",
  "sense",
  "sentence",
  "series",
  "service",
  "session",
  "settle",
  "setup",
  "seven",
  "shadow",
  "shaft",
  "shallow",
  "share",
  "shed",
  "shell",
  "sheriff",
  "shield",
  "shift",
  "shine",
  "ship",
  "shiver",
  "shock",
  "shoe",
  "shoot",
  "shop",
  "short",
  "shoulder",
  "shove",
  "shrimp",
  "shrug",
  "shuffle",
  "shy",
  "sibling",
  "sick",
  "side",
  "siege",
  "sight",
  "sign",
  "silent",
  "silk",
  "silly",
  "silver",
  "similar",
  "simple",
  "since",
  "sing",
  "siren",
  "sister",
  "situate",
  "six",
  "size",
  "skate",
  "sketch",
  "ski",
  "skill",
  "skin",
  "skirt",
  "skull",
  "slab",
  "slam",
  "sleep",
  "slender",
  "slice",
  "slide",
  "slight",
  "slim",
  "slogan",
  "slot",
  "slow",
  "slush",
  "small",
  "smart",
  "smile",
  "smoke",
  "smooth",
  "snack",
  "snake",
  "snap",
  "sniff",
  "snow",
  "soap",
  "soccer",
  "social",
  "sock",
  "soda",
  "soft",
  "solar",
  "soldier",
  "solid",
  "solution",
  "solve",
  "someone",
  "song",
  "soon",
  "sorry",
  "sort",
  "soul",
  "sound",
  "soup",
  "source",
  "south",
  "space",
  "spare",
  "spatial",
  "spawn",
  "speak",
  "special",
  "speed",
  "spell",
  "spend",
  "sphere",
  "spice",
  "spider",
  "spike",
  "spin",
  "spirit",
  "split",
  "spoil",
  "sponsor",
  "spoon",
  "sport",
  "spot",
  "spray",
  "spread",
  "spring",
  "spy",
  "square",
  "squeeze",
  "squirrel",
  "stable",
  "stadium",
  "staff",
  "stage",
  "stairs",
  "stamp",
  "stand",
  "start",
  "state",
  "stay",
  "steak",
  "steel",
  "stem",
  "step",
  "stereo",
  "stick",
  "still",
  "sting",
  "stock",
  "stomach",
  "stone",
  "stool",
  "story",
  "stove",
  "strategy",
  "street",
  "strike",
  "strong",
  "struggle",
  "student",
  "stuff",
  "stumble",
  "style",
  "subject",
  "submit",
  "subway",
  "success",
  "such",
  "sudden",
  "suffer",
  "sugar",
  "suggest",
  "suit",
  "summer",
  "sun",
  "sunny",
  "sunset",
  "super",
  "supply",
  "supreme",
  "sure",
  "surface",
  "surge",
  "surprise",
  "surround",
  "survey",
  "suspect",
  "sustain",
  "swallow",
  "swamp",
  "swap",
  "swarm",
  "swear",
  "sweet",
  "swift",
  "swim",
  "swing",
  "switch",
  "sword",
  "symbol",
  "symptom",
  "syrup",
  "system",
  "table",
  "tackle",
  "tag",
  "tail",
  "talent",
  "talk",
  "tank",
  "tape",
  "target",
  "task",
  "taste",
  "tattoo",
  "taxi",
  "teach",
  "team",
  "tell",
  "ten",
  "tenant",
  "tennis",
  "tent",
  "term",
  "test",
  "text",
  "thank",
  "that",
  "theme",
  "then",
  "theory",
  "there",
  "they",
  "thing",
  "this",
  "thought",
  "three",
  "thrive",
  "throw",
  "thumb",
  "thunder",
  "ticket",
  "tide",
  "tiger",
  "tilt",
  "timber",
  "time",
  "tiny",
  "tip",
  "tired",
  "tissue",
  "title",
  "toast",
  "tobacco",
  "today",
  "toddler",
  "toe",
  "together",
  "toilet",
  "token",
  "tomato",
  "tomorrow",
  "tone",
  "tongue",
  "tonight",
  "tool",
  "tooth",
  "top",
  "topic",
  "topple",
  "torch",
  "tornado",
  "tortoise",
  "toss",
  "total",
  "tourist",
  "toward",
  "tower",
  "town",
  "toy",
  "track",
  "trade",
  "traffic",
  "tragic",
  "train",
  "transfer",
  "trap",
  "trash",
  "travel",
  "tray",
  "treat",
  "tree",
  "trend",
  "trial",
  "tribe",
  "trick",
  "trigger",
  "trim",
  "trip",
  "trophy",
  "trouble",
  "truck",
  "true",
  "truly",
  "trumpet",
  "trust",
  "truth",
  "try",
  "tube",
  "tuition",
  "tumble",
  "tuna",
  "tunnel",
  "turkey",
  "turn",
  "turtle",
  "twelve",
  "twenty",
  "twice",
  "twin",
  "twist",
  "two",
  "type",
  "typical",
  "ugly",
  "umbrella",
  "unable",
  "unaware",
  "uncle",
  "uncover",
  "under",
  "undo",
  "unfair",
  "unfold",
  "unhappy",
  "uniform",
  "unique",
  "unit",
  "universe",
  "unknown",
  "unlock",
  "until",
  "unusual",
  "unveil",
  "update",
  "upgrade",
  "uphold",
  "upon",
  "upper",
  "upset",
  "urban",
  "urge",
  "usage",
  "use",
  "used",
  "useful",
  "useless",
  "usual",
  "utility",
  "vacant",
  "vacuum",
  "vague",
  "valid",
  "valley",
  "valve",
  "van",
  "vanish",
  "vapor",
  "various",
  "vast",
  "vault",
  "vehicle",
  "velvet",
  "vendor",
  "venture",
  "venue",
  "verb",
  "verify",
  "version",
  "very",
  "vessel",
  "veteran",
  "viable",
  "vibrant",
  "vicious",
  "victory",
  "video",
  "view",
  "village",
  "vintage",
  "violin",
  "virtual",
  "virus",
  "visa",
  "visit",
  "visual",
  "vital",
  "vivid",
  "vocal",
  "voice",
  "void",
  "volcano",
  "volume",
  "vote",
  "voyage",
  "wage",
  "wagon",
  "wait",
  "walk",
  "wall",
  "walnut",
  "want",
  "warfare",
  "warm",
  "warrior",
  "wash",
  "wasp",
  "waste",
  "water",
  "wave",
  "way",
  "wealth",
  "weapon",
  "wear",
  "weasel",
  "weather",
  "web",
  "wedding",
  "weekend",
  "weird",
  "welcome",
  "west",
  "wet",
  "whale",
  "what",
  "wheat",
  "wheel",
  "when",
  "where",
  "whip",
  "whisper",
  "wide",
  "width",
  "wife",
  "wild",
  "will",
  "win",
  "window",
  "wine",
  "wing",
  "wink",
  "winner",
  "winter",
  "wire",
  "wisdom",
  "wise",
  "wish",
  "witness",
  "wolf",
  "woman",
  "wonder",
  "wood",
  "wool",
  "word",
  "work",
  "world",
  "worry",
  "worth",
  "wrap",
  "wreck",
  "wrestle",
  "wrist",
  "write",
  "wrong",
  "yard",
  "year",
  "yellow",
  "you",
  "young",
  "youth",
  "zebra",
  "zero",
  "zone",
  "zoo"
];
var Language = ((Language2) => {
  Language2["english"] = "english";
  return Language2;
})(Language || {});

// node_modules/@fuel-ts/mnemonic/dist/index.mjs
function toUtf8Bytes(stri) {
  const str = stri.normalize("NFKD");
  const result = [];
  for (let i = 0; i < str.length; i += 1) {
    const c = str.charCodeAt(i);
    if (c < 128) {
      result.push(c);
    } else if (c < 2048) {
      result.push(c >> 6 | 192);
      result.push(c & 63 | 128);
    } else if ((c & 64512) === 55296) {
      i += 1;
      const c2 = str.charCodeAt(i);
      if (i >= str.length || (c2 & 64512) !== 56320) {
        throw new FuelError(
          ErrorCode.INVALID_INPUT_PARAMETERS,
          "Invalid UTF-8 in the input string."
        );
      }
      const pair = 65536 + ((c & 1023) << 10) + (c2 & 1023);
      result.push(pair >> 18 | 240);
      result.push(pair >> 12 & 63 | 128);
      result.push(pair >> 6 & 63 | 128);
      result.push(pair & 63 | 128);
    } else {
      result.push(c >> 12 | 224);
      result.push(c >> 6 & 63 | 128);
      result.push(c & 63 | 128);
    }
  }
  return Uint8Array.from(result);
}
function getLowerMask(bits) {
  return (1 << bits) - 1;
}
function getUpperMask(bits) {
  return (1 << bits) - 1 << 8 - bits;
}
function getWords(mnemonic) {
  if (!Array.isArray(mnemonic)) {
    return mnemonic.split(/\s+/);
  }
  return mnemonic;
}
function getPhrase(mnemonic) {
  if (Array.isArray(mnemonic)) {
    return mnemonic.join(" ");
  }
  return mnemonic;
}
function entropyToMnemonicIndices(entropy) {
  const indices = [0];
  let remainingBits = 11;
  for (let i = 0; i < entropy.length; i += 1) {
    if (remainingBits > 8) {
      indices[indices.length - 1] <<= 8;
      indices[indices.length - 1] |= entropy[i];
      remainingBits -= 8;
    } else {
      indices[indices.length - 1] <<= remainingBits;
      indices[indices.length - 1] |= entropy[i] >> 8 - remainingBits;
      indices.push(entropy[i] & getLowerMask(8 - remainingBits));
      remainingBits += 3;
    }
  }
  const checksumBits = entropy.length / 4;
  const checksum = getBytesCopy(sha256(entropy))[0] & getUpperMask(checksumBits);
  indices[indices.length - 1] <<= checksumBits;
  indices[indices.length - 1] |= checksum >> 8 - checksumBits;
  return indices;
}
function mnemonicWordsToEntropy(words, wordlist) {
  const size = Math.ceil(11 * words.length / 8);
  const entropy = getBytesCopy(new Uint8Array(size));
  let offset = 0;
  for (let i = 0; i < words.length; i += 1) {
    const index = wordlist.indexOf(words[i].normalize("NFKD"));
    if (index === -1) {
      throw new FuelError(
        ErrorCode.INVALID_MNEMONIC,
        `Invalid mnemonic: the word '${words[i]}' is not found in the provided wordlist.`
      );
    }
    for (let bit = 0; bit < 11; bit += 1) {
      if (index & 1 << 10 - bit) {
        entropy[offset >> 3] |= 1 << 7 - offset % 8;
      }
      offset += 1;
    }
  }
  const entropyBits = 32 * words.length / 3;
  const checksumBits = words.length / 3;
  const checksumMask = getUpperMask(checksumBits);
  const checksum = getBytesCopy(sha256(entropy.slice(0, entropyBits / 8)))[0] & checksumMask;
  if (checksum !== (entropy[entropy.length - 1] & checksumMask)) {
    throw new FuelError(
      ErrorCode.INVALID_CHECKSUM,
      "Checksum validation failed for the provided mnemonic."
    );
  }
  return entropy.slice(0, entropyBits / 8);
}
var MasterSecret = toUtf8Bytes("Bitcoin seed");
var MainnetPRV = "0x0488ade4";
var TestnetPRV = "0x04358394";
var MNEMONIC_SIZES = [12, 15, 18, 21, 24];
function assertWordList(wordlist) {
  if (wordlist.length !== 2048) {
    throw new FuelError(
      ErrorCode.INVALID_WORD_LIST,
      `Expected word list length of 2048, but got ${wordlist.length}.`
    );
  }
}
function assertEntropy(entropy) {
  if (entropy.length % 4 !== 0 || entropy.length < 16 || entropy.length > 32) {
    throw new FuelError(
      ErrorCode.INVALID_ENTROPY,
      `Entropy should be between 16 and 32 bytes and a multiple of 4, but got ${entropy.length} bytes.`
    );
  }
}
function assertMnemonic(words) {
  if (!MNEMONIC_SIZES.includes(words.length)) {
    const errorMsg = `Invalid mnemonic size. Expected one of [${MNEMONIC_SIZES.join(
      ", "
    )}] words, but got ${words.length}.`;
    throw new FuelError(ErrorCode.INVALID_MNEMONIC, errorMsg);
  }
}
var Mnemonic = class {
  /**
   *
   * @param wordlist - Provide a wordlist with the list of words used to generate the mnemonic phrase. The default value is the English list.
   * @returns Mnemonic instance
   */
  constructor(wordlist = english) {
    __publicField(this, "wordlist");
    this.wordlist = wordlist;
    assertWordList(this.wordlist);
  }
  /**
   *
   * @param phrase - Mnemonic phrase composed by words from the provided wordlist
   * @returns Entropy hash
   */
  mnemonicToEntropy(phrase) {
    return Mnemonic.mnemonicToEntropy(phrase, this.wordlist);
  }
  /**
   *
   * @param entropy - Entropy source to the mnemonic phrase.
   * @returns Mnemonic phrase
   */
  entropyToMnemonic(entropy) {
    return Mnemonic.entropyToMnemonic(entropy, this.wordlist);
  }
  /**
   *
   * @param phrase - Mnemonic phrase composed by words from the provided wordlist
   * @param wordlist - Provide a wordlist with the list of words used to generate the mnemonic phrase. The default value is the English list.
   * @returns Mnemonic phrase
   */
  static mnemonicToEntropy(phrase, wordlist = english) {
    const words = getWords(phrase);
    assertMnemonic(words);
    return hexlify(mnemonicWordsToEntropy(words, wordlist));
  }
  /**
   * @param entropy - Entropy source to the mnemonic phrase.
   * @param testnet - Inform if should use testnet or mainnet prefix, default value is true (`mainnet`).
   * @returns 64-byte array contains privateKey and chainCode as described on BIP39
   */
  static entropyToMnemonic(entropy, wordlist = english) {
    const entropyBytes = getBytesCopy(entropy);
    assertWordList(wordlist);
    assertEntropy(entropyBytes);
    return entropyToMnemonicIndices(entropyBytes).map((i) => wordlist[i]).join(" ");
  }
  /**
   * @param phrase - Mnemonic phrase composed by words from the provided wordlist
   * @param passphrase - Add additional security to protect the generated seed with a memorized passphrase. `Note: if the owner forgot the passphrase, all wallets and accounts derive from the phrase will be lost.`
   * @returns 64-byte array contains privateKey and chainCode as described on BIP39
   */
  static mnemonicToSeed(phrase, passphrase = "") {
    assertMnemonic(getWords(phrase));
    const phraseBytes = toUtf8Bytes(getPhrase(phrase));
    const salt = toUtf8Bytes(`mnemonic${passphrase}`);
    return pbkdf2(phraseBytes, salt, 2048, 64, "sha512");
  }
  /**
   * @param phrase - Mnemonic phrase composed by words from the provided wordlist
   * @param passphrase - Add additional security to protect the generated seed with a memorized passphrase. `Note: if the owner forgot the passphrase, all wallets and accounts derive from the phrase will be lost.`
   * @returns 64-byte array contains privateKey and chainCode as described on BIP39
   */
  static mnemonicToMasterKeys(phrase, passphrase = "") {
    const seed = Mnemonic.mnemonicToSeed(phrase, passphrase);
    return Mnemonic.masterKeysFromSeed(seed);
  }
  /**
   * Validates if given mnemonic is  valid
   * @param phrase - Mnemonic phrase composed by words from the provided wordlist
   * @returns true if phrase is a valid mnemonic
   */
  static isMnemonicValid(phrase) {
    const words = getWords(phrase);
    let i = 0;
    try {
      assertMnemonic(words);
    } catch {
      return false;
    }
    while (i < words.length) {
      if (Mnemonic.binarySearch(words[i]) === false)
        return false;
      i += 1;
    }
    return true;
  }
  static binarySearch(target) {
    const words = english;
    let left = 0;
    let right = words.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (words[mid] === target)
        return true;
      if (target < words[mid])
        right = mid - 1;
      else
        left = mid + 1;
    }
    return false;
  }
  /**
   * @param seed - BIP39 seed
   * @param testnet - Inform if should use testnet or mainnet prefix, the default value is true (`mainnet`).
   * @returns 64-byte array contains privateKey and chainCode as described on BIP39
   */
  static masterKeysFromSeed(seed) {
    const seedArray = getBytesCopy(seed);
    if (seedArray.length < 16 || seedArray.length > 64) {
      throw new FuelError(
        ErrorCode.INVALID_SEED,
        `Seed length should be between 16 and 64 bytes, but received ${seedArray.length} bytes.`
      );
    }
    return getBytesCopy(computeHmac("sha512", MasterSecret, seedArray));
  }
  /**
   * Get the extendKey as defined on BIP-32 from the provided seed
   *
   * @param seed - BIP39 seed
   * @param testnet - Inform if should use testnet or mainnet prefix, default value is true (`mainnet`).
   * @returns BIP-32 extended private key
   */
  static seedToExtendedKey(seed, testnet = false) {
    const masterKey = Mnemonic.masterKeysFromSeed(seed);
    const prefix = getBytesCopy(testnet ? TestnetPRV : MainnetPRV);
    const depth = "0x00";
    const fingerprint = "0x00000000";
    const index = "0x00000000";
    const chainCode = masterKey.slice(32);
    const privateKey = masterKey.slice(0, 32);
    const extendedKey = concat([
      prefix,
      depth,
      fingerprint,
      index,
      chainCode,
      concat(["0x00", privateKey])
    ]);
    const checksum = dataSlice(sha256(sha256(extendedKey)), 0, 4);
    return encodeBase58(concat([extendedKey, checksum]));
  }
  /**
   *  Create a new mnemonic using a randomly generated number as entropy.
   *  As defined in BIP39, the entropy must be a multiple of 32 bits, and its size must be between 128 and 256 bits.
   *  Therefore, the possible values for `strength` are 128, 160, 192, 224, and 256.
   *  If not provided, the default entropy length will be set to 256 bits.
   *  The return is a list of words that encodes the generated entropy.
   *
   *
   * @param size - Number of bytes used as an entropy
   * @param extraEntropy - Optional extra entropy to increase randomness
   * @returns A randomly generated mnemonic
   */
  static generate(size = 32, extraEntropy = "") {
    const entropy = extraEntropy ? sha256(concat([randomBytes2(size), getBytesCopy(extraEntropy)])) : randomBytes2(size);
    return Mnemonic.entropyToMnemonic(entropy);
  }
};
var mnemonic_default = Mnemonic;

// node_modules/@fuel-ts/hdwallet/dist/index.mjs
var HARDENED_INDEX = 2147483648;
var MainnetPRV2 = hexlify("0x0488ade4");
var MainnetPUB = hexlify("0x0488b21e");
var TestnetPRV2 = hexlify("0x04358394");
var TestnetPUB = hexlify("0x043587cf");
function base58check(data) {
  return encodeBase58(concat([data, dataSlice(sha256(sha256(data)), 0, 4)]));
}
function getExtendedKeyPrefix(isPublic = false, testnet = false) {
  if (isPublic) {
    return testnet ? TestnetPUB : MainnetPUB;
  }
  return testnet ? TestnetPRV2 : MainnetPRV2;
}
function isPublicExtendedKey(extendedKey) {
  return [MainnetPUB, TestnetPUB].includes(hexlify(extendedKey.slice(0, 4)));
}
function isValidExtendedKey(extendedKey) {
  return [MainnetPRV2, TestnetPRV2, MainnetPUB, TestnetPUB].includes(
    hexlify(extendedKey.slice(0, 4))
  );
}
function parsePath(path, depth = 0) {
  const components = path.split("/");
  if (components.length === 0 || components[0] === "m" && depth !== 0) {
    throw new FuelError(ErrorCode.HD_WALLET_ERROR, `invalid path - ${path}`);
  }
  if (components[0] === "m") {
    components.shift();
  }
  return components.map(
    (p) => ~p.indexOf(`'`) ? parseInt(p, 10) + HARDENED_INDEX : parseInt(p, 10)
  );
}
var HDWallet = class {
  /**
   * HDWallet is a implementation of the BIP-0044 and BIP-0032, Multi-Account Hierarchy for Deterministic Wallets
   *
   * @param config - Wallet configurations
   */
  constructor(config) {
    __publicField(this, "depth", 0);
    __publicField(this, "index", 0);
    __publicField(this, "fingerprint", hexlify("0x00000000"));
    __publicField(this, "parentFingerprint", hexlify("0x00000000"));
    __publicField(this, "privateKey");
    __publicField(this, "publicKey");
    __publicField(this, "chainCode");
    if (config.privateKey) {
      const signer = new signer_default(config.privateKey);
      this.publicKey = hexlify(signer.compressedPublicKey);
      this.privateKey = hexlify(config.privateKey);
    } else {
      if (!config.publicKey) {
        throw new FuelError(
          ErrorCode.HD_WALLET_ERROR,
          "Both public and private Key cannot be missing. At least one should be provided."
        );
      }
      this.publicKey = hexlify(config.publicKey);
    }
    this.parentFingerprint = config.parentFingerprint || this.parentFingerprint;
    this.fingerprint = dataSlice(ripemd160(sha256(this.publicKey)), 0, 4);
    this.depth = config.depth || this.depth;
    this.index = config.index || this.index;
    this.chainCode = config.chainCode;
  }
  get extendedKey() {
    return this.toExtendedKey();
  }
  /**
   * Derive the current HDWallet instance navigating only on the index.
   * `Ex.: m/44'/0 -> Ex.: m/44'/1 -> m/44'/2`. [Learn more](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
   *
   * @param index - Index of the child HDWallet.
   * @returns A new instance of HDWallet on the derived index
   */
  deriveIndex(index) {
    const privateKey = this.privateKey && getBytesCopy(this.privateKey);
    const publicKey = getBytesCopy(this.publicKey);
    const chainCode = getBytesCopy(this.chainCode);
    const data = new Uint8Array(37);
    if (index & HARDENED_INDEX) {
      if (!privateKey) {
        throw new FuelError(
          ErrorCode.HD_WALLET_ERROR,
          "Cannot derive a hardened index without a private Key."
        );
      }
      data.set(privateKey, 1);
    } else {
      data.set(getBytesCopy(this.publicKey));
    }
    data.set(toBytes(index, 4), 33);
    const bytes = getBytesCopy(computeHmac("sha512", chainCode, data));
    const IL = bytes.slice(0, 32);
    const IR = bytes.slice(32);
    if (privateKey) {
      const N = "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141";
      const ki = bn(IL).add(privateKey).mod(N).toBytes(32);
      return new HDWallet({
        privateKey: ki,
        chainCode: IR,
        index,
        depth: this.depth + 1,
        parentFingerprint: this.fingerprint
      });
    }
    const signer = new signer_default(hexlify(IL));
    const Ki = signer.addPoint(publicKey);
    return new HDWallet({
      publicKey: Ki,
      chainCode: IR,
      index,
      depth: this.depth + 1,
      parentFingerprint: this.fingerprint
    });
  }
  /**
   * Derive the current HDWallet instance to the path. [Learn more](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki)
   *
   * @param path - The string representation of the child HDWallet. `Ex.: m/44'/0'/0'/0/0`
   * @returns A new instance of HDWallet on the derived path
   */
  derivePath(path) {
    const paths = parsePath(path, this.depth);
    return paths.reduce((hdwallet, index) => hdwallet.deriveIndex(index), this);
  }
  /**
   * Get the extendKey as defined on BIP-32 from the provided seed
   *
   * @param isPublic - enable to export public extendedKey, it not required when HDWallet didn't have the privateKey.
   * @param testnet - Inform if should use testnet or mainnet prefix, default value is true (`mainnet`).
   * @returns BIP-32 extended private key
   */
  toExtendedKey(isPublic = false, testnet = false) {
    if (this.depth >= 256) {
      throw new FuelError(
        ErrorCode.HD_WALLET_ERROR,
        `Exceeded max depth of 255. Current depth: ${this.depth}.`
      );
    }
    const prefix = getExtendedKeyPrefix(this.privateKey == null || isPublic, testnet);
    const depth = hexlify(Uint8Array.from([this.depth]));
    const parentFingerprint = this.parentFingerprint;
    const index = toHex(this.index, 4);
    const chainCode = this.chainCode;
    const key = this.privateKey != null && !isPublic ? concat(["0x00", this.privateKey]) : this.publicKey;
    const extendedKey = getBytesCopy(
      concat([prefix, depth, parentFingerprint, index, chainCode, key])
    );
    return base58check(extendedKey);
  }
  /**
   * Create HDWallet instance from seed
   *
   * @param seed - Seed
   * @returns A new instance of HDWallet
   */
  static fromSeed(seed) {
    const masterKey = mnemonic_default.masterKeysFromSeed(seed);
    return new HDWallet({
      chainCode: getBytesCopy(masterKey.slice(32)),
      privateKey: getBytesCopy(masterKey.slice(0, 32))
    });
  }
  static fromExtendedKey(extendedKey) {
    const decoded = toBeHex(decodeBase58(extendedKey));
    const bytes = getBytesCopy(decoded);
    const validChecksum = base58check(bytes.slice(0, 78)) === extendedKey;
    if (bytes.length !== 82 || !isValidExtendedKey(bytes)) {
      throw new FuelError(ErrorCode.HD_WALLET_ERROR, "Provided key is not a valid extended key.");
    }
    if (!validChecksum)
      throw new FuelError(ErrorCode.HD_WALLET_ERROR, "Provided key has an invalid checksum.");
    const depth = bytes[4];
    const parentFingerprint = hexlify(bytes.slice(5, 9));
    const index = parseInt(hexlify(bytes.slice(9, 13)).substring(2), 16);
    const chainCode = hexlify(bytes.slice(13, 45));
    const key = bytes.slice(45, 78);
    if (depth === 0 && parentFingerprint !== "0x00000000" || depth === 0 && index !== 0) {
      throw new FuelError(
        ErrorCode.HD_WALLET_ERROR,
        "Inconsistency detected: Depth is zero but fingerprint/index is non-zero."
      );
    }
    if (isPublicExtendedKey(bytes)) {
      if (key[0] !== 3) {
        throw new FuelError(ErrorCode.HD_WALLET_ERROR, "Invalid public extended key.");
      }
      return new HDWallet({
        publicKey: key,
        chainCode,
        index,
        depth,
        parentFingerprint
      });
    }
    if (key[0] !== 0) {
      throw new FuelError(ErrorCode.HD_WALLET_ERROR, "Invalid private extended key.");
    }
    return new HDWallet({
      privateKey: key.slice(1),
      chainCode,
      index,
      depth,
      parentFingerprint
    });
  }
};
var hdwallet_default = HDWallet;

// node_modules/@fuel-ts/wallet/dist/index.mjs
var __defProp2 = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField2 = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var composeScriptForTransferringToContract = async () => {
  await initWasm();
  const gtf2 = gtf(16, 0, GTFArgs.ScriptData);
  const addi2 = addi(17, 16, 32);
  const lw2 = lw(18, 17, 0);
  const addi22 = addi(19, 17, 8);
  const tr2 = tr(16, 18, 19);
  const ret2 = ret(1);
  const script = Uint8Array.from([
    ...gtf2.to_bytes(),
    ...addi2.to_bytes(),
    ...lw2.to_bytes(),
    ...addi22.to_bytes(),
    ...tr2.to_bytes(),
    ...ret2.to_bytes()
  ]);
  return script;
};
var formatScriptDataForTransferringToContract = (hexelifiedContractId, amountToTransfer, assetId) => {
  const numberCoder = new NumberCoder("u16");
  const encoded = numberCoder.encode(new BN(amountToTransfer).toNumber());
  const scriptData = Uint8Array.from([
    ...getBytesCopy(hexelifiedContractId),
    ...encoded,
    ...getBytesCopy(assetId)
  ]);
  return scriptData;
};
var Account = class extends AbstractAccount {
  /**
   * Creates a new Account instance.
   *
   * @param address - The address of the account.
   * @param provider - A Provider instance.
   */
  constructor(address, provider) {
    super();
    /**
     * The address associated with the account.
     */
    __publicField(this, "address");
    /**
     * The provider used to interact with the network.
     */
    __publicField(this, "provider");
    this.provider = provider;
    this.address = Address.fromDynamicInput(address);
  }
  /**
   * Changes the provider connection for the account.
   *
   * @param provider - A Provider instance.
   * @returns The updated Provider instance.
   */
  connect(provider) {
    this.provider = provider;
    return this.provider;
  }
  /**
   * Retrieves resources satisfying the spend query for the account.
   *
   * @param quantities - IDs of coins to exclude.
   * @param excludedIds - IDs of resources to be excluded from the query.
   * @returns A promise that resolves to an array of Resources.
   */
  async getResourcesToSpend(quantities, excludedIds) {
    return this.provider.getResourcesToSpend(this.address, quantities, excludedIds);
  }
  /**
   * Retrieves coins owned by the account.
   *
   * @param assetId - The asset ID of the coins to retrieve.
   * @returns A promise that resolves to an array of Coins.
   */
  async getCoins(assetId) {
    const coins = [];
    const pageSize = 9999;
    let cursor;
    for (; ; ) {
      const pageCoins = await this.provider.getCoins(this.address, assetId, {
        first: pageSize,
        after: cursor
      });
      coins.push(...pageCoins);
      const hasNextPage = pageCoins.length >= pageSize;
      if (!hasNextPage) {
        break;
      }
      throw new FuelError(
        ErrorCode.NOT_SUPPORTED,
        `Wallets containing more than ${pageSize} coins exceed the current supported limit.`
      );
    }
    return coins;
  }
  /**
   * Retrieves messages owned by the account.
   *
   * @returns A promise that resolves to an array of Messages.
   */
  async getMessages() {
    const messages = [];
    const pageSize = 9999;
    let cursor;
    for (; ; ) {
      const pageMessages = await this.provider.getMessages(this.address, {
        first: pageSize,
        after: cursor
      });
      messages.push(...pageMessages);
      const hasNextPage = pageMessages.length >= pageSize;
      if (!hasNextPage) {
        break;
      }
      throw new FuelError(
        ErrorCode.NOT_SUPPORTED,
        `Wallets containing more than ${pageSize} messages exceed the current supported limit.`
      );
    }
    return messages;
  }
  /**
   * Retrieves the balance of the account for the given asset.
   *
   * @param assetId - The asset ID to check the balance for.
   * @returns A promise that resolves to the balance amount.
   */
  async getBalance(assetId = BaseAssetId) {
    const amount = await this.provider.getBalance(this.address, assetId);
    return amount;
  }
  /**
   * Retrieves all the balances for the account.
   *
   * @returns A promise that resolves to an array of Coins and their quantities.
   */
  async getBalances() {
    const balances = [];
    const pageSize = 9999;
    let cursor;
    for (; ; ) {
      const pageBalances = await this.provider.getBalances(this.address, {
        first: pageSize,
        after: cursor
      });
      balances.push(...pageBalances);
      const hasNextPage = pageBalances.length >= pageSize;
      if (!hasNextPage) {
        break;
      }
      throw new FuelError(
        ErrorCode.NOT_SUPPORTED,
        `Wallets containing more than ${pageSize} balances exceed the current supported limit.`
      );
    }
    return balances;
  }
  /**
   * Adds resources to the transaction enough to fund it.
   *
   * @param request - The transaction request.
   * @returns A promise that resolves when the resources are added to the transaction.
   */
  async fund(request) {
    const { gasPriceFactor } = this.provider.getGasConfig();
    const fee = request.calculateFee(gasPriceFactor);
    const resources = await this.getResourcesToSpend([fee]);
    request.addResources(resources);
  }
  /**
   * Transfers coins to a destination address.
   *
   * @param destination - The address of the destination.
   * @param amount - The amount of coins to transfer.
   * @param assetId - The asset ID of the coins to transfer.
   * @param txParams - The transaction parameters (gasLimit, gasPrice, maturity).
   * @returns A promise that resolves to the transaction response.
   */
  async transfer(destination, amount, assetId = BaseAssetId, txParams = {}) {
    const { maxGasPerTx } = this.provider.getGasConfig();
    const params = { gasLimit: maxGasPerTx, ...txParams };
    const request = new ScriptTransactionRequest(params);
    request.addCoinOutput(destination, amount, assetId);
    const { gasPriceFactor } = this.provider.getGasConfig();
    const fee = request.calculateFee(gasPriceFactor);
    let quantities = [];
    if (fee.assetId === hexlify(assetId)) {
      fee.amount = fee.amount.add(amount);
      quantities = [fee];
    } else {
      quantities = [[amount, assetId], fee];
    }
    const resources = await this.getResourcesToSpend(quantities);
    request.addResources(resources);
    return this.sendTransaction(request);
  }
  /**
   * Transfers coins to a contract address.
   *
   * @param contractId - The address of the contract.
   * @param amount - The amount of coins to transfer.
   * @param assetId - The asset ID of the coins to transfer.
   * @param txParams - The optional transaction parameters.
   * @returns A promise that resolves to the transaction response.
   */
  async transferToContract(contractId, amount, assetId = BaseAssetId, txParams = {}) {
    const script = await composeScriptForTransferringToContract();
    const scriptData = formatScriptDataForTransferringToContract(
      contractId.toB256(),
      amount,
      assetId
    );
    const { maxGasPerTx } = this.provider.getGasConfig();
    const request = new ScriptTransactionRequest({
      gasLimit: maxGasPerTx,
      ...txParams,
      script,
      scriptData
    });
    request.addContractInputAndOutput(contractId);
    const { gasPriceFactor } = this.provider.getGasConfig();
    const fee = request.calculateFee(gasPriceFactor);
    let quantities = [];
    if (fee.assetId === hexlify(assetId)) {
      fee.amount = fee.amount.add(amount);
      quantities = [fee];
    } else {
      quantities = [[amount, assetId], fee];
    }
    const resources = await this.getResourcesToSpend(quantities);
    request.addResources(resources);
    return this.sendTransaction(request);
  }
  /**
   * Withdraws an amount of the base asset to the base chain.
   *
   * @param recipient - Address of the recipient on the base chain.
   * @param amount - Amount of base asset.
   * @param txParams - The optional transaction parameters.
   * @returns A promise that resolves to the transaction response.
   */
  async withdrawToBaseLayer(recipient, amount, txParams = {}) {
    const recipientDataArray = getBytesCopy(
      "0x".concat(recipient.toHexString().substring(2).padStart(64, "0"))
    );
    const amountDataArray = getBytesCopy(
      "0x".concat(bn(amount).toHex().substring(2).padStart(16, "0"))
    );
    const script = new Uint8Array([
      ...getBytesCopy(withdrawScript.bytes),
      ...recipientDataArray,
      ...amountDataArray
    ]);
    const { maxGasPerTx } = this.provider.getGasConfig();
    const params = { script, gasLimit: maxGasPerTx, ...txParams };
    const request = new ScriptTransactionRequest(params);
    const { gasPriceFactor } = this.provider.getGasConfig();
    const fee = request.calculateFee(gasPriceFactor);
    let quantities = [];
    fee.amount = fee.amount.add(amount);
    quantities = [fee];
    const resources = await this.getResourcesToSpend(quantities);
    request.addResources(resources);
    return this.sendTransaction(request);
  }
  /**
   * Sends a transaction to the network.
   *
   * @param transactionRequestLike - The transaction request to be sent.
   * @returns A promise that resolves to the transaction response.
   */
  async sendTransaction(transactionRequestLike) {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    await this.provider.estimateTxDependencies(transactionRequest);
    return this.provider.sendTransaction(transactionRequest);
  }
  /**
   * Simulates a transaction.
   *
   * @param transactionRequestLike - The transaction request to be simulated.
   * @returns A promise that resolves to the call result.
   */
  async simulateTransaction(transactionRequestLike) {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    await this.provider.estimateTxDependencies(transactionRequest);
    return this.provider.simulate(transactionRequest);
  }
};
var DEFAULT_KDF_PARAMS_LOG_N = 13;
var DEFAULT_KDF_PARAMS_R = 8;
var DEFAULT_KDF_PARAMS_P = 1;
var DEFAULT_KEY_SIZE = 32;
var DEFAULT_IV_SIZE = 16;
var removeHexPrefix = (hexString) => {
  if (/^0x/.test(hexString)) {
    return hexString.slice(2);
  }
  return hexString;
};
async function encryptKeystoreWallet(privateKey, address, password) {
  const privateKeyBuffer = bufferFromString2(removeHexPrefix(privateKey), "hex");
  const salt = randomBytes2(DEFAULT_KEY_SIZE);
  const key = scrypt2({
    password: bufferFromString2(password),
    salt,
    dklen: DEFAULT_KEY_SIZE,
    n: 2 ** DEFAULT_KDF_PARAMS_LOG_N,
    r: DEFAULT_KDF_PARAMS_R,
    p: DEFAULT_KDF_PARAMS_P
  });
  const iv = randomBytes2(DEFAULT_IV_SIZE);
  const ciphertext = await encryptJsonWalletData2(privateKeyBuffer, key, iv);
  const data = Uint8Array.from([...key.subarray(16, 32), ...ciphertext]);
  const macHashUint8Array = keccak2562(data);
  const mac = stringFromBuffer2(macHashUint8Array, "hex");
  const keystore = {
    id: v4_default(),
    version: 3,
    address: removeHexPrefix(address.toHexString()),
    crypto: {
      cipher: "aes-128-ctr",
      mac,
      cipherparams: { iv: stringFromBuffer2(iv, "hex") },
      ciphertext: stringFromBuffer2(ciphertext, "hex"),
      kdf: "scrypt",
      kdfparams: {
        dklen: DEFAULT_KEY_SIZE,
        n: 2 ** DEFAULT_KDF_PARAMS_LOG_N,
        p: DEFAULT_KDF_PARAMS_P,
        r: DEFAULT_KDF_PARAMS_R,
        salt: stringFromBuffer2(salt, "hex")
      }
    }
  };
  return JSON.stringify(keystore);
}
async function decryptKeystoreWallet(jsonWallet, password) {
  const keystoreWallet = JSON.parse(jsonWallet);
  const {
    crypto: {
      mac,
      ciphertext,
      cipherparams: { iv },
      kdfparams: { dklen, n, r, p, salt }
    }
  } = keystoreWallet;
  const ciphertextBuffer = bufferFromString2(ciphertext, "hex");
  const ivBuffer = bufferFromString2(iv, "hex");
  const saltBuffer = bufferFromString2(salt, "hex");
  const passwordBuffer = bufferFromString2(password);
  const key = scrypt2({
    password: passwordBuffer,
    salt: saltBuffer,
    n,
    p,
    r,
    dklen
  });
  const data = Uint8Array.from([...key.subarray(16, 32), ...ciphertextBuffer]);
  const macHashUint8Array = keccak2562(data);
  const macHash = stringFromBuffer2(macHashUint8Array, "hex");
  if (mac !== macHash) {
    throw new FuelError(
      ErrorCode.INVALID_PASSWORD,
      "Failed to decrypt the keystore wallet, the provided password is incorrect."
    );
  }
  const buffer = await decryptJsonWalletData2(ciphertextBuffer, key, ivBuffer);
  const privateKey = hexlify(buffer);
  return privateKey;
}
var BaseWalletUnlocked = class extends Account {
  /**
   * Creates a new BaseWalletUnlocked instance.
   *
   * @param privateKey - The private key of the wallet.
   * @param provider - A Provider instance.
   */
  constructor(privateKey, provider) {
    const signer = new signer_default(privateKey);
    super(signer.address, provider);
    /**
     * The provider used to interact with the Fuel network.
     */
    __publicField(this, "provider");
    /**
     * A function that returns the wallet's signer.
     */
    __publicField(this, "signer");
    this.signer = () => signer;
    this.provider = provider;
  }
  /**
   * Gets the private key of the wallet.
   *
   * @returns The private key of the wallet.
   */
  get privateKey() {
    return this.signer().privateKey;
  }
  /**
   * Gets the public key of the wallet.
   *
   * @returns
   */
  get publicKey() {
    return this.signer().publicKey;
  }
  /**
   * Signs a message with the wallet's private key.
   *
   * @param message - The message to sign.
   * @returns A promise that resolves to the signature as a ECDSA 64 bytes string.
   */
  async signMessage(message) {
    const signedMessage = await this.signer().sign(hashMessage(message));
    return signedMessage;
  }
  /**
   * Signs a transaction with the wallet's private key.
   *
   * @param transactionRequestLike - The transaction request to sign.
   * @returns A promise that resolves to the signature as a ECDSA 64 bytes string.
   */
  async signTransaction(transactionRequestLike) {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    const chainId = (await this.provider.getChain()).consensusParameters.chainId.toNumber();
    const hashedTransaction = hashTransaction(transactionRequest, chainId);
    const signature = await this.signer().sign(hashedTransaction);
    return signature;
  }
  /**
   * Populates a transaction with the witnesses signature.
   *
   * @param transactionRequestLike - The transaction request to populate.
   * @returns The populated transaction request.
   */
  async populateTransactionWitnessesSignature(transactionRequestLike) {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    const signedTransaction = await this.signTransaction(transactionRequest);
    transactionRequest.updateWitnessByOwner(this.address, signedTransaction);
    return transactionRequest;
  }
  /**
   * Populates the witness signature for a transaction and sends it to the network using `provider.sendTransaction`.
   *
   * @param transactionRequestLike - The transaction request to send.
   * @returns A promise that resolves to the TransactionResponse object.
   */
  async sendTransaction(transactionRequestLike) {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    await this.provider.estimateTxDependencies(transactionRequest);
    return this.provider.sendTransaction(
      await this.populateTransactionWitnessesSignature(transactionRequest)
    );
  }
  /**
   * Populates the witness signature for a transaction and sends a call to the network using `provider.call`.
   *
   * @param transactionRequestLike - The transaction request to simulate.
   * @returns A promise that resolves to the CallResult object.
   */
  async simulateTransaction(transactionRequestLike) {
    const transactionRequest = transactionRequestify(transactionRequestLike);
    await this.provider.estimateTxDependencies(transactionRequest);
    return this.provider.call(
      await this.populateTransactionWitnessesSignature(transactionRequest),
      {
        utxoValidation: true
      }
    );
  }
  async encrypt(password) {
    return encryptKeystoreWallet(this.privateKey, this.address, password);
  }
};
__publicField2(BaseWalletUnlocked, "defaultPath", "m/44'/1179993420'/0'/0/0");
var WalletLocked = class extends Account {
  /**
   * Unlocks the wallet using the provided private key and returns an instance of WalletUnlocked.
   *
   * @param privateKey - The private key used to unlock the wallet.
   * @returns An instance of WalletUnlocked.
   */
  unlock(privateKey) {
    return new WalletUnlocked(privateKey, this.provider);
  }
};
var WalletUnlocked = class extends BaseWalletUnlocked {
  /**
   * Locks the wallet and returns an instance of WalletLocked.
   *
   * @returns An instance of WalletLocked.
   */
  lock() {
    this.signer = () => new signer_default("0x00");
    return new WalletLocked(this.address, this.provider);
  }
  /**
   * Generate a new Wallet Unlocked with a random key pair.
   *
   * @param generateOptions - Options to customize the generation process (optional).
   * @returns An instance of WalletUnlocked.
   */
  static generate(generateOptions) {
    const privateKey = signer_default.generatePrivateKey(generateOptions == null ? void 0 : generateOptions.entropy);
    return new WalletUnlocked(privateKey, generateOptions == null ? void 0 : generateOptions.provider);
  }
  /**
   * Create a Wallet Unlocked from a seed.
   *
   * @param seed - The seed phrase.
   * @param provider - A Provider instance.
   * @param path - The derivation path (optional).
   * @returns An instance of WalletUnlocked.
   */
  static fromSeed(seed, provider, path) {
    const hdWallet = hdwallet_default.fromSeed(seed);
    const childWallet = hdWallet.derivePath(path || WalletUnlocked.defaultPath);
    return new WalletUnlocked(childWallet.privateKey, provider);
  }
  /**
   * Create a Wallet Unlocked from a mnemonic phrase.
   *
   * @param mnemonic - The mnemonic phrase.
   * @param provider - A Provider instance.
   * @param path - The derivation path (optional).
   * @param passphrase - The passphrase for the mnemonic (optional).
   * @returns An instance of WalletUnlocked.
   */
  static fromMnemonic(mnemonic, provider, path, passphrase) {
    const seed = mnemonic_default.mnemonicToSeed(mnemonic, passphrase);
    const hdWallet = hdwallet_default.fromSeed(seed);
    const childWallet = hdWallet.derivePath(path || WalletUnlocked.defaultPath);
    return new WalletUnlocked(childWallet.privateKey, provider);
  }
  /**
   * Create a Wallet Unlocked from an extended key.
   *
   * @param extendedKey - The extended key.
   * @param provider - A Provider instance.
   * @returns An instance of WalletUnlocked.
   */
  static fromExtendedKey(extendedKey, provider) {
    const hdWallet = hdwallet_default.fromExtendedKey(extendedKey);
    return new WalletUnlocked(hdWallet.privateKey, provider);
  }
  static async fromEncryptedJson(jsonWallet, password, provider) {
    const privateKey = await decryptKeystoreWallet(jsonWallet, password);
    return new WalletUnlocked(privateKey, provider);
  }
};
var Wallet = class {
  /**
   * Creates a locked wallet instance from an address and a provider.
   *
   * @param address - The address of the wallet.
   * @param provider - A Provider instance.
   * @returns A locked wallet instance.
   */
  static fromAddress(address, provider) {
    return new WalletLocked(address, provider);
  }
  /**
   * Creates an unlocked wallet instance from a private key and a provider.
   *
   * @param privateKey - The private key of the wallet.
   * @param provider - A Provider instance.
   * @returns An unlocked wallet instance.
   */
  static fromPrivateKey(privateKey, provider) {
    return new WalletUnlocked(privateKey, provider);
  }
};
__publicField2(Wallet, "generate", WalletUnlocked.generate);
__publicField2(Wallet, "fromSeed", WalletUnlocked.fromSeed);
__publicField2(Wallet, "fromMnemonic", WalletUnlocked.fromMnemonic);
__publicField2(Wallet, "fromExtendedKey", WalletUnlocked.fromExtendedKey);
__publicField2(Wallet, "fromEncryptedJson", WalletUnlocked.fromEncryptedJson);

// node_modules/@fuel-ts/predicate/dist/index.mjs
var getPredicateRoot = (bytecode, chainId) => {
  const chunkSize = 16 * 1024;
  const bytes = getBytesCopy(bytecode);
  const chunks = chunkAndPadBytes(bytes, chunkSize);
  const chainIdBytes = uint64ToBytesBE(chainId);
  const codeRoot = calcRoot(chunks.map((c) => hexlify(c)));
  const predicateRoot = hash2(concat(["0x4655454C", chainIdBytes, codeRoot]));
  return predicateRoot;
};
var Predicate = class extends Account {
  // TODO: Since provider is no longer optional, we can maybe remove `chainId` from the constructor.
  /**
   * Creates an instance of the Predicate class.
   *
   * @param bytes - The bytes of the predicate.
   * @param chainId - The chain ID for which the predicate is used.
   * @param provider - The provider used to interact with the blockchain.
   * @param jsonAbi - The JSON ABI of the predicate.
   * @param configurableConstants - Optional configurable constants for the predicate.
   */
  constructor(bytes, provider, jsonAbi, configurableConstants) {
    const { predicateBytes, predicateInterface } = Predicate.processPredicateData(
      bytes,
      jsonAbi,
      configurableConstants
    );
    const chainId = provider.getChainId();
    const address = Address.fromB256(getPredicateRoot(predicateBytes, chainId));
    super(address, provider);
    __publicField(this, "bytes");
    __publicField(this, "predicateData", Uint8Array.from([]));
    __publicField(this, "interface");
    this.bytes = predicateBytes;
    this.interface = predicateInterface;
  }
  /**
   * Populates the transaction data with predicate data.
   *
   * @param transactionRequestLike - The transaction request-like object.
   * @returns The transaction request with predicate data.
   */
  populateTransactionPredicateData(transactionRequestLike) {
    var _a2;
    const request = transactionRequestify(transactionRequestLike);
    (_a2 = request.inputs) == null ? void 0 : _a2.forEach((input) => {
      if (input.type === InputType.Coin && hexlify(input.owner) === this.address.toB256()) {
        input.predicate = this.bytes;
        input.predicateData = this.predicateData;
      }
    });
    return request;
  }
  /**
   * Sends a transaction with the populated predicate data.
   *
   * @param transactionRequestLike - The transaction request-like object.
   * @returns A promise that resolves to the transaction response.
   */
  sendTransaction(transactionRequestLike) {
    const transactionRequest = this.populateTransactionPredicateData(transactionRequestLike);
    return super.sendTransaction(transactionRequest);
  }
  /**
   * Simulates a transaction with the populated predicate data.
   *
   * @param transactionRequestLike - The transaction request-like object.
   * @returns A promise that resolves to the call result.
   */
  simulateTransaction(transactionRequestLike) {
    const transactionRequest = this.populateTransactionPredicateData(transactionRequestLike);
    return super.simulateTransaction(transactionRequest);
  }
  /**
   * Sets data for the predicate.
   *
   * @param args - Arguments for the predicate function.
   * @returns The Predicate instance with updated predicate data.
   */
  setData(...args) {
    var _a2;
    const mainFn = (_a2 = this.interface) == null ? void 0 : _a2.functions.main;
    const paddedCode = new ByteArrayCoder(this.bytes.length).encode(this.bytes);
    const VM_TX_MEMORY = calculateVmTxMemory({
      maxInputs: this.provider.getChain().consensusParameters.maxInputs.toNumber()
    });
    const OFFSET = VM_TX_MEMORY + SCRIPT_FIXED_SIZE + INPUT_COIN_FIXED_SIZE + WORD_SIZE + paddedCode.byteLength;
    this.predicateData = (mainFn == null ? void 0 : mainFn.encodeArguments(args, OFFSET)) || new Uint8Array();
    return this;
  }
  /**
   * Processes the predicate data and returns the altered bytecode and interface.
   *
   * @param bytes - The bytes of the predicate.
   * @param jsonAbi - The JSON ABI of the predicate.
   * @param configurableConstants - Optional configurable constants for the predicate.
   * @returns An object containing the new predicate bytes and interface.
   */
  static processPredicateData(bytes, jsonAbi, configurableConstants) {
    let predicateBytes = getBytesCopy(bytes);
    let abiInterface;
    if (jsonAbi) {
      abiInterface = new Interface(jsonAbi);
      if (abiInterface.functions.main === void 0) {
        throw new FuelError(
          ErrorCode.ABI_MAIN_METHOD_MISSING,
          'Cannot use ABI without "main" function.'
        );
      }
    }
    if (configurableConstants && Object.keys(configurableConstants).length) {
      predicateBytes = Predicate.setConfigurableConstants(
        predicateBytes,
        configurableConstants,
        abiInterface
      );
    }
    return {
      predicateBytes,
      predicateInterface: abiInterface
    };
  }
  /**
   * Sets the configurable constants for the predicate.
   *
   * @param bytes - The bytes of the predicate.
   * @param configurableConstants - Configurable constants to be set.
   * @param abiInterface - The ABI interface of the predicate.
   * @returns The mutated bytes with the configurable constants set.
   */
  static setConfigurableConstants(bytes, configurableConstants, abiInterface) {
    const mutatedBytes = bytes;
    try {
      if (!abiInterface) {
        throw new Error(
          "Cannot validate configurable constants because the Predicate was instantiated without a JSON ABI"
        );
      }
      if (Object.keys(abiInterface.configurables).length === 0) {
        throw new Error("Predicate has no configurable constants to be set");
      }
      Object.entries(configurableConstants).forEach(([key, value]) => {
        if (!(abiInterface == null ? void 0 : abiInterface.configurables[key])) {
          throw new Error(`No configurable constant named '${key}' found in the Predicate`);
        }
        const { offset } = abiInterface.configurables[key];
        const encoded = abiInterface.encodeConfigurable(key, value);
        mutatedBytes.set(encoded, offset);
      });
    } catch (err) {
      throw new FuelError(
        ErrorCode.INVALID_CONFIGURABLE_CONSTANTS,
        `Error setting configurable constants: ${err.message}.`
      );
    }
    return mutatedBytes;
  }
};

// node_modules/@fuel-ts/script/dist/index.mjs
var ScriptInvocationScope = class extends FunctionInvocationScope {
  constructor() {
    super(...arguments);
    __publicField(this, "scriptRequest");
  }
  updateScriptRequest() {
    if (!this.scriptRequest) {
      this.buildScriptRequest();
    }
    this.transactionRequest.setScript(this.scriptRequest, this.args);
  }
  buildScriptRequest() {
    const programBytes = this.program.bytes;
    const chainInfoCache = this.program.provider.getChain();
    if (!chainInfoCache) {
      throw new FuelError(
        FuelError.CODES.CHAIN_INFO_CACHE_EMPTY,
        "Provider chain info cache is empty. Please make sure to initialize the `Provider` properly by running `await Provider.create()`"
      );
    }
    const maxInputs = chainInfoCache.consensusParameters.maxInputs.toNumber();
    const byteLength = new ByteArrayCoder(programBytes.length).encodedLength;
    this.scriptRequest = new ScriptRequest(
      programBytes,
      (args) => this.func.encodeArguments(
        args,
        ScriptRequest.getScriptDataOffsetWithScriptBytes(byteLength, maxInputs)
      ),
      () => []
    );
  }
  /**
   * Submits a script transaction to the blockchain.
   */
  async call() {
    assert(this.program.account, "Provider is required!");
    const transactionRequest = await this.getTransactionRequest();
    const response = await this.program.account.sendTransaction(transactionRequest);
    return FunctionInvocationResult.build(
      this,
      response,
      false,
      this.program
    );
  }
};
var Script = class extends AbstractScript {
  /**
   * Create a new instance of the Script class.
   *
   * @param bytecode - The compiled bytecode of the script.
   * @param abi - The ABI interface for the script.
   * @param account - The account associated with the script.
   */
  constructor(bytecode, abi, account) {
    super();
    /**
     * The compiled bytecode of the script.
     */
    __publicField(this, "bytes");
    /**
     * The ABI interface for the script.
     */
    __publicField(this, "interface");
    /**
     * The account associated with the script.
     */
    __publicField(this, "account");
    /**
     * The script request object.
     */
    __publicField(this, "script");
    /**
     * The provider used for interacting with the network.
     */
    __publicField(this, "provider");
    /**
     * Functions that can be invoked within the script.
     */
    __publicField(this, "functions");
    this.bytes = getBytesCopy(bytecode);
    this.interface = new Interface(abi);
    this.provider = account.provider;
    this.account = account;
    this.functions = {
      main: (...args) => new ScriptInvocationScope(this, this.interface.getFunction("main"), args)
    };
  }
  /**
   * Set the configurable constants of the script.
   *
   * @param configurables - An object containing the configurable constants and their values.
   * @throws Will throw an error if the script has no configurable constants to be set or if an invalid constant is provided.
   * @returns This instance of the `Script`.
   */
  setConfigurableConstants(configurables) {
    try {
      if (!Object.keys(this.interface.configurables).length) {
        throw new Error(`The script does not have configurable constants to be set`);
      }
      Object.entries(configurables).forEach(([key, value]) => {
        if (!this.interface.configurables[key]) {
          throw new Error(`The script does not have a configurable constant named: '${key}'`);
        }
        const { offset } = this.interface.configurables[key];
        const encoded = this.interface.encodeConfigurable(key, value);
        this.bytes.set(encoded, offset);
      });
    } catch (err) {
      throw new FuelError(
        ErrorCode.INVALID_CONFIGURABLE_CONSTANTS,
        `Error setting configurable constants: ${err.message}.`
      );
    }
    return this;
  }
};
var returnZeroScript2 = new ScriptRequest(
  /*
    Opcode::RET(REG_ZERO)
    Opcode::NOOP
  */
  // TODO: Don't use hardcoded scripts: https://github.com/FuelLabs/fuels-ts/issues/281
  "0x24000000",
  () => new Uint8Array(0),
  () => void 0
);

// node_modules/@fuel-ts/math/dist/configs.mjs
var DEFAULT_PRECISION = 9;
var DEFAULT_MIN_PRECISION = 3;
var DECIMAL_UNITS = 9;

// node_modules/@fuel-ts/program/dist/configs.mjs
var PANIC_REASONS2 = [
  "Success",
  "Revert",
  "OutOfGas",
  "TransactionValidity",
  "MemoryOverflow",
  "ArithmeticOverflow",
  "ContractNotFound",
  "MemoryOwnership",
  "NotEnoughBalance",
  "ExpectedInternalContext",
  "AssetIdNotFound",
  "InputNotFound",
  "OutputNotFound",
  "WitnessNotFound",
  "TransactionMaturity",
  "InvalidMetadataIdentifier",
  "MalformedCallStructure",
  "ReservedRegisterNotWritable",
  "ErrorFlag",
  "InvalidImmediateValue",
  "ExpectedCoinInput",
  "MaxMemoryAccess",
  "MemoryWriteOverlap",
  "ContractNotInInputs",
  "InternalBalanceOverflow",
  "ContractMaxSize",
  "ExpectedUnallocatedStack",
  "MaxStaticContractsReached",
  "TransferAmountCannotBeZero",
  "ExpectedOutputVariable",
  "ExpectedParentInternalContext",
  "IllegalJump",
  "NonZeroMessageOutputRecipient",
  "ZeroedMessageOutputRecipient"
];
var PANIC_DOC_URL2 = "https://docs.rs/fuel-asm/latest/fuel_asm/enum.PanicReason.html";

// node_modules/@fuel-ts/wallet/dist/configs.mjs
var FUEL_NETWORK_URL = "http://127.0.0.1:4000/graphql";
export {
  ASSET_ID_LEN,
  AbstractAccount,
  AbstractAddress,
  AbstractContract,
  AbstractPredicate,
  AbstractProgram,
  AbstractScript,
  AbstractScriptRequest,
  Account,
  Address,
  AddressType,
  ArrayCoder,
  AssertFailedRevertError,
  B256Coder,
  B512Coder,
  BN,
  BaseAssetId,
  BaseTransactionRequest,
  BaseWalletUnlocked,
  BooleanCoder,
  ByteArrayCoder,
  CONTRACT_ID_LEN,
  CONTRACT_MAX_SIZE,
  ChainName,
  ChangeOutputCollisionError,
  Coder,
  Contract,
  ContractFactory,
  util_exports as ContractUtils,
  CreateTransactionRequest,
  DECIMAL_UNITS,
  DEFAULT_MIN_PRECISION,
  DEFAULT_PRECISION,
  EmptyRoot,
  EnumCoder,
  FAILED_ASSERT_EQ_SIGNAL,
  FAILED_ASSERT_SIGNAL,
  FAILED_REQUIRE_SIGNAL,
  FAILED_SEND_MESSAGE_SIGNAL,
  FAILED_TRANSFER_TO_ADDRESS_SIGNAL,
  FAILED_UNKNOWN_SIGNAL,
  FUEL_BECH32_HRP_PREFIX,
  FUEL_NETWORK_URL,
  FunctionInvocationResult,
  FunctionInvocationScope,
  INPUT_COIN_FIXED_SIZE,
  InputCoder,
  InputCoinCoder,
  InputContractCoder,
  InputMessageCoder,
  InputType,
  InstructionSet,
  Interface,
  InvocationResult,
  MAX_PREDICATE_DATA_LENGTH,
  MAX_PREDICATE_LENGTH,
  MAX_SCRIPT_DATA_LENGTH,
  MAX_SCRIPT_LENGTH,
  MAX_STATIC_CONTRACTS,
  MAX_WITNESSES,
  MNEMONIC_SIZES,
  mnemonic_default as Mnemonic,
  MultiCallInvocationScope,
  NoWitnessAtIndexError,
  NoWitnessByOwnerError,
  NumberCoder,
  OperationName,
  OutputChangeCoder,
  OutputCoder,
  OutputCoinCoder,
  OutputContractCoder,
  OutputContractCreatedCoder,
  OutputType,
  OutputVariableCoder,
  PANIC_DOC_URL2 as PANIC_DOC_URL,
  PANIC_REASONS2 as PANIC_REASONS,
  Predicate,
  Provider,
  ReceiptBurnCoder,
  ReceiptCallCoder,
  ReceiptCoder,
  ReceiptLogCoder,
  ReceiptLogDataCoder,
  ReceiptMessageOutCoder,
  ReceiptMintCoder,
  ReceiptPanicCoder,
  ReceiptReturnCoder,
  ReceiptReturnDataCoder,
  ReceiptRevertCoder,
  ReceiptScriptResultCoder,
  ReceiptTransferCoder,
  ReceiptTransferOutCoder,
  ReceiptType,
  RequireRevertError,
  RevertError,
  SCRIPT_FIXED_SIZE,
  Script,
  ScriptRequest,
  ScriptResultDecoderError,
  ScriptTransactionRequest,
  SendMessageRevertError,
  signer_default as Signer,
  StorageSlotCoder,
  StringCoder,
  StructCoder,
  TransactionCoder,
  TransactionCreateCoder,
  TransactionMintCoder,
  TransactionResponse,
  TransactionScriptCoder,
  TransactionStatus,
  TransactionType,
  TransactionTypeName,
  TransferToAddressRevertError,
  TupleCoder,
  TxPointerCoder,
  U64Coder,
  UtxoIdCoder,
  VecCoder,
  WORD_SIZE,
  Wallet,
  WalletLocked,
  WalletUnlocked,
  WitnessCoder,
  ZeroBytes32,
  addOperation,
  addressify,
  getBytesCopy as arrayify,
  assembleReceiptByType,
  assembleTransactionSummary,
  assert,
  bn,
  bufferFromString2 as bufferFromString,
  buildBlockExplorerUrl,
  calculatePriceWithFactor,
  calculateTransactionFee,
  calculateTransactionFeeForContractCreated,
  calculateTransactionFeeForScript,
  calculateVmTxMemory,
  clearFirst12BytesFromB256,
  coinQuantityfy,
  decrypt2 as decrypt,
  decryptJsonWalletData2 as decryptJsonWalletData,
  encrypt2 as encrypt,
  encryptJsonWalletData2 as encryptJsonWalletData,
  extractBurnedAssetsFromReceipts,
  extractMintedAssetsFromReceipts,
  format,
  formatUnits,
  fromBech32,
  fromDateToTai64,
  fromTai64ToDate,
  fromTai64ToUnix,
  fromUnixToTai64,
  getBytesFromBech32,
  getContractCallOperations,
  getContractCreatedOperations,
  getContractTransferOperations,
  getCurve,
  getDecodedLogs,
  getDocs,
  getGasUsedFromReceipts,
  getInputAccountAddress,
  getInputContractFromIndex,
  getInputFromAssetId,
  getInputsByType,
  getInputsCoin,
  getInputsContract,
  getInputsMessage,
  getOperations,
  getOutputsByType,
  getOutputsChange,
  getOutputsCoin,
  getOutputsContract,
  getOutputsContractCreated,
  getOutputsVariable,
  getPayProducerOperations,
  getRandomB256,
  getReceiptsByType,
  getReceiptsCall,
  getReceiptsMessageOut,
  getReceiptsTransferOut,
  getReceiptsWithMissingData,
  getTransactionStatusName,
  getTransactionSummary,
  getTransactionSummaryFromRequest,
  getTransactionTypeName,
  getTransactionsSummaries,
  getTransferOperations,
  getWithdrawFromFuelOperations,
  hasSameAssetId,
  hash2 as hash,
  hashMessage,
  hashTransaction,
  hexlify,
  inputify,
  isB256,
  isBech32,
  isCoin,
  isEvmAddress,
  isMessage,
  isPublicKey,
  isRawCoin,
  isRawMessage,
  isType,
  isTypeCreate,
  isTypeMint,
  isTypeScript,
  keccak2562 as keccak256,
  keyFromPassword2 as keyFromPassword,
  max,
  multiply,
  normalizeBech32,
  normalizeJSON,
  outputify,
  padFirst12BytesOfEvmAddress,
  processGqlReceipt,
  processGraphqlStatus,
  randomBytes2 as randomBytes,
  returnZeroScript,
  revertErrorFactory,
  scrypt2 as scrypt,
  sleep,
  stringFromBuffer2 as stringFromBuffer,
  toB256,
  toBech32,
  toBytes,
  toFixed,
  toHex,
  toNumber,
  transactionRequestify,
  uint64ToBytesBE,
  withdrawScript
};
//# sourceMappingURL=fuels.js.map
