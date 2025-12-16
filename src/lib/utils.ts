
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getFallback(name : string) : string{
  if(!name) return ''

  const parts = name.trim().split(' ')
  
  if(parts.length === 1){
    return parts[0].slice(0, 2).toUpperCase()// eg. "Mohamed" -> "MO"
  }

  return (parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase())
}

export function getDirection(locale: string): "ltr" | "rtl" {
  const rtlLocales = ["ar"];
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

import { Mode } from "@/generated/prisma/browser";

export const MODE_I18N_KEY: Record<Mode, string> = {
  POMODORO: "timer.modes.pomodoro",
  SHORT_BREAK: "timer.modes.shortBreak",
  LONG_BREAK: "timer.modes.longBreak"
};



export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}


