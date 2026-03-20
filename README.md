<div align="center">

<img src="./public/waveform-line.gif" width="600" alt="audio-pulse waveform" />

# audio-pulse

**React audio recorder with real-time waveform visualization**

Record MP3 audio from the microphone, visualize live sound waves on a canvas,  
and control recording state with a simple hook — fully typed with TypeScript.

[![npm version](https://img.shields.io/npm/v/audio-pulse?style=flat-square&color=3b82f6)](https://www.npmjs.com/package/audio-pulse)
[![npm downloads](https://img.shields.io/npm/dm/audio-pulse?style=flat-square&color=10b981)](https://www.npmjs.com/package/audio-pulse)
[![bundle size](https://img.shields.io/bundlephobia/minzip/audio-pulse?style=flat-square&color=f97316)](https://bundlephobia.com/package/audio-pulse)
[![license](https://img.shields.io/npm/l/audio-pulse?style=flat-square&color=94a3b8)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3b82f6?style=flat-square)](https://www.typescriptlang.org)

[Documentation](https://audio-pulse-playground.vercel.app) · [Playground](https://audio-pulse-playground.vercel.app/#playground) · [npm](https://www.npmjs.com/package/audio-pulse) · [Report Bug](https://github.com/ashishvora1997/audio-pulse/issues)

</div>

---

## Features

- ✅ **Zero config** — one component, plug in and record
- 🎨 **5 built-in variants** — line, bars, mirror, dots, circle
- 🪝 **`useAudioRecorder` hook** — clean state management, no boilerplate
- 🔷 **TypeScript-first** — full types included, no `@types/` package needed
- 📦 **Tiny bundle** — built with tsup + esbuild, tree-shakeable ESM + CJS
- 🌐 **Cross-browser** — MP3 output via polyfill (Safari + Firefox support)
- 🎛️ **Fully customizable** — colors, size, line width, or bring your own canvas

---

## Variants

| | Name | Description |
|---|---|---|
| ![line](./public/waveform-line.gif) | `line` | Smooth bezier waveform — default |
| ![bars](./public/waveform-bars.gif) | `bars` | Frequency bar chart |
| ![mirror](./public/waveform-mirror.gif) | `mirror` | Waveform reflected top + bottom |
| ![dots](./public/waveform-dots.gif) | `dots` | Particle dot wave |
| ![circle](./public/waveform-circle.gif) | `circle` | Radial circular waveform |

---

## Installation

```bash
npm install audio-pulse
# or
yarn add audio-pulse
# or
pnpm add audio-pulse
```

> **Peer dependencies** — `react >= 17` and `react-dom >= 17` must be installed in your project.

---

## Quick Start

```tsx
import { useState } from 'react';
import AudioPulse, {
  useAudioRecorder,
  RecordState,
} from 'audio-pulse';
import type { AudioResult } from 'audio-pulse';

export default function Recorder() {
  const { recordState, start, pause, stop, reset } = useAudioRecorder();
  const [audio, setAudio] = useState<AudioResult | null>(null);

  const handleStop = (result: AudioResult) => setAudio(result);

  const handleStartAgain = () => {
    setAudio(null);
    reset();
    setTimeout(start, 0);
  };

  return (
    <div>
      {/* Always mounted — use display:none, never unmount */}
      <div style={{ display: audio ? 'none' : 'block' }}>
        <AudioPulse
          state={recordState}
          onStop={handleStop}
          onError={console.error}
        />
      </div>

      {audio && <audio controls src={audio.url} />}

      {recordState === RecordState.NONE && !audio && (
        <button onClick={start}>Start</button>
      )}
      {recordState === RecordState.START && (
        <>
          <button onClick={pause}>Pause</button>
          <button onClick={stop}>Stop</button>
        </>
      )}
      {recordState === RecordState.PAUSE && (
        <>
          <button onClick={start}>Resume</button>
          <button onClick={stop}>Stop</button>
        </>
      )}
      {audio && (
        <button onClick={handleStartAgain}>Record Again</button>
      )}
    </div>
  );
}
```

> ⚠️ **Keep `<AudioPulse>` always mounted.** Unmounting it tears down the internal Web Audio contexts.
> Use `display: none` to hide it rather than conditional rendering — this is why the example above
> wraps it in a div with a style toggle.

---

## Props

### Core

| Prop | Type | Default | Description |
|---|---|---|---|
| `state` | `RecordStateType` | **required** | Current recording state |
| `onStop` | `(result: AudioResult) => void` | — | Called with audio data when recording stops |
| `onError` | `(error: string) => void` | — | Called when mic access is denied |
| `variant` | `VisualizerVariantType` | `'line'` | Visualizer style |

### Appearance

| Prop | Type | Default | Description |
|---|---|---|---|
| `foregroundColor` | `string` | `'#3b82f6'` | Waveform stroke / fill color |
| `backgroundColor` | `string` | `'transparent'` | Canvas background fill |
| `lineWidth` | `number` | `2` | Stroke width in px (line, mirror, circle) |
| `height` | `number` | `60` | Canvas height in px |
| `className` | `string` | `''` | CSS class on the outer wrapper |
| `style` | `CSSProperties` | `{}` | Inline style on the outer wrapper |
| `canvasStyle` | `CSSProperties` | `{}` | Inline style on the `<canvas>` |

### Audio Analysis

| Prop | Type | Default | Description |
|---|---|---|---|
| `smoothingTimeConstant` | `number` | `0.8` | Analyser smoothing 0–1. Lower = more reactive |
| `fftSize` | `number` | `512` | FFT size (power of 2). Lower = more movement |
| `barSkipBins` | `number` | `4` | `bars` only — skip DC offset bins (stops idle jumping) |
| `barSilenceThreshold` | `number` | `20` | `bars` only — min value 0–255 to render a bar |

### Custom Renderer

| Prop | Type | Description |
|---|---|---|
| `renderVisualizer` | `(ref: RefObject<HTMLCanvasElement>) => ReactNode` | Replace the default canvas entirely |

---

## `useAudioRecorder` Hook

```ts
const { recordState, start, pause, stop, toggle, reset } = useAudioRecorder();
```

| Return | Type | Description |
|---|---|---|
| `recordState` | `RecordStateType` | Current state |
| `start` | `() => void` | Start or resume recording |
| `pause` | `() => void` | Pause recording |
| `stop` | `() => void` | Stop and trigger `onStop` |
| `toggle` | `() => void` | Toggle START ↔ PAUSE |
| `reset` | `() => void` | Reset back to NONE |

**State machine:**

```
NONE ──start()──► START ──pause()──► PAUSE
                    │                  │
                    └────stop()────────┘
                              │
                            STOP
                              │
                         reset() → NONE
```

---

## Variants

```tsx
import { VisualizerVariant } from 'audio-pulse';

<AudioPulse variant={VisualizerVariant.LINE}   ... />  // smooth bezier wave (default)
<AudioPulse variant={VisualizerVariant.BARS}   ... />  // frequency bar chart
<AudioPulse variant={VisualizerVariant.MIRROR} ... />  // wave mirrored top + bottom
<AudioPulse variant={VisualizerVariant.DOTS}   ... />  // dot particle wave
<AudioPulse variant={VisualizerVariant.CIRCLE} ... />  // radial circular wave

// Or plain strings:
<AudioPulse variant="bars" ... />
```

---

## Types

All types are exported directly from `audio-pulse`. No `@types/` package needed.

```ts
import type {
  AudioResult,
  RecordStateType,
  VisualizerVariantType,
  AudioPulseProps,
  UseAudioRecorderReturn,
} from 'audio-pulse';

// AudioResult — passed to onStop
interface AudioResult {
  blob: Blob;    // Raw MP3 Blob
  url:  string;  // Object URL — use in <audio src={url} />
  type: string;  // 'audio/mp3'
}
```

---

## Examples

### Light theme

```tsx
<AudioPulse
  state={recordState}
  onStop={handleStop}
  variant="mirror"
  foregroundColor="#3b82f6"
  backgroundColor="#f0f5ff"
  lineWidth={2}
  height={80}
  style={{
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #b4c8e6',
  }}
/>
```

### Custom canvas renderer

```tsx
<AudioPulse
  state={recordState}
  onStop={handleStop}
  renderVisualizer={(ref) => (
    <div style={{ background: '#000', padding: 16, borderRadius: 8 }}>
      <canvas
        ref={ref}
        width={500}
        height={120}
        style={{ display: 'block', width: '100%' }}
      />
    </div>
  )}
/>
```

### Upload recording to a server

```tsx
const handleStop = async (audio: AudioResult) => {
  const formData = new FormData();
  formData.append('file', audio.blob, 'recording.mp3');

  await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
};
```

---

## Advanced — Raw Context Access

For fully custom visualizers, access the internal Web Audio API contexts directly:

```tsx
import {
  MediaStreamProvider,
  InputAudioProvider,
  AudioAnalyserProvider,
  useAudioAnalyser,
  useMediaStream,
} from 'audio-pulse';

function MyVisualizer() {
  const { analyser } = useAudioAnalyser();
  // Use analyser.getByteTimeDomainData() or
  // analyser.getByteFrequencyData() in a rAF loop

  const { start, stop, url, isStop } = useMediaStream();

  return <canvas id="my-canvas" />;
}

export default function App() {
  return (
    <MediaStreamProvider audio video={false}>
      <InputAudioProvider>
        <AudioAnalyserProvider smoothingTimeConstant={0.8} fftSize={512}>
          <MyVisualizer />
        </AudioAnalyserProvider>
      </InputAudioProvider>
    </MediaStreamProvider>
  );
}
```

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome | ✅ Native |
| Edge | ✅ Native |
| Firefox | ✅ via polyfill |
| Safari | ✅ via polyfill |
| Chrome Android | ✅ Native |
| Safari iOS | ✅ via polyfill |

> **HTTPS required** — microphone access via `getUserMedia` only works on secure origins (HTTPS or localhost).

---

## Contributing

Contributions, issues and feature requests are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

MIT © [Ashish Vora](https://github.com/ashishvora1997)

---

<div align="center">

Made with ❤️ · [audio-pulse-playground](https://audio-pulse-playground.vercel.app) · [npm](https://www.npmjs.com/package/audio-pulse) · [GitHub](https://github.com/ashishvora1997/audio-pulse)

</div>