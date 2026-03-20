import { useState } from 'react';
import './docs.css';

// ─── Types ───────────────────────────────────────────────────────────────────

type Section =
  | 'installation'
  | 'quickstart'
  | 'variants'
  | 'props'
  | 'hook'
  | 'types'
  | 'advanced'
  | 'browser';

// ─── Code Block ──────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = 'tsx' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const keywords = ['import', 'export', 'default', 'function', 'return', 'const',
    'from', 'type', 'interface', 'null', 'undefined', 'true', 'false', 'async',
    'await', 'let', 'var', 'extends', 'npm', 'pnpm', 'yarn'];

  const highlight = (line: string) => {
    if (lang === 'bash') {
      return [{ text: line, cls: 'code-string' }];
    }
    const tokens = line.split(/(\s+|[{}()<>=,;:/'"`]|\b\w+\b)/g).filter(Boolean);
    return tokens.map(tok => {
      let cls = 'code-plain';
      if (keywords.includes(tok)) cls = 'code-keyword';
      else if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith('`')) cls = 'code-string';
      else if (/^[A-Z][a-zA-Z]+$/.test(tok)) cls = 'code-component';
      else if (/^(state|variant|foregroundColor|backgroundColor|lineWidth|height|smoothingTimeConstant|fftSize|barSkipBins|barSilenceThreshold|className|style|canvasStyle|renderVisualizer|onStop|onError|recordState|start|pause|stop|toggle|reset|blob|url|type|analyser|source|audioCtx|stream|isPause|isStop|isError)$/.test(tok)) cls = 'code-prop';
      else if (/^[\d.]+$/.test(tok)) cls = 'code-number';
      else if (/^[{}()<>=,;:/]$/.test(tok)) cls = 'code-punct';
      return { text: tok, cls };
    });
  };

  const lines = code.trim().split('\n');

  return (
    <div className="doc-code-block">
      <div className="doc-code-header">
        <span className="doc-code-lang">{lang}</span>
        <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
          {copied ? '✓ copied' : 'copy'}
        </button>
      </div>
      <div className="doc-code-body">
        <pre>
          {lines.map((line, i) => (
            <div key={i} className="code-line">
              <span className="line-num">{i + 1}</span>
              <span>
                {highlight(line).map((tok, j) => (
                  <span key={j} className={tok.cls}>{tok.text}</span>
                ))}
              </span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// ─── Props Table ─────────────────────────────────────────────────────────────

function PropsTable({ rows }: {
  rows: { prop: string; type: string; default?: string; description: string; badge?: string }[]
}) {
  return (
    <div className="props-table-wrap">
      <table className="props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.prop}>
              <td>
                <code className="inline-code">{row.prop}</code>
                {row.badge && <span className="required-badge">{row.badge}</span>}
              </td>
              <td><code className="inline-code type">{row.type}</code></td>
              <td>{row.default ? <code className="inline-code dim">{row.default}</code> : <span className="dim">—</span>}</td>
              <td className="desc-cell">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Inline Badge ─────────────────────────────────────────────────────────────

// function Tag({ children, color = 'blue' }: { children: string; color?: 'blue' | 'green' | 'amber' }) {
//   return <span className={`tag tag-${color}`}>{children}</span>;
// }

// ─── Nav Item ─────────────────────────────────────────────────────────────────

function NavItem({ id, label, active, onClick }: {
  id: Section; label: string; active: boolean; onClick: (id: Section) => void
}) {
  return (
    <button
      className={`nav-item ${active ? 'active' : ''}`}
      onClick={() => onClick(id)}
    >
      {label}
    </button>
  );
}

// ─── Variant Card ─────────────────────────────────────────────────────────────

function VariantCard({ name, description, gif }: { name: string; description: string; gif: string }) {
  return (
    <div className="variant-card">
      <div className="variant-preview">
        <img src={gif} alt={`${name} variant`} />
      </div>
      <div className="variant-info">
        <code className="inline-code">{name}</code>
        <p>{description}</p>
      </div>
    </div>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────

function H2({ children }: { children: string }) {
  return <h2 className="doc-h2">{children}</h2>;
}

function H3({ children }: { children: string }) {
  return <h3 className="doc-h3">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="doc-p">{children}</p>;
}

// ─── Docs Page ────────────────────────────────────────────────────────────────

// const NAV: { id: Section; label: string }[] = [
//   { id: 'installation', label: 'Installation' },
//   { id: 'quickstart',   label: 'Quick Start' },
//   { id: 'variants',     label: 'Variants' },
//   { id: 'props',        label: 'Props' },
//   { id: 'hook',         label: 'useAudioRecorder' },
//   { id: 'types',        label: 'Types' },
//   { id: 'advanced',     label: 'Advanced' },
//   { id: 'browser',      label: 'Browser Support' },
// ];

export default function Docs() {
  const [active, setActive] = useState<Section>('installation');

  const scrollTo = (id: Section) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="docs-layout">

      {/* ── Sidebar ── */}
      <aside className="docs-sidebar">
        <div className="sidebar-group">
          <div className="sidebar-group-label">Getting Started</div>
          <NavItem id="installation" label="Installation" active={active === 'installation'} onClick={scrollTo} />
          <NavItem id="quickstart" label="Quick Start" active={active === 'quickstart'} onClick={scrollTo} />
        </div>
        <div className="sidebar-group">
          <div className="sidebar-group-label">Components</div>
          <NavItem id="variants" label="Variants" active={active === 'variants'} onClick={scrollTo} />
          <NavItem id="props" label="Props" active={active === 'props'} onClick={scrollTo} />
        </div>
        <div className="sidebar-group">
          <div className="sidebar-group-label">API</div>
          <NavItem id="hook" label="useAudioRecorder" active={active === 'hook'} onClick={scrollTo} />
          <NavItem id="types" label="Types" active={active === 'types'} onClick={scrollTo} />
          <NavItem id="advanced" label="Advanced" active={active === 'advanced'} onClick={scrollTo} />
        </div>
        <div className="sidebar-group">
          <div className="sidebar-group-label">Reference</div>
          <NavItem id="browser" label="Browser Support" active={active === 'browser'} onClick={scrollTo} />
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="docs-content">

        {/* ── Installation ── */}
        <section id="installation" className="doc-section">
          <H2>Installation</H2>
          <P>Install audio-pulse from npm. React 17 or higher is required as a peer dependency.</P>
          <CodeBlock lang="bash" code={`npm install audio-pulse`} />
          <CodeBlock lang="bash" code={`yarn add audio-pulse`} />
          <CodeBlock lang="bash" code={`pnpm add audio-pulse`} />
          <div className="callout callout-info">
            <span className="callout-icon">ℹ</span>
            <div>
              <strong>Peer dependencies</strong> — <code className="inline-code">react</code> and{' '}
              <code className="inline-code">react-dom</code> {'>'}= 17.0.0 must already be installed in your project.
            </div>
          </div>
        </section>

        {/* ── Quick Start ── */}
        <section id="quickstart" className="doc-section">
          <H2>Quick Start</H2>
          <P>The recommended way to use audio-pulse is with the <code className="inline-code">useAudioRecorder</code> hook.
          It manages all recording state for you.</P>
          <CodeBlock code={`import { useState } from 'react';
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
}`} />

          <div className="callout callout-warn">
            <span className="callout-icon">⚠</span>
            <div>
              <strong>Always keep {'<AudioPulse>'} mounted.</strong> Unmounting it tears down the internal
              Web Audio contexts. Use <code className="inline-code">display: none</code> to hide it
              instead of conditional rendering. This is why the example above wraps it in a div with
              a style toggle rather than <code className="inline-code">{'audio && <AudioPulse />'}</code>.
            </div>
          </div>
        </section>

        {/* ── Variants ── */}
        <section id="variants" className="doc-section">
          <H2>Variants</H2>
          <P>Switch between 5 built-in visualizer styles using the <code className="inline-code">variant</code> prop.</P>

          <div className="variants-grid">
            <VariantCard name="line" gif="./waveform-line.gif"
              description="Smooth bezier waveform. The default. Works great for all use cases." />
            <VariantCard name="bars" gif="./waveform-bars.gif"
              description="Frequency bar chart using FFT data. Bars animate with your voice." />
            <VariantCard name="mirror" gif="./waveform-mirror.gif"
              description="Waveform reflected symmetrically above and below the centre line." />
            <VariantCard name="dots" gif="./waveform-dots.gif"
              description="Particle dot wave. Dot size scales with amplitude deviation." />
            <VariantCard name="circle" gif="./waveform-circle.gif"
              description="Radial waveform plotted around a circle. Pulsates with your voice." />
          </div>

          <CodeBlock code={`import AudioPulse, { VisualizerVariant } from 'audio-pulse';

// Using the constant (recommended — full TypeScript autocomplete)
<AudioPulse variant={VisualizerVariant.BARS}   state={recordState} onStop={handleStop} />
<AudioPulse variant={VisualizerVariant.MIRROR} state={recordState} onStop={handleStop} />
<AudioPulse variant={VisualizerVariant.DOTS}   state={recordState} onStop={handleStop} />
<AudioPulse variant={VisualizerVariant.CIRCLE} state={recordState} onStop={handleStop} />
<AudioPulse variant={VisualizerVariant.LINE}   state={recordState} onStop={handleStop} />

// Or plain strings
<AudioPulse variant="bars" state={recordState} onStop={handleStop} />`} />
        </section>

        {/* ── Props ── */}
        <section id="props" className="doc-section">
          <H2>Props</H2>
          <P>All props except <code className="inline-code">state</code> are optional.</P>

          <H3>Core</H3>
          <PropsTable rows={[
            { prop: 'state', type: 'RecordStateType', badge: 'required', description: 'Current recording state. Drive this with useState or useAudioRecorder().' },
            { prop: 'onStop', type: '(result: AudioResult) => void', description: 'Called with the audio blob and URL when recording stops.' },
            { prop: 'onError', type: '(error: string) => void', description: 'Called with an error message string when mic access is denied.' },
            { prop: 'variant', type: 'VisualizerVariantType', default: "'line'", description: "Visualizer style. One of: 'line', 'bars', 'mirror', 'dots', 'circle'." },
          ]} />

          <H3>Appearance</H3>
          <PropsTable rows={[
            { prop: 'foregroundColor', type: 'string', default: "'#3b82f6'", description: 'Waveform stroke or fill color. Any valid CSS color.' },
            { prop: 'backgroundColor', type: 'string', default: "'transparent'", description: "Canvas background fill. Use 'transparent' to let parent background show through." },
            { prop: 'lineWidth', type: 'number', default: '2', description: 'Stroke width in px. Applies to line, mirror, and circle variants.' },
            { prop: 'height', type: 'number', default: '60', description: 'Canvas height in px. Width always fills 100% of the container.' },
            { prop: 'className', type: 'string', default: "''", description: 'Extra CSS class added to the outer wrapper div.' },
            { prop: 'style', type: 'CSSProperties', default: '{}', description: 'Inline style applied to the outer wrapper div.' },
            { prop: 'canvasStyle', type: 'CSSProperties', default: '{}', description: 'Inline style applied directly to the canvas element.' },
          ]} />

          <H3>Audio Analysis</H3>
          <PropsTable rows={[
            { prop: 'smoothingTimeConstant', type: 'number', default: '0.8', description: 'AnalyserNode smoothing (0–1). Lower = more reactive and taller waves. Higher = smoother.' },
            { prop: 'fftSize', type: 'number', default: '512', description: 'AnalyserNode FFT size. Must be a power of 2 (32–32768). Lower = more dramatic movement.' },
            { prop: 'barSkipBins', type: 'number', default: '4', description: 'bars only — number of low-frequency bins to skip. Prevents DC offset hum from making leftmost bars jump in silence.' },
            { prop: 'barSilenceThreshold', type: 'number', default: '20', description: 'bars only — minimum bin value (0–255) needed to render a bar. Hides idle background noise.' },
          ]} />

          <H3>Custom Renderer</H3>
          <PropsTable rows={[
            { prop: 'renderVisualizer', type: '(ref: RefObject<HTMLCanvasElement>) => ReactNode', description: 'Custom render prop. Replaces the default canvas entirely. You receive the canvas ref and are responsible for rendering it.' },
          ]} />

          <H3>Example — custom renderer</H3>
          <CodeBlock code={`<AudioPulse
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
      <p style={{ color: '#fff' }}>Recording...</p>
    </div>
  )}
/>`} />
        </section>

        {/* ── Hook ── */}
        <section id="hook" className="doc-section">
          <H2>useAudioRecorder</H2>
          <P>A convenience hook that manages recording state for you. The recommended way to control AudioPulse.</P>

          <CodeBlock code={`import { useAudioRecorder } from 'audio-pulse';

const {
  recordState,  // current state: 'none' | 'start' | 'pause' | 'stop'
  start,        // () => void — begin or resume recording
  pause,        // () => void — pause recording
  stop,         // () => void — stop and trigger onStop
  toggle,       // () => void — toggle between start ↔ pause
  reset,        // () => void — reset back to 'none'
} = useAudioRecorder();`} />

          <PropsTable rows={[
            { prop: 'recordState', type: 'RecordStateType', description: 'The current recording state.' },
            { prop: 'start', type: '() => void', description: 'Set state to START. Also resumes from PAUSE.' },
            { prop: 'pause', type: '() => void', description: 'Set state to PAUSE.' },
            { prop: 'stop', type: '() => void', description: 'Set state to STOP. Triggers the onStop callback with the audio result.' },
            { prop: 'toggle', type: '() => void', description: 'Toggle between START and PAUSE. Starts from NONE or STOP.' },
            { prop: 'reset', type: '() => void', description: 'Set state back to NONE. Use before starting a new recording session.' },
          ]} />

          <H3>State machine</H3>
          <CodeBlock lang="bash" code={`NONE ──start()──► START ──pause()──► PAUSE
                    │                   │
                    └─────stop()────────┘
                               │
                             STOP
                               │
                          reset() → NONE`} />
        </section>

        {/* ── Types ── */}
        <section id="types" className="doc-section">
          <H2>Types</H2>
          <P>All types are exported directly from audio-pulse. No separate @types package needed.</P>

          <H3>RecordState</H3>
          <CodeBlock code={`import { RecordState } from 'audio-pulse';
import type { RecordStateType } from 'audio-pulse';

RecordState.NONE   // 'none'  — idle, initial state
RecordState.START  // 'start' — actively recording
RecordState.PAUSE  // 'pause' — recording paused
RecordState.STOP   // 'stop'  — stopped, onStop fires`} />

          <H3>VisualizerVariant</H3>
          <CodeBlock code={`import { VisualizerVariant } from 'audio-pulse';
import type { VisualizerVariantType } from 'audio-pulse';

VisualizerVariant.LINE    // 'line'
VisualizerVariant.BARS    // 'bars'
VisualizerVariant.MIRROR  // 'mirror'
VisualizerVariant.DOTS    // 'dots'
VisualizerVariant.CIRCLE  // 'circle'`} />

          <H3>AudioResult</H3>
          <P>The object passed to your <code className="inline-code">onStop</code> callback.</P>
          <CodeBlock code={`import type { AudioResult } from 'audio-pulse';

interface AudioResult {
  blob: Blob;    // Raw MP3 Blob — send to server, save to disk, etc.
  url:  string;  // Object URL — use directly in <audio src={url} />
  type: string;  // Always 'audio/mp3'
}`} />

          <H3>UseAudioRecorderReturn</H3>
          <CodeBlock code={`import type { UseAudioRecorderReturn } from 'audio-pulse';

interface UseAudioRecorderReturn {
  recordState: RecordStateType;
  start:  () => void;
  pause:  () => void;
  stop:   () => void;
  toggle: () => void;
  reset:  () => void;
}`} />
        </section>

        {/* ── Advanced ── */}
        <section id="advanced" className="doc-section">
          <H2>Advanced Usage</H2>
          <P>For fully custom visualizers, you can access the internal Web Audio API contexts directly.
          AudioPulse exposes all three provider/hook pairs.</P>

          <CodeBlock code={`import {
  MediaStreamProvider,
  InputAudioProvider,
  AudioAnalyserProvider,
  useAudioAnalyser,
  useMediaStream,
} from 'audio-pulse';

function MyVisualizer() {
  const { analyser } = useAudioAnalyser();
  // analyser is a native AnalyserNode — call
  // analyser.getByteTimeDomainData(data) or
  // analyser.getByteFrequencyData(data) in a rAF loop

  const { start, stop, url, isStop } = useMediaStream();
  // url is { blob, url, type } when recording stops

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
}`} />

          <H3>Context reference</H3>
          <PropsTable rows={[
            { prop: 'useMediaStream', type: 'hook', description: 'Returns stream, url, isPause, isStop, isError, start, stop, pause, resume.' },
            { prop: 'useInputAudio', type: 'hook', description: 'Returns audioCtx (AudioContext) and source (MediaStreamAudioSourceNode).' },
            { prop: 'useAudioAnalyser', type: 'hook', description: 'Returns analyser (AnalyserNode). Connect your own processing chain to it.' },
          ]} />

          <H3>Upload recording to a server</H3>
          <CodeBlock code={`const handleStop = async (audio: AudioResult) => {
  const formData = new FormData();
  formData.append('file', audio.blob, 'recording.mp3');

  await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
};`} />
        </section>

        {/* ── Browser Support ── */}
        <section id="browser" className="doc-section">
          <H2>Browser Support</H2>
          <P>audio-pulse uses <code className="inline-code">audio-recorder-polyfill</code> for MP3 output,
          which provides Safari and Firefox compatibility out of the box.</P>

          <div className="browser-grid">
            {[
              { name: 'Chrome', status: 'supported', note: 'Native MediaRecorder' },
              { name: 'Edge', status: 'supported', note: 'Native MediaRecorder' },
              { name: 'Firefox', status: 'supported', note: 'Via polyfill' },
              { name: 'Safari', status: 'supported', note: 'Via polyfill' },
              { name: 'Chrome Android', status: 'supported', note: 'Native MediaRecorder' },
              { name: 'Safari iOS', status: 'partial', note: 'Requires user gesture' },
            ].map(b => (
              <div key={b.name} className={`browser-card browser-${b.status}`}>
                <div className="browser-status-dot" />
                <div className="browser-name">{b.name}</div>
                <div className="browser-note">{b.note}</div>
              </div>
            ))}
          </div>

          <div className="callout callout-warn">
            <span className="callout-icon">⚠</span>
            <div>
              <strong>HTTPS required.</strong> Microphone access via <code className="inline-code">getUserMedia</code> is
              only available on secure origins (HTTPS or localhost). Your production deployment must use HTTPS.
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}