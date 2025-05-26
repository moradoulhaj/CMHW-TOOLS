import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function SpliterSettingsModal({
  modalSettings,
  setModalSettings,
  onApply,
  selectedEntity,
  timedrops,nextDaySeeds
}) {
  const {
    isOpen,
    useFixedQuantity,
    fixedQuantity,
    shuffle,
    fastKill,
    loginNextDay,
    timeType,
    scheduleTasks,
    coversationOff,
    morningDrops,
    morningDropsQuantity,
    nightDrops,
    nightDropsQuantity,
  } = modalSettings;

  if (!isOpen) return null;
  useEffect(() => {
    setModalSettings((prev) => ({ ...prev, morningDrops: timedrops.length }));
    setModalSettings((prev) => ({ ...prev, nightDrops: 0 }));
  }, []);
  const updateSetting = (key, value) => {
    if (key == "loginNextDay" && nextDaySeeds == ""){
      toast.error("Next Day tags is empty")
      return;

    }
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
        <hr className="mt-2 bg-black" />
        {/* Use Fixed Quantity */}

        {selectedEntity != 7 && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-gray-700 font-medium">
              Use Fixed Quantity
            </span>
            <button
              onClick={() =>
                updateSetting("useFixedQuantity", !useFixedQuantity)
              }
              className={`px-4 py-2 rounded-lg transition ${
                useFixedQuantity
                  ? "bg-green-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {useFixedQuantity ? "Yes" : "No"}
            </button>
          </div>
        )}

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

        {selectedEntity == 7 && (
          <>
            {/* MORNING INPUTS */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                Morning Settings
              </h3>
              <div className="flex gap-4 items-center">
                <label className="text-gray-700 font-medium">
                  Drops Number
                </label>

                <input
                  type="number"
                  value={morningDrops}
                  onChange={(e) => {
                    const newMorning = parseInt(e.target.value, 10);

                    if (newMorning > timedrops.length) return;

                    updateSetting("morningDrops", newMorning);
                    updateSetting("nightDrops", timedrops.length - newMorning);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
                />
                <label className="text-gray-700 font-medium">Quantity</label>
                <input
                  type="number"
                  value={morningDropsQuantity}
                  onChange={(e) =>
                    updateSetting("morningDropsQuantity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
                />
              </div>
            </div>

            {/* NIGHT INPUTS */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                Night Settings
              </h3>
              <div className="flex grid-cols-2 gap-4 items-center">
                <label className="text-gray-700 font-medium">
                  Drops Number
                </label>
                <input
                  type="number"
                  value={nightDrops}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                />
                <label className="text-gray-700 font-medium">Quantity</label>
                <input
                  type="number"
                  value={nightDropsQuantity}
                  onChange={(e) =>
                    updateSetting("nightDropsQuantity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
                />
              </div>
            </div>
          </>
        )}

        {/* Time Type Input*/}

        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-700 font-medium">Time Type</span>
          <input
            type="number"
            value={timeType}
            onChange={(e) => updateSetting("timeType", e.target.value)}
            className="w-[3.5rem] px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
          />
        </div>
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

        {/* ScheduleTasks Toggle */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-700 font-medium">Schedule Tasks</span>
          <button
            onClick={() => updateSetting("scheduleTasks", !scheduleTasks)}
            className={`px-4 py-2 rounded-lg transition ${
              scheduleTasks
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {scheduleTasks ? "Yes" : "No"}
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
        {/* Deactivate Conversation Toggle */}
        {/* <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-700 font-medium">Conversation Off</span>
          <button
            onClick={() => updateSetting("coversationOff", !coversationOff)}
            className={`px-4 py-2 rounded-lg transition ${
              coversationOff ? "bg-green-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {coversationOff ? "Yes" : "No"}
          </button>
        </div> */}
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
