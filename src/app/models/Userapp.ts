export interface IUserapp {
    id: string
    username: string
    password: string
    name: string
    surname: string
    fiscalCode: string
    birthDate: string
    birthPlace: string
    address: string
    postcode: string
    municipality: string
    district: string
    personalPhone: string
    homePhone: string
    mailAddress : string

    // Dati inerenti la risorsa
    checkResource: boolean
    alias : string
    // l'icon viene settata di default dal servizio rest
}