import { FileText } from 'lucide-react';

export default function FileList({ files , titre}) {
  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <FileText className="w-5 h-5 text-blue-600" />
          <span>{titre}</span>
        </h3>
      </div>
      <div className="p-6">
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md"
              >
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No files uploaded yet</p>
        )}
      </div>
    </div>
  );
}