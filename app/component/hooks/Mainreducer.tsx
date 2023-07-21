import { ADDCLUES, RandomizeNumber, numberToStringWithMinDigits } from "@/lib/utils";
import { Action, BerhasilMenebak, Dialog, Level, State, advanced } from "../type/reducerType";

function isDialog(obj: any): obj is Dialog & advanced {
  return obj && (obj.isShow !== undefined || obj.advanced !== undefined);
}

export const ACTION = {
   BERHASIL_MENEBAK: "Berhasil-Menebak",
   SET_DIGIT: "SET_DIGIT",
   GAGAL_MENEBAK: "Gagal-Menebak",
   RESET_TEBAKAN: "Reset-Tebakan",
   RESET_BERHASIL: "RESET_BERHASIL",
   CLEAR_DIGIT: "Clear-Digit",
   CHANGE_LEVEL : "Change-Level",
   NAMBAH_ARRAYGUESS : 'Nambah-Arrays',
   CHANGE_MIN : "Change-Min",
   ADD_CLUE : "Add-Clue",
   SET_DIALOG : "Set-Dialog",
   SET_DIALOG_ISSHOW : "Set-Dialog-IsShowing",
};
export type levelSections = Record<levelIs, Level>;

const levelSection: levelSections = {
   easy: {
      inputValue: ["",""],
      sumGuess: 0,
      status: "",
      arrayGuess : [],
      jawaban : (RandomizeNumber(0,99)),
      berhasil : false,
      clue : []
   },
   medium: {
      inputValue: ["","",""],
      sumGuess: 0,
      status: "",
      arrayGuess : [],
      jawaban : (RandomizeNumber(0,999)),
      berhasil : false,
      clue : []
   },
   hard: {
      inputValue: ["","","",""],
      sumGuess: 0,
      status: "",
      arrayGuess : [],
      jawaban : (RandomizeNumber(0,9999)),
      berhasil : false,
      clue : []
   },
};

export type levelIs = 'easy' | 'medium' | 'hard'

export interface levels  {
   level : levelIs
}

export const levelArray: levelIs[] = ["easy","medium","hard"];
if (typeof window !== 'undefined') {
  // Perform localStorage action
  const item = localStorage.getItem('key')
}

export const INITIAL_STATE: State = {
   menu: { ...levelSection },
   level: "easy",
   berhasilMenebak: (typeof window !== 'undefined'
      ? JSON.parse(window.localStorage.getItem('berhasil') || '[]')
      : []),
   dialog: {
      Title: '',
      isShow: false,
      MainDialog: '',
      advanced: true,
      type: ''
   }
};





export const REDUCER = (state: State, action: Action): State => {
   const {menu,level} = state
   function mengeditSumGuess(num : number,res? : boolean) {
      if (res) {
         return 0
      }
      const {sumGuess} = menu[level]
      return sumGuess + num
   }
   function addProgress(num : string){
      const {arrayGuess} = menu[level]
      return arrayGuess.concat(num)
   }
   switch (action.type) {
      case ACTION.SET_DIGIT:
         const { index = 0, value = "" } = action.payload || {} ;
         const newMenu = {...state.menu};
         const {level} = state
         const newInputValue = [...newMenu[level].inputValue];
         newInputValue[index] = value.toString();
         newMenu[level].inputValue = newInputValue;
         return {
         ...state,
         menu: newMenu,
         };
      case ACTION.RESET_TEBAKAN : {
         const {level} = state

         const value = level === "easy" 
            ? RandomizeNumber(0,99)
            : level === "medium"
            ? RandomizeNumber(0,999)
            : RandomizeNumber(0,9999)
         const newMenu = {...state.menu}
         const {inputValue} = newMenu[level]
         newMenu[level].jawaban = Number(value)
         newMenu[level].sumGuess = 0
         newMenu[level].berhasil = false
         newMenu[level].inputValue = inputValue.map(_ => "")
         newMenu[level].arrayGuess = []
         newMenu[level].status = ""
         newMenu[level].clue = []
         return {
            ...state,
            menu : newMenu
         }
      }
      case ACTION.NAMBAH_ARRAYGUESS : {
         const {level} = state
         const newMenu = {...state.menu};
         const gues = newMenu[level].inputValue.join("")
         newMenu[level].arrayGuess = addProgress(gues)
         newMenu[level].sumGuess = mengeditSumGuess(1)
         return {
            ...state,
            menu : newMenu
         }
      } 
      case ACTION.GAGAL_MENEBAK: {
         const { newMessage = "ERROR" } = action.payload || {};
         const {level} = state
         const newMenu = {...state.menu};
         newMenu[level].status = newMessage;
         return {
            ...state,
            menu: newMenu,
         };
      }
      case ACTION.BERHASIL_MENEBAK: {
         const newMenu = {...state.menu};
         const {level} = state
         const {inputValue,sumGuess} = state.menu[level]
         newMenu[level].status = "Tebakan anda benar!";
         newMenu[level].berhasil = true
         const newBerhasil : BerhasilMenebak = {
            guess : inputValue.join(""),
            percobaan : sumGuess,
            level
         }
         localStorage.setItem('berhasil', JSON.stringify(newBerhasil))
         const newBerhasilMenebak: BerhasilMenebak[] = state.berhasilMenebak.concat(newBerhasil);
         return {
            ...state,
            menu: newMenu,
            berhasilMenebak: newBerhasilMenebak
         };
      }
      case ACTION.CHANGE_LEVEL: {
         const {newLevel = state.level} = action.payload || {}
         return {
            ...state,
            level : newLevel
         }
      }
      case ACTION.RESET_BERHASIL : {
         localStorage.setItem('berhasil', JSON.stringify([]))
         return {
            ...state,
            berhasilMenebak : []
         }
      }
      case ACTION.ADD_CLUE : {
         const {level} = state
         const newMenu = {...state.menu}
         const minDigit = level == "easy" ? 2 : (level == "medium" ? 3 : 4)
         const {jawaban} = newMenu[level]
         newMenu[level].clue = ADDCLUES(numberToStringWithMinDigits(jawaban,minDigit),minDigit)
         return {
            ...state,
            menu : newMenu
         }
      }
      case ACTION.SET_DIALOG : {
         const { Title = "", MainDialog = "", isShow = false,advanced=false , type="Progress" } = (action.payload?.dialog || {}) as Dialog & advanced;
         const newDialog = {...state.dialog}
         if(Title == "" || Title == undefined){
            console.error('Title cannot be empty')
            return {...state}
         }else if(MainDialog == undefined || MainDialog == ""){
            console.error('Dialog cannot be empty')
            return {...state}
         }
         newDialog.MainDialog = MainDialog
         newDialog.Title = Title
         newDialog.isShow = isShow
         newDialog.advanced = advanced
         newDialog.type = type
         return {
            ...state,
            dialog : newDialog
         }
      }
      case ACTION.SET_DIALOG_ISSHOW : {
         if(!(isDialog(action.payload?.dialog))){
            return {...state}
         }
         const {isShow = false} = action.payload?.dialog || {}
         const newDialog = {...state.dialog}
         newDialog.isShow = isShow
         return {...state,dialog : newDialog}
      }
      default:
         return state;
   }
};
