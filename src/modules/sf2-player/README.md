# sf2-player

sf2-player a library for parsing a sf2 file and issuing play command on it via MIDI numbers.

## Install

```
npm install sf2-player
```

or

```html
<script src="https://unpkg.com/sf2-player"></script>
```

## Usage

```js
import SoundFont from 'https://unpkg.com/sf2-player';

const sf = new SoundFont();

sf.loadSoundFontFromURL('path/to/soundfont.sf2').then(() => {
  sf.bank = sf.banks[0].id;
  sf.program = sf.programs[0].id;

  sf.noteOn(60);

  setTimeout(() => sf.noteOff(60), 1000);
});
```

noteOn and noteOff should be used for mousedown/mouseup and or Web MIDI commands, setTimeout only for demo purpose.

## License

Licensed under the MIT License.

* 2013      by imaya / GREE Inc.
* 2013-2019 by Logue.np
* 2020      by enjikaka
