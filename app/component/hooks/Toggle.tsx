
import { useState } from "react"

export function CustomUsestate<T>(states : T){
   const [state,setState] = useState<T>(states)
   return { state, setState}
}

export default function Toggle<T>(cond : T) {
   const [status,setStatus] = useState(cond)
   return {status,setStatus}
}
