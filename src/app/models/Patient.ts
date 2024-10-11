export interface IPatient {
    id: string
    name: string
    surname: string
    gender: string
    fiscal_code: string
    birth_time: string
    birth_place: string
    residence_address: string
    residence_postcode: string
    residence_municipality: string
    residence_district: string
    home_address: string
    home_postcode: string
    home_municipality: string
    home_district: string
    home_phone: string
    personal_phone: string
    mail_address : string

    //serve per il tracciamento dell'operazione
    username : string
}