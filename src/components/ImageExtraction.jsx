import React, { useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { performImageExtraction, clearImageResult } from '../store/medextSlice';
import {
    Upload, ImageIcon, FileText, X, Scan, CheckCircle2,
    AlertCircle, Loader2, Sparkles, Download, Copy,
    FlaskConical, Pill, Stethoscope, HeartPulse, ClipboardList,
    ChevronRight, Eye, RefreshCw, Shield, Activity, AlignLeft
} from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
const MAX_SIZE_MB = 10;

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const ENTITY_COLORS = {
    diagnosis: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', icon: Stethoscope },
    medication: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', icon: Pill },
    dosage: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: Activity },
    symptom: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: HeartPulse },
    lab: { bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400', icon: FlaskConical },
    procedure: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', icon: ClipboardList },
};

// ── Drag-to-highlight overlay ────────────────────────────────────────────────

const DropZone = ({ onFile, isDragging }) => (
    <div
        className={`relative flex flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed transition-all duration-300 p-16 cursor-pointer group
      ${isDragging
                ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                : 'border-white/10 hover:border-blue-500/50 hover:bg-white/[0.02]'
            }`}
    >
        {/* animated rings */}
        <div className={`relative flex items-center justify-center ${isDragging ? 'scale-110' : ''} transition-transform duration-300`}>
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl w-24 h-24 -translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center
        ${isDragging ? 'bg-blue-500/20 border-blue-500/40' : 'bg-white/5 border-white/10 group-hover:border-blue-500/30 group-hover:bg-blue-500/10'}
        border transition-all duration-300`}>
                <Upload size={32} className={`transition-all duration-300 ${isDragging ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-400'}`} />
            </div>
        </div>

        <div className="text-center space-y-2">
            <p className="text-base font-bold text-white tracking-tight">
                {isDragging ? 'Drop it here!' : 'Drag & Drop your file'}
            </p>
            <p className="text-xs text-slate-500 font-medium">or <span className="text-blue-400 underline underline-offset-2">browse files</span></p>
            <p className="text-[11px] text-slate-600 font-semibold uppercase tracking-widest mt-4">
                PNG · JPG · WEBP · PDF · Max {MAX_SIZE_MB}MB
            </p>
        </div>

        <input
            type="file"
            accept={ACCEPTED.join(',')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
    </div>
);

// ── File preview card ────────────────────────────────────────────────────────

const FilePreview = ({ file, preview, onRemove }) => (
    <div className="relative glass-card p-4 flex items-center gap-4 overflow-hidden group fade-in">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center shrink-0 border border-white/10">
            {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                : <FileText size={24} className="text-slate-500" />
            }
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{file.name}</p>
            <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">
                {file.type.split('/')[1]?.toUpperCase()} · {formatFileSize(file.size)}
            </p>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 size={11} /> Ready
            </span>
            <button
                onClick={onRemove}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-all"
            >
                <X size={14} />
            </button>
        </div>
    </div>
);

// ── Processing animation ─────────────────────────────────────────────────────

const ProcessingState = () => (
    <div className="flex flex-col items-center justify-center py-20 gap-8 fade-in">
        <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Scan size={36} className="text-blue-400 animate-pulse" />
            </div>
            <div className="absolute -inset-3 rounded-3xl border-2 border-blue-500/20 animate-ping opacity-30" />
            <div className="absolute -inset-6 rounded-3xl border border-blue-500/10 animate-ping opacity-20 animation-delay-150" />
        </div>
        <div className="text-center space-y-2">
            <p className="text-lg font-bold text-white tracking-tight">Analyzing Document…</p>
            <p className="text-sm text-slate-500 font-medium">AI is extracting medical entities</p>
        </div>
        {/* progress steps */}
        <div className="w-full max-w-xs space-y-3">
            {['Parsing document', 'Detecting entities', 'Generating summary'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                    <Loader2 size={14} className="text-blue-400 animate-spin shrink-0" style={{ animationDelay: `${i * 200}ms` }} />
                    <span className="text-xs font-semibold text-slate-400">{step}</span>
                </div>
            ))}
        </div>
    </div>
);

// ── Entity chip ──────────────────────────────────────────────────────────────

const EntityChip = ({ label, type }) => {
    const style = ENTITY_COLORS[type] ?? ENTITY_COLORS.diagnosis;
    const Icon = style.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold border ${style.bg} ${style.border} ${style.text} hover:-translate-y-0.5 transition-transform duration-150 cursor-default`}>
            <Icon size={11} />
            {label}
        </span>
    );
};

// ── Results panel ────────────────────────────────────────────────────────────

const ResultsPanel = ({ result, file, preview, onReset }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(result, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medext_${file?.name ?? 'result'}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Build entity groups from result
    const entityGroups = [
        { key: 'diagnosis', label: 'Diagnoses', items: result?.diagnoses ?? result?.entities?.filter(e => e.type === 'diagnosis')?.map(e => e.text) ?? [] },
        { key: 'medication', label: 'Medications', items: result?.medicines ?? result?.medications ?? result?.entities?.filter(e => e.type === 'medication')?.map(e => e.text) ?? [] },
        { key: 'dosage', label: 'Dosages', items: result?.dosages ?? [] },
        { key: 'symptom', label: 'Symptoms', items: result?.symptoms ?? result?.entities?.filter(e => e.type === 'symptom')?.map(e => e.text) ?? [] },
        { key: 'lab', label: 'Lab Values', items: result?.lab_values ?? result?.entities?.filter(e => e.type === 'lab')?.map(e => e.text) ?? [] },
        { key: 'procedure', label: 'Procedures', items: result?.procedures ?? result?.entities?.filter(e => e.type === 'procedure')?.map(e => e.text) ?? [] },
    ].filter(g => g.items.length > 0);

    const summary = result?.summary ?? result?.clinical_summary ?? null;
    const rawText = result?.raw_text ?? null;
    const cleanedText = result?.corrected_text ?? null;

    return (
        <div className="space-y-6 fade-in">
            {/* top bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 size={18} className="text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Extraction Complete</p>
                        <p className="text-[11px] text-slate-500 font-semibold">AI successfully analyzed your document</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
                    >
                        <Copy size={13} /> {copied ? 'Copied!' : 'Copy JSON'}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
                    >
                        <Download size={13} /> Export
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
                    >
                        <RefreshCw size={13} /> New
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* left: file info + entities */}
                <div className="lg:col-span-2 space-y-5">
                    {/* file thumbnail */}
                    {preview && (
                        <div className="glass-card p-4 flex items-center gap-4">
                            <img src={preview} alt="uploaded" className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                            <div>
                                <p className="text-sm font-bold text-white">{file?.name}</p>
                                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">{formatFileSize(file?.size ?? 0)}</p>
                            </div>
                            <span className="ml-auto flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                <Shield size={11} /> Analyzed
                            </span>
                        </div>
                    )}

                    {/* entities */}
                    {entityGroups.length > 0 ? (
                        <div className="glass-card p-6 space-y-5">
                            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                                <Sparkles size={16} className="text-blue-400" />
                                <h3 className="text-sm font-bold text-white tracking-tight">Extracted Entities</h3>
                                <span className="ml-auto text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                                    {entityGroups.reduce((acc, g) => acc + g.items.length, 0)} found
                                </span>
                            </div>
                            {entityGroups.map(group => (
                                <div key={group.key}>
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">{group.label}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {group.items.map((item, i) => (
                                            <EntityChip key={i} label={item} type={group.key} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card p-6 text-center text-slate-500 text-sm">No entities detected.</div>
                    )}

                    {/* ICD-10 codes */}
                    {result?.icd_codes?.length > 0 && (
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <ClipboardList size={16} className="text-purple-400" />
                                <h3 className="text-sm font-bold text-white tracking-tight">ICD-10 Codes</h3>
                            </div>
                            <div className="space-y-2">
                                {result.icd_codes.map((code, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 hover:border-purple-500/20 transition-all">
                                        <span className="text-xs font-mono font-bold text-purple-400">{code.code}</span>
                                        <ChevronRight size={12} className="text-slate-600" />
                                        <span className="text-xs text-slate-300 font-medium">{code.description}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* right: clinical summary */}
                <div className="space-y-5">
                    {summary && (
                        <div className="glass-card p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                                <Eye size={16} className="text-cyan-400" />
                                <h3 className="text-sm font-bold text-white tracking-tight">Clinical Summary</h3>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">{summary}</p>
                        </div>
                    )}

                    {cleanedText && (
                        <div className="glass-card p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                                <Sparkles size={16} className="text-blue-400" />
                                <h3 className="text-sm font-bold text-white tracking-tight">Cleaned Extraction</h3>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">{cleanedText}</p>
                        </div>
                    )}

                    {rawText && (
                        <div className="glass-card p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                                <AlignLeft size={16} className="text-slate-400" />
                                <h3 className="text-sm font-bold text-slate-300 tracking-tight">Raw Text</h3>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">{rawText}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// ── Main page ────────────────────────────────────────────────────────────────

const ImageExtraction = () => {
    const dispatch = useDispatch();
    const { imageResult, imageStatus, imageError } = useSelector((state) => state.medext);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [validationError, setValidationError] = useState(null);
    const dropRef = useRef(null);

    // ── file selection logic ──
    const handleFile = useCallback((selected) => {
        setValidationError(null);
        if (!ACCEPTED.includes(selected.type)) {
            setValidationError('Unsupported file type. Please upload PNG, JPG, WEBP, or PDF.');
            return;
        }
        if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
            setValidationError(`File too large. Max size is ${MAX_SIZE_MB}MB.`);
            return;
        }
        setFile(selected);
        if (selected.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(selected);
        } else {
            setPreview(null);
        }
        dispatch(clearImageResult());
    }, [dispatch]);

    // ── drag events ──
    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFile(dropped);
    };

    const handleExtract = () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        dispatch(performImageExtraction(formData));
    };

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setValidationError(null);
        dispatch(clearImageResult());
    };

    const isLoading = imageStatus === 'loading';
    const isSuccess = imageStatus === 'succeeded' && imageResult;
    const isFailed = imageStatus === 'failed';

    return (
        <main className="flex-1 p-8 min-h-screen bg-slate-950/20 backdrop-blur-3xl">
            <div className="max-w-5xl mx-auto py-10">

                {/* ── page header ── */}
                <div className="mb-10 space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                        <Sparkles size={12} className="text-cyan-400" />
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">AI Vision</span>
                    </div>
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
                            Image &amp; File Extraction
                        </h2>
                        <p className="text-slate-400 font-medium mt-1">
                            Upload a medical image, scan, or PDF — our AI will extract clinical entities and generate a structured summary.
                        </p>
                    </div>
                </div>

                {/* ── supported formats banner ── */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {[
                        { label: 'Medical Images', icon: ImageIcon, color: 'text-blue-400  bg-blue-500/10  border-blue-500/20' },
                        { label: 'PDF Reports', icon: FileText, color: 'text-rose-400  bg-rose-500/10  border-rose-500/20' },
                        { label: 'Lab Results', icon: FlaskConical, color: 'text-teal-400  bg-teal-500/10  border-teal-500/20' },
                        { label: 'Prescriptions', icon: Pill, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
                    ].map(({ label, icon: Icon, color }) => (
                        <span key={label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border ${color}`}>
                            <Icon size={11} /> {label}
                        </span>
                    ))}
                </div>

                {/* ── main card ── */}
                <div className="glass-card p-6 space-y-6">
                    {!isSuccess && !isLoading && (
                        <>
                            {/* drop zone */}
                            <div ref={dropRef} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                                {file
                                    ? <FilePreview file={file} preview={preview} onRemove={handleReset} />
                                    : <DropZone onFile={handleFile} isDragging={isDragging} />
                                }
                            </div>

                            {/* validation error */}
                            {validationError && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold fade-in">
                                    <AlertCircle size={16} className="shrink-0" />
                                    {validationError}
                                </div>
                            )}

                            {/* api error */}
                            {isFailed && imageError && (
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold fade-in">
                                    <AlertCircle size={16} className="shrink-0" />
                                    Extraction failed: {imageError}
                                </div>
                            )}

                            {/* extract button */}
                            {file && (
                                <button
                                    onClick={handleExtract}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold text-white
                    bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500
                    shadow-xl shadow-blue-500/25 hover:shadow-cyan-500/30
                    hover:-translate-y-0.5 active:translate-y-0
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    transition-all duration-200 fade-in"
                                >
                                    <Scan size={18} />
                                    Extract Medical Information
                                </button>
                            )}
                        </>
                    )}

                    {isLoading && <ProcessingState />}

                    {isSuccess && (
                        <ResultsPanel
                            result={imageResult}
                            file={file}
                            preview={preview}
                            onReset={handleReset}
                        />
                    )}
                </div>

                {/* ── how it works ── */}
                {!file && !isLoading && !isSuccess && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 fade-in">
                        {[
                            { step: '01', title: 'Upload', desc: 'Drag & drop or browse to select a medical image or PDF document.', icon: Upload },
                            { step: '02', title: 'Analyze', desc: 'Our Llama-powered AI scans the document for clinical information.', icon: Scan },
                            { step: '03', title: 'Extract', desc: 'Review structured entities, ICD codes, and a generated clinical report.', icon: Sparkles },
                        ].map(({ step, title, desc, icon: Icon }) => (
                            <div key={step} className="glass-card p-6 space-y-3 hover:border-blue-500/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-blue-500/60 tracking-widest">{step}</span>
                                    <div className="h-[1px] flex-1 bg-white/5" />
                                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-all">
                                        <Icon size={15} className="text-blue-400" />
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-white">{title}</p>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default ImageExtraction;
