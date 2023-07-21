
export function Data1({Index,jawaban,item} : {Index : number,jawaban? : number,item? : string}) {
   return (
   <tr className={`even:bg-slate-700 ${jawaban && Number(item) === jawaban ? 'bg-emerald-700' : ''}`} key={Index}>
      <td className="border-s border-b border-gray-400 text-center">{Index}</td>
      <td className="border-e border-b border-gray-400 text-center">{item}</td>
   </tr>
   )
}
