import { useState, useRef } from "react";

export default function MessageInput({ socketData, placeholder = "Type a message..." }) {
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socketData.sendMessage(message.trim());
    setMessage("");
    socketData.setTyping(false);
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socketData.setTyping(e.target.value.length > 0);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Here you can integrate your existing file upload API if needed
      // For now, we just send a system message placeholder
      socketData.sendMessage(`Shared a file: ${file.name}`);
    } catch (error) {
      console.error("File upload failed:", error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <form onSubmit={handleSend} className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder={placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={1}
            style={{ minHeight: "44px", maxHeight: "120px" }}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Attach file"
        >
          {isUploading ? "⏳" : "📎"}
        </button>

        <button
          type="submit"
          disabled={!message.trim() || isUploading}
          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
