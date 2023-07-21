'use client'
import {  useRef, ChangeEvent, KeyboardEvent, FormEvent, useEffect, useReducer } from "react";
import { ACTION, INITIAL_STATE, REDUCER, levelArray, levelIs } from "./component/hooks/Mainreducer";
import { WrongHandler, colorLevel } from "@/lib/utils";
import { Select,SelectItem } from "./component/ui/select";
import { SelectContent, SelectIcon, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { ChevronDownIcon, RotateCcw } from "lucide-react";
import AsideComp from "./component/components/asideComp";
import ToolTipDemo from "./component/ui/tooltip";
import FooterComp, { HandleDelete } from "./component/components/footerComp";
import Toggle from "./component/hooks/Toggle";
import { DIALOGS } from "./component/text/idn";
import { AlertDialogDemo } from "./component/ui/alert-dialog";


export default function Home() {
   const [state, dispatch] = useReducer(REDUCER,INITIAL_STATE);
   const { level,berhasilMenebak,dialog } = state;
   const {isShow,Title,MainDialog,advanced,type} = dialog
   const { inputValue, sumGuess, status,jawaban,berhasil,clue } = state.menu[level];
   const inputRefs = useRef<HTMLInputElement[]>([]);
   const {status : onClickclues,setStatus : setOnClick} = Toggle(false)
   useEffect(() => {
      if(!localStorage.getItem('berhasil')){
         localStorage.setItem('berhasil','[]')
      }
      if(inputRefs.current && !berhasil){
         inputValue.forEach((_,index) => {
            inputRefs.current[index].disabled = false
         })}
   }, [inputRefs,inputValue,berhasil]);
   const onChangeLevel = (item : levelIs) => {
      dispatch({type : ACTION.CHANGE_LEVEL,payload : {newLevel : item}})
   }
   const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key === "Backspace") {
         e.preventDefault();
         if (index > 0 && inputValue[index] === "") {
            inputRefs.current[index - 1]?.focus();
            dispatch({ type: ACTION.SET_DIGIT, payload: { index: index - 1, value: "" } });
         }else if(inputValue[index] != "") {
            dispatch({ type: ACTION.SET_DIGIT, payload: { index: index, value: "" } });
         }
      }
   };
   const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
      const { value } = e.target;
      if (value === "") {
         dispatch({ type: ACTION.SET_DIGIT, payload: { index, value: "" } });
         if (index > 0) {
            setTimeout(() => inputRefs.current[index + 1]?.focus(),50)
         }
      } else {
         if(value.length == 2 && (index + 1 < inputValue.length)){
            const numeric = Number(value[1])
            if (!isNaN(numeric) && Number.isInteger(numeric) && numeric >= 0 && numeric <= 9) {
               dispatch({ type: ACTION.SET_DIGIT, payload: { index : index + 1, value: String(numeric) } });
               if (index < inputValue.length - 1) {
                  setTimeout(() => inputRefs.current[index + 1]?.focus(),50)
               }
            }
            return;
         }
         const numericValue = Number(value);
         if (!isNaN(numericValue) && Number.isInteger(numericValue) && numericValue >= 0 && numericValue <= 9) {
            dispatch({ type: ACTION.SET_DIGIT, payload: { index, value: String(numericValue) } });
            if (index < inputValue.length - 1) {
               setTimeout(() => inputRefs.current[index + 1]?.focus(),50)
            }
         }
      }
   };
   const HandleAlert = () => {
      dispatch({type: ACTION.SET_DIALOG_ISSHOW , payload : {dialog : {isShow : false,type : '' ,advanced : false}}})
   }
   const HandleForm = (e : FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if(berhasil){
         dispatch({type: ACTION.RESET_TEBAKAN})
         return;
      }
      if(inputValue.includes("")){
         dispatch({type : ACTION.GAGAL_MENEBAK,payload : {newMessage : WrongHandler(1)}})
         return
      }
      const guessings = inputValue.join("")
      dispatch({type:ACTION.NAMBAH_ARRAYGUESS})
      if(Number(guessings) == jawaban){
         dispatch({type : ACTION.SET_DIALOG,payload : {dialog : {...DIALOGS.WIN(inputValue.join('')) , isShow : true} }})
         dispatch({type : ACTION.BERHASIL_MENEBAK })
         return;
      }
      const between = Math.abs(Number(guessings) - jawaban)
      dispatch({ type: ACTION.GAGAL_MENEBAK, payload: { newMessage: WrongHandler(between,level) } });
   }
   useEffect(() => {
      let timeout : NodeJS.Timeout
      if(onClickclues){
         timeout = setTimeout(() => {
            setOnClick((prev) => !prev)
         }, 1000);
      }
      return () => clearTimeout(timeout)
   },[onClickclues,setOnClick])
   return (
      <>
         <AlertDialogDemo advanced={advanced} handlerConfirm={() =>HandleDelete(dispatch,type)} handler={HandleAlert} isOpen={isShow} title={Title} description={MainDialog} />
         <main className="grid grid-cols-1 w-screen md:h-screen text-white pt-10 md:pt-0 md:grid-cols-2 md:grid-rows-4 md:min-h-[800px] md:max-h-[1000px]">
            <div className={`min-h-full md:row-span-2`}>
               <h1 className="font-semibold text-2xl text-center mb-5">GUESS</h1>
               <div className="flex justify-center px-2 flex-col text-center border-y border-y-gray-200">
                  <div className="flex flex-col">
                     <div className="flex mb-1 justify-around relative">
                        <div className={` text-lg rounded-lg p-1 ${sumGuess > 0 ? `${berhasil ? 'bg-green-700' : 'bg-red-700'}` : "bg-gray-800"} w-fit px-4`}>
                           Guessing: {sumGuess}
                        </div>
                        <Select onValueChange={(item : levelIs) => onChangeLevel(item)} >
                           <SelectTrigger className={`flex ${colorLevel(level)} bg-gray-800 p-1 px-2 rounded-lg justify-between h-fit focus-visible:outline-none`}>
                              <SelectValue className="" placeholder={level} />
                              <SelectIcon className=" text-violet-600">
                                 <ChevronDownIcon className="my-auto" size={28}/>
                              </SelectIcon>
                           </SelectTrigger>
                           <SelectContent  className=" font-semibold bg-gray-900 transition-all rounded-lg border border-t-0 border-gray-400" position="popper" >
                              {levelArray.map((item,index) => {
                                 return (
                                    <SelectItem className={`rounded-lg transition-all ${colorLevel(item)} ${item == "medium" && "text-yellow-400"}`}  key={index} value={item}>
                                       <p className="my-auto h-fit">{item}</p>
                                    </SelectItem>
                                 )})}
                           </SelectContent>
                        </Select>
                     </div>
                     <div className={`${berhasil ? 'text-green-500' : ''}`}>{status}</div>
                  </div>
                  <form className="pb-2" onSubmit={(e) => HandleForm(e)}>
                     <div className="text-white mt-2 gap-3 justify-center flex mb-4">
                        <div className="flex gap-3">
                           {inputValue.map((item, index) => (
                              <div className="relative" key={index}>
                                 <input
                                    required
                                    type="text"
                                    inputMode="numeric"
                                    value={item}
                                    title="Input number"
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyPress(e, index)}
                                    disabled={berhasil || !inputRefs.current[index]}
                                    className={`bg-transparent transition-all duration-300 border-2 w-8 rounded-lg px-2 py-1 border-blue-50 focus:outline-none focus:border-red-400 focus:shadow-xl focus:shadow-blue-600 focus:border-b-blue-400 ${
                                       berhasil ? "disabled:text-black disabled:font-medium disabled:bg-green-200" : "disabled:bg-red-500 disabled:animate-pulse"
                                    }`}
                                    ref={(ref) => {
                                       if (ref) {
                                          inputRefs.current[index] = ref;
                                       }
                                    }}
                                 />
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="flex flex-col mx-auto max-sm:w-full sm:w-[60%] md:w-full bg-opacity-50 transition-all bg-gray-600 rounded-lg">
                           <button onClick={() => {setOnClick((prev) => !prev);dispatch({type : ACTION.ADD_CLUE})}} className={`bg-gray-800 transition-all w-full text-sm p-1 ${onClickclues ? 'w-full' : (clue.length > 0 ?'' : 'w-40')} rounded-lg px-7`} type="button">
                              + Petunjuk
                           </button>
                           <div className={`h-0 duration-500 text-left  transition-all ${clue.length > 0 || onClickclues ? 'h-fit py-1' : 'h-0'}`}>
                              {!onClickclues ? clue.map((clue,index) => (
                                 <div className=" flex gap-3 px-2 text-gray-200 border-b border-gray-500 pb-1" key={index}>
                                    <p className=" font-semibold ">{index + 1} </p>
                                    <p>{clue}</p>
                                 </div>
                              )) : <RotateCcw className=" animate-spin" />}
                           </div>
                        </div>
                        <ToolTipDemo content={berhasil ? 'Lanjut' : 'Kirim'}>
                           <button className={`${berhasil ? 'bg-sky-600 text-white w-full' : ' bg-gray-600 text-white'} before:h-1 before:bg-green-400 px-4 transition-all rounded-md `} type="submit">{berhasil ? 'Next' : 'Submit'}</button>
                        </ToolTipDemo>
                     </div>
                  </form>
               </div>
            </div>
            <AsideComp level={level} dispatchs={dispatch} states={state.menu[level]} />
            <FooterComp dispatch={dispatch} state={berhasilMenebak} />
         </main>
         
         
      </>
   );
}

