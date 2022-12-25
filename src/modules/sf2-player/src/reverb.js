/** @typedef Options
  * @prop {number} [decay]
  * @prop {number} [delay]
  * @prop {number} [filterFreq]
  * @prop {number} [filterQ]
  * @prop {BiquadFilterType} [filterType]
  * @prop {number} [mix]
  * @prop {boolean} [reverse]
  * @prop {number} [time]
 */

export default class Reverb {
  /**
   * constructor
   * @param {AudioContext} ctx
   * @param {Options} providedOptions
   */
  constructor (ctx, providedOptions) {

    const defaultOptions = {
      decay: undefined,
      delay: undefined,
      filterFreq: undefined,
      filterQ: undefined,
      filterType: undefined,
      mix: undefined,
      reverse: undefined,
      time: undefined
    };

    const options = {
      ...defaultOptions,
      ...providedOptions
    };

    /** @type {AudioContext} */
    this.ctx = ctx;
    /** @type {GainNode} */
    this.wetGainNode = this.ctx.createGain();
    /** @type {GainNode} */
    this.dryGainNode = this.ctx.createGain();
    /** @type {BiquadFilterNode} */
    this.filterNode = this.ctx.createBiquadFilter();
    /** @type {ConvolverNode} */
    this.convolverNode = this.ctx.createConvolver();
    /** @type {GainNode} */
    this.outputNode = this.ctx.createGain();

    /** @type {number} */
    // eslint-disable-next-line no-bitwise
    this._decay = options.decay | 0 || 5;
    /** @type {number} */
    // eslint-disable-next-line no-bitwise
    this._delay = options.delay | 0 || 0;
    /** @type {boolean} */
    this._reverse = options.reverse || false;
    /** @type {number} */
    // eslint-disable-next-line no-bitwise
    this._time = options.time | 0 || 3;
    /** @type {BiquadFilterType} */
    this._filterType = options.filterType || 'lowpass';
    /** @type {number} */
    // eslint-disable-next-line no-bitwise
    this._freq = options.filterFreq | 0 || 2200;
    /** @type {number} */
    // eslint-disable-next-line no-bitwise
    this._q = options.filterQ | 0 || 1;
    /** @type {number} ドライ／ウェット比 */
    this._mix = options.mix || 0.5;

    this.time(this._time);
    this.delay(this._delay);
    this.decay(this._decay);
    this.reverse(this._reverse);

    this.filterType(this._filterType);
    this.filterFreq(this._freq);
    this.filterQ(this._q);

    this.mix(this._mix);

    /** @type {boolean} */
    this.isConnected = false;

    this.buildImpulse();
  }

  /**
   * connect
   * @param {GainNode} sourceNode
   * @return {GainNode}
   */
  connect (sourceNode) {
    this.isConnected = true;
    // 畳み込みノードをウェットレベルに接続
    this.convolverNode.connect(this.filterNode);
    // フィルタノードをウェットレベルに接続
    this.filterNode.connect(this.wetGainNode);
    // 入力ノードを畳み込みノードに接続
    sourceNode.connect(this.convolverNode);
    // ドライレベルを出力ノードに接続
    sourceNode.connect(this.dryGainNode).connect(this.outputNode);
    // ウェットレベルを出力ノードに接続
    sourceNode.connect(this.wetGainNode).connect(this.outputNode);

    return this.outputNode;
  }

  /**
   * disconnect
   * @param {GainNode} sourceNode
   * @return {GainNode}
   */
  disconnect (sourceNode) {
    try {
      this.convolverNode.disconnect(this.filterNode);
      this.filterNode.disconnect(this.wetGainNode);
      sourceNode.disconnect(this.convolverNode);
      sourceNode.disconnect(this.dryGainNode);
      this.dryGainNode.disconnect(this.outputNode);
      sourceNode.disconnect(this.wetGainNode);
      this.wetGainNode.disconnect(this.outputNode);
    } catch (e) { }

    this.isConnected = false;

    return sourceNode;
  }

  /**
   * Mixing Dry and Wet Level.
   * @param {number} mix
   * @returns {void}
   */
  mix (mix) {
    if (!this.inRange(mix, 0, 1)) {
      console.warn('Dry/Wet level must be between 0 to 1.');

      return;
    }
    this._mix = mix;
    this.dryGainNode.gain.value = (1 - this._mix);
    this.wetGainNode.gain.value = this._mix;
    console.info(`Set dry/wet level to ${mix * 100}%`);
  }

  /**
   * Set Impulse Response time length (second)
   * @param {number} value
   * @returns {void}
   */
  time (value) {
    if (!this.inRange(value, 1, 50)) {
      console.warn('Time length of inpulse response must be less than 50sec.');

      return;
    }
    this._time = value;
    this.buildImpulse();
    console.info(`Set inpulse response time length to ${value}sec.`);
  }

  /**
   * Impulse response decay rate.
   * @param {number} value
   * @returns {void}
   */
  decay (value) {
    if (!this.inRange(value, 0, 100)) {
      console.warn('Inpulse Response decay level must be less than 100.');

      return;
    }
    this._decay = value;
    this.buildImpulse();
    console.info(`Set inpulse response decay level to ${value}.`);
  }

  /**
   * Impulse response delay time. (NOT deley effect)
   * @param {number} value
   * @returns {void}
   */
  delay (value) {
    if (!this.inRange(value, 0, 100)) {
      console.warn('Inpulse Response delay time must be less than 100.');

      return;
    }
    this._delay = value;
    this.buildImpulse();
    console.info(`Set inpulse response delay time to ${value}sec.`);
  }

  /**
   * Reverse the impulse response.
   * @param {boolean} reverse
   * @returns {void}
   */
  reverse (reverse) {
    this._reverse = reverse;
    this.buildImpulse();
    console.info(`Inpulse response is ${reverse ? '' : 'not '}reversed.`);
  }

  /**
   * Filter type.
   * @param {BiquadFilterType} type
   * @returns {void}
   */
  filterType (type) {
    this._filterType = type;
    this.filterNode.type = type;

    console.info(`Set filter type to ${type}`);
  }

  /**
   * Filter frequency.
   * @param {number} freq
   * @returns {void}
   */
  filterFreq (freq) {
    if (!this.inRange(freq, 20, 5000)) {
      console.warn('Filter frequrncy must be between 20 and 5000.');

      return;
    }

    this._freq = freq;
    this.filterNode.frequency.value = this._freq;

    console.info(`Set filter frequency to ${freq}Hz.`);
  }

  /**
   * Filter quality.
   * @param {number} q
   * @returns {void}
   */
  filterQ (q) {
    if (!this.inRange(q, 0, 10)) {
      console.warn('Filter quality value must be between 0 and 1.');

      return;
    }

    this._q = q;
    this.filterNode.Q.value = this._q;

    console.info(`Set filter quality to ${q}.`);
  }

  /**
   * return true if in range, otherwise false
   * @private
   * @param {number} x Target value
   * @param {number} min Minimum value
   * @param {number} max Maximum value
   * @return {boolean}
   */
  inRange (x, min, max) {
    return ((x - min) * (x - max) <= 0);
  }

  /**
   * Utility function for building an impulse response
   * from the module parameters.
   * @returns {void}
   * @private
   */
  buildImpulse () {
    // インパルス応答生成ロジック
    /** @type {number} サンプリングレート */
    const rate = this.ctx.sampleRate;
    /** @type {number} インパルス応答の演奏時間 */
    const length = Math.max(rate * this._time, 1);
    /** @type {number} インパルス応答が始まるまでの遅延時間 */
    const delayDuration = rate * this._delay;
    /** @type {AudioBuffer} インパルス応答バッファ（今の所ステレオのみ） */
    const impulse = this.ctx.createBuffer(2, length, rate);
    /** @type {Array<number>|ArrayBufferView} 左チャンネル */
    const impulseL = new Float32Array(length);
    /** @type {Array<number>|ArrayBufferView} 右チャンネル */
    const impulseR = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      let n = 0;

      if (i < delayDuration) {
        // Delay Effect
        impulseL[i] = 0;
        impulseR[i] = 0;
        n = this._reverse ? length - (i - delayDuration) : i - delayDuration;
      } else {
        n = this._reverse ? length - i : i;
      }

      const pow = (1 - n / length) ** this._decay;

      impulseL[i] = this.getNoise(pow);
      impulseR[i] = this.getNoise(pow);
    }

    // @ts-ignore
    impulse.getChannelData(0).set(impulseL);
    // @ts-ignore
    impulse.getChannelData(1).set(impulseR);

    this.convolverNode.buffer = impulse;
  }

  /**
   * Generate white noise
   * @param {number} rate Attenuation rate
   * @return {number}
   * @private
   */
  getNoise (rate) {
    return (Math.random() * 2 - 1) * rate;
  }
}
