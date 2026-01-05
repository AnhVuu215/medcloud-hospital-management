
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Upload, Wand2, RefreshCw, Download, AlertCircle, Camera, CheckCircle2, Image as ImageIcon } from 'lucide-react';

const ImageEditView: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!originalImage || !prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Chuyển đổi base64 để gửi qua API (bỏ prefix data:image/...)
      const base64Data = originalImage.split(',')[1];
      const mimeType = originalImage.split(';')[0].split(':')[1];

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        // Find the image part, do not assume it is the first part.
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const resultBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            setEditedImage(resultBase64);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        setError("AI không trả về ảnh mới. Vui lòng thử lại với prompt rõ ràng hơn.");
      }
    } catch (err: any) {
      console.error("Lỗi AI:", err);
      setError(`Lỗi hệ thống AI: ${err.message || 'Không xác định'}`);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setPrompt('');
    setError(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Xử lý ảnh y tế bằng AI</h1>
          <p className="text-slate-500 text-sm">Sử dụng công nghệ Gemini 2.5 Flash Image để chỉnh sửa, lọc hoặc xóa vật thể trên ảnh y tế.</p>
        </div>
        <div className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg border border-blue-100 flex items-center">
          <Wand2 size={14} className="mr-1.5" />
          NANO BANANA POWERED
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">1. Tải ảnh lên</h3>
            
            {!originalImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group"
              >
                <div className="bg-slate-50 p-4 rounded-full text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700">Nhấn để tải ảnh hoặc kéo thả</p>
                  <p className="text-xs text-slate-500 mt-1">Hỗ trợ JPG, PNG (Tối đa 5MB)</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
            ) : (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-100">
                <img src={originalImage} alt="Original" className="w-full h-auto max-h-[400px] object-contain bg-slate-50" />
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={reset} className="p-2 bg-white/90 backdrop-blur rounded-lg shadow-sm text-rose-500 hover:bg-white">
                    <RefreshCw size={16} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 text-white text-[10px] text-center font-bold uppercase tracking-widest backdrop-blur-sm">
                  Ảnh gốc
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">2. Nhập lệnh chỉnh sửa</h3>
            <div className="space-y-3">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ví dụ: 'Thêm filter retro', 'Xóa người phía sau', 'Làm rõ các vùng tối'..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none min-h-[100px] resize-none transition-all"
              />
              <div className="flex flex-wrap gap-2">
                {['Thêm filter retro', 'Tăng độ tương phản', 'Xóa vật thể nền', 'Làm sáng ảnh'].map(p => (
                  <button 
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleEdit}
                disabled={loading || !originalImage || !prompt.trim()}
                className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <RefreshCw size={20} className="animate-spin" />
                ) : (
                  <Wand2 size={20} />
                )}
                <span>{loading ? 'Đang xử lý bằng AI...' : 'Thực hiện chỉnh sửa'}</span>
              </button>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start space-x-3 text-rose-700 text-xs animate-in slide-in-from-top-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Output */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Kết quả từ Gemini</h3>
            
            {!editedImage ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                {loading ? (
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Wand2 size={24} className="text-blue-600 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-sm font-bold animate-pulse text-blue-600">Đang tạo nội dung mới...</p>
                  </div>
                ) : (
                  <>
                    {/* Fixed: Import ImageIcon from lucide-react */}
                    <ImageIcon size={48} className="opacity-20" />
                    <p className="text-sm font-medium italic">Ảnh sau khi xử lý sẽ hiển thị tại đây</p>
                  </>
                )}
              </div>
            ) : (
              <div className="flex-1 space-y-4 animate-in zoom-in-95 duration-500">
                <div className="relative rounded-2xl overflow-hidden border border-emerald-100 bg-emerald-50/20 p-2">
                  <img src={editedImage} alt="Edited" className="w-full h-auto max-h-[450px] object-contain rounded-xl shadow-lg" />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <div className="bg-emerald-600 text-white text-[10px] px-2 py-1 rounded shadow-sm font-bold flex items-center">
                      <CheckCircle2 size={12} className="mr-1" /> KẾT QUẢ AI
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <a 
                    href={editedImage} 
                    download="medcloud-ai-edited.png"
                    className="flex-1 flex items-center justify-center space-x-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-95"
                  >
                    <Download size={18} />
                    <span>Lưu ảnh về máy</span>
                  </a>
                  <button 
                    onClick={() => {
                      setOriginalImage(editedImage);
                      setEditedImage(null);
                      setPrompt('');
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 border border-emerald-200 py-3 rounded-xl font-bold hover:bg-emerald-100 transition-all active:scale-95"
                  >
                    <RefreshCw size={18} />
                    <span>Tiếp tục sửa</span>
                  </button>
                </div>
              </div>
            )}

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start space-x-3 text-amber-800 text-[11px] leading-relaxed">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p>
                <b>Lưu ý:</b> Kết quả được tạo bởi Trí tuệ nhân tạo. Vui lòng kiểm tra kỹ tính chính xác của hình ảnh trước khi đưa vào hồ sơ bệnh án chính thức.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageEditView;
