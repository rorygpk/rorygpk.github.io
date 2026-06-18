import React, { useRef, useEffect, useState } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Palette, 
  Type, 
  Code, 
  Eye, 
  Link as LinkIcon, 
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder = "Type content here...", className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value);
  const [selectedColor, setSelectedColor] = useState("#38bdf8"); // default cyan-400 style
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Sync internal HTML value with external value
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value && !isHtmlMode) {
      editorRef.current.innerHTML = value;
    }
    setHtmlValue(value);
  }, [value, isHtmlMode]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setHtmlValue(html);
    }
  };

  const executeCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setHtmlValue(val);
    onChange(val);
  };

  const applyColor = (color: string) => {
    executeCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const colors = [
    "#f87171", "#fb923c", "#facc15", "#4ade80", "#2dd4bf", "#38bdf8", 
    "#818cf8", "#c084fc", "#f472b6", "#ffffff", "#94a3b8", "#1e293b"
  ];

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  return (
    <div className={`flex flex-col border border-white/10 rounded-2xl bg-slate-900/40 select-text overflow-hidden ${className}`}>
      {/* Editor Control Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-slate-950/80">
        {!isHtmlMode ? (
          <>
            <button
              type="button"
              onClick={() => executeCommand("bold")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Bold"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("italic")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Italic"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("underline")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Underline"
            >
              <Underline className="h-3.5 w-3.5" />
            </button>

            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<h1>")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition font-bold text-xs"
              title="Heading 1"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<h2>")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition font-bold text-xs"
              title="Heading 2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<h3>")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition font-bold text-xs"
              title="Heading 3"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<p>")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition text-xs"
              title="Paragraph"
            >
              P
            </button>

            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            <button
              type="button"
              onClick={() => executeCommand("insertUnorderedList")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Bullet List"
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("insertOrderedList")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Numbered List"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </button>

            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            {/* Alignments */}
            <button
              type="button"
              onClick={() => executeCommand("justifyLeft")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Align Left"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("justifyCenter")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Align Center"
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("justifyRight")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Align Right"
            >
              <AlignRight className="h-3.5 w-3.5" />
            </button>

            <div className="w-[1px] h-4 bg-white/10 mx-1" />

            <button
              type="button"
              onClick={insertLink}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Insert Link"
            >
              <LinkIcon className="h-3.5 w-3.5" />
            </button>

            {/* Color selection dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center gap-1"
                title="Font Color"
              >
                <Palette className="h-3.5 w-3.5" style={{ color: selectedColor }} />
              </button>
              {showColorPicker && (
                <div className="absolute left-0 top-full mt-1 z-50 bg-slate-950 border border-white/20 p-2 rounded-xl grid grid-cols-4 gap-1.5 shadow-2xl">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c);
                        applyColor(c);
                      }}
                      className="w-5 h-5 rounded-full border border-white/10 shadow-inner"
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      applyColor(e.target.value);
                    }}
                    className="w-full col-span-4 h-5 mt-1 border-0 p-0 bg-transparent cursor-pointer"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => executeCommand("removeFormat")}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition"
              title="Clear Formatting"
            >
              <Eraser className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <span className="text-[10px] text-zinc-400 px-2 font-mono uppercase font-bold">
            Raw HTML Coding Sandbox
          </span>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsHtmlMode(!isHtmlMode)}
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-cyan-400 font-semibold border border-white/10 flex items-center gap-1 transition"
            title={isHtmlMode ? "Switch to Rich Editing" : "Switch to Raw Code"}
          >
            {isHtmlMode ? (
              <>
                <Eye className="h-3 w-3" />
                <span>Visual View</span>
              </>
            ) : (
              <>
                <Code className="h-3 w-3" />
                <span>Raw HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative min-h-[160px] text-xs">
        {!isHtmlMode ? (
          <div
            id="formatted-textarea-body"
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            className="w-full min-h-[160px] p-3 text-slate-200 focus:outline-none overflow-y-auto select-text prose prose-invert prose-sm max-w-none prose-headings:text-white prose-a:text-cyan-400"
            style={{ minHeight: "160px" }}
            placeholder={placeholder}
          />
        ) : (
          <textarea
            value={htmlValue}
            onChange={handleHtmlChange}
            className="w-full min-h-[160px] p-3 bg-slate-950 font-mono text-xs text-amber-300 border-0 focus:outline-none rounded-b-2xl resize-y"
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}
