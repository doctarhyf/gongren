"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function StoreAgentDashboard({ onLogout }) {
  const stats = [
    {
      id: 1,
      title: "Pending Review",
      value: 3,
      subtitle: "Your articles awaiting validation",
      icon: <Clock className="h-5 w-5 text-gray-500" />,
    },
    {
      id: 2,
      title: "Approved",
      value: 1,
      subtitle: "Your articles that are approved",
      icon: <CheckCircle className="h-5 w-5 text-gray-500" />,
    },
    {
      id: 3,
      title: "Rejected",
      value: 1,
      subtitle: "Articles that have been rejected",
      icon: <AlertTriangle className="h-5 w-5 text-gray-500" />,
    },
    {
      id: 4,
      title: "My Articles",
      value: 10,
      subtitle: "Total articles you submitted",
      icon: <Upload className="h-5 w-5 text-gray-500" />,
    },
  ];

  const sampleArticles = [
    {
      id: "ART-001",
      name: "Industrial Grade Screwdrivers",
      status: "Pending Store",
      color: "bg-yellow-100 text-yellow-700",
      quantity: 150,
      price: "$15.50",
      supplier: "Tools Inc.",
      date: "2023-10-01",
    },
    {
      id: "ART-002",
      name: "Heavy-Duty Work Gloves",
      status: "Pending Finance",
      color: "bg-orange-100 text-orange-700",
      quantity: 300,
      price: "$8.00",
      supplier: "SafeHands Corp",
      date: "2023-10-02",
    },
    {
      id: "ART-003",
      name: "Electric Drill Machine",
      status: "Pending Store",
      color: "bg-yellow-100 text-yellow-700",
      quantity: 120,
      price: "$45.00",
      supplier: "BuildMaster",
      date: "2023-10-03",
    },
    {
      id: "ART-004",
      name: "Safety Boots",
      status: "Pending Finance",
      color: "bg-orange-100 text-orange-700",
      quantity: 200,
      price: "$29.99",
      supplier: "SafeSteps",
      date: "2023-10-04",
    },
    {
      id: "ART-005",
      name: "Hydraulic Jack",
      status: "Pending Store",
      color: "bg-yellow-100 text-yellow-700",
      quantity: 75,
      price: "$120.00",
      supplier: "LiftCo",
      date: "2023-10-05",
    },
    {
      id: "ART-006",
      name: "Aluminum Ladder",
      status: "Pending Finance",
      color: "bg-orange-100 text-orange-700",
      quantity: 45,
      price: "$60.00",
      supplier: "ClimbTech",
      date: "2023-10-06",
    },
    {
      id: "ART-007",
      name: "Power Generator 5kW",
      status: "Pending Store",
      color: "bg-yellow-100 text-yellow-700",
      quantity: 20,
      price: "$450.00",
      supplier: "ElectroMax",
      date: "2023-10-07",
    },
    {
      id: "ART-008",
      name: "Welding Helmet",
      status: "Pending Finance",
      color: "bg-orange-100 text-orange-700",
      quantity: 85,
      price: "$25.00",
      supplier: "MetalGuard",
      date: "2023-10-08",
    },
    {
      id: "ART-009",
      name: "Engine Oil 5L",
      status: "Pending Store",
      color: "bg-yellow-100 text-yellow-700",
      quantity: 300,
      price: "$18.50",
      supplier: "LubePros",
      date: "2023-10-09",
    },
    {
      id: "ART-010",
      name: "Protective Masks (Box)",
      status: "Pending Finance",
      color: "bg-orange-100 text-orange-700",
      quantity: 600,
      price: "$12.00",
      supplier: "HealthPro",
      date: "2023-10-10",
    },
  ];

  // Pagination
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(sampleArticles.length / ITEMS_PER_PAGE);

  const paginated = sampleArticles.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6">Store Agent Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-gray-700">{s.title}</p>
              {s.icon}
            </div>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Article Management Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-5">
        <h2 className="text-xl font-semibold text-gray-800">
          Article Management
        </h2>
        <p className="text-sm text-gray-500">
          Manage and submit your registered articles.
        </p>

        {/* Search + Actions */}
        <div className="flex items-center gap-3 mt-5">
          <div className="flex items-center border rounded-lg bg-gray-100 px-3 py-2 w-full">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by name, supplier..."
              className="bg-transparent outline-none ml-2 w-full text-gray-700"
            />
          </div>

          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 shadow-sm hover:bg-indigo-700 transition">
            <Plus className="w-4 h-4" />
            Add Article
          </button>

          <button className="px-4 py-2 border rounded-lg flex items-center gap-2 text-gray-700 hover:bg-gray-100 transition">
            <Upload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-3">Article Name</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Supplier</th>
              <th>Entry Date</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((a) => (
              <tr key={a.id} className="border-b text-gray-700">
                <td className="py-4">
                  <div className="font-medium">{a.name}</div>
                  <div className="text-xs text-gray-500">{a.id}</div>
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${a.color}`}
                  >
                    {a.status}
                  </span>
                </td>

                <td>{a.quantity}</td>
                <td>{a.price}</td>
                <td>{a.supplier}</td>
                <td>{a.date}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={(e) => onLogout()}
          className={`px-3 py-2 rounded-md border bg-red-500 text-white`}
        >
          Logout
        </button>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-3 mt-5">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-2 rounded-md border ${
              page === 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-600">
            Page <b>{page}</b> of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-3 py-2 rounded-md border ${
              page === totalPages
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
