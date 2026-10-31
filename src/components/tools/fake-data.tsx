import { useState } from "react";
import { ActionButton } from "@/components/ui/ActionButton";

const FIRST = ["Aarav","Vivaan","Aditya","Diya","Ananya","Isha","Rohan","Neha","Kabir","Sara","James","Emma","Liam","Olivia"];
const LAST = ["Sharma","Patel","Singh","Khan","Gupta","Verma","Shah","Smith","Johnson","Brown","Lee","Garcia"];
const DOMAINS = ["gmail.com","yahoo.com","outlook.com","example.com"];

function pick<T>(arr: T[]) { return arr[Math.floor(Math.random()*arr.length)]; }

export default function FakeData() {
  const [rows, setRows] = useState<string[]>([]);
  const gen = () => {
    const list = Array.from({length: 10}, () => {
      const f = pick(FIRST), l = pick(LAST);
      const email = `${f.toLowerCase()}.${l.toLowerCase()}@${pick(DOMAINS)}`;
      const phone = `+91 ${Math.floor(6000000000 + Math.random()*3999999999)}`;
      return `${f} ${l} | ${email} | ${phone}`;
    });
    setRows(list);
  };
  return (
    <div className="space-y-4">
      <ActionButton onClick={gen}>Generate 10 sample people</ActionButton>
      <ul className="list-none m-0 p-0 space-y-2">
        {rows.map((r,i)=>(
          <li key={i} style={{padding:10,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface-2)",fontSize:14}}>{r}</li>
        ))}
      </ul>
      {rows.length>0 && <ActionButton variant="secondary" onClick={()=>navigator.clipboard.writeText(rows.join("\n"))}>Copy all</ActionButton>}
    </div>
  );
}
