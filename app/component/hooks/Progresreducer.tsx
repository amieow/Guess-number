
import { levelIs, levels } from "./Mainreducer"

interface Prg {
   value : number;
   status : boolean
}

type ProgressState = Record<levelIs,Prg>
export const PROGRESS_STATE : ProgressState = {
   easy : {
      value : 0,
      status : false
   },
   medium : {
      value : 0,
      status : false
   },
   hard : {
      value : 0,
      status : false
   }
}

export const ProgressAction = {
   CHANGE_MIN : "CHANGE_MIN",
   CHANGE_STATUS : "CHANGE_STATUS",
}
export type ACTIONPRG = {
   type : typeof ProgressAction[keyof typeof ProgressAction],
   payload : {
      value? : number,
      newStatus? : boolean
   } & levels
}
export const REDUCER_PROGRESS_STATE = (state : ProgressState,action : ACTIONPRG):ProgressState  =>  {
   switch (action.type){
      case ProgressAction.CHANGE_MIN : {
         const {value,level} = action.payload || {}
         const newPrg = {...state}
         newPrg[level].value = Number(value)
         return {
            ...newPrg
         }
      }
      case ProgressAction.CHANGE_STATUS : {
         const {level} = action.payload
         const {newStatus = state[level].status} = action.payload
         const newPrg = {...state}
         newPrg[level].status = newStatus
         return newPrg
      }
      default:{
         return state
      }
   }
}