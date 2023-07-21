import type { levelIs,levelSections,ACTION, levels } from "../hooks/Mainreducer";

type BerhasilMenebak = {
   guess: string;
   percobaan: number;
}& levels

type Level = {
   inputValue: string[];
   sumGuess: number;
   status: string;
   arrayGuess: string[]
   jawaban : number
   berhasil : boolean
   clue : string[]
   
};
type advanced = {
   advanced : boolean
   type : 'Progress' | 'ProgressBerhasil' | ''
}

type Dialog = {
   Title : string
   MainDialog : string
   isShow : boolean
}

type State = {
   menu: levelSections;
   berhasilMenebak: BerhasilMenebak[];
   dialog : Dialog & advanced
}& levels
type Action = {
   type: typeof ACTION[keyof typeof ACTION]; 
   payload?: {
      value?: string 
      index?: number;
      newMessage?: string;
      newLevel?: levelIs ;
      level? : levelIs
      dialog? : Dialog & advanced | {isShow : boolean} | advanced
   }
};

export type {Action,BerhasilMenebak,State,Level,Dialog,advanced}