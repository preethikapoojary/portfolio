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
  srcUrl = '',
  initialCrop = null,
  defaultAspect = 'original',
  onCancel,
  onConfirm,
}) {
  const [objectUrl, setObjectUrl] = useState('');
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [aspectKey, setAspectKey] = useState(initialCrop?.aspect || defaultAspect);
  const [zoom, setZoom] = useState(Number(initialCrop?.zoom || 1));
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const dragRef = useRef({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 });

  useEffect(() => {
    setAspectKey(initialCrop?.aspect || defaultAspect);
    setZoom(Number(initialCrop?.zoom || 1));
    setOffset({ x: 0, y: 0 });
  }, [file, srcUrl, initialCrop, defaultAspect]);

  useEffect(() => {
    if (!file) {
      setObjectUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const previewUrl = objectUrl || srcUrl;

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
    if (initialCrop && box.w && box.h && natural.w && natural.h) {
      const initX = (Number(initialCrop.tx || 0) / 100) * box.w;
      const initY = (Number(initialCrop.ty || 0) / 100) * box.h;
      setOffset(clampOffset(initX, initY, effectiveScale));
      return;
    }
    setOffset((prev) => clampOffset(prev.x, prev.y, effectiveScale));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, box.w, box.h, natural.w, natural.h]);

  if (!previewUrl) return null;

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

  const tx = box.w ? Number(((offset.x / box.w) * 100).toFixed(2)) : 0;
  const ty = box.h ? Number(((offset.y / box.h) * 100).toFixed(2)) : 0;

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
              Original image is uploaded; only the framed area is displayed.
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
              src={previewUrl}
              alt="Crop preview"
              draggable={false}
              onLoad={(e) =>
                setNatural({
                  w: e.currentTarget.naturalWidth,
                  h: e.currentTarget.naturalHeight,
                })
              }
              style={{
                transform: `translate(${tx}%, ${ty}%) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
              className="pointer-events-none h-full w-full select-none object-cover"
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
            onClick={() => onConfirm({ file, crop: null })}
            className="border border-[#DCD9D1] bg-white px-3 py-1.5 text-xs font-medium text-[#22221F] hover:border-[#22221F]"
          >
            Use Uncropped
          </button>
          <button
            type="button"
            onClick={() => onConfirm({ file, crop: { tx, ty, zoom, aspect: aspectKey } })}
            className="inline-flex items-center gap-1.5 border border-[#22221F] bg-[#22221F] px-4 py-1.5 text-xs font-medium text-[#F6F4EF] hover:bg-[#85806D]"
          >
            <FiCheck size={13} />
            {file ? 'Save Crop & Upload' : 'Save Crop'}
          </button>
        </div>
      </div>
    </div>
  );
}
