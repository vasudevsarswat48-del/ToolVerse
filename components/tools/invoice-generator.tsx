"use client";

import React, { useState } from "react";
import { Plus, Trash2, Printer, DollarSign, Calendar, Building, User, FileText } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export default function InvoiceGenerator() {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-1001");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  
  // Business Info
  const [fromName, setFromName] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromAddress, setFromAddress] = useState("");

  // Client Info
  const [toName, setToName] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [toAddress, setToAddress] = useState("");

  // Items & Calculations
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Web Development Services", quantity: 1, price: 500 },
  ]);
  const [taxRate, setTaxRate] = useState<number>(10);
  const [currency, setCurrency] = useState("$");
  const [notes, setNotes] = useState("Thank you for your business!");

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", quantity: 1, price: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 print:hidden">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" /> Invoice Generator
          </h2>
          <p className="text-xs text-slate-400">Fill in the details to print or save as PDF</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none"
          >
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="₹">INR (₹)</option>
          </select>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Invoice Sheet Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-8 print:bg-white print:text-black print:p-0 print:border-none">
        
        {/* Top Section: Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-800 print:border-gray-300">
          <div>
            <label className="text-xs font-medium text-slate-400 print:text-gray-600">Invoice Title / ID</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full text-2xl font-bold bg-transparent text-white print:text-black border-none focus:outline-none focus:ring-0 p-0"
              placeholder="INV-001"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 print:text-gray-600 block mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-800 print:bg-transparent text-slate-200 print:text-black text-xs rounded-md p-2 border border-slate-700 print:border-gray-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 print:text-gray-600 block mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-800 print:bg-transparent text-slate-200 print:text-black text-xs rounded-md p-2 border border-slate-700 print:border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Sender & Receiver Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5" /> From (Your Info)
            </h3>
            <input
              type="text"
              placeholder="Your Business Name"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              className="w-full bg-slate-800/50 print:bg-transparent border border-slate-700/60 print:border-none rounded-md p-2 text-xs text-white print:text-black"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              className="w-full bg-slate-800/50 print:bg-transparent border border-slate-700/60 print:border-none rounded-md p-2 text-xs text-white print:text-black"
            />
            <textarea
              placeholder="Address & Phone Number"
              rows={2}
              value={fromAddress}
              onChange={(e) => setFromAddress(e.target.value)}
              className="w-full bg-slate-800/50 print:bg-transparent border border-slate-700/60 print:border-none rounded-md p-2 text-xs text-white print:text-black resize-none"
            />
          </div>

          {/* To */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Bill To (Client Info)
            </h3>
            <input
              type="text"
              placeholder="Client Name / Business"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              className="w-full bg-slate-800/50 print:bg-transparent border border-slate-700/60 print:border-none rounded-md p-2 text-xs text-white print:text-black"
            />
            <input
              type="email"
              placeholder="Client Email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              className="w-full bg-slate-800/50 print:bg-transparent border border-slate-700/60 print:border-none rounded-md p-2 text-xs text-white print:text-black"
            />
            <textarea
              placeholder="Client Address"
              rows={2}
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="w-full bg-slate-800/50 print:bg-transparent border border-slate-700/60 print:border-none rounded-md p-2 text-xs text-white print:text-black resize-none"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-400 print:text-gray-700 border-b border-slate-800 print:border-gray-300 pb-2">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center text-xs">
              <div className="col-span-6 flex items-center gap-2">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-500 hover:text-red-400 transition-colors print:hidden"
                  title="Remove Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  className="w-full bg-slate-800/40 print:bg-transparent border border-slate-700/50 print:border-none rounded p-1.5 text-white print:text-black"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-slate-800/40 print:bg-transparent border border-slate-700/50 print:border-none rounded p-1.5 text-center text-white print:text-black"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800/40 print:bg-transparent border border-slate-700/50 print:border-none rounded p-1.5 text-right text-white print:text-black"
                />
              </div>
              <div className="col-span-2 text-right font-mono text-slate-200 print:text-black">
                {currency}{(item.quantity * item.price).toFixed(2)}
              </div>
            </div>
          ))}

          <button
            onClick={addItem}
            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium pt-2 print:hidden"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>

        {/* Totals Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-800 print:border-gray-300">
          <div className="w-full md:w-1/2 space-y-2">
            <label className="text-xs font-medium text-slate-400 print:text-gray-600 block">Notes / Payment Details</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800/50 print:bg-transparent border border-slate-700/60 print:border-none rounded-md p-2 text-xs text-white print:text-black resize-none"
              placeholder="Bank transfer details, terms, etc."
            />
          </div>

          <div className="w-full md:w-5/12 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400 print:text-gray-700">
              <span>Subtotal</span>
              <span className="font-mono text-slate-200 print:text-black">{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 print:text-gray-700">
              <span className="flex items-center gap-1">
                Tax Rate (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-12 bg-slate-800 print:bg-transparent border border-slate-700 print:border-none rounded p-0.5 text-center text-white print:text-black text-xs print:hidden ml-1"
                />
              </span>
              <span className="font-mono text-slate-200 print:text-black">{currency}{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800 print:border-gray-300 text-sm font-bold text-white print:text-black">
              <span>Total Due</span>
              <span className="font-mono text-emerald-400 print:text-black">{currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
