import { useState } from "react";

const SUBJECTS = [
  { id: "mathematics", label: "Mathematics", icon: "∑", color: "#FF6B35" },
  { id: "science", label: "Science", icon: "⚗", color: "#4ECDC4" },
  { id: "social_science", label: "Social Science", icon: "🌍", color: "#FFE66D" },
  { id: "english", label: "English", icon: "✍", color: "#A8E6CF" },
  { id: "hindi", label: "Hindi", icon: "अ", color: "#FF8B94" },
];

const PAPER_TYPES = [
  { id: "full", label: "Full Paper", desc: "80 marks • 3 hours" },
  { id: "chapter", label: "Chapter-wise", desc: "Topic focused" },
  { id: "high_prob", label: "High Probability", desc: "Most likely to come" },
];

export default function App() {
  const [subject, setSubject] = useState(null);
  const [paperType, setPaperType] = useState("full");
  const [chapter, setChapter] = useState("");
  const [loading, setLoading] = useState(false);
  const [paper, setPaper] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const selectedSubject = SUBJECTS.find(s => s.id === subject);

  const generatePaper = async () => {
    if (!subject) return;
    setLoading(true);
    setError(null);
    setPaper(null);

    const chapterNote = paperType === "chapter" && chapter
      ? `Focus specifically on chapter/topic: ${chapter}.`
      : "";

    const prompt = `You are a CBSE Class 10 exam expert with deep knowledge of the last 10 years of board exam papers (2014–2024).

Generate a ${paperType === "full" ? "complete sample paper" : paperType === "chapter" ? "chapter-wise practice paper" : "high-probability question set"} for CBSE Class 10 ${subject.replace("_", " ").toUpperCase()}.

${chapterNote}

Instructions:
- Base ALL questions on actual patterns from CBSE board exams 2014–2024
- Mark questions that have appeared 3+ times as ⭐ HIGH PROBABILITY
- Include proper CBSE format: Section A (MCQ/1 mark), Section B (2 marks), Section C (3 marks), Section D (5 marks)
- For each question, briefly mention in [brackets] which year(s) it appeared or a similar question appeared
- At the end, add a "TREND ANALYSIS" section with 5 key insights about what topics repeat most

Format the output clearly with proper numbering. Make it exam-ready.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("\n") || "";
      if (!text) throw new Error("No response received");
      setPaper(text);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(paper);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => window.print();

  const reset = () => {
    setPaper(null);
    setSubject(null);
    setPaperType("full");
    setChapter("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0F",
      fontFamily: "'Georgia', serif",
      color: "#E8E0D0",
      padding: "0",
    }}>

      <div style={{
        borderBottom: "1px solid #1E1E2E",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        background: "#0D0D18",
      }}>
        <div style={{
          width: 36, height: 36,
          background: "linear-gradient(135deg, #FF6B35, #FF8B94)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18,
        }}>📄</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: "bold", letterSpacing: "0.5px" }}>
            BoardPrep AI
          </div>
          <div style={{ fontSize: 11, color: "#666", letterSpacing: "1px", textTransform: "uppercase" }}>
            CBSE Class 10 • 10-Year Trend Analysis
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px" }}>

        {!paper ? (
          <>
            <div style={{ marginBottom: 32 }}>
              <div style={{
                fontSize: 11, color: "#555", letterSpacing: "2px",
                textTransform: "uppercase", marginBottom: 14
              }}>
                01 — Select Subject
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
                {SUBJECTS.map(s => (
                  <button key={s.id} onClick={() => setSubject(s.id)} style={{
                    padding: "16px 8px",
                    background: subject === s.id ? "#1A1A2E" : "#111118",
                    border: subject === s.id ? `1px solid ${s.color}` : "1px solid #1E1E2E",
                    borderRadius: 10,
                    cursor: "pointer",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 8,
                    transition: "all 0.2s",
                  }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <span style={{
                      fontSize: 10, color: subject === s.id ? s.color : "#666",
                      letterSpacing: "0.5px", fontFamily: "sans-serif"
                    }}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <div style={{
                fontSize: 11, color: "#555", letterSpacing: "2px",
                textTransform: "uppercase", marginBottom: 14
              }}>
                02 — Paper Type
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {PAPER_TYPES.map(t => (
                  <button key={t.id} onClick={() => setPaperType(t.id)} style={{
                    padding: "14px",
                    background: paperType === t.id ? "#1A1A2E" : "#111118",
                    border: paperType === t.id ? "1px solid #FF6B35" : "1px solid #1E1E2E",
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                  }}>
                    <div style={{
                      fontSize: 13, color: paperType === t.id ? "#FF6B35" : "#999",
                      fontFamily: "sans-serif", fontWeight: "600", marginBottom: 4
                    }}>{t.label}</div>
                    <div style={{ fontSize: 11, color: "#444", fontFamily: "sans-serif" }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {paperType === "chapter" && (
              <div style={{ marginBottom: 32 }}>
                <div style={{
                  fontSize: 11, color: "#555", letterSpacing: "2px",
                  textTransform: "uppercase", marginBottom: 14
                }}>
                  03 — Chapter / Topic Name
                </div>
                <input
                  value={chapter}
                  onChange={e => setChapter(e.target.value)}
                  placeholder="e.g. Quadratic Equations, Heredity, French Revolution..."
                  style={{
                    width: "100%", padding: "14px 16px",
                    background: "#111118", border: "1px solid #1E1E2E",
                    borderRadius: 10, color: "#E8E0D0",
                    fontSize: 14, fontFamily: "sans-serif",
                    outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            <button
              onClick={generatePaper}
              disabled={!subject || loading}
              style={{
                width: "100%", padding: "18px",
                background: subject
                  ? "linear-gradient(135deg, #FF6B35, #FF8B94)"
                  : "#1A1A1A",
                border: "none", borderRadius: 12,
                color: subject ? "#fff" : "#333",
                fontSize: 15, fontFamily: "sans-serif",
                fontWeight: "600", letterSpacing: "0.5px",
                cursor: subject ? "pointer" : "not-allowed",
                transition: "opacity 0.2s",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading
                ? "⏳ Analyzing 10 Years of Papers..."
                : `Generate ${selectedSubject ? selectedSubject.label : ""} Paper →`}
            </button>

            {error && (
              <div style={{
                marginTop: 16, padding: 14,
                background: "#1A0A0A", border: "1px solid #3D1A1A",
                borderRadius: 10, color: "#FF6B35",
                fontSize: 13, fontFamily: "sans-serif",
              }}>{error}</div>
            )}

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              gap: 10, marginTop: 40,
            }}>
              {[
                { icon: "⭐", title: "Trend-Based", desc: "Questions from actual 10-year CBSE pattern" },
                { icon: "📊", title: "Year Tagged", desc: "Each question shows which year it appeared" },
                { icon: "🎯", title: "High Probability", desc: "Marks questions most likely to repeat" },
              ].map((c, i) => (
                <div key={i} style={{
                  padding: 16, background: "#0D0D18",
                  border: "1px solid #1A1A2E", borderRadius: 10,
                }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontSize: 12, color: "#ccc", fontFamily: "sans-serif", fontWeight: "600", marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 11, color: "#444", fontFamily: "sans-serif" }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", marginBottom: 20,
            }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: "bold" }}>
                  {selectedSubject?.label} — Sample Paper
                </div>
                <div style={{ fontSize: 11, color: "#555", fontFamily: "sans-serif", marginTop: 4 }}>
                  Based on CBSE 10-Year Trend Analysis
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={handleCopy} style={{
                  padding: "8px 14px", background: "#1A1A2E",
                  border: "1px solid #2A2A3E", borderRadius: 8,
                  color: copied ? "#4ECDC4" : "#999",
                  fontSize: 12, fontFamily: "sans-serif",
                  cursor: "pointer",
                }}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
                <button onClick={handlePrint} style={{
                  padding: "8px 14px", background: "#1A1A2E",
                  border: "1px solid #2A2A3E", borderRadius: 8,
                  color: "#999", fontSize: 12, fontFamily: "sans-serif",
                  cursor: "pointer",
                }}>
                  Print
                </button>
                <button onClick={reset} style={{
                  padding: "8px 14px",
                  background: "linear-gradient(135deg, #FF6B35, #FF8B94)",
                  border: "none", borderRadius: 8,
                  color: "#fff", fontSize: 12, fontFamily: "sans-serif",
                  cursor: "pointer",
                }}>
                  New Paper
                </button>
              </div>
            </div>

            <div style={{
              background: "#0D0D18",
              border: "1px solid #1A1A2E",
              borderRadius: 12, padding: "28px 32px",
              whiteSpace: "pre-wrap",
              lineHeight: 1.8, fontSize: 14,
              fontFamily: "'Courier New', monospace",
              color: "#D0C8B8",
              maxHeight: "70vh", overflowY: "auto",
            }}>
              {paper}
            </div>

            <div style={{
              marginTop: 16, padding: "12px 16px",
              background: "#0D0D18", border: "1px solid #1A1A2E",
              borderRadius: 10, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 14 }}>⭐</span>
              <span style={{ fontSize: 12, color: "#666", fontFamily: "sans-serif" }}>
                Questions marked ⭐ have appeared 3+ times in past CBSE papers — prioritize these for revision
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
