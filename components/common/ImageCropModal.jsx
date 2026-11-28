'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FiCheck, FiX, FiZoomIn } from 'react-icons/fi';

const ASPECT_OPTIONS = [
  { key: 'circle', label: 'Circle (1:1)', ratio: 1, isCircle: true },
  { key: '1:1', label: 'Square (1:1)', ratio: 1, isCircle: false },
  { key: '16:10', label: 'Card (16:10)', ratio: 16 / 10, isCircle: false },
  { key: '16:9', label: 'Wide (16:9)', ratio: 16 / 9, isCircle: false },
  { key: '4:5', label: 'Portrait (4:5)', ratio: 4 / 5, isCircle: false },
  { key: 'original', label: 'Original', ratio: null, isCircle: false },
];

export default function ImageCropModal({
  file,
  defaultAspect = 'original',
  onCancel,
  onConfirm,
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [aspectKey, setAspectKey] = useState(defaultAspect);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [processing, setProcessing] = useState(false);

  const imgRef = useRef(null);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  useEffect(() => {
    setAspectKey(defaultAspect);
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, [file, defaultAspect]);

  useEffect(() => {
    if (!file) {
      setImageUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const activeOption = useMemo(
    () => ASPECT_OPTIONS.find((o) => o.key === aspectKey) || ASPECT_OPTIONS[0],
    [aspectKey]
  );

  const box = useMemo(() => {
    const maxDim = 280;
    let ratio = activeOption.ratio;
    if (!ratio) {
      ratio = natural.w && natural.h ? natural.w / natural.h : 1;
    }
    if (ratio >= 1) {
      return { w: maxDim, h: Math.max(120, Math.round(maxDim / ratio)) };
    }
    return { w: Math.max(120, Math.round(maxDim * ratio)), h: maxDim };
  }, [activeOption, natural]);

  const baseScale = useMemo(() => {
    if (!natural.w || !natural.h) return 1;
    return Math.max(box.w / natural.w, box.h / natural.h);
  }, [box, natural]);

  const effectiveScale = baseScale * zoom;

  const clampOffset = (x, y, nextScale = effectiveScale) => {
    if (!natural.w || !natural.h) return { x: 0, y: 0 };
    const maxX = Math.max(0, (natural.w * nextScale - box.w) / 2);
    const maxY = Math.max(0, (natural.h * nextScale - box.h) / 2);
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  useEffect(() => {
    setOffset((prev) => clampOffset(prev.x, prev.y, effectiveScale));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, box.w, box.h, natural.w, natural.h]);

  if (!file || !imageUrl) return null;

  const onPointerDown = (e) => {
    e.preventDefault();
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: offset.x,
      origY: offset.y,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(clampOffset(dragRef.current.origX + dx, dragRef.current.origY + dy));
  };

  const onPointerUp = () => {
    dragRef.current.active = false;
  };

  const handleCropConfirm = async () => {
    if (!imgRef.current || !natural.w || !natural.h) {
      onConfirm(file);
      return;
    }
    setProcessing(true);
    try {
      const srcW = box.w / effectiveScale;
      const srcH = box.h / effectiveScale;
      const srcX = Math.max(0, natural.w / 2 - offset.x / effectiveScale - srcW / 2);
      const srcY = Math.max(0, natural.h / 2 - offset.y / effectiveScale - srcH / 2);

      const targetW = Math.min(1600, Math.max(600, Math.round(srcW)));
      const targetH = Math.max(1, Math.round(targetW * (box.h / box.w)));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onConfirm(file);
        return;
      }
      ctx.drawImage(
        imgRef.current,
        srcX,
        srcY,
        Math.min(srcW, natural.w - srcX),
        Math.min(srcH, natural.h - srcY),
        0,
        0,
        targetW,
        targetH
      );

      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, 0.92));
      if (!blob) {
        onConfirm(file);
        return;
      }
      const croppedFile = new File([blob], file.name, { type: mime });
      onConfirm(croppedFile);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Crop and preview image"
    >
      <div className="w-full max-w-md border border-[#DCD9D1] bg-[#F6F4EF] p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-[#DCD9D1] pb-3">
          <div>
            <h3 className="font-display text-lg font-medium text-[#22221F]">
              Crop &amp; Preview Image
            </h3>
            <p className="text-[11px] text-[#89877F]">
              Drag to reposition and zoom to frame your image.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 text-[#89877F] hover:text-[#22221F]"
            aria-label="Close cropper"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Aspect ratio selector */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {ASPECT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => {
                setAspectKey(opt.key);
                setZoom(1);
                setOffset({ x: 0, y: 0 });
              }}
              className={`border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                aspectKey === opt.key
                  ? 'border-[#22221F] bg-[#22221F] text-[#F6F4EF]'
                  : 'border-[#DCD9D1] bg-white/60 text-[#89877F] hover:border-[#22221F] hover:text-[#22221F]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Interactive Crop Stage */}
        <div className="flex justify-center bg-[#22221F]/90 py-5">
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ width: box.w, height: box.h }}
            className={`relative cursor-grab touch-none overflow-hidden border border-white/40 bg-black active:cursor-grabbing ${
              activeOption.isCircle ? 'rounded-full' : 'rounded-sm'
            }`}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop preview"
              draggable={false}
              onLoad={(e) =>
                setNatural({
                  w: e.currentTarget.naturalWidth,
                  h: e.currentTarget.naturalHeight,
                })
              }
              style={{
                width: natural.w ? natural.w * effectiveScale : '100%',
                height: natural.h ? natural.h * effectiveScale : '100%',
                maxWidth: 'none',
                transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 select-none"
            />
          </div>
        </div>

        {/* Zoom Slider */}
        <div className="mt-4 flex items-center gap-3">
          <FiZoomIn size={15} className="shrink-0 text-[#89877F]" />
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[#22221F]"
            aria-label="Zoom level"
          />
          <span className="w-10 text-right text-xs text-[#89877F]">
            {zoom.toFixed(1)}x
          </span>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-[#DCD9D1] pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="border border-[#DCD9D1] px-3 py-1.5 text-xs font-medium text-[#89877F] hover:border-[#22221F] hover:text-[#22221F]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(file)}
            disabled={processing}
            className="border border-[#DCD9D1] bg-white px-3 py-1.5 text-xs font-medium text-[#22221F] hover:border-[#22221F]"
          >
            Use Original
          </button>
          <button
            type="button"
            onClick={handleCropConfirm}
            disabled={processing}
            className="inline-flex items-center gap-1.5 border border-[#22221F] bg-[#22221F] px-4 py-1.5 text-xs font-medium text-[#F6F4EF] hover:bg-[#85806D]"
          >
            <FiCheck size={13} />
            {processing ? 'Processing…' : 'Crop & Upload'}
          </button>
        </div>
      </div>
    </div>
  );
}
