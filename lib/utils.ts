
import { levelIs } from "@/app/component/hooks/Mainreducer";
import { Clues, SalahMenebak, StatusLainnya } from "@/app/component/text/idn";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs))
}
export const RandomizeNumber = (min: number, max: number): number => {
   return Math.floor(Math.random() * (max - min) + min);
}

export const RandomIndex = (len : number) => {
   return Math.floor(Math.random() * len)
}

export const RandomStatus = (alt : string) : string => {
   const {statusLain} = StatusLainnya
   const random = Math.random()
   return random < 0.6 ? alt : statusLain[RandomIndex(statusLain.length)]
}

export const WrongHandler = (between : number,level? : levelIs) : string => {
   switch(level){
      case "easy" : {
         const {lebihDariPuluh,lebihDariSeratus,kurangDariPuluh,terlaluJauh} = SalahMenebak
         const message =  between <= 10
            ? RandomStatus(kurangDariPuluh[RandomIndex(kurangDariPuluh.length)])
            : between <= 30
            ? RandomStatus(lebihDariPuluh[RandomIndex(lebihDariPuluh.length)])
            : between <= 70 
            ? RandomStatus(terlaluJauh[RandomIndex(terlaluJauh.length)])
            : RandomStatus(lebihDariSeratus[RandomIndex(terlaluJauh.length)])
         return message
      }case "medium" : {
         const {lebihDariPuluh,lebihDariSeratus,kurangDariPuluh,terlaluJauh} = SalahMenebak
         const message = between <= 50
            ? RandomStatus(kurangDariPuluh[RandomIndex(kurangDariPuluh.length)])
            : between <= 100
            ? RandomStatus(lebihDariPuluh[RandomIndex(lebihDariPuluh.length)])
            : between <= 300
            ? RandomStatus(terlaluJauh[RandomIndex(terlaluJauh.length)])
            : RandomStatus(lebihDariSeratus[RandomIndex(terlaluJauh.length)])
         return message
      }case "hard" : {
         const {lebihDariPuluh,lebihDariSeratus,kurangDariPuluh,terlaluJauh} = SalahMenebak
         const message = between <= 100
            ? RandomStatus(kurangDariPuluh[RandomIndex(kurangDariPuluh.length)])
            : between <= 500
            ? RandomStatus(lebihDariPuluh[RandomIndex(lebihDariPuluh.length)])
            : between <= 1000
            ? RandomStatus(terlaluJauh[RandomIndex(terlaluJauh.length)])
            : RandomStatus(lebihDariSeratus[RandomIndex(terlaluJauh.length)])
         return message
      }
      default : {
         return "ERROR ON HANDLER!"
      }
   }
}

export function colorLevel (item: levelIs)  {
  switch(item){
   case "easy":
      return "text-green-500"
   case "medium" : 
      return "text-yellow-400"
   case "hard":
      return "text-rose-500"
   default : return "text-yellow-500"
  }
};


export const numberToStringWithMinDigits = (number: number, minDigits: number): string => {
   const stringValue = number.toString();
   const leadingZeros = '0'.repeat(Math.max(0, minDigits - stringValue.length));
   return leadingZeros + stringValue;
}
export const ADDCLUES = (jawaban : string,minDigit : number) : string[] => {
   const res : string[] = []
   const split = jawaban.split('')
   const toNumJawaban = Number(jawaban)
   const resultObject = {
      even : 0,
      odd : 0,
      differnt : 0,
      divided : 0,
      isDiff : true
   }
   split.forEach(element => {
      const ToNum = Number(element)
      if( resultObject.differnt == ToNum){
         resultObject.isDiff = false
      }else {
         resultObject.differnt = ToNum
      }
      if(ToNum % 2 == 0){
         resultObject.even++
      }else {
         resultObject.odd++
      }
   });
   for (let i = 6; i < (minDigit > 2 ? 30 : 10); i++) {
      if(Number(jawaban) % i == 0){
         resultObject.divided = i
         break
      }
   }
   const same = []
   for (let i = 0; i < split.length; i++) {
      const dif = split[i]
      for (let z = i + 1; z < split.length; z++) {
         if(dif == split[z]){
            same.push(dif,split[z])
         }
      }
   }
   if(same.length > 0){
      res.push(Clues.sameSome(same.length))
   }
   if(resultObject.isDiff){
      res.push(Clues.diffAll)
   }
   if(resultObject.even >= resultObject.odd){
      res.push(Clues.sumGenap(resultObject.even))
   }else {
      res.push(Clues.sumGanjil(resultObject.odd))
   }
   if(resultObject.divided != 0){
      res.push(Clues.dividedBy(resultObject.divided))
   }
   if(res.length <3){
      const randomNum = RandomizeNumber(11,30)
      const sisa = toNumJawaban % randomNum
      res.push(Clues.RandomDivider(randomNum,sisa))
   }
   if(toNumJawaban == 1945){
      res.push('tahun kemerdekaan indonesia')
   }else if(toNumJawaban == 2030){
      res.push('tahun ini')
   }
   if(Math.random() < 0.7){
      const posisiNumber = Math.random() > 0.7 ? 0 : split.length - 1
      const posisiDecide = posisiNumber == 0 ? 'awal' : 'akhir'
      const IsOdd = Number(split[posisiNumber]) % 2 == 0 ? 'genap' : 'ganjil'
      res.push(Clues.RandomPut(posisiDecide,IsOdd))
   }
   return res.sort((a,b) => a.localeCompare(b))
}
