"use client";

import React, { useState } from "react";
import { Printer, Plus, Trash2, RotateCcw } from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  hours: number;
  rate: number;
}

export default function ClassicInvoiceGenerator() {
  const [companyName, setCompanyName] = useState("Your Company Name");
  const [companySlogan, setCompanySlogan] = useState("Your Company Slogan");
  const [companyAddress, setCompanyAddress] = useState("123 Street Address, City, ST 12345");
  const [companyContact, setCompanyContact] = useState("Phone: (509) 555-0190 | Fax: (509) 555-0191");

  const [invoiceNumber, setInvoiceNumber] = useState("100");
  const [invoiceDate, setInvoiceDate] = useState("OCTOBER 9, 2026");

  const [clientName, setClientName] = useState("[Name]");
  const [clientCompany, setClientCompany] = useState("[Company Name]");
  const [clientAddress, setClientAddress] = useState("[Street Address, City, ST ZIP Code]");
  const [clientPhone, setClientPhone] = useState("[Phone]");

  const [projectDescription, setProjectDescription] = useState("[Project or service description]");
  const [poNumber, setPoNumber] = useState("[P.O. #]");

  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Frontend Development & UI Design", hours: 40, rate: 75 },
    { id: "2", description: "Database Optimization & Migration", hours: 15, rate: 90 },
    { id: "3", description: "", hours: 0, rate: 0 },
    { id: "4", description: "", hours: 0, rate: 0 },
    { id: "5", description: "", hours: 0, rate: 0 },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", hours: 0, rate: 0 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.hours) || 0) * (Number(item.rate) || 0),
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Top Action Bar (Hidden during print) */}
      <div className="no-print flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddItem}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-400" /> Add Line Item
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      {/* ─── PRINTABLE INVOICE CARD ─── */}
      <div
        id="printable-invoice"
        className="bg-white text-slate-900 p-8 sm:p-12 border border-slate-200 shadow-md rounded-lg font-sans space-y-6"
      >
        {/* Top Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1 max-w-sm">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-xl font-bold text-slate-900 w-full focus:outline-none focus:bg-slate-50 rounded"
              placeholder="[Your Company Name]"
            />
            <input
              type="text"
              value={companySlogan}
              onChange={(e) => setCompanySlogan(e.target.value)}
              className="text-xs italic text-slate-500 w-full focus:outline-none focus:bg-slate-50 rounded block"
              placeholder="[Your Company Slogan]"
            />
            <div className="pt-2 text-xs text-slate-600 space-y-0.5">
              <input
                type="text"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                className="w-full focus:outline-none focus:bg-slate-50 rounded"
                placeholder="[Street Address, City, ST ZIP Code]"
              />
              <input
                type="text"
                value={companyContact}
                onChange={(e) => setCompanyContact(e.target.value)}
                className="w-full focus:outline-none focus:bg-slate-50 rounded"
                placeholder="Phone & Fax Details"
              />
            </div>
          </div>

          <div className="text-right space-y-2">
            <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">INVOICE</h1>
            <div className="text-xs font-semibold text-slate-700 space-y-1">
              <div className="flex items-center justify-end gap-1">
                <span className="text-slate-400">INVOICE #:</span>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-16 text-right font-mono focus:outline-none focus:bg-slate-50 rounded"
                />
              </div>
              <div className="flex items-center justify-end gap-1">
                <span className="text-slate-400">DATE:</span>
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-32 text-right focus:outline-none focus:bg-slate-50 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info Columns (TO / FOR) */}
        <div className="grid grid-cols-2 gap-8 text-xs pt-4">
          {/* Client Details */}
          <div className="space-y-1">
            <span className="font-bold text-blue-600 uppercase tracking-wider block">TO:</span>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full font-bold text-slate-800 focus:outline-none focus:bg-slate-50 rounded"
              placeholder="[Name]"
            />
            <input
              type="text"
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
              className="w-full text-slate-600 focus:outline-none focus:bg-slate-50 rounded"
              placeholder="[Company Name]"
            />
            <input
              type="text"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="w-full text-slate-600 focus:outline-none focus:bg-slate-50 rounded"
              placeholder="[Street Address, City, ST ZIP Code]"
            />
            <input
              type="text"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              className="w-full text-slate-600 focus:outline-none focus:bg-slate-50 rounded"
              placeholder="[Phone]"
            />
          </div>

          {/* Project Details */}
          <div className="space-y-1">
            <span className="font-bold text-blue-600 uppercase tracking-wider block">FOR:</span>
            <input
              type="text"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full text-slate-700 focus:outline-none focus:bg-slate-50 rounded"
              placeholder="[Project or service description]"
            />
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              className="w-full text-slate-700 focus:outline-none focus:bg-slate-50 rounded"
              placeholder="[P.O. #]"
            />
          </div>
        </div>

        {/* Classic Bordered Table Structure */}
        <div className="border-2 border-slate-900 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 bg-slate-100 text-xs font-bold text-slate-900 uppercase">
                <th className="p-2 border-r border-slate-900">DESCRIPTION</th>
                <th className="p-2 border-r border-slate-900 text-center w-20">HOURS</th>
                <th className="p-2 border-r border-slate-900 text-right w-24">RATE</th>
                <th className="p-2 text-right w-28">AMOUNT</th>
                <th className="p-2 w-8 no-print"></th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-200">
              {items.map((item) => {
                const amount = (Number(item.hours) || 0) * (Number(item.rate) || 0);
                return (
                  <tr key={item.id} className="group">
                    <td className="p-1.5 border-r border-slate-900">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className="w-full focus:outline-none focus:bg-blue-50/50 p-1 rounded"
                        placeholder="Item description..."
                      />
                    </td>
                    <td className="p-1.5 border-r border-slate-900 text-center">
                      <input
                        type="number"
                        min="0"
                        value={item.hours || ""}
                        onChange={(e) => handleItemChange(item.id, "hours", Number(e.target.value))}
                        className="w-full text-center focus:outline-none focus:bg-blue-50/50 p-1 rounded font-mono"
                      />
                    </td>
                    <td className="p-1.5 border-r border-slate-900 text-right">
                      <input
                        type="number"
                        min="0"
                        value={item.rate || ""}
                        onChange={(e) => handleItemChange(item.id, "rate", Number(e.target.value))}
                        className="w-full text-right focus:outline-none focus:bg-blue-50/50 p-1 rounded font-mono"
                      />
                    </td>
                    <td className="p-2 text-right font-mono font-medium text-slate-900">
                      ${amount.toFixed(2)}
                    </td>
                    <td className="p-1 text-center no-print">
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Table Total Footer Block */}
          <div className="border-t-2 border-slate-900 flex justify-end text-xs font-bold bg-slate-50">
            <div className="py-2 px-4 border-r border-slate-900 uppercase flex items-center">
              TOTAL
            </div>
            <div className="py-2 px-4 w-28 text-right font-mono text-sm text-blue-700 bg-white border-l border-slate-900">
              ${totalAmount.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Footer Payment Terms */}
        <div className="pt-8 space-y-4 text-center text-xs text-slate-600">
          <div className="space-y-1">
            <p>Make all checks payable to <span className="font-bold text-slate-800">{companyName}</span></p>
            <p>Total due in 15 days. Overdue accounts subject to a service charge of 1% per month.</p>
          </div>

          <p className="text-sm font-extrabold text-blue-600 tracking-wide pt-2">
            Thank you for your business!
          </p>
        </div>
      </div>
    </div>
  );
}
