import { useMemo, useState } from "react";
function zodiac(m:number,d:number){
  const z=[[1,20,"Capricorn"],[2,19,"Aquarius"],[3,20,"Pisces"],[4,20,"Aries"],[5,21,"Taurus"],[6,21,"Gemini"],[7,22,"Cancer"],[8,22,"Leo"],[9,23,"Virgo"],[10,23,"Libra"],[11,22,"Scorpio"],[12,22,"Sagittarius"],[12,32,"Capricorn"]];
  for(let i=0;i<z.length-1;i++){const [m1,d1,name]=z[i] as any; const [m2,d2]=z[i+1] as any; if(m===m1&&d<=d1||m===m2&&d<d2&&m1!==m2) return name; if(m===m1&&d>d1&&m2===m1+1) return (z[i+1] as any)[2];}
  return "Capricorn";
}
export default function ZodiacSign() {
  const [date,setDate]=useState("2000-06-15");
  const sign=useMemo(()=>{const d=new Date(date+"T00:00:00");if(isNaN(d.getTime()))return null;return zodiac(d.getMonth()+1,d.getDate());},[date]);
  return (<div className="space-y-4">
    <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:"100%",padding:12,borderRadius:10,border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)"}} />
    <div style={{textAlign:"center",padding:28,borderRadius:12,border:"1px solid var(--border)",background:"var(--surface-2)",fontSize:32,fontWeight:800}}>{sign||"—"}</div>
  </div>);
}
