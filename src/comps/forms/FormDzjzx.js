import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../helpers/sb.config";

export default function FormDzjzx() {
  const [formData, setFormData] = useState({
    //id: "",
    date_time: "",
    operation: "in",
    s32: "",
    s42: "",
    stock_32: "",
    stock_42: "",
    fuzeren: "谭义勇",
    team: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const operations = ["in", "out"];
  const fuzerens = ["谭义勇", "赵峰", "王刚", "武子瑞", "张玉波"];
  const teams = ["A", "B", "C", "D"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("dzjzx").upsert(
      [
        {
          ...formData,
          created_at: new Date().toISOString(),
          s32: Number(formData.s32),
          s42: Number(formData.s42),
          stock_32: Number(formData.stock_32),
          stock_42: Number(formData.stock_42),
        },
      ],
      { onConflict: ["id"] }
    );

    if (error) {
      setMessage(`❌ Error: ${error.message}`);
    } else {
      setMessage("✅ Data saved successfully!");
      setFormData({
        id: "",
        date_time: "",
        operation: "in",
        s32: "",
        s42: "",
        stock_32: "",
        stock_42: "",
        fuzeren: "谭义勇",
        team: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Insert Operation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/*  {/* ID }
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID
          </label>
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>{" "}
        */}
        {/* Date Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Time
          </label>
          <input
            type="datetime-local"
            name="date_time"
            value={formData.date_time}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        {/* Operation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operation
          </label>
          <select
            name="operation"
            value={formData.operation}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {operations.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </div>
        {/* Numbers */}
        {[
          { label: "S32", name: "s32" },
          { label: "S42", name: "s42" },
          { label: "Stock 32", name: "stock_32" },
          { label: "Stock 42", name: "stock_42" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <input
              type="number"
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
        ))}
        {/* Fuzeren */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            负责人 (Fuzeren)
          </label>
          <select
            name="fuzeren"
            value={formData.fuzeren}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {fuzerens.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        {/* Team */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team
          </label>
          <select
            name="team"
            value={formData.team}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {teams.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
        {/* Message */}
        {message && (
          <div className="mt-4 text-center text-sm font-medium text-gray-700">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
