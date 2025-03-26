import React from "react";
import { motion } from "framer-motion";

export default function SpliterSettingsModal({
  modalSettings,
  setModalSettings,
  onApply,
}) {
  const {
    isOpen,
    useFixedQuantity,
    fixedQuantity,
    shuffle,
    fastKill,
    loginNextDay,
  } = modalSettings;

  if (!isOpen) return null;

  const updateSetting = (key, value) => {
    setModalSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-lg p-6 w-[400px] text-center"
      >
        <h2 className="text-xl font-bold text-blue-700">Spliter Settings</h2>

        {/* Use Fixed Quantity */}

        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-700 font-medium">Use Fixed Quantity</span>
          <button
            onClick={() => updateSetting("useFixedQuantity", !useFixedQuantity)}
            className={`px-4 py-2 rounded-lg transition ${
              useFixedQuantity
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {useFixedQuantity ? "Yes" : "No"}
          </button>
        </div>

        {/* Fixed Quantity Input */}
        {useFixedQuantity && (
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">
              Fixed Quantity
            </label>
            <input
              type="number"
              value={fixedQuantity}
              onChange={(e) => updateSetting("fixedQuantity", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
            />
          </div>
        )}

        {/* Shuffle Toggle */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-700 font-medium">Apply Shuffle</span>
          <button
            onClick={() => updateSetting("shuffle", !shuffle)}
            className={`px-4 py-2 rounded-lg transition ${
              shuffle ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {shuffle ? "Yes" : "No"}
          </button>
        </div>

        {/* Fast Kill Toggle */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-700 font-medium">Fast Kill</span>
          <button
            onClick={() => updateSetting("fastKill", !fastKill)}
            className={`px-4 py-2 rounded-lg transition ${
              fastKill ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {fastKill ? "Yes" : "No"}
          </button>
        </div>

        {/* Login Next Day Toggle */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-700 font-medium">Login Next Day</span>
          <button
            onClick={() => updateSetting("loginNextDay", !loginNextDay)}
            className={`px-4 py-2 rounded-lg transition ${
              loginNextDay
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {loginNextDay ? "Yes" : "No"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={() => updateSetting("isOpen", false)}
            className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              updateSetting("isOpen", false);
              onApply(); // Call handleSplit when Apply is clicked
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </motion.div>
    </div>
  );
}
