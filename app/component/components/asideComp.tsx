import { Dispatch, useEffect, useReducer } from "react";
import Toggle, { CustomUsestate } from "../hooks/Toggle";
import { Data1 } from "./tableProgress";
import { RotateCcw } from "lucide-react";
import ToolTipDemo from "../ui/tooltip";
import { Action, Level } from "../type/reducerType";
import { RandomizeNumber } from "@/lib/utils";
import { ACTION, levelIs } from "../hooks/Mainreducer";
import { PROGRESS_STATE, ProgressAction, REDUCER_PROGRESS_STATE } from "../hooks/Progresreducer";
import { DIALOGS } from "../text/idn";

export default function AsideComp({states,dispatchs,level} : {states : Level ,dispatchs : Dispatch<Action>,level : levelIs}) {
   const [state,dispatch] = useReducer(REDUCER_PROGRESS_STATE,PROGRESS_STATE)
   const {arrayGuess,jawaban} = states
   const {value : min,status} = state[level]
   const {status : status2,setStatus : setStatus2} = Toggle<boolean>(false)
   const {status : buttons,setStatus : setButton} = Toggle<boolean>(true)
   const {state : windowWidth,setState : setWindowWidth} = CustomUsestate<number>(0)
   const min2 = arrayGuess.length > 3 ? (arrayGuess.length - 3 - min) : 0
   const displayedAll = arrayGuess.map((_, index) => {
               const reverseIndex = arrayGuess.length - index;
               const reverseItem = arrayGuess[reverseIndex - 1];
               return (
               <Data1 key={index} Index={reverseIndex} jawaban={jawaban} item={reverseItem}/>
               );
            }) 
   const displayedTable = arrayGuess.length > 0 
   ? (status || status2) 
   ? displayedAll
   : arrayGuess.slice(min2 ,arrayGuess.length).map((_, index) => {
               const reverseIndex = arrayGuess.length - index;
               const reverseItem = arrayGuess[reverseIndex - 1];
               return (
               <Data1 key={index} Index={reverseIndex} jawaban={jawaban} item={reverseItem}/>
               );
            })
   : <Data1 Index={0} item="-"  />
   const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if(windowWidth > 768){
         setButton(false)
         setStatus2(true)
      }else {
         setButton(true)
         setStatus2(false)
      }
   };
   const resethandler = () => {
   dispatchs({ type: ACTION.SET_DIALOG,payload : {dialog : {...DIALOGS.RESET('Progress'),isShow : true,advanced : true,type : 'Progress'}} });
   dispatch({type : ProgressAction.CHANGE_MIN, payload : {value : 0,level}})
   dispatch({type : ProgressAction.CHANGE_STATUS, payload : {level,newStatus : false}})
};
   
   useEffect(() => {
      setWindowWidth(window.innerWidth)
      if(window.innerWidth > 768){
         setButton(false)
         setStatus2(true)
      }else {
         setButton(true)
         setStatus2(false)
      }
      setTimeout(() => window.addEventListener('resize', handleResize) ,50)
      return () => {
         window.removeEventListener('resize', handleResize);
      }
   })
   const HandleButton = () => {
      if(!status){
         if(min2 >= 7){
            const randomIndex = min2 > 10 
            ? RandomizeNumber(5,10)
            : RandomizeNumber(5,7)
            dispatch({type : ProgressAction.CHANGE_MIN , payload : {value : state[level].value + randomIndex , level}})
            return;
         }else {
            dispatch({type : ProgressAction.CHANGE_STATUS, payload : {level,newStatus : true}})
         }
         
         if(Math.max(0,min2 - min) == 0 && !(min2 >= 7)){
            dispatch({type : ProgressAction.CHANGE_MIN , payload : {value : (state[level].value + min2) , level} })
            dispatch({type : ProgressAction.CHANGE_STATUS, payload : {level,newStatus : true}})
         }
      }else {
         dispatch({type : ProgressAction.CHANGE_MIN , payload : { value : 0 , level}})
         dispatch({type : ProgressAction.CHANGE_STATUS, payload : {level,newStatus : false}})
      }
   }
   return (
   <div className="px-3 md:border-l md:overflow-y-scroll no-scrollbar md:border border-gray-300-t w-full transition-all flex flex-col md:px-0 md:row-span-4 md:row-start-1">
      <table className="w-full border-collapse border-white">
         <thead className="group">
            <tr>
               <th className="w-[20%] border border-r-0 border-t-0 border-gray-300">Urutan</th>
               <th className=" border h-7 border-t-0 relative flex justify-end border-l-0 border-gray-300">
                  <p className="absolute right-1/2 translate-x-1/2">Tebakan</p>
                     <ToolTipDemo
                        content="Reset Progress"
                        >
                        <RotateCcw onClick={resethandler} size={24} className=" text-rose-500 cursor-pointer transition-all duration-300 hover:-rotate-180">Hover me</RotateCcw>
                     </ToolTipDemo>
               </th>
               
            </tr>
         </thead>
         <tbody className={`md:w-0 h-0 transition-all ${status ? 'h-full' : ''}`}>
            {displayedTable}
         </tbody>
      </table>
      {buttons && arrayGuess.length > 3
      && <button onClick={HandleButton} className={`w-full transition-all bg-gray-500 ${(status2 || status) || min2 == 0 ? 'shadow-[rgba(100,100,_100,_0.4)_0px_10px_40px_7px] translate-y-0' : '-translate-y-4 shadow-[rgba(0,0,_0,_0.5)_0px_-10px_20px_7px] bg-gray-700'}  md:hidden py-1`}>{(status || status2) || min2 == 0 ? 'See Less' : "See More"} </button>}
   </div>
   )
}
