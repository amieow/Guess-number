import { Trash2 } from "lucide-react";
import { Action, BerhasilMenebak } from "../type/reducerType";
import { Dispatch } from "react";
import { ACTION } from "../hooks/Mainreducer";
import ToolTipDemo from "../ui/tooltip";
import { colorLevel } from "@/lib/utils";
import { DIALOGS } from "../text/idn";

export const BerhasilData1 = ({state,index} : {state? :BerhasilMenebak | undefined,index : number}) => {
   const {guess,percobaan,level} = state || {}
   return (
      <tr key={index} className={`text-center even:bg-gray-800`}>
         <td>
            {index}
         </td>
         <td className={`${level && colorLevel(level)} font-bold text-lg`}>
            {level || "-"}
         </td>
         <td>
            {guess || "-"}
         </td>
         <td>
            {percobaan || "-"}
         </td>
      </tr>
   )
}
export const HandleDelete = (dispatch : Dispatch<Action>,type : 'Progress' | 'ProgressBerhasil' | '') => {
   switch(type){
      case 'Progress': {
         dispatch({type :ACTION.RESET_TEBAKAN})
         return;
      }
      case 'ProgressBerhasil': {
         dispatch({type :ACTION.RESET_BERHASIL})
         return;
      }
      default : {
         return
      }
   }
}

export default function FooterComp({state,dispatch} : {state : BerhasilMenebak[] , dispatch : Dispatch<Action>}) {
   const HandleDelete = () => {
      dispatch({type : ACTION.SET_DIALOG , payload : {dialog : {...DIALOGS.RESET('Progress Berhasil'),advanced : true,type : 'ProgressBerhasil',isShow : true}}})
   }
   return (
      <footer className="px-3 my-3 md:border-b md:my-0 md:row-span-2 md:px-0 no-scrollbar md:overflow-y-scroll">
         <table className=" w-full text-white border-collapse">
            <thead>
               <tr>
                  <td colSpan={4} className="">
                     <div className="flex gap-4">
                        <span className=" flex-shrink-0 font-semibold">berhasil : <span className={`${state.length > 0 ? "text-sky-400" : ''} font-bold`}>{state.length}</span></span>
                        <ToolTipDemo
                           content="Hapus semua progress berhasil"
                        >
                           <Trash2 onClick={HandleDelete} className=" text-red-600 cursor-pointer hover:text-red-400" />
                           
                        </ToolTipDemo>
                     </div>
                  </td>
               </tr>
               <tr className="border bg-violet-800 border-gray-400">
                  <th className="w-[20%] py-1">
                     no
                  </th>
                  <th className="w-[20%]">
                     Level
                  </th>
                  <th className="w-[25%]">
                     jawaban
                  </th>
                  <th className="w-[35%]">
                     Jumlah tebakan
                  </th>
               </tr>
            </thead>
            <tbody className="border border-gray-400 border-t-0">
               {state.length == 0 
                  ? <BerhasilData1 index={0} />
                  : state.map((_,index) => {
                     const reverseIndex = state.length - index
                     return (
                        <BerhasilData1 key={index} state={state[reverseIndex - 1]} index={reverseIndex} />
                     )
                  })
               }
            </tbody>
         </table>
      </footer>
   )
}
