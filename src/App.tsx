import { useState, useEffect, useRef } from 'react';
import AudioPulse, { useAudioRecorder, RecordState } from 'audio-pulse';
import type { AudioResult, VisualizerVariantType } from 'audio-pulse';
import './App.css';
// ─── Types ────────────────────────────────────────────────────────────────────

interface Config {
  variant: VisualizerVariantType;
  foregroundColor: string;
  backgroundColor: string;
  lineWidth: number;
  height: number;
  smoothingTimeConstant: number;
  fftSize: number;
}

// ─── Code Generator ──────────────────────────────────────────────────────────

function generateCode(cfg: Config): string {
  const lines: string[] = [];
  lines.push(`import AudioPulse, {`);
  lines.push(`  useAudioRecorder,`);
  lines.push(`  RecordState,`);
  lines.push(`  VisualizerVariant,`);
  lines.push(`} from 'audio-pulse';`);
  lines.push(``);
  lines.push(`export default function Recorder() {`);
  lines.push(`  const { recordState, start,`);
  lines.push(`          pause, stop, reset`);
  lines.push(`  } = useAudioRecorder();`);
  lines.push(``);
  lines.push(`  return (`);
  lines.push(`    <>`);
  lines.push(`      <AudioPulse`);
  lines.push(`        state={recordState}`);
  lines.push(`        onStop={(audio) => {`);
  lines.push(`          console.log(audio.url);`);
  lines.push(`        }}`);
  lines.push(`        variant="${cfg.variant}"`);
  if (cfg.foregroundColor !== '#3b82f6')
    lines.push(`        foregroundColor="${cfg.foregroundColor}"`);
  if (cfg.backgroundColor !== 'transparent')
    lines.push(`        backgroundColor="${cfg.backgroundColor}"`);
  if (cfg.lineWidth !== 2) lines.push(`        lineWidth={${cfg.lineWidth}}`);
  if (cfg.height !== 80) lines.push(`        height={${cfg.height}}`);
  if (cfg.smoothingTimeConstant !== 0.8)
    lines.push(`        smoothingTimeConstant={${cfg.smoothingTimeConstant}}`);
  if (cfg.fftSize !== 512) lines.push(`        fftSize={${cfg.fftSize}}`);
  lines.push(`      />`);
  lines.push(``);
  lines.push(`      {/* Controls */}`);
  lines.push(`      {recordState === RecordState.NONE && (`);
  lines.push(`        <button onClick={start}>Start</button>`);
  lines.push(`      )}`);
  lines.push(`      {recordState === RecordState.START && (`);
  lines.push(`        <>`);
  lines.push(`          <button onClick={pause}>Pause</button>`);
  lines.push(`          <button onClick={stop}>Stop</button>`);
  lines.push(`        </>`);
  lines.push(`      )}`);
  lines.push(`      {recordState === RecordState.PAUSE && (`);
  lines.push(`        <>`);
  lines.push(`          <button onClick={start}>Resume</button>`);
  lines.push(`          <button onClick={stop}>Stop</button>`);
  lines.push(`        </>`);
  lines.push(`      )}`);
  lines.push(`    </>`);
  lines.push(`  );`);
  lines.push(`}`);
  return lines.join('\n');
}

// ─── Syntax Highlight ────────────────────────────────────────────────────────

function highlight(code: string) {
  const keywords = [
    'import',
    'export',
    'default',
    'function',
    'return',
    'const',
    'from',
    'type',
  ];
  const parts: { text: string; cls: string }[] = [];

  const lines = code.split('\n');
  lines.forEach((line, li) => {
    // tokenise each line character by character using regex
    const tokens = line.split(/(\s+|[{}()<>=,;/'"]|\b\w+\b)/g).filter(Boolean);
    tokens.forEach((tok) => {
      let cls = 'code-plain';
      if (keywords.includes(tok)) cls = 'code-keyword';
      else if (tok.startsWith('"') || tok.startsWith("'")) cls = 'code-string';
      else if (/^[A-Z]/.test(tok)) cls = 'code-component';
      else if (
        /^[a-z]+State|start|pause|stop|reset|onStop|variant|foreground|background|lineWidth|height|smoothing|fftSize/.test(
          tok
        )
      )
        cls = 'code-prop';
      else if (/^\d/.test(tok)) cls = 'code-number';
      else if (
        tok === '{' ||
        tok === '}' ||
        tok === '(' ||
        tok === ')' ||
        tok === '<' ||
        tok === '>' ||
        tok === '/' ||
        tok === '='
      )
        cls = 'code-punct';
      parts.push({ text: tok, cls });
    });
    if (li < lines.length - 1) parts.push({ text: '\n', cls: 'code-plain' });
  });

  return parts;
}

// ─── Slider ──────────────────────────────────────────────────────────────────

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="slider-row">
      <div className="slider-label">
        <span>{label}</span>
        <span className="slider-value">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

const PRESETS: Record<string, Config> = {
  Default: {
    variant: 'line',
    foregroundColor: '#3b82f6',
    backgroundColor: '#0f172a',
    lineWidth: 2,
    height: 80,
    smoothingTimeConstant: 0.8,
    fftSize: 512,
  },
  Neon: {
    variant: 'mirror',
    foregroundColor: '#22d3ee',
    backgroundColor: '#020617',
    lineWidth: 2,
    height: 100,
    smoothingTimeConstant: 0.75,
    fftSize: 256,
  },
  Warm: {
    variant: 'bars',
    foregroundColor: '#f97316',
    backgroundColor: '#1c0a00',
    lineWidth: 2,
    height: 100,
    smoothingTimeConstant: 0.7,
    fftSize: 512,
  },
  Minimal: {
    variant: 'dots',
    foregroundColor: '#94a3b8',
    backgroundColor: 'transparent',
    lineWidth: 1.5,
    height: 60,
    smoothingTimeConstant: 0.85,
    fftSize: 512,
  },
  Vivid: {
    variant: 'circle',
    foregroundColor: '#a855f7',
    backgroundColor: '#0c0010',
    lineWidth: 2.5,
    height: 120,
    smoothingTimeConstant: 0.8,
    fftSize: 256,
  },
};

const VARIANTS: VisualizerVariantType[] = [
  'line',
  'bars',
  'mirror',
  'dots',
  'circle',
];

export default function App() {
  const { recordState, start, pause, stop, reset } = useAudioRecorder();
  const [audio, setAudio] = useState<AudioResult | null>(null);
  const [cfg, setCfg] = useState<Config>(PRESETS.Default);
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState('Default');
  const [typedLines, setTypedLines] = useState(0);
  const codeRef = useRef<HTMLDivElement>(null);

  const code = generateCode(cfg);
  const totalLines = code.split('\n').length;

  // Animate code lines when config changes
  useEffect(() => {
    setTypedLines(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTypedLines(i);
      if (i >= totalLines) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [cfg]);

  const update = (patch: Partial<Config>) => {
    setCfg((prev) => ({ ...prev, ...patch }));
    setActivePreset('');
  };

  const applyPreset = (name: string) => {
    setCfg(PRESETS[name]);
    setActivePreset(name);
    setAudio(null);
    reset();
  };

  const handleStop = (result: AudioResult) => setAudio(result);

  const handleStartAgain = () => {
    setAudio(null);
    reset();
    setTimeout(start, 0);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isRecording = recordState === RecordState.START;
  const isPaused = recordState === RecordState.PAUSE;
  const isIdle = recordState === RecordState.NONE;

  const visLines = code.split('\n').slice(0, typedLines);
  const tokens = highlight(visLines.join('\n'));

  return (
    <>
      <div className="lab">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-header">
            <div className="logo-mark">AP</div>
            <div className="topbar-left">
              <span className="logo-text">audio-pulse</span>
              <span className="logo-badge">playground</span>
            </div>
          </div>
          <div className="topbar-right">
            <a
              className="top-btn"
              href="https://www.npmjs.com/package/audio-pulse"
              target="_blank"
              rel="noreferrer"
            >
              npm
            </a>
            <a
              className="top-btn"
              href="https://github.com/ashishvora1997/audio-pulse"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <div className="main">
          {/* ── Left panel ── */}
          <div className="panel-left">
            {/* Presets */}
            {/* <div className="panel-section">
              <div className="section-label">Presets</div>
              <div className="presets-grid">
                {Object.keys(PRESETS).map((name) => (
                  <button
                    key={name}
                    className={`preset-btn ${
                      activePreset === name ? 'active' : ''
                    }`}
                    onClick={() => applyPreset(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Variant */}
            <div className="panel-section">
              <div className="section-label">variant</div>
              <div className="variant-tabs">
                {VARIANTS.map((v) => (
                  <button
                    key={v}
                    className={`var-tab ${cfg.variant === v ? 'active' : ''}`}
                    onClick={() => update({ variant: v })}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="panel-section">
              <div className="section-label">Colors</div>
              <div className="color-row">
                <div className="color-field">
                  <label>foregroundColor</label>
                  <div className="color-input-wrap">
                    <div
                      className="color-swatch"
                      style={{ background: cfg.foregroundColor }}
                    >
                      <input
                        type="color"
                        value={cfg.foregroundColor}
                        onChange={(e) =>
                          update({ foregroundColor: e.target.value })
                        }
                      />
                    </div>
                    <input
                      className="color-hex"
                      value={cfg.foregroundColor}
                      onChange={(e) =>
                        update({ foregroundColor: e.target.value })
                      }
                      maxLength={7}
                    />
                  </div>
                </div>
                <div className="color-field">
                  <label>backgroundColor</label>
                  <div className="color-input-wrap">
                    <div
                      className="color-swatch"
                      style={{
                        background:
                          cfg.backgroundColor === 'transparent'
                            ? 'var(--border2)'
                            : cfg.backgroundColor,
                      }}
                    >
                      <input
                        type="color"
                        value={
                          cfg.backgroundColor === 'transparent'
                            ? '#080c14'
                            : cfg.backgroundColor
                        }
                        onChange={(e) =>
                          update({ backgroundColor: e.target.value })
                        }
                      />
                    </div>
                    <input
                      className="color-hex"
                      value={cfg.backgroundColor}
                      onChange={(e) =>
                        update({ backgroundColor: e.target.value })
                      }
                      maxLength={11}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="panel-section">
              <div className="section-label">Props</div>
              <Slider
                label="lineWidth"
                value={cfg.lineWidth}
                min={0.5}
                max={8}
                step={0.5}
                unit="px"
                onChange={(v) => update({ lineWidth: v })}
              />
              <Slider
                label="height"
                value={cfg.height}
                min={40}
                max={200}
                step={10}
                unit="px"
                onChange={(v) => update({ height: v })}
              />
              <Slider
                label="smoothingTimeConstant"
                value={cfg.smoothingTimeConstant}
                min={0}
                max={1}
                step={0.05}
                onChange={(v) => update({ smoothingTimeConstant: v })}
              />
              <Slider
                label="fftSize"
                value={cfg.fftSize}
                min={64}
                max={2048}
                step={64}
                onChange={(v) => update({ fftSize: v })}
              />
            </div>
          </div>

          {/* ── Right panel ── */}
          <div className="panel-right">
            {/* Preview */}
            <div className="preview-pane">
              <div className="pane-header">
                <div className="pane-title">
                  <div
                    className={`dot ${
                      isRecording ? 'red' : isPaused ? 'amber' : 'green'
                    }`}
                  />
                  Preview
                </div>
                <div
                  className={`status-chip ${
                    isRecording ? 'recording' : isPaused ? 'paused' : 'idle'
                  }`}
                >
                  {isRecording ? '● REC' : isPaused ? '⏸ PAUSED' : '○ IDLE'}
                </div>
              </div>

              <div className="preview-body">
                {/* AudioPulse — always mounted */}
                <div
                  className="wave-container"
                  style={{ display: audio ? 'none' : 'block' }}
                >
                  <AudioPulse
                    state={recordState}
                    onStop={handleStop}
                    onError={(err) => console.error(err)}
                    variant={cfg.variant}
                    foregroundColor={cfg.foregroundColor}
                    backgroundColor={
                      cfg.backgroundColor === 'transparent'
                        ? 'transparent'
                        : cfg.backgroundColor
                    }
                    lineWidth={cfg.lineWidth}
                    height={cfg.height}
                    smoothingTimeConstant={cfg.smoothingTimeConstant}
                    fftSize={cfg.fftSize}
                  />
                </div>

                {audio && (
                  <div className="audio-player">
                    <div className="saved-label">Recording saved</div>
                    <audio controls src={audio.url} />
                  </div>
                )}

                <div className="record-controls">
                  {isIdle && !audio && (
                    <button className="rec-btn start" onClick={start}>
                      <div
                        className="rec-dot"
                        style={{ animation: 'none', background: 'white' }}
                      />
                      Start Recording
                    </button>
                  )}
                  {isRecording && (
                    <>
                      <button className="rec-btn pause" onClick={pause}>
                        ⏸ Pause
                      </button>
                      <button className="rec-btn stop" onClick={stop}>
                        ⏹ Stop
                      </button>
                    </>
                  )}
                  {isPaused && (
                    <>
                      <button className="rec-btn start" onClick={start}>
                        ▶ Resume
                      </button>
                      <button className="rec-btn stop" onClick={stop}>
                        ⏹ Stop
                      </button>
                    </>
                  )}
                  {audio && (
                    <button
                      className="rec-btn again"
                      onClick={handleStartAgain}
                    >
                      ↺ Record Again
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Code pane */}
            <div className="code-pane">
              <div className="pane-header">
                <div className="pane-title">
                  <span style={{ color: 'var(--text3)' }}>Recorder.tsx</span>
                </div>
                <div className="code-actions">
                  <button
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                    onClick={copyCode}
                  >
                    {copied ? '✓ copied' : 'copy'}
                  </button>
                </div>
              </div>
              <div className="code-body" ref={codeRef}>
                <pre>
                  {visLines.map((line, i) => (
                    <div key={i} className="code-line">
                      <span className="line-num">{i + 1}</span>
                      <span>
                        {highlight(line).map((tok, j) => (
                          <span key={j} className={tok.cls}>
                            {tok.text}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                  {typedLines < totalLines && <span className="cursor" />}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
