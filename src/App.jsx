import { useState, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #e8e0d5; min-height: 100vh; }
  .app { min-height: 100vh; background: #0a0a0a; display: flex; flex-direction: column; }
  .header { display: flex; align-items: center; gap: 14px; padding: 22px 36px; border-bottom: 1px solid #1e1e1e; position: relative; overflow: hidden; }
  .header::after { content: ''; position: absolute; bottom: 0; left: 0; width: 100%; height: 1px; background: linear-gradient(90deg, transparent, #ff3c3c55, transparent); }
  .logo-mark { width: 36px; height: 36px; background: #ff3c3c; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', cursive; font-size: 20px; color: #fff; box-shadow: 0 0 20px #ff3c3c55; flex-shrink: 0; }
  .header-title { font-family: 'Bebas Neue', cursive; font-size: 26px; letter-spacing: 2px; color: #fff; line-height: 1; }
  .header-sub { font-size: 11px; color: #555; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 500; margin-top: 2px; }
  .header-tag { margin-left: auto; background: #ff3c3c11; border: 1px solid #ff3c3c44; color: #ff3c3c; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; padding: 5px 12px; border-radius: 4px; }
  .main { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 0; height: calc(100vh - 80px); }
  .panel { display: flex; flex-direction: column; padding: 28px 32px; position: relative; }
  .panel-left { border-right: 1px solid #1a1a1a; }
  .panel-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #444; font-weight: 600; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .panel-label::before { content: ''; width: 18px; height: 1px; background: #333; }
  .script-input { flex: 1; background: #111; border: 1px solid #1e1e1e; border-radius: 10px; padding: 20px; color: #c8c0b5; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.8; resize: none; outline: none; transition: border-color 0.2s; min-height: 0; }
  .script-input::placeholder { color: #2e2e2e; }
  .script-input:focus { border-color: #2a2a2a; }
  .controls { display: flex; align-items: center; gap: 12px; margin-top: 16px; }
  .style-select { flex: 1; background: #111; border: 1px solid #1e1e1e; border-radius: 7px; padding: 10px 14px; color: #888; font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23444' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
  .style-select option { background: #111; }
  .style-select:focus { border-color: #ff3c3c44; }
  .enhance-btn { background: #ff3c3c; color: #fff; border: none; border-radius: 7px; padding: 10px 22px; font-family: 'Bebas Neue', cursive; font-size: 18px; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 8px; white-space: nowrap; }
  .enhance-btn:hover:not(:disabled) { background: #ff5555; box-shadow: 0 0 24px #ff3c3c44; transform: translateY(-1px); }
  .enhance-btn:active:not(:disabled) { transform: translateY(0); }
  .enhance-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .output-area { flex: 1; overflow-y: auto; position: relative; min-height: 0; }
  .empty-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; }
  .empty-icon { font-size: 40px; opacity: 0.3; filter: grayscale(1); }
  .empty-text { font-size: 13px; letter-spacing: 1px; color: #2a2a2a; font-weight: 500; }
  .loading-state { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
  .loading-bars { display: flex; gap: 5px; align-items: flex-end; height: 32px; }
  .loading-bar { width: 4px; background: #ff3c3c; border-radius: 2px; animation: bar-bounce 0.8s ease-in-out infinite; }
  .loading-bar:nth-child(2) { animation-delay: 0.1s; }
  .loading-bar:nth-child(3) { animation-delay: 0.2s; }
  .loading-bar:nth-child(4) { animation-delay: 0.3s; }
  .loading-bar:nth-child(5) { animation-delay: 0.4s; }
  @keyframes bar-bounce { 0%, 100% { height: 6px; opacity: 0.3; } 50% { height: 28px; opacity: 1; } }
  .loading-text { font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #333; font-weight: 600; animation: pulse 1.5s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
  .output-content { background: #111; border: 1px solid #1e1e1e; border-radius: 10px; padding: 20px; font-size: 14px; line-height: 1.9; color: #d5cdc2; white-space: pre-wrap; min-height: 100%; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .output-actions { display: flex; align-items: center; gap: 10px; margin-top: 16px; }
  .copy-btn { background: #111; border: 1px solid #1e1e1e; border-radius: 7px; padding: 9px 16px; color: #555; font-family: 'DM Sans', sans-serif; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 7px; }
  .copy-btn:hover { border-color: #2e2e2e; color: #888; }
  .copy-btn.copied { border-color: #22aa6644; color: #22aa66; }
  .char-count { margin-left: auto; font-size: 11px; color: #2a2a2a; letter-spacing: 1px; }
  .improvements { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
  .badge { background: #161616; border: 1px solid #222; border-radius: 4px; padding: 4px 10px; font-size: 10px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; color: #3a3a3a; }
  .word-count-row { display: flex; gap: 20px; margin-top: 14px; padding-top: 14px; border-top: 1px solid #161616; }
  .wc-item { display: flex; flex-direction: column; gap: 2px; }
  .wc-label { font-size: 10px; color: #333; letter-spacing: 1.5px; text-transform: uppercase; }
  .wc-val { font-size: 18px; font-family: 'Bebas Neue', cursive; color: #555; letter-spacing: 1px; }
  .wc-val.green { color: #22aa66; }
`;

const STYLE_OPTIONS = [
  { value: "hype", label: "🔥 Hype & Energy" },
  { value: "storytelling", label: "📖 Storytelling" },
  { value: "educational", label: "🧠 Educational" },
  { value: "shorts", label: "⚡ YT Shorts" },
  { value: "cinematic", label: "🎬 Cinematic" },
];

function wordCount(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

export default function ScriptEnhancer() {
  const [script, setScript] = useState("");
  const [style, setStyle] = useState("hype");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const enhance = async () => {
    if (!script.trim()) return;
    setLoading(true);
    setOutput("");

    const styleInstructions = {
      hype: "Make it extremely energetic and hype. Use punchy sentences, emotional hooks, power words, and pattern interrupts. Add hype transitions like 'But wait—', 'Here's the thing', 'NO ONE talks about this'. Make every line demand attention.",
      storytelling: "Transform it with compelling narrative structure. Add a story hook at the start, use tension and suspense, create emotional peaks, and build to a satisfying conclusion. Use vivid scene-setting language.",
      educational: "Make it super clear and digestible. Add strong hooks that promise value, use the 'But why does this matter?' technique, add smooth transitions, numbered insights, and memorable analogies. Keep it sharp.",
      shorts: "Rework this for a YouTube Short (under 60s). Cut everything unnecessary. Start with a MASSIVE hook in the first 2 seconds. Make every sentence earn its place. Fast, punchy, no filler. End with a cliffhanger or call-to-action.",
      cinematic: "Give it a cinematic, dramatic feel. Use atmosphere, vivid imagery, pacing variation (fast/slow), dramatic pauses marked with '...', and an epic quality. Make it feel like a movie trailer narration.",
    };

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `You are an expert YouTube scriptwriter who transforms average scripts into viral, highly-engaging content. Your rewrites keep the original meaning and information but dramatically improve engagement, retention, and viewer hooks.

Style direction: ${styleInstructions[style]}

Rules:
- Keep the same core message and information
- Make the opening hook IRRESISTIBLE (first 3-5 seconds)
- Add pattern interrupts every 30-45 seconds of speaking
- Use active voice, short punchy sentences mixed with longer flowing ones
- Never start with "In this video" or "Today we're going to"
- Add natural transition phrases
- End with a strong CTA or cliffhanger
- Return ONLY the enhanced script, no explanations or meta-commentary

ORIGINAL SCRIPT:
${script}

ENHANCED SCRIPT:`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.map((b) => b.text || "").join("") || "";
      setOutput(text.trim());
    } catch (err) {
      setOutput("Error connecting to the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputWords = wordCount(script);
  const outputWords = wordCount(output);

  return (
    <>
      <style>{FONTS + styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo-mark">YT</div>
          <div>
            <div className="header-title">Script Enhancer</div>
            <div className="header-sub">AI-Powered YouTube Rewrite</div>
          </div>
          <div className="header-tag">Powered by Claude</div>
        </header>

        <main className="main">
          <div className="panel panel-left">
            <div className="panel-label">Your Script</div>
            <textarea
              ref={textareaRef}
              className="script-input"
              placeholder="Paste your YouTube script here..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
            <div className="controls">
              <select className="style-select" value={style} onChange={(e) => setStyle(e.target.value)}>
                {STYLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <button className="enhance-btn" onClick={enhance} disabled={loading || !script.trim()}>
                {loading ? "..." : "ENHANCE"}
                {!loading && <span>→</span>}
              </button>
            </div>
            {inputWords > 0 && (
              <div className="word-count-row">
                <div className="wc-item">
                  <span className="wc-label">Words</span>
                  <span className="wc-val">{inputWords}</span>
                </div>
                <div className="wc-item">
                  <span className="wc-label">Est. Duration</span>
                  <span className="wc-val">{Math.ceil(inputWords / 130)}m</span>
                </div>
              </div>
            )}
          </div>

          <div className="panel">
            <div className="panel-label">Enhanced Script</div>
            <div className="output-area">
              {!loading && !output && (
                <div className="empty-state">
                  <div className="empty-icon">✦</div>
                  <div className="empty-text">Your enhanced script will appear here</div>
                </div>
              )}
              {loading && (
                <div className="loading-state">
                  <div className="loading-bars">
                    {[1,2,3,4,5].map((i) => <div key={i} className="loading-bar" />)}
                  </div>
                  <div className="loading-text">Enhancing script</div>
                </div>
              )}
              {!loading && output && <div className="output-content">{output}</div>}
            </div>
            {output && !loading && (
              <>
                <div className="output-actions">
                  <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
                    {copied ? "✓ Copied" : "⧉ Copy Script"}
                  </button>
                  <span className="char-count">{outputWords} words</span>
                </div>
                <div className="improvements">
                  {["Hook Added", "Pattern Interrupts", "Active Voice", "Strong CTA",
                    style === "shorts" ? "Short-Form Optimized" : "Retention Boosts"
                  ].map((tag) => <span key={tag} className="badge">{tag}</span>)}
                </div>
                {inputWords > 0 && (
                  <div className="word-count-row">
                    <div className="wc-item">
                      <span className="wc-label">Original</span>
                      <span className="wc-val">{inputWords}w</span>
                    </div>
                    <div className="wc-item">
                      <span className="wc-label">Enhanced</span>
                      <span className={`wc-val ${outputWords > inputWords * 0.8 ? "green" : ""}`}>{outputWords}w</span>
                    </div>
                    <div className="wc-item">
                      <span className="wc-label">Style</span>
                      <span className="wc-val">{STYLE_OPTIONS.find(o => o.value === style)?.label.split(" ").slice(1).join(" ")}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
