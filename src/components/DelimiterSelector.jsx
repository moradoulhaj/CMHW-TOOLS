import { SplitSquareHorizontal } from 'lucide-react';

export default function DelimiterSelector({ delimiter, setDelimiter ,setProcessedContents }) {
  const HandleSelectChange = (e) => {
    setDelimiter(e.target.value);
    setProcessedContents([]);
  };
  return (
    <div className="w-full max-w-xs">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <SplitSquareHorizontal className="w-4 h-4" />
        <span>Select Delimiter</span>
      </label>
      <select
        value={delimiter}
        onChange={HandleSelectChange}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
      >
        <option value="AUTO">Auto Detect</option>
        <option value="\n">New Line (\n)</option>
        <option value=";">Semicolon (;)</option>
      </select>
    </div>
  );
}