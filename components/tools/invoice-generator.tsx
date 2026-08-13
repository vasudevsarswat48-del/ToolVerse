"use client";

import React, { useState } from "react";

interface LineItem {
  id: string;
  description: string;
  hsnCode: string;
  qty: number;
  rate: number;
}

export default function InvoiceGenerator() {
  const [currency, setCurrency] = useState("₹");
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState("2026-08-13");
  
  // Business Header State
  const [businessName, setBusinessName] = useState("BUSINESS NAME");
  const [businessAddress, setBusinessAddress] = useState("132 Street, City, State, PIN");
  const [businessGstin, setBusinessGstin] = useState("AAA213465");
  const [businessEmail, setBusinessEmail] = useState("122@gmail.com");
  const [businessPan, setBusinessPan] = useState("AAA132456");

  // Client Info State
  const [clientName, setClientName] = useState("CLIENT / PARTY NAME");
  const [clientAddress, setClientAddress] = useState("132 STREET, CITY, STATE - 132456");
  const [dueDate, setDueDate] = useState("2026-08-20");
  const [paymentMode, setPaymentMode] = useState("Bank Transfer / UPI");

  // Tax Rates State
  const [cgstRate, setCgstRate] = useState(14);
  const [sgstRate, setSgstRate] = useState(14);

  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "Web Development Services", hsnCode: "998314", qty: 1, rate: 1000 },
    { id: "2", description: "UI/UX Design Concept", hsnCode: "998313", qty: 1, rate: 500 },
  ]);

  const handleItemChange = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

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

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Calculation Logic
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const cgstAmount = (subtotal * cgstRate) / 100;
  const sgstAmount = (subtotal * sgstRate) / 100;
  const grandTotal = subtotal + cgstAmount + sgstAmount;

  // Print Isolated Iframe Function
  const handlePrint = () => {
    const invoiceElement = document.getElementById("printable-invoice");
    if (!invoiceElement) return;

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
              margin: 0mm !important;
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm;
              height: 297mm;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              overflow: hidden !important;
            }
            #print-wrapper {
              width: 210mm;
              padding: 4mm 6mm;
              box-sizing: border-box;
              background: #ffffff;
            }
            input {
              border: none !important;
              outline: none !important;
              background: transparent !important;
            }
            .print\\:hidden, button, .no-print {
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

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Control Bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            Currency:
            <input
              type="text"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-800 text-white px-2 py-1 rounded w-12 text-center border border-slate-700"
            />
          </label>
          <button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1.5 rounded font-semibold transition-colors"
          >
            + Add Item Line
          </button>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-1.5 rounded font-semibold transition-colors shadow"
        >
          Print / Save PDF
        </button>
      </div>

      {/* Printable Invoice Sheet */}
      <div
        id="printable-invoice"
        className="bg-white text-black font-sans text-xs border-2 border-black w-[210mm] max-w-full mx-auto box-border overflow-hidden"
      >
        {/* Header Banner */}
        <div className="bg-black text-white flex justify-between items-center px-4 py-2 font-bold text-sm">
          <span>TAX INVOICE</span>
          <div className="text-right text-xs flex gap-4">
            <div>
              <span>INVOICE NO : </span>
              <input
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="bg-transparent text-white font-mono w-20 focus:outline-none"
              />
            </div>
            <div>
              <span>DATE : </span>
              <input
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="bg-transparent text-white font-mono w-24 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Fully Editable Business Header */}
        <div className="text-center py-3 border-t-2 border-b-2 border-black space-y-1">
          <input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="text-lg font-bold uppercase text-center w-full bg-transparent focus:outline-none focus:bg-gray-100/50"
            placeholder="YOUR BUSINESS NAME"
          />
          <input
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            className="text-xs text-gray-700 text-center w-full bg-transparent focus:outline-none focus:bg-gray-100/50"
            placeholder="Street, City, State, PIN"
          />
          <div className="flex justify-center items-center gap-4 text-[11px] pt-1">
            <div className="flex items-center gap-1">
              <span className="font-semibold">GSTIN:</span>
              <input
                value={businessGstin}
                onChange={(e) => setBusinessGstin(e.target.value)}
                className="w-24 bg-transparent focus:outline-none focus:bg-gray-100/50"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">Email:</span>
              <input
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
                className="w-36 bg-transparent focus:outline-none focus:bg-gray-100/50"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold">PAN NO:</span>
              <input
                value={businessPan}
                onChange={(e) => setBusinessPan(e.target.value)}
                className="w-24 bg-transparent focus:outline-none focus:bg-gray-100/50"
              />
            </div>
          </div>
        </div>

        {/* Bill To & Payment Info */}
        <div className="grid grid-cols-2 border-b-2 border-black">
          <div className="p-3 border-r-2 border-black space-y-1">
            <div className="font-bold underline">BILL TO:</div>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full font-bold uppercase bg-transparent focus:outline-none"
              placeholder="PARTY'S NAME"
            />
            <textarea
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              className="w-full bg-transparent focus:outline-none resize-none text-[11px]"
              rows={2}
              placeholder="132 STREET, CITY, STATE - 132456"
            />
          </div>
          <div className="p-3 space-y-1 bg-gray-50/50">
            <div>
              <span className="font-semibold">Payment Due Date: </span>
              <input
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-transparent focus:outline-none"
              />
            </div>
            <div>
              <span className="font-semibold">Payment Mode: </span>
              <input
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="bg-transparent focus:outline-none w-48"
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-b-2 border-black text-left">
          <thead>
            <tr className="border-b-2 border-black bg-gray-100 font-bold">
              <th className="p-2 border-r-2 border-black">Description</th>
              <th className="p-2 border-r-2 border-black w-24 text-center">HSN Code</th>
              <th className="p-2 border-r-2 border-black w-16 text-center">Qty</th>
              <th className="p-2 border-r-2 border-black w-24 text-right">Rate</th>
              <th className="p-2 w-28 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-300">
                <td className="p-2 border-r-2 border-black flex justify-between items-center group">
                  <input
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 no-print font-bold px-1 text-xs shrink-0"
                      title="Remove item"
                    >
                      ×
                    </button>
                  )}
                </td>
                <td className="p-2 border-r-2 border-black text-center">
                  <input
                    value={item.hsnCode}
                    onChange={(e) => handleItemChange(item.id, "hsnCode", e.target.value)}
                    className="w-full text-center bg-transparent focus:outline-none"
                  />
                </td>
                <td className="p-2 border-r-2 border-black text-center">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => handleItemChange(item.id, "qty", Number(e.target.value))}
                    className="w-full text-center bg-transparent focus:outline-none"
                  />
                </td>
                <td className="p-2 border-r-2 border-black text-right">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(item.id, "rate", Number(e.target.value))}
                    className="w-full text-right bg-transparent focus:outline-none"
                  />
                </td>
                <td className="p-2 text-right font-mono font-medium">
                  {currency}{(item.qty * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end p-3 border-b-2 border-black">
          <div className="w-1/2 space-y-1 text-right">
            <div className="flex justify-between border-b pb-1">
              <span className="font-semibold">Total Subtotal:</span>
              <span className="font-mono">{currency}{subtotal.toFixed(2)}</span>
            </div>

            {/* CGST % */}
            <div className="flex justify-between border-b pb-1 items-center">
              <span className="font-semibold flex items-center gap-1">
                Add : CGST @
                <input
                  type="number"
                  value={cgstRate}
                  onChange={(e) => setCgstRate(Number(e.target.value))}
                  className="w-8 text-center font-bold bg-transparent focus:outline-none"
                />
                %
              </span>
              <span className="font-mono">{currency}{cgstAmount.toFixed(2)}</span>
            </div>

            {/* SGST % */}
            <div className="flex justify-between border-b pb-1 items-center">
              <span className="font-semibold flex items-center gap-1">
                Add : SGST @
                <input
                  type="number"
                  value={sgstRate}
                  onChange={(e) => setSgstRate(Number(e.target.value))}
                  className="w-8 text-center font-bold bg-transparent focus:outline-none"
                />
                %
              </span>
              <span className="font-mono">{currency}{sgstAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-bold text-sm bg-black text-white p-1.5 mt-2">
              <span>Grand Total</span>
              <span className="font-mono">{currency}{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Total Amount in Words */}
        <div className="p-3 border-b-2 border-black font-semibold text-[11px]">
          Total Amount ({currency} - In Words) : <span className="underline italic font-bold">RUPEES {grandTotal.toFixed(2)} ONLY</span>
        </div>

        {/* Terms & Conditions & Signatory Footer */}
        <div className="flex justify-between items-end p-3 gap-4">
          <div className="flex-1 pr-4">
            <div className="font-bold underline text-xs mb-1">Terms & conditions</div>
            <ol
              contentEditable
              suppressContentEditableWarning
              className="list-decimal list-inside text-[10px] space-y-0.5 outline-none focus:bg-yellow-50/50 p-1 rounded"
            >
              <li>Goods once sold will not be taken back.</li>
              <li>Interest @18% p.a. charged if bill unpaid after due date.</li>
              <li>Subject to local jurisdiction.</li>
            </ol>
          </div>

          <div className="text-right space-y-8 shrink-0">
            <div className="font-bold text-xs">For : {businessName}</div>
            <div className="border-t border-black pt-1 text-[11px] font-semibold">Authorised Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
}
