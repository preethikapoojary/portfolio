export async function downloadCertificatePdf(imageUrl, title = 'certificate') {
  if (!imageUrl) return;

  const { jsPDF } = await import('jspdf');
  const res = await fetch(imageUrl, { mode: 'cors' });
  if (!res.ok) throw new Error('Failed to load certificate image');
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = objectUrl;
    });

    const width = img.naturalWidth || 1200;
    const height = img.naturalHeight || 900;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    const orientation = width >= height ? 'landscape' : 'portrait';
    const pdf = new jsPDF({ orientation, unit: 'px', format: [width, height] });
    pdf.addImage(dataUrl, 'JPEG', 0, 0, width, height);

    const safeName =
      String(title || 'certificate')
        .replace(/[<>:"/\\|?*]+/g, '')
        .replace(/\s+/g, ' ')
        .trim() || 'certificate';
    pdf.save(`${safeName}.pdf`);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
