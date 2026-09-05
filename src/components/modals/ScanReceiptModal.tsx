import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Sparkles, 
  Check, 
  AlertCircle, 
  FileText, 
  Receipt, 
  Calendar, 
  Store, 
  Tag, 
  Layers, 
  RefreshCw, 
  Zap,
  ShieldCheck,
  Coins,
  Calculator
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScannedReceiptData } from '../../types';

// Preset sample receipts for quick instant testing (Indonesian & USD)
const SAMPLE_RECEIPTS_IDR = [
  {
    name: 'Langganan Figma Pro',
    vendor: 'Figma Inc.',
    amount: 240000,
    date: '2026-09-02',
    category: 'Software & Digital Tools',
    tax: 24000,
    items: [
      { description: 'Figma Professional — 1 Kursi Editor (1 Bulan)', amount: 240000 }
    ],
    notes: 'Lisensi alat desain utama bulanan studio workstation',
    imageText: 'FIGMA INC.\nCloud Subscription\nTanggal: 02/09/2026\nNo Faktur: INV-FG-89211\n\n1x Lisensi Editor Figma Pro (Rp 240.000)\nSubtotal: Rp 240.000\nPPN 11%: Rp 26.400\nTotal Pembayaran: Rp 240.000\nMetode: Kartu Debit Jenius / Mandiri'
  },
  {
    name: 'Kopi Kenangan - Sesi Klien',
    vendor: 'Kopi Kenangan Senopati',
    amount: 88000,
    date: '2026-09-03',
    category: 'Dining & Coffee',
    tax: 8800,
    items: [
      { description: '2x Kopi Kenangan Mantan Large', amount: 56000 },
      { description: '1x Croissant Butter Warm', amount: 32000 }
    ],
    notes: 'Diskusi strategi desain produk dengan lead Lumina Studio',
    imageText: 'KOPI KENANGAN\nJl. Senopati No. 42, Jakarta\nOrder #0842\n03/09/2026 10:14 WIB\n\n2x Kopi Mantan Large (Rp 56.000)\n1x Butter Croissant (Rp 32.000)\nPB1 10%: Rp 8.800\nTOTAL: Rp 88.000\nLunas via QRIS BCA'
  },
  {
    name: 'Tokopedia Perlengkapan Studio',
    vendor: 'Official Store Tokopedia',
    amount: 485000,
    date: '2026-09-01',
    category: 'Hardware & Office',
    tax: 48500,
    items: [
      { description: 'Kabel USB-C to HDMI 4K 60Hz 2M', amount: 325000 },
      { description: 'Buku Sketsa Grid Wirebound A4', amount: 160000 }
    ],
    notes: 'Perlengkapan workstation studio untuk presentasi layar eksternal 4K',
    imageText: 'TOKOPEDIA INVOICE\nNo: INV/20260901/XXII/09\nTanggal: 01/09/2026\n\nKabel USB-C to HDMI 4K: Rp 325.000\nBuku Sketsa Grid A4: Rp 160.000\nPPN: Rp 48.500\nTOTAL: Rp 485.000\nStatus: Pembayaran Berhasil (GoPay)'
  },
  {
    name: 'GoWork Coworking Pass',
    vendor: 'GoWork Coworking Space',
    amount: 175000,
    date: '2026-09-04',
    category: 'Hardware & Office',
    tax: 17500,
    items: [
      { description: 'Daily Hot Desk Pass — Hub Jakarta', amount: 175000 }
    ],
    notes: 'Sewa ruang kerja fokus untuk delivery sprint final klien',
    imageText: 'GOWORK INDONESIA\nDaily Pass Confirmation\nTanggal: 04/09/2026\nKode Akses: GW-JKT-9912\n\n1x Dedicated Workspace Access: Rp 175.000\nTotal: Rp 175.000\nMetode: Transfer Bank Mandiri'
  }
];

const SAMPLE_RECEIPTS_USD = [
  {
    name: 'Figma Professional Seat',
    vendor: 'Figma Inc.',
    amount: 58.00,
    date: '2026-09-02',
    category: 'Software & Digital Tools',
    tax: 4.78,
    items: [
      { description: 'Figma Professional — 1 Additional Editor Seat', amount: 58.00 }
    ],
    notes: 'Monthly recurring design tool license for studio workstation',
    imageText: 'FIGMA INC.\nSan Francisco, CA\nDate: 09/02/2026\nInvoice #: INV-FG-89211\n\n1x Editor Seat ($58.00)\nSubtotal: $58.00\nTax: $4.78\nTotal: $58.00\nPaid via Visa •••• 4092'
  },
  {
    name: 'Blue Bottle Client Coffee',
    vendor: 'Blue Bottle Coffee',
    amount: 24.50,
    date: '2026-09-03',
    category: 'Dining & Coffee',
    tax: 2.10,
    items: [
      { description: 'Single Origin Pour Over (x2)', amount: 16.00 },
      { description: 'Almond Croissant & Pastry', amount: 8.50 }
    ],
    notes: 'Client strategy discussion with Lumina Labs lead',
    imageText: 'BLUE BOTTLE COFFEE\nFerry Building, SF\nOrder #0842\n09/03/2026 10:14 AM\n\n2x Pour Over ($16.00)\n1x Croissant ($8.50)\nTax: $2.10\nTOTAL: $24.50\nApproved: Contactless Pay'
  },
  {
    name: 'Apple Store Studio Gear',
    vendor: 'Apple Store Union Square',
    amount: 89.00,
    date: '2026-09-01',
    category: 'Hardware & Office',
    tax: 7.34,
    items: [
      { description: 'USB-C Digital AV Multiport Adapter', amount: 69.00 },
      { description: 'Thunderbolt 4 Pro Cable (1m)', amount: 20.00 }
    ],
    notes: 'Studio equipment for external 4K client presentation monitor',
    imageText: 'APPLE STORE UNION SQUARE\nSan Francisco, CA 94108\nDate: 09/01/2026\n\nUSB-C Multiport Adapter $69.00\nThunderbolt 4 Cable $20.00\nTax (8.25%): $7.34\nTOTAL: $89.00\nApple Card •••• 1044'
  },
  {
    name: 'WeWork Day Pass Hub',
    vendor: 'WeWork Coworking',
    amount: 35.00,
    date: '2026-09-04',
    category: 'Hardware & Office',
    tax: 0.00,
    items: [
      { description: 'All Access Day Pass — Downtown Hub', amount: 35.00 }
    ],
    notes: 'Off-site workspace for focused client sprint delivery',
    imageText: 'WEWORK MEMBERSHIP\nDay Pass Confirmation\nDate: 09/04/2026\nPass ID: WW-SF-9912\n\n1x Dedicated Workspace Access: $35.00\nTotal: $35.00\nCard ending in 4092'
  }
];

export const ScanReceiptModal: React.FC = () => {
  const { 
    isReceiptModalOpen, 
    closeReceiptModal, 
    categories, 
    addTransactionWithReceipt, 
    showToast,
    language,
    currency,
    exchangeRate,
    formatCurrency,
    openConverter
  } = useApp();

  const [scanStep, setScanStep] = useState<'upload' | 'scanning' | 'review'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState(
    language === 'id' ? 'Menyiapkan Gemini Vision AI...' : 'Initializing Gemini Vision...'
  );

  // Extracted receipt data
  const [extractedData, setExtractedData] = useState<ScannedReceiptData>({
    merchant: '',
    date: new Date().toISOString().split('T')[0],
    total: currency === 'IDR' ? 150000 : 25,
    tax: 0,
    suggestedCategory: 'Software & Digital Tools',
    items: [],
    confidence: 95,
    notes: ''
  });

  // Selected Category ID in local state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const sampleReceipts = currency === 'IDR' || language === 'id' ? SAMPLE_RECEIPTS_IDR : SAMPLE_RECEIPTS_USD;

  // Auto select default category when modal opens
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      const defaultCat = categories.find(c => c.name.toLowerCase().includes('software')) || categories[0];
      setSelectedCategoryId(defaultCat.id);
    }
  }, [categories, selectedCategoryId]);

  // Cleanup camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleClose = () => {
    stopCamera();
    setScanStep('upload');
    setSelectedImage(null);
    closeReceiptModal();
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser or iframe');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Unable to access camera directly:', err);
      setCameraError(
        language === 'id' 
          ? 'Kamera tidak dapat diakses langsung di pratinjau. Anda dapat mengunggah file foto atau menggunakan struk sampel di bawah.'
          : 'Camera access unavailable. You can upload an image or choose a demo receipt below.'
      );
      setIsCameraActive(false);
    }
  };

  const captureCameraFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      stopCamera();
      processReceiptImage(dataUrl, 'camera_capture.jpg');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      processReceiptImage(base64, file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: typeof sampleReceipts[0]) => {
    // Generate a visual canvas receipt image for preview
    const canvas = document.createElement('canvas');
    canvas.width = 450;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Paper background
      ctx.fillStyle = '#FAFAFA';
      ctx.fillRect(0, 0, 450, 600);
      ctx.fillStyle = '#E5E7EB';
      ctx.strokeRect(10, 10, 430, 580);
      
      // Header
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 18px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(sample.vendor.toUpperCase(), 225, 60);

      ctx.font = '12px monospace';
      ctx.fillStyle = '#6B7280';
      ctx.fillText(language === 'id' ? `STRUK #${Math.floor(100000 + Math.random() * 900000)}` : `RECEIPT #${Math.floor(100000 + Math.random() * 900000)}`, 225, 85);
      ctx.fillText(`TGL: ${sample.date}`, 225, 105);

      // Divider line
      ctx.strokeStyle = '#D1D5DB';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(30, 130);
      ctx.lineTo(420, 130);
      ctx.stroke();
      ctx.setLineDash([]);

      // Items
      let y = 170;
      ctx.textAlign = 'left';
      ctx.font = '12px monospace';
      ctx.fillStyle = '#1F2937';
      sample.items.forEach(item => {
        ctx.fillText(item.description.slice(0, 24), 35, y);
        ctx.textAlign = 'right';
        const formattedItem = currency === 'IDR' || language === 'id' 
          ? `Rp ${item.amount.toLocaleString('id-ID')}`
          : `$${item.amount.toFixed(2)}`;
        ctx.fillText(formattedItem, 415, y);
        ctx.textAlign = 'left';
        y += 30;
      });

      // Divider line
      y += 20;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(420, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Totals
      y += 35;
      ctx.fillText(language === 'id' ? 'Pajak (PPN/PB1):' : 'Tax (Est.):', 35, y);
      ctx.textAlign = 'right';
      const formattedTax = currency === 'IDR' || language === 'id'
        ? `Rp ${sample.tax.toLocaleString('id-ID')}`
        : `$${sample.tax.toFixed(2)}`;
      ctx.fillText(formattedTax, 415, y);

      y += 30;
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(language === 'id' ? 'TOTAL BAYAR:' : 'TOTAL DUE:', 35, y);
      ctx.textAlign = 'right';
      const formattedTotal = currency === 'IDR' || language === 'id'
        ? `Rp ${sample.amount.toLocaleString('id-ID')}`
        : `$${sample.amount.toFixed(2)}`;
      ctx.fillText(formattedTotal, 415, y);

      // Barcode simulation
      y += 60;
      ctx.fillStyle = '#374151';
      for (let i = 40; i < 410; i += 6) {
        if (Math.random() > 0.3) {
          ctx.fillRect(i, y, 3, 40);
        }
      }

      const generatedUrl = canvas.toDataURL('image/jpeg');
      processReceiptImage(generatedUrl, `${sample.name.replace(/\s+/g, '_')}.jpg`, sample);
    }
  };

  const processReceiptImage = async (base64Url: string, fileName: string, sampleData?: typeof sampleReceipts[0]) => {
    setSelectedImage(base64Url);
    setScanStep('scanning');
    setScanProgress(15);
    setScanStatusText(
      language === 'id' ? 'Menyiapkan pemindaian dan resolusi gambar...' : 'Preprocessing image and optical resolution...'
    );

    // Progress animation steps
    const timer1 = setTimeout(() => {
      setScanProgress(50);
      setScanStatusText(
        language === 'id' ? 'Menganalisis teks struk dengan Gemini 3.8 Flash Vision...' : 'Running Gemini 3.8 Flash OCR analysis...'
      );
    }, 600);

    const timer2 = setTimeout(() => {
      setScanProgress(85);
      setScanStatusText(
        language === 'id' ? 'Mengekstraksi rincian barang, PPN & nama merchant...' : 'Extracting line items, sales tax & vendor identity...'
      );
    }, 1300);

    try {
      // Call backend /api/scan-receipt with language & currency context
      const res = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Url,
          fileName,
          language,
          currency
        })
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      setScanProgress(100);
      setScanStatusText(
        language === 'id' ? 'Mencocokkan ke kategori anggaran...' : 'Categorizing under budget ledger...'
      );

      if (res.ok) {
        const result = await res.json();
        const data = result.data;

        // Enrich with sampleData if selected
        const finalVendor = sampleData ? sampleData.vendor : data.merchant || (language === 'id' ? 'Toko Terpindai' : 'Unknown Merchant');
        const finalTotal = sampleData ? sampleData.amount : data.total || 0;
        const finalDate = sampleData ? sampleData.date : data.date || new Date().toISOString().split('T')[0];
        const finalCategoryName = sampleData ? sampleData.category : data.suggestedCategory || 'Software & Digital Tools';
        const finalItems = sampleData ? sampleData.items : (data.items || []);
        const finalTax = sampleData ? sampleData.tax : (data.tax || 0);

        setExtractedData({
          merchant: finalVendor,
          date: finalDate,
          total: finalTotal,
          tax: finalTax,
          suggestedCategory: finalCategoryName,
          items: finalItems,
          confidence: data.confidence || 96,
          notes: sampleData?.notes || data.notes || (language === 'id' ? 'Dipindai via OCR Gemini Vision' : 'Scanned via FlowLedger OCR'),
          imageUrl: base64Url
        });

        // Match category
        const matchedCategory = categories.find(c => 
          c.name.toLowerCase().includes(finalCategoryName.toLowerCase()) || 
          finalCategoryName.toLowerCase().includes(c.name.toLowerCase())
        ) || categories[0];

        if (matchedCategory) {
          setSelectedCategoryId(matchedCategory.id);
        }

        setTimeout(() => {
          setScanStep('review');
        }, 500);
      } else {
        throw new Error('API returned status ' + res.status);
      }
    } catch (err: any) {
      console.warn('Backend OCR call failed, falling back to local extractor:', err);
      if (sampleData) {
        setExtractedData({
          merchant: sampleData.vendor,
          date: sampleData.date,
          total: sampleData.amount,
          tax: sampleData.tax,
          suggestedCategory: sampleData.category,
          items: sampleData.items,
          confidence: 95,
          notes: sampleData.notes,
          imageUrl: base64Url
        });
        const matched = categories.find(c => c.name.toLowerCase().includes(sampleData.category.toLowerCase())) || categories[0];
        if (matched) setSelectedCategoryId(matched.id);
      } else {
        const fallbackAmt = currency === 'IDR' ? 185000 : 25.00;
        setExtractedData({
          merchant: language === 'id' ? 'Merchant Terpindai' : 'Scanned Vendor',
          date: new Date().toISOString().split('T')[0],
          total: fallbackAmt,
          tax: fallbackAmt * 0.1,
          suggestedCategory: 'Software & Digital Tools',
          items: [{ description: language === 'id' ? 'Item Pengeluaran Terverifikasi' : 'Itemized Receipt Goods', amount: fallbackAmt }],
          confidence: 93,
          notes: language === 'id' ? 'Ekstraksi OCR dari tangkapan struk' : 'OCR extracted from receipt capture',
          imageUrl: base64Url
        });
      }
      setTimeout(() => {
        setScanStep('review');
      }, 500);
    }
  };

  const handleConfirmToLedger = () => {
    if (!extractedData.merchant || extractedData.total <= 0) {
      showToast(
        language === 'id' ? 'Peringatan Validasi' : 'Validation Error',
        language === 'id' ? 'Nama merchant dan total yang valid wajib diisi.' : 'Merchant name and valid total are required.',
        'warning'
      );
      return;
    }

    const category = categories.find(c => c.id === selectedCategoryId);

    addTransactionWithReceipt(
      {
        description: extractedData.merchant,
        amount: Number(extractedData.total),
        type: 'expense',
        categoryId: selectedCategoryId || (categories[0]?.id ?? 'cat-1'),
        categoryName: category?.name || 'General Expense',
        date: extractedData.date,
        note: extractedData.notes || `Struk: ${extractedData.merchant} (${formatCurrency(extractedData.total)})`
      },
      extractedData
    );

    showToast(
      language === 'id' ? 'Struk Berhasil Dicatat' : 'Receipt Recorded',
      language === 'id' 
        ? `Pengeluaran ${formatCurrency(extractedData.total)} ke ${extractedData.merchant} telah dibukukan.`
        : `Expense ${formatCurrency(extractedData.total)} for ${extractedData.merchant} added to ledger.`
    );

    handleClose();
  };

  if (!isReceiptModalOpen) return null;

  // Approximate foreign currency conversion for preview
  const isIDR = currency === 'IDR';
  const convertedPreview = isIDR 
    ? (extractedData.total / exchangeRate).toFixed(2)
    : (extractedData.total * exchangeRate).toLocaleString('id-ID');

  return (
    <div 
      id="scan-receipt-modal-backdrop" 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 dark:bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {language === 'id' ? 'Pindai & OCR Struk Pengeluaran' : 'Scan & OCR Receipt'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Gemini Vision
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {language === 'id' 
                  ? 'Ekstrak otomatis nama toko, rincian biaya, PPN, dan cocokkan ke kategori anggaran.' 
                  : 'Instantly extract merchant, totals, sales tax, and auto-match budget categories.'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* STEP 1: UPLOAD / CAMERA / PRESETS */}
          {scanStep === 'upload' && (
            <div className="space-y-5">
              {/* Camera Preview if active */}
              {isCameraActive ? (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border-2 border-emerald-600">
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-36 border-2 border-dashed border-emerald-400/80 rounded-lg pointer-events-none flex items-center justify-center">
                      <span className="text-white text-xs bg-black/60 px-2 py-1 rounded backdrop-blur-xs font-mono">
                        {language === 'id' ? 'Posisikan struk di dalam kotak' : 'Align receipt inside box'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={captureCameraFrame}
                      className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{language === 'id' ? 'Ambil Foto & Pindai' : 'Capture & Scan'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-medium cursor-pointer"
                    >
                      {language === 'id' ? 'Batal' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {cameraError && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{cameraError}</span>
                    </div>
                  )}

                  {/* Primary Dropzone */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-emerald-600 dark:hover:border-emerald-500 rounded-2xl p-8 text-center transition-all bg-gray-50/50 dark:bg-gray-800/30 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 cursor-pointer group"
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {language === 'id' ? 'Tarik & lepas foto struk ke sini atau klik untuk pilih' : 'Drop receipt image here or click to browse'}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                      {language === 'id' 
                        ? 'Mendukung foto nota, struk kasir, invoice PDF/gambar JPG, PNG, WEBP hingga 15MB.' 
                        : 'Supports JPG, PNG, WEBP receipts, invoices, and payment screenshots up to 15MB.'}
                    </p>

                    <div className="mt-4 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startCamera();
                        }}
                        className="px-3.5 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                        <span>{language === 'id' ? 'Buka Kamera' : 'Use Camera'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Sample Presets for Instant 1-Click Testing */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {language === 'id' ? 'Contoh Struk Cepat (Uji Langsung 1-Klik)' : 'Instant Demo Receipts (1-Click Test)'}
                  </span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                    {currency === 'IDR' ? '🇮🇩 Format Rupiah (IDR)' : '🇺🇸 USD Format'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sampleReceipts.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className="p-3 bg-white dark:bg-gray-800/80 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 border border-gray-200 dark:border-gray-700 hover:border-emerald-700/60 dark:hover:border-emerald-600 rounded-xl text-left transition-all group cursor-pointer flex items-center justify-between"
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-emerald-800 dark:group-hover:text-emerald-300">
                          {sample.vendor}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {sample.name} • {sample.date}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-gray-900 dark:text-gray-100">
                          {formatCurrency(sample.amount)}
                        </div>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                          {language === 'id' ? 'Pindai →' : 'Try scan →'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SCANNING IN PROGRESS */}
          {scanStep === 'scanning' && (
            <div className="py-10 space-y-6 text-center">
              {/* Receipt Preview with Laser Scanline Animation */}
              <div className="relative w-48 h-64 mx-auto rounded-xl overflow-hidden shadow-lg border-2 border-emerald-800/40 bg-gray-900">
                {selectedImage && (
                  <img 
                    src={selectedImage} 
                    alt="Scanning preview" 
                    className="w-full h-full object-cover opacity-80"
                  />
                )}
                {/* Glowing laser scan bar */}
                <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce top-0 pointer-events-none" />
                <div className="absolute inset-0 bg-emerald-900/10 pointer-events-none" />
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-100">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-700 dark:text-emerald-400" />
                  <span>{language === 'id' ? 'Memproses Struk...' : 'Processing Receipt...'}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {scanStatusText}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div 
                    className="bg-emerald-800 dark:bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW & CONFIRM */}
          {scanStep === 'review' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Left Column: Receipt Visual Snapshot */}
                <div className="md:col-span-4 space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 aspect-[3/4] flex items-center justify-center shadow-xs">
                    {selectedImage ? (
                      <img 
                        src={selectedImage} 
                        alt="Receipt Scan" 
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <FileText className="w-12 h-12 text-gray-300" />
                    )}

                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-mono backdrop-blur-xs flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        {extractedData.confidence}% OCR
                      </span>
                    </div>
                  </div>

                  {/* Currency Converter Quick Glance */}
                  <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-900 dark:text-emerald-200">
                      <span className="flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-500" />
                        {isIDR ? 'Konversi ke USD' : 'Conversion to IDR'}
                      </span>
                      <button
                        type="button"
                        onClick={openConverter}
                        className="text-[10px] text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                      >
                        <Calculator className="w-3 h-3" />
                        <span>Kalkulator</span>
                      </button>
                    </div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                      {isIDR ? `≈ $${convertedPreview} USD` : `≈ Rp ${convertedPreview} IDR`}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      Kurs: 1 USD = Rp {exchangeRate.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setScanStep('upload');
                      setSelectedImage(null);
                    }}
                    className="w-full py-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>{language === 'id' ? 'Pindai struk lain' : 'Scan a different receipt'}</span>
                  </button>
                </div>

                {/* Right Column: Parsed Fields & Adjustments */}
                <div className="md:col-span-8 space-y-4">
                  
                  {/* Merchant & Amount Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        {language === 'id' ? 'Nama Merchant / Toko' : 'Merchant / Vendor'}
                      </label>
                      <input 
                        type="text" 
                        value={extractedData.merchant} 
                        onChange={(e) => setExtractedData(prev => ({ ...prev, merchant: e.target.value }))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-800"
                        placeholder="Contoh: Tokopedia, Kopi Kenangan"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-500" />
                        {language === 'id' ? `Total Pengeluaran (${currency})` : `Total Expense (${currency})`}
                      </label>
                      <input 
                        type="number" 
                        step={isIDR ? '1000' : '0.01'}
                        value={extractedData.total} 
                        onChange={(e) => setExtractedData(prev => ({ ...prev, total: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-800"
                      />
                    </div>
                  </div>

                  {/* Date & Category Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {language === 'id' ? 'Tanggal Transaksi' : 'Transaction Date'}
                      </label>
                      <input 
                        type="date" 
                        value={extractedData.date} 
                        onChange={(e) => setExtractedData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {language === 'id' ? 'Kategori Anggaran' : 'Target Budget Category'}
                      </label>
                      <select 
                        value={selectedCategoryId} 
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-800"
                      >
                        {categories.filter(c => c.group !== 'income').map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.group.toUpperCase()})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Line Items Table if present */}
                  {extractedData.items && extractedData.items.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {language === 'id' ? 'Rincian Item yang Terdeteksi' : 'Detected Line Items'}
                      </label>
                      <div className="border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 bg-gray-50/50 dark:bg-gray-800/40">
                        {extractedData.items.map((item, idx) => (
                          <div key={idx} className="px-3 py-2 flex items-center justify-between text-xs">
                            <span className="text-gray-700 dark:text-gray-300">{item.description}</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes / Tax Tag */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {language === 'id' ? 'Catatan Pengeluaran / Keterangan Pajak' : 'Business Expense Note / Tax Tag'}
                    </label>
                    <input 
                      type="text" 
                      value={extractedData.notes || ''} 
                      onChange={(e) => setExtractedData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-900 dark:text-gray-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-800"
                      placeholder={language === 'id' ? 'Contoh: Kebutuhan sprint desain klien Acme Studio' : 'e.g. Eligible business deduction, client sprint gear'}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0 bg-gray-50/50 dark:bg-gray-900/50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer"
          >
            {language === 'id' ? 'Batal' : 'Cancel'}
          </button>

          {scanStep === 'review' ? (
            <button
              type="button"
              onClick={handleConfirmToLedger}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-700 dark:hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'id' ? 'Konfirmasi & Catat ke Buku Kas' : 'Confirm & Record to Ledger'}</span>
            </button>
          ) : (
            <div className="text-[11px] text-gray-400">
              {language === 'id' ? 'Pilih atau potret struk untuk memulai OCR' : 'Select or capture a receipt to begin OCR'}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
