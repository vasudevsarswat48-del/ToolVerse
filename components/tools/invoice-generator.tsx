"use client";

import React, { useState } from "react";
import { Printer, Plus, Trash2 } from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  hsnCode: string;
  qty: number;
  rate: number;
}

const CURRENCIES = [
  { label: "INR (₹)", symbol: "₹" },
  { label: "USD ($)", symbol: "$" },
  { label: "EUR (€)", symbol: "€" },
  { label: "GBP (£)", symbol: "£" },
  { label: "JPY (¥)", symbol: "¥" },
];

export default function TaxInvoiceGenerator() {
  const [currency, setCurrency] = useState("₹");
  const [businessName, setBusinessName] = useState("BUSINESS NAME");
  const [businessAddress, setBusinessAddress] = useState("132 Street, City, State, PIN");
  const [gstin, setGstin] = useState("AAA213465");
  const [email, setEmail] = useState("122@gmail.com");
  const [pan, setPan] = useState("AAA132456");

  const [invoiceNo, setInvoiceNo] = useState("1234");
  const [invoiceDate, setInvoiceDate] = useState("04-03-2026");
  const [paymentDueDate, setPaymentDueDate] = useState("18-03-2026");
  const [paymentMode, setPaymentMode] = useState("UPI / Bank Transfer / Cash");

  const [clientName, setClientName] = useState("PARTY'S NAME");
  const [clientAddress, setClientAddress] = useState("132 STREET, CITY, STATE - 132456");
  const [clientEmail, setClientEmail] = useState("abc@gmail.com");
  const [clientGstin, setClientGstin] = useState("07AAFD8457JU3");

  const [cgstRate, setCgstRate] = useState(14);
  const [sgstRate, setSgstRate] = useState(14);
  const [balanceReceived, setBalanceReceived] = useState(0);
  // Editable Terms & Conditions State
const [terms, setTerms] = useState<string[]>([
  "Goods once sold will not be taken back.",
  "Interest @18% p.a. charged if bill unpaid after due date.",
  "Subject to local jurisdiction.",
]);

const handleTermChange = (index: number, value: string) => {
  const updatedTerms = [...terms];
  updatedTerms[index] = value;
  setTerms(updatedTerms);
};

const handleAddTerm = () => {
  setTerms([...terms, ""]);
};

const handleRemoveTerm = (index: number) => {
  setTerms(terms.filter((_, i) => i !== index));
};

  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Web Development Services", hsnCode: "998314", qty: 1, rate: 1000 },
    { id: "2", description: "UI/UX Design Concept", hsnCode: "998313", qty: 1, rate: 500 },
  ]);
  const handleAddItem = () => {
  setItems([
    ...items,
    {
      id: Date.now().toString(),
      description: "",
      hsnCode: "",
      qty: 1,
      rate: 0,
    },
  ]);
};

  const handlePrint = () => {
  const invoiceElement = document.getElementById("printable-invoice");
  if (!invoiceElement) return;

  // Create a hidden iframe element
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  // Inject only the invoice HTML and A4 CSS into the clean iframe
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm;
            height: 275mm;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            overflow: hidden;
          }
          #print-wrapper {
            width: 210mm;
            height: 255mm;
            padding: 8mm 10mm;
            box-sizing: border-box;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .print\\:hidden, button {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div id="print-wrapper">
          ${invoiceElement.innerHTML}
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.focus();
              window.print();
              setTimeout(function() {
                window.frameElement.remove();
              }, 1000);
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  doc.close();
};

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0);
  const cgstAmount = (subtotal * cgstRate) / 100;
  const sgstAmount = (subtotal * sgstRate) / 100;
  const grandTotal = subtotal + cgstAmount + sgstAmount;
  const balanceDue = Math.max(0, grandTotal - balanceReceived);

  // Status Indicator logic
  const paymentStatus =
    balanceReceived >= grandTotal && grandTotal > 0
      ? "PAID IN FULL"
      : balanceReceived > 0
      ? "PARTIALLY PAID"
      : "UNPAID / DUE";

  const statusBgColor =
    balanceReceived >= grandTotal && grandTotal > 0
      ? "bg-emerald-600"
      : balanceReceived > 0
      ? "bg-amber-600"
      : "bg-red-600";


  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Control Bar (Hidden during print) */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            Currency:
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-1 text-xs focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={handleAddItem}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs px-3 py-1.5 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" /> Add Row
          </button>
        </div>

       <button
  onClick={handlePrint}
  className="print:hidden flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded shadow transition-colors"
>
          <Printer className="w-4 h-4" /> Print / Save A4 PDF
        </button>
      </div>

      {/* ─── EXACT A4 TAX INVOICE FORM ─── */}
     <div
  id="printable-invoice"
  className="bg-white text-black font-sans text-xs border-2 border-black w-[210mm] max-w-full h-[255mm] p-4 mx-auto flex flex-col justify-between box-border overflow-hidden"
>
        <div>
          {/* Header Banner */}
          <div className="bg-[#0b2545] text-white flex justify-between items-center px-4 py-2 border-b-2 border-black font-bold text-sm">
            <span>TAX INVOICE</span>
            <div className="text-right text-xs space-y-0.5">
              <div>INVOICE NO : <input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="bg-transparent text-white font-mono w-16 focus:outline-none" /></div>
              <div>DATE : <input value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="bg-transparent text-white w-24 focus:outline-none" /></div>
            </div>
          </div>

          {/* Business Header */}
          <div className="text-center py-3 border-b-2 border-black space-y-0.5">
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="text-xl font-extrabold text-center uppercase tracking-wide w-full focus:outline-none"
            />
            <input
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              className="text-center w-full focus:outline-none text-slate-700"
            />
            <div className="flex justify-center gap-4 text-[11px] text-slate-800 font-semibold pt-0.5">
              <span>GSTIN: <input value={gstin} onChange={(e) => setGstin(e.target.value)} className="w-24 focus:outline-none" /></span>
              <span>Email: <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-32 focus:outline-none" /></span>
              <span>PAN NO: <input value={pan} onChange={(e) => setPan(e.target.value)} className="w-24 focus:outline-none" /></span>
            </div>
          </div>

          {/* Bill To & Dynamic Payment Status */}
          <div className="grid grid-cols-2 border-b-2 border-black min-h-[110px]">
            <div className="p-2 border-r-2 border-black space-y-0.5">
              <span className="font-bold text-black uppercase block">Bill To:</span>
              <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="font-semibold w-full uppercase focus:outline-none" />
              <textarea value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} className="w-full h-10 resize-none focus:outline-none text-slate-700" />
              <div className="text-slate-800">Email: <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-40 focus:outline-none" /></div>
              <div className="text-slate-800">GSTIN: <input value={clientGstin} onChange={(e) => setClientGstin(e.target.value)} className="w-36 focus:outline-none" /></div>
            </div>

            <div className="p-2 bg-[#d8ecf8] space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div>
                  <span className="font-semibold">Payment Due Date: </span>
                  <input value={paymentDueDate} onChange={(e) => setPaymentDueDate(e.target.value)} className="bg-transparent focus:outline-none" />
                </div>
                <div>
                  <span className="font-semibold">Payment Mode: </span>
                  <input value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} className="bg-transparent focus:outline-none w-48" placeholder="e.g. Cash, UPI, Net Banking" />
                </div>
              </div>

              {/* Status Tag */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-300">
                <span className="font-semibold">Status:</span>
                <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded ${statusBgColor}`}>
                  {paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full border-collapse border-b-2 border-black">
            <thead>
              <tr className="border-b-2 border-black text-left font-bold bg-slate-50">
                <th className="p-2 border-r-2 border-black">Description</th>
                <th className="p-2 border-r-2 border-black text-center w-24">HSN Code</th>
                <th className="p-2 border-r-2 border-black text-center w-16">Qty</th>
                <th className="p-2 border-r-2 border-black text-right w-24">Rate</th>
                <th className="p-2 text-right w-28">Amount</th>
                <th className="p-1 w-6 no-print"></th>
              </tr>
            </thead>
            <tbody className="divide-y border-black">
              {items.map((item) => {
                const amount = (Number(item.qty) || 0) * (Number(item.rate) || 0);
                return (
                  <tr key={item.id} className="align-top">
                    <td className="p-1.5 border-r-2 border-black">
                      <input
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                        className="w-full focus:outline-none"
                        placeholder="Item name..."
                      />
                    </td>
                    <td className="p-2 border-r-2 border-black text-center">
                      <input
                        value={item.hsnCode}
                        onChange={(e) => handleItemChange(item.id, "hsnCode", e.target.value)}
                        className="w-full text-center focus:outline-none"
                      />
                    </td>
                    <td className="p-2 border-r-2 border-black text-center">
                      <input
                        type="number"
                        value={item.qty || ""}
                        onChange={(e) => handleItemChange(item.id, "qty", Number(e.target.value))}
                        className="w-full text-center focus:outline-none"
                      />
                    </td>
                    <td className="p-2 border-r-2 border-black text-right">
                      <input
                        type="number"
                        value={item.rate || ""}
                        onChange={(e) => handleItemChange(item.id, "rate", Number(e.target.value))}
                        className="w-full text-right focus:outline-none"
                      />
                    </td>
                    <td className="p-2 text-right font-mono font-medium">
                      {currency}{amount.toFixed(2)}
                    </td>
                    <td className="p-1 text-center no-print">
                      <button
                            onClick={() => handleRemoveItem(item.id)}
                             className="text-red-500 hover:text-red-700 print:hidden"
                             >
                            <Trash2 className="w-4 h-4" />
                            </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Tax & Payment Adjustments Block */}
          <div className="grid grid-cols-2 border-b-2 border-black">
            <div className="p-2 border-r-2 border-black space-y-1">
              <span className="font-bold underline block">Terms & conditions</span>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-slate-700">
                <li>Goods once sold will not be taken back.</li>
                <li>Interest @18% p.a. charged if bill unpaid after due date.</li>
                <li>Subject to local jurisdiction.</li>
              </ol>
            </div>

            <div className="divide-y border-black font-semibold bg-[#d8ecf8]">
              <div className="flex justify-between p-1.5">
                <span>Total Subtotal:</span>
                <span className="font-mono">{currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-1.5">
                <span>Add : CGST @ {cgstRate}%</span>
                <span className="font-mono">{currency}{cgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-1.5">
                <span>Add : SGST @ {sgstRate}%</span>
                <span className="font-mono">{currency}{sgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-1.5 bg-blue-100/50">
                <span>Balance Received :</span>
                <div className="flex items-center">
                  <span className="font-mono mr-1">{currency}</span>
                  <input
                    type="number"
                    value={balanceReceived || ""}
                    onChange={(e) => setBalanceReceived(Number(e.target.value))}
                    className="w-20 text-right bg-transparent border-b border-black focus:outline-none font-mono font-bold text-emerald-800"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="flex justify-between p-1.5 bg-amber-100/50">
                <span>Balance Due :</span>
                <span className="font-mono font-bold text-red-700">{currency}{balanceDue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between p-2 bg-[#0b2545] text-white font-bold text-sm">
                <span>Grand Total</span>
                <span className="font-mono">{currency}{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Total Amount in Words */}
          <div className="p-2 border-b-2 border-black italic font-bold">
            Total Amount ({currency} - In Words) : <span className="font-normal uppercase underline">Rupees {grandTotal.toFixed(2)} Only</span>
          </div>
        </div>

        {/* Footer Authorised Signatory */}
        <div className="pt-12 flex justify-between items-end border-t-2 border-black mt-8">
          <div className="font-bold">
            For : <span className="uppercase">{businessName}</span>
          </div>
          <div className="text-right font-bold pt-8">
            <p className="border-t border-black pt-1 px-4 inline-block">Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
