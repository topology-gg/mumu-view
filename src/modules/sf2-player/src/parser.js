/* eslint-disable no-bitwise */
import * as RiffHelper from './riff.js';

/**
 * @typedef InstrumentGenerator
 * @prop {Array.<Object>} startAddrsOffset
 * @prop {Array.<Object>} endAddrsOffset
 * @prop {Array.<Object>} startloopAddrsOffset
 * @prop {Array.<Object>} endloopAddrsOffset
 * @prop {Array.<Object>} startAddrsCoarseOffset
 * @prop {Array.<Object>} modLfoToPitch
 * @prop {Array.<Object>} vibLfoToPitch
 * @prop {Array.<Object>} modEnvToPitch
 * @prop {Array.<Object>} initialFilterFc
 * @prop {Array.<Object>} initialFilterQ
 * @prop {Array.<Object>} modLfoToFilterFc
 * @prop {Array.<Object>} modEnvToFilterFc
 * @prop {Array.<Object>} endAddrsCoarseOffset
 * @prop {Array.<Object>} modLfoToVolume
 * @prop {Array.<Object>} chorusEffectsSend
 * @prop {Array.<Object>} reverbEffectsSend
 * @prop {Array.<Object>} pan
 * @prop {Array.<Object>} delayModLFO
 * @prop {Array.<Object>} freqModLFO
 * @prop {Array.<Object>} delayVibLFO
 * @prop {Array.<Object>} freqVibLFO
 * @prop {Array.<Object>} delayModEnv
 * @prop {Array.<Object>} attackModEnv
 * @prop {Array.<Object>} holdModEnv
 * @prop {Array.<Object>} decayModEnv
 * @prop {Array.<Object>} sustainModEnv
 * @prop {Array.<Object>} releaseModEnv
 * @prop {Array.<Object>} keynumToModEnvHold
 * @prop {Array.<Object>} keynumToModEnvDecay
 * @prop {Array.<Object>} delayVolEnv
 * @prop {Array.<Object>} attackVolEnv
 * @prop {Array.<Object>} holdVolEnv
 * @prop {Array.<Object>} decayVolEnv
 * @prop {Array.<Object>} sustainVolEnv
 * @prop {Array.<Object>} releaseVolEnv
 * @prop {Array.<Object>} keynumToVolEnvHold
 * @prop {Array.<Object>} keynumToVolEnvDecay
 * @prop {Array.<Object>} instrument
 * @prop {Array.<Object>} keyRange
 * @prop {Array.<Object>} velRange
 * @prop {Array.<Object>} startloopAddrsCoarseOffset
 * @prop {Array.<Object>} keynum
 * @prop {Array.<Object>} velocity
 * @prop {Array.<Object>}initialAttenuation
 * @prop {Array.<Object>} endloopAddrsCoarseOffset
 * @prop {Array.<Object>} coarseTune
 * @prop {Array.<Object>} fineTune
 * @prop {Array.<Object>} sampleID
 * @prop {Array.<Object>} sampleModes
 * @prop {Array.<Object>} scaleTuning
 * @prop {Array.<Object>} exclusiveClass
 * @prop {Array.<Object>} overridingRootKey
 * @prop {Array.<Object>} endOper
 */

/**
 * SoundFont Parser Class
 */
export class Parser {
  /**
   * @param {Uint8Array} input
   * @param {Object=} optParams
   */
  constructor (input, optParams = {}) {
    this.input = input;
    /** @type {(Object|undefined)} */
    this.parserOption = optParams.parserOption || {};
    /** @type {(Number|undefined)} */
    this.sampleRate = optParams.sampleRate || 22050; // よくわからんが、OSで指定されているサンプルレートを入れないと音が切れ切れになる。

    /** @type {Array.<Object>} */
    this.presetHeader = [];
    /** @type {Array.<Object>} */
    this.presetZone = [];
    /** @type {Array.<Object>} */
    this.presetZoneModulator = [];
    /** @type {Array.<Object>} */
    this.presetZoneGenerator = [];
    /** @type {Array.<Object>} */
    this.instrument = [];
    /** @type {Array.<Object>} */
    this.instrumentZone = [];
    /** @type {Array.<Object>} */
    this.instrumentZoneModulator = [];
    /** @type {Array.<Object>} */
    this.instrumentZoneGenerator = [];
    /** @type {Array.<Object>} */
    this.sampleHeader = [];

    /**
     * @type {Array.<string>}
     * @const
     */
    // eslint-disable-next-line no-sparse-arrays
    this.GeneratorEnumeratorTable = [
      'startAddrsOffset',
      'endAddrsOffset',
      'startloopAddrsOffset',
      'endloopAddrsOffset',
      'startAddrsCoarseOffset',
      'modLfoToPitch',
      'vibLfoToPitch',
      'modEnvToPitch',
      'initialFilterFc',
      'initialFilterQ',
      'modLfoToFilterFc',
      'modEnvToFilterFc',
      'endAddrsCoarseOffset',
      'modLfoToVolume', , // 14
      'chorusEffectsSend',
      'reverbEffectsSend',
      'pan', , , , // 18,19,20
      'delayModLFO',
      'freqModLFO',
      'delayVibLFO',
      'freqVibLFO',
      'delayModEnv',
      'attackModEnv',
      'holdModEnv',
      'decayModEnv',
      'sustainModEnv',
      'releaseModEnv',
      'keynumToModEnvHold',
      'keynumToModEnvDecay',
      'delayVolEnv',
      'attackVolEnv',
      'holdVolEnv',
      'decayVolEnv',
      'sustainVolEnv',
      'releaseVolEnv',
      'keynumToVolEnvHold',
      'keynumToVolEnvDecay',
      'instrument', , // 42
      'keyRange',
      'velRange',
      'startloopAddrsCoarseOffset',
      'keynum',
      'velocity',
      'initialAttenuation', , // 49
      'endloopAddrsCoarseOffset',
      'coarseTune',
      'fineTune',
      'sampleID',
      'sampleModes', , // 55
      'scaleTuning',
      'exclusiveClass',
      'overridingRootKey', // 59
      'endOper'
    ];
  }

  parse () {
    const parser = new RiffHelper.Riff(this.input, this.parserOption);

    // parse RIFF chunk
    parser.parse();
    if (parser.chunkList.length !== 1) {
      throw new Error('wrong chunk length');
    }

    /** @type {?RiffHelper.RiffChunk} */
    const chunk = parser.getChunk(0);

    if (chunk === null) {
      throw new Error('chunk not found');
    }

    this.parseRiffChunk(chunk);
    // console.log(this.sampleHeader);
    this.input = null;
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parseRiffChunk (chunk) {
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    // check parse target
    if (chunk.type !== 'RIFF') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    /** @type {string} */
    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

    if (signature !== 'sfbk') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    const parser = new RiffHelper.Riff(data, { 'index': ip, 'length': chunk.size - 4 });

    parser.parse();

    if (parser.getNumberOfChunks() !== 3) {
      throw new Error('invalid sfbk structure');
    }

    // INFO-list
    this.parseInfoList(parser.getChunk(0));

    // sdta-list
    this.parseSdtaList(parser.getChunk(1));

    // pdta-list
    this.parsePdtaList(parser.getChunk(2));
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {any}
   */
  parseInfoList (chunk) {
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    /** @type {string} */
    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

    if (signature !== 'INFO') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    const parser = new RiffHelper.Riff(data, { 'index': ip, 'length': chunk.size - 4 });

    parser.parse();
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parseSdtaList (chunk) {
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    /** @type {string} */
    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

    if (signature !== 'sdta') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    const parser = new RiffHelper.Riff(data, { 'index': ip, 'length': chunk.size - 4 });

    parser.parse();
    if (parser.chunkList.length !== 1) {
      throw new Error('TODO');
    }
    this.samplingData =
      /** @type {{type: string, size: number, offset: number}} */
      (parser.getChunk(0));
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parsePdtaList (chunk) {
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    // check parse target
    if (chunk.type !== 'LIST') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    // check signature
    /** @type {string} */
    const signature = String.fromCharCode(data[ip++], data[ip++], data[ip++], data[ip++]);

    if (signature !== 'pdta') {
      throw new Error('invalid signature:' + signature);
    }

    // read structure
    const parser = new RiffHelper.Riff(data, { 'index': ip, 'length': chunk.size - 4 });

    parser.parse();

    // check number of chunks
    if (parser.getNumberOfChunks() !== 9) {
      throw new Error('invalid pdta chunk');
    }

    this.parsePhdr(parser.getChunk(0));
    this.parsePbag(parser.getChunk(1));
    this.parsePmod(parser.getChunk(2));
    this.parsePgen(parser.getChunk(3));
    this.parseInst(parser.getChunk(4));
    this.parseIbag(parser.getChunk(5));
    this.parseImod(parser.getChunk(6));
    this.parseIgen(parser.getChunk(7));
    this.parseShdr(parser.getChunk(8));
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parsePhdr (chunk) {
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    this.presetHeader = [];

    const { presetHeader } = this;

    /** @type {number} */
    const size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'phdr') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      presetHeader.push({
        presetName: String.fromCharCode.apply(null, data.subarray(ip, ip += 20)),
        preset: data[ip++] | (data[ip++] << 8),
        bank: data[ip++] | (data[ip++] << 8),
        presetBagIndex: data[ip++] | (data[ip++] << 8),
        library: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0,
        genre: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0,
        morphology: (data[ip++] | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)) >>> 0
      });
    }
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parsePbag (chunk) {
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    this.presetZone = [];

    const { presetZone } = this;

    const size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'pbag') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      presetZone.push({
        presetGeneratorIndex: data[ip++] | (data[ip++] << 8),
        presetModulatorIndex: data[ip++] | (data[ip++] << 8)
      });
    }
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parsePmod (chunk) {
    // check parse target
    if (chunk.type !== 'pmod') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.presetZoneModulator = this.parseModulator(chunk);
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parsePgen (chunk) {
    // check parse target
    if (chunk.type !== 'pgen') {
      throw new Error('invalid chunk type:' + chunk.type);
    }
    this.presetZoneGenerator = this.parseGenerator(chunk);
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parseInst (chunk) {
    const data = this.input;

    let ip = chunk.offset;

    this.instrument = [];
    const { instrument } = this;

    const size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'inst') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      instrument.push({
        instrumentName: String.fromCharCode.apply(null, data.subarray(ip, ip += 20)),
        instrumentBagIndex: data[ip++] | (data[ip++] << 8)
      });
    }
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parseIbag (chunk) {
    const data = this.input;
    let ip = chunk.offset;

    this.instrumentZone = [];
    const { instrumentZone } = this;
    const size = chunk.offset + chunk.size;

    // check parse target
    if (chunk.type !== 'ibag') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      instrumentZone.push({
        instrumentGeneratorIndex: data[ip++] | (data[ip++] << 8),
        instrumentModulatorIndex: data[ip++] | (data[ip++] << 8)
      });
    }
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parseImod (chunk) {
    // check parse target
    if (chunk.type !== 'imod') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.instrumentZoneModulator = this.parseModulator(chunk);
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parseIgen (chunk) {
    // check parse target
    if (chunk.type !== 'igen') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    this.instrumentZoneGenerator = this.parseGenerator(chunk);
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @returns {void}
   */
  parseShdr (chunk) {
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;

    this.sample = [];
    const { sample: samples } = this;

    this.sampleHeader = [];
    const { sampleHeader } = this;

    const size = chunk.offset + chunk.size;

    /** @type {string} */
    let sampleName;
    /** @type {number} */
    let start;
    /** @type {number} */
    let end;
    /** @type {number} */
    let startLoop;
    /** @type {number} */
    let endLoop;
    /** @type {number} */
    let sampleRate;
    /** @type {number} */
    let originalPitch;
    /** @type {number} */
    let pitchCorrection;
    /** @type {number} */
    let sampleLink;
    /** @type {number} */
    let sampleType;

    // check parse target
    if (chunk.type !== 'shdr') {
      throw new Error('invalid chunk type:' + chunk.type);
    }

    while (ip < size) {
      sampleName = String.fromCharCode.apply(null, data.subarray(ip, ip += 20));
      start = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0;
      end = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0;
      startLoop = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0;
      endLoop = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0;
      sampleRate = (
        (data[ip++] << 0) | (data[ip++] << 8) | (data[ip++] << 16) | (data[ip++] << 24)
      ) >>> 0;
      originalPitch = data[ip++];
      pitchCorrection = (data[ip++] << 24) >> 24;
      sampleLink = data[ip++] | (data[ip++] << 8);
      sampleType = data[ip++] | (data[ip++] << 8);

      let sample = new Int16Array(new Uint8Array(data.subarray(
        this.samplingData.offset + start * 2,
        this.samplingData.offset + end * 2
      )).buffer);

      startLoop -= start;
      endLoop -= start;

      if (sampleRate > 0) {
        const adjust = this.adjustSampleData(sample, sampleRate);

        sample = adjust.sample;
        sampleRate *= adjust.multiply;
        startLoop *= adjust.multiply;
        endLoop *= adjust.multiply;
      }

      samples.push(sample);

      sampleHeader.push({
        sampleName: sampleName,
        start: start,
        end: end,
        startLoop: startLoop,
        endLoop: endLoop,
        sampleRate: sampleRate,
        originalPitch: originalPitch,
        pitchCorrection: pitchCorrection,
        sampleLink: sampleLink,
        sampleType: sampleType
      });
    }
  }

  /**
   * @param {Int16Array} sample
   * @param {number} sampleRate
   * @return {object}
   */
  adjustSampleData (sample, sampleRate) {
    /** @type {Int16Array} */
    let newSample;
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;
    /** @type {number} */
    let j;
    /** @type {number} */
    let multiply = 1;

    // buffer
    while (sampleRate < (this.sampleRate)) {
      newSample = new Int16Array(sample.length * 2);
      // eslint-disable-next-line no-multi-assign
      for (i = j = 0, il = sample.length; i < il; ++i) {
        newSample[j++] = sample[i];
        newSample[j++] = sample[i];
      }
      sample = newSample;
      multiply *= 2;
      sampleRate *= 2;
    }

    return {
      sample: sample,
      multiply: multiply
    };
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @return {Array.<Object>}
   */
  parseModulator (chunk) {
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {number} */
    const size = chunk.offset + chunk.size;
    /** @type {number} */
    let code;
    /** @type {string} */
    let key;
    /** @type {Array.<Object>} */
    const output = [];

    while (ip < size) {
      // Src  Oper
      // TODO
      ip += 2;

      // Dest Oper
      code = data[ip++] | (data[ip++] << 8);
      key = this.GeneratorEnumeratorTable[code];
      if (key === undefined) {
        // Amount
        output.push({
          type: key,
          value: {
            code: code,
            amount: data[ip] | (data[ip + 1] << 8) << 16 >> 16,
            lo: data[ip++],
            hi: data[ip++]
          }
        });
      } else {
        // Amount
        switch (key) {
        case 'keyRange':
          /* FALLTHROUGH */
        case 'velRange':
          /* FALLTHROUGH */
        case 'keynum':
          /* FALLTHROUGH */
        case 'velocity':
          output.push({
            type: key,
            value: {
              lo: data[ip++],
              hi: data[ip++]
            }
          });
          break;
        default:
          output.push({
            type: key,
            value: {
              amount: data[ip++] | (data[ip++] << 8) << 16 >> 16
            }
          });
          break;
        }
      }

      // AmtSrcOper
      // TODO
      ip += 2;

      // Trans Oper
      // TODO
      ip += 2;
    }

    return output;
  }

  /**
   * @param {RiffHelper.RiffChunk} chunk
   * @return {Array.<Object>}
   */
  parseGenerator (chunk) {
    const data = this.input;
    /** @type {number} */
    let ip = chunk.offset;
    /** @type {number} */
    const size = chunk.offset + chunk.size;
    /** @type {number} */
    let code;
    /** @type {string} */
    let key;
    /** @type {Array.<Object>} */
    const output = [];

    while (ip < size) {
      code = data[ip++] | (data[ip++] << 8);
      key = this.GeneratorEnumeratorTable[code];
      if (key === undefined) {
        output.push({
          type: key,
          value: {
            code: code,
            amount: data[ip] | (data[ip + 1] << 8) << 16 >> 16,
            lo: data[ip++],
            hi: data[ip++]
          }
        });
        continue;
      }

      switch (key) {
      case 'keynum':
        /* FALLTHROUGH */
      case 'keyRange':
        /* FALLTHROUGH */
      case 'velRange':
        /* FALLTHROUGH */
      case 'velocity':
        output.push({
          type: key,
          value: {
            lo: data[ip++],
            hi: data[ip++]
          }
        });
        break;
      default:
        output.push({
          type: key,
          value: {
            amount: data[ip++] | (data[ip++] << 8) << 16 >> 16
          }
        });
        break;
      }
    }

    return output;
  }

  /**
   * @return {Array.<object>}
   */
  createInstrument () {
    /** @type {Array.<Object>} */
    const instrument = this.instrument;
    /** @type {Array.<Object>} */
    const zone = this.instrumentZone;
    /** @type {Array.<Object>} */
    const output = [];
    /** @type {number} */
    let bagIndex;
    /** @type {number} */
    let bagIndexEnd;
    /** @type {Array.<Object>} */
    let zoneInfo;
    /** @type {{generator: InstrumentGenerator, generatorInfo: Array.<Object>}} */
    let instrumentGenerator;
    /** @type {{modulator: Object, modulatorInfo: Array.<Object>}} */
    let instrumentModulator;
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;
    /** @type {number} */
    let j;
    /** @type {number} */
    let jl;

    // instrument -> instrument bag -> generator / modulator
    for (i = 0, il = instrument.length; i < il; ++i) {
      bagIndex = instrument[i].instrumentBagIndex;
      bagIndexEnd = instrument[i + 1] ? instrument[i + 1].instrumentBagIndex : zone.length;
      zoneInfo = [];

      // instrument bag
      for (j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
        instrumentGenerator = this.createInstrumentGenerator_(zone, j);
        instrumentModulator = this.createInstrumentModulator_(zone, j);

        zoneInfo.push({
          generator: instrumentGenerator.generator,
          generatorSequence: instrumentGenerator.generatorInfo,
          modulator: instrumentModulator.modulator,
          modulatorSequence: instrumentModulator.modulatorInfo
        });
      }

      output.push({
        name: instrument[i].instrumentName,
        info: zoneInfo
      });
    }

    return output;
  }

  /**
   * @return {Array.<object>}
   */
  createPreset () {
    /** @type {Array.<Object>} */
    const preset = this.presetHeader;
    /** @type {Array.<Object>} */
    const zone = this.presetZone;
    /** @type {Array.<Object>} */
    const output = [];
    /** @type {number} */
    let bagIndex;
    /** @type {number} */
    let bagIndexEnd;
    /** @type {Array.<Object>} */
    let zoneInfo;
    /** @type {number} */
    let instrument;
    /** @type {{generator: InstrumentGenerator, generatorInfo: Array.<Object>}} */
    let presetGenerator;
    /** @type {{modulator: Object, modulatorInfo: Array.<Object>}} */
    let presetModulator;
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;
    /** @type {number} */
    let j;
    /** @type {number} */
    let jl;

    // preset -> preset bag -> generator / modulator
    for (i = 0, il = preset.length; i < il; ++i) {
      bagIndex = preset[i].presetBagIndex;
      bagIndexEnd = preset[i + 1] ? preset[i + 1].presetBagIndex : zone.length;
      zoneInfo = [];

      // preset bag
      for (j = bagIndex, jl = bagIndexEnd; j < jl; ++j) {
        presetGenerator = this.createPresetGenerator_(zone, j);
        presetModulator = this.createPresetModulator_(zone, j);

        zoneInfo.push({
          generator: presetGenerator.generator,
          generatorSequence: presetGenerator.generatorInfo,
          modulator: presetModulator.modulator,
          modulatorSequence: presetModulator.modulatorInfo
        });

        instrument =
          presetGenerator.generator.instrument !== undefined ?
            presetGenerator.generator.instrument.amount :
            presetModulator.modulator.instrument !== undefined ?
              presetModulator.modulator.instrument.amount :
              null;
      }

      output.push({
        name: preset[i].presetName,
        info: zoneInfo,
        header: preset[i],
        instrument: instrument
      });
    }

    return output;
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @return {{generator: Object, generatorInfo: Array.<Object>}}
   * @private
   */
  createInstrumentGenerator_ (zone, index) {
    const modgen = this.createBagModGen_(
      zone,
      zone[index].instrumentGeneratorIndex,
      zone[index + 1] ? zone[index + 1].instrumentGeneratorIndex : this.instrumentZoneGenerator.length,
      this.instrumentZoneGenerator
    );

    return {
      generator: modgen.modgen,
      generatorInfo: modgen.modgenInfo
    };
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @return {{modulator: Object, modulatorInfo: Array.<Object>}}
   * @private
   */
  createInstrumentModulator_ (zone, index) {
    const modgen = this.createBagModGen_(
      zone,
      zone[index].presetModulatorIndex,
      zone[index + 1] ? zone[index + 1].instrumentModulatorIndex : this.instrumentZoneModulator.length,
      this.instrumentZoneModulator
    );

    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo
    };
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @return {{generator: InstrumentGenerator, generatorInfo: Array.<Object>}}
   * @private
   */
  createPresetGenerator_ (zone, index) {
    const modgen = this.createBagModGen_(
      zone,
      zone[index].presetGeneratorIndex,
      zone[index + 1] ? zone[index + 1].presetGeneratorIndex : this.presetZoneGenerator.length,
      this.presetZoneGenerator
    );

    return {
      generator: modgen.modgen,
      generatorInfo: modgen.modgenInfo
    };
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} index
   * @return {{modulator: Object, modulatorInfo: Array.<Object>}}
   * @private
   */
  createPresetModulator_ (zone, index) {
    /** @type {{modgen: Object, modgenInfo: Array.<Object>}} */
    const modgen = this.createBagModGen_(
      zone,
      zone[index].presetModulatorIndex,
      zone[index + 1] ? zone[index + 1].presetModulatorIndex : this.presetZoneModulator.length,
      this.presetZoneModulator
    );

    return {
      modulator: modgen.modgen,
      modulatorInfo: modgen.modgenInfo
    };
  }

  /**
   * @param {Array.<Object>} zone
   * @param {number} indexStart
   * @param {number} indexEnd
   * @param {Array} zoneModGen
   * @return {{modgen: Object, modgenInfo: Array.<Object>}}
   * @private
   */
  createBagModGen_ (zone, indexStart, indexEnd, zoneModGen) {
    /** @type {Array.<Object>} */
    const modgenInfo = [];
    /** @type {Object} */
    const modgen = {
      'unknown': [],
      'keyRange': {
        hi: 127,
        lo: 0
      }
    }; // TODO
    /** @type {Object} */
    let info;
    /** @type {number} */
    let i;
    /** @type {number} */
    let il;

    for (i = indexStart, il = indexEnd; i < il; ++i) {
      info = zoneModGen[i];
      modgenInfo.push(info);

      if (info.type === 'unknown') {
        modgen.unknown.push(info.value);
      } else {
        modgen[info.type] = info.value;
      }
    }

    return {
      modgen: modgen,
      modgenInfo: modgenInfo
    };
  }
}

export default Parser;
