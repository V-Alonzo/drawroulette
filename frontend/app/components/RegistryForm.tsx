"use client"

import { useState } from "react";
import { Input } from "./InputFields/base/input/input";

import { Mail01, Phone01, User01 } from "@untitledui/icons";


export default function RegistryForm({ ticketNumber, closeModal } : { ticketNumber : number, closeModal: (registeredTicket: boolean) => void }) {

    const[formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        ticketNumber: String(ticketNumber),
    });

    type FormField = keyof typeof formData;

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const [fieldsWithErrors, setFieldsWithErrors] = useState<string[]>([]);

    const validationFunctions : Record<FormField, (value : string) => boolean> = {
        "name" : (value : string) => value.trim() !== "",
        "email" : (value : string) => /^\S+@\S+\.\S+$/.test(value),
        "phone" : (value : string) => /^\d{10}$/.test(value),
        "ticketNumber" : () => true
    }

    const registerTicket = async (data : typeof formData) => {
        try {
            const response = await fetch(`${API_URL}/registerTicket`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const res = await response.json();

            if(Object.keys(res).includes("error")){
                alert(res.error);
                return;
            }
            
            alert("¡Registro exitoso!");

            closeModal(true);

        } 
        catch (error) {
            console.error("Error registering ticket:", error);
            alert("Error al enviar el formulario. Por favor, inténtalo de nuevo.");
        }
    }
    

    const submitForm = () => {
        const formFields = Object.keys(formData) as FormField[];
        const newFieldsWithErrors = formFields.filter((field) => !validationFunctions[field](formData[field]));
        console.log("Campos con errores:", newFieldsWithErrors);
        setFieldsWithErrors(newFieldsWithErrors);

        if(newFieldsWithErrors.length === 0) {
            console.log("Formulario enviado con éxito:", formData);
            registerTicket(formData);
        }
    }


    return(
        <div className="space-y-4">
            <Input hint = {fieldsWithErrors.includes("name") ? "El nombre es inválido" : ""} isInvalid={fieldsWithErrors.includes("name")} icon={User01} isRequired label="Nombre" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e }))}/>
            <Input hint = {fieldsWithErrors.includes("email") ? "El email es inválido" : ""} isInvalid={fieldsWithErrors.includes("email")} icon={Mail01} isRequired label="Email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e }))}/>
            <Input hint = {fieldsWithErrors.includes("phone") ? "El teléfono es inválido" : ""} isInvalid={fieldsWithErrors.includes("phone")} icon={Phone01} isRequired label="Teléfono" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e }))}/>

            <button className="buttonModal" onClick={submitForm}>Registrar</button>
        </div>
    )

    

}