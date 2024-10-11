import { DayPilot } from "@daypilot/daypilot-lite-angular";

export interface IEvent {

    id: string
	start: DayPilot.Date | string  
	end: DayPilot.Date | string 
	barColor: string 
	text: string 
	note: string 
	resource: string
	patient: string
    resizeDisabled: boolean
    moveDisabled: boolean

}