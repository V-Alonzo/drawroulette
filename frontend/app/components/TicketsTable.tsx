"use client";

import { useMemo, useState } from "react";
import {
    PAYMENT_OPTIONS,
    PHYSICAL_DELIVERY_OPTIONS,
    YES_NO_UNKNOWN_OPTIONS,
} from "../../types/registered-ticket";
import type {
    EditableTicketField,
    EditableTicketValue,
    PaymentOption,
    PhysicalDeliveryOption,
    RegisteredTickets,
    YesNoUnknownOption,
} from "../../types/registered-ticket";

type TicketsTableProps = {
    registeredTickets: RegisteredTickets;
    onTicketFieldChange: (ticketNumber: string, field: EditableTicketField, value: EditableTicketValue) => Promise<void>;
};

const normalizeYesNoUnknownValue = (value: unknown): YesNoUnknownOption => {
    if (typeof value === "boolean") {
        return value ? "SI" : "NO";
    }

    if (typeof value !== "string") {
        return "DESCONOCIDO";
    }

    const normalizedValue = value.trim().toLowerCase();

    if (["si", "sí", "true", "yes"].includes(normalizedValue)) {
        return "SI";
    }

    if (["no", "false"].includes(normalizedValue)) {
        return "NO";
    }

    return "DESCONOCIDO";
};

const normalizePaymentValue = (value: unknown): PaymentOption => {
    if (typeof value !== "string") {
        return "Ninguno";
    }

    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === "efectivo") {
        return "Efectivo";
    }

    if (normalizedValue === "transferencia") {
        return "Transferencia";
    }

    return "Ninguno";
};

const normalizePhysicalDeliveryValue = (value: unknown): PhysicalDeliveryOption => {
    if (typeof value === "boolean") {
        return value ? "SI" : "NO";
    }

    if (typeof value !== "string") {
        return "DESCONOCIDO";
    }

    const normalizedValue = value.trim().toLowerCase();

    if (["si", "sí", "true", "yes"].includes(normalizedValue)) {
        return "SI";
    }

    if (["no", "false"].includes(normalizedValue)) {
        return "NO";
    }

    if (["no aplica", "no_aplica", "n/a", "na"].includes(normalizedValue)) {
        return "NO APLICA";
    }

    return "DESCONOCIDO";
};

const getFieldValue = (field: EditableTicketField, value: unknown) => {
    if (field === "TipoPago") {
        return normalizePaymentValue(value);
    }

    if (field === "BoletoFisicoEntregado") {
        return normalizePhysicalDeliveryValue(value);
    }

    return normalizeYesNoUnknownValue(value);
};

export default function TicketsTable({ registeredTickets, onTicketFieldChange }: TicketsTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [ticketNumberSearch, setTicketNumberSearch] = useState("");
    const [savingFields, setSavingFields] = useState<Record<string, boolean>>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFieldChange = async (ticketNumber: string, field: EditableTicketField, value: EditableTicketValue) => {
        const savingKey = `${ticketNumber}:${field}`;

        setErrorMessage(null);
        setSavingFields((previousSavingFields) => ({
            ...previousSavingFields,
            [savingKey]: true,
        }));

        try {
            await onTicketFieldChange(ticketNumber, field, value);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "No se pudo actualizar el boleto.");
        } finally {
            setSavingFields((previousSavingFields) => {
                const nextSavingFields = { ...previousSavingFields };
                delete nextSavingFields[savingKey];
                return nextSavingFields;
            });
        }
    };

    const filteredTickets = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const normalizedTicketNumberSearch = ticketNumberSearch.trim().toLowerCase();

        return Object.entries(registeredTickets).filter(([ticketNumber, info]) => {
            const matchesTicketNumber = !normalizedTicketNumberSearch || ticketNumber.toLowerCase().includes(normalizedTicketNumberSearch);

            if (!normalizedSearch) {
                return matchesTicketNumber;
            }

            const generalColumns = [info.name, info.email, info.phone];
            const matchesGeneralSearch = generalColumns.some((value) =>  
                {
                    if(typeof value !== "string") return false;
                    return value.toLowerCase().includes(normalizedSearch);
                }
            );

            return matchesTicketNumber && matchesGeneralSearch;
        });
    }, [registeredTickets, searchTerm, ticketNumberSearch]);

    const filteredRevenue = filteredTickets.reduce((acc, [ticketNumber]) => acc + Number.parseInt(ticketNumber, 10), 0);

    return (
        <div className="w-full max-w-full self-stretch p-6">
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                    type="text"
                    value={ticketNumberSearch}
                    onChange={(event) => setTicketNumberSearch(event.target.value)}
                    placeholder="Filtrar por número de boleto"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar por nombre, email o teléfono"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
            </div>

            <div className="overflow-x-auto">
                <p className="mb-4 font-bold">Ganancia: ${filteredRevenue}</p>

                {errorMessage && (
                    <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
                )}
                
                <table className="min-w-max text-left border-collapse border border-gray-300 mx-auto">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Número de Boleto</th>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Nombre</th>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Email</th>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Teléfono</th>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Tipo de Pago</th>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Pagado</th>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Desea Boleto Físico</th>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Boleto Físico Entregado</th>
                        </tr>
                    </thead>
                    <tbody>

                        {filteredTickets.length === 0 && (
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 text-center text-gray-500" colSpan={8}>
                                    No se encontraron coincidencias.
                                </td>
                            </tr>
                        )}

                        {filteredTickets.map(([ticketNumber, info]) => (
                            <tr key={ticketNumber}>
                                <td className="border border-gray-300 px-4 py-2 max-w-[300px] whitespace-normal break-words">{ticketNumber}</td>
                                <td className="border border-gray-300 px-4 py-2 max-w-[300px] whitespace-normal break-words">{info.name}</td>
                                <td className="border border-gray-300 px-4 py-2 max-w-[300px] whitespace-normal break-words">{info.email}</td>
                                <td className="border border-gray-300 px-4 py-2 max-w-[300px] whitespace-normal break-words">{info.phone}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <select
                                        value={getFieldValue("TipoPago", info.TipoPago)}
                                        onChange={(event) => void handleFieldChange(ticketNumber, "TipoPago", event.target.value as PaymentOption)}
                                        disabled={Boolean(savingFields[`${ticketNumber}:TipoPago`])}
                                        className="w-full min-w-[150px] rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                                    >
                                        {PAYMENT_OPTIONS.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <select
                                        value={getFieldValue("Pagado", info.Pagado)}
                                        onChange={(event) => void handleFieldChange(ticketNumber, "Pagado", event.target.value as YesNoUnknownOption)}
                                        disabled={Boolean(savingFields[`${ticketNumber}:Pagado`])}
                                        className="w-full min-w-[150px] rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                                    >
                                        {YES_NO_UNKNOWN_OPTIONS.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <select
                                        value={getFieldValue("DeseaFisico", info.DeseaFisico)}
                                        onChange={(event) => void handleFieldChange(ticketNumber, "DeseaFisico", event.target.value as YesNoUnknownOption)}
                                        disabled={Boolean(savingFields[`${ticketNumber}:DeseaFisico`])}
                                        className="w-full min-w-[170px] rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                                    >
                                        {YES_NO_UNKNOWN_OPTIONS.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <select
                                        value={getFieldValue("BoletoFisicoEntregado", info.BoletoFisicoEntregado)}
                                        onChange={(event) => void handleFieldChange(ticketNumber, "BoletoFisicoEntregado", event.target.value as PhysicalDeliveryOption)}
                                        disabled={Boolean(savingFields[`${ticketNumber}:BoletoFisicoEntregado`])}
                                        className="w-full min-w-[190px] rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 disabled:bg-gray-100"
                                    >
                                        {PHYSICAL_DELIVERY_OPTIONS.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}