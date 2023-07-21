import { Dialog } from "../type/reducerType";

export const SalahMenebak = {
kurangDariPuluh : ['Tebakan anda kurang sedikit lagi','Tebakan anda sedikit Lagi Benar', 'Hampir tepat!', 'Mantap, tinggal sedikit lagi!', 'Bersiap-siap, jawabanmu hampir benar!'], //kurang dari sama dengan 10
lebihDariPuluh : ['Ops, Coba Lagi', 'Tebakan anda kurang tepat', "Oops, salah jawab!", "Coba lagi!", "Ups, salah tebak!", 'Yah, belum tepat nih!', 'Sedikit lagi, jangan menyerah!', 'Jawabanmu belum benar, terus mencoba!'], //kurang dari sama dengan 50 dan lebih dari 10
terlaluJauh : ['Tebakan Anda Terlalu Jauh, Coba Lagi', 'Wow, jauh sekali!', 'Jangan terlalu jauh, terus mencoba!', 'Kamu bisa lebih dekat dari itu!', 'Lebih fokus lagi, jangan terlalu jauh!'], //lebih dari sama dengan 50
lebihDariSeratus : ['Wow, terlalu besar!', 'Hmm, coba lagi!', 'Jangan terlalu berlebihan, periksa kembali!', 'Terlalu tinggi, perlu dicoba lagi!', 'Hati-hati, jangan terlalu besar!'], 
}
export const StatusLainnya = {
   statusLain : ['Hmm, belum tepat juga.', 'Ayo, coba lagi!', 'Tetap semangat mencoba!', 'Belum berhasil, terus berusaha!', 'Jangan menyerah, coba sekali lagi!'], //kondisi lainnya
};

export const Clues = {
   sumGenap : (sum : number) => `di antara digit terdapat ${sum} bilangan genap`,
   sumGanjil : (sum : number) => `di antara digit tedapat ${sum} bilangan ganjil`,
   diffAll : `semua digit berbeda-beda`,
   sameSome : (sum : number) => `di antara digit terdapat ${sum} bilangan yang sama`,
   dividedBy : (divider : number) => `jawban dapat dibagi habis oleh ${divider}`,
   RandomDivider : (divider : number,sum:number)=> `jika jawaban dibagi ${divider} maka tersisa ${sum}`,
   RandomPut : (posisi : 'awal' | 'akhir',isOdd : 'genap' | 'ganjil') => `digit paling ${posisi} berupa ${isOdd}`
}

type DIALOGS = {
   WIN : (jawaban : string) => Dialog
   RESET : (type : string) => Dialog
}

export const DIALOGS : DIALOGS = {
   WIN : (Jawaban) => ({
      Title : 'Tebakan ANDA BENAR',
      MainDialog : `Selamat angka ${Jawaban} merupakan jawaban-nya `,
      isShow : false
   }),
   RESET : (type) => ({
      Title : `Apakah Anda yakin?`,
      MainDialog : `aksi ini akan menghapus semua ${type} ,apakah anda yakin?`,
      isShow : false
   })
}
