"use client";

import { useMemo, useState } from "react";

export default function TicketsTable({ registeredTickets }: { registeredTickets: Record<number, { name: string; email: string; phone: string }> }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [ticketNumberSearch, setTicketNumberSearch] = useState("");

    const filteredTickets = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        const normalizedTicketNumberSearch = ticketNumberSearch.trim().toLowerCase();

        return Object.entries(registeredTickets).filter(([ticketNumber, info]) => {
            const matchesTicketNumber = !normalizedTicketNumberSearch || ticketNumber.toLowerCase().includes(normalizedTicketNumberSearch);

            if (!normalizedSearch) {
                return matchesTicketNumber;
            }

            const generalColumns = [info.name, info.email, info.phone];
            const matchesGeneralSearch = generalColumns.some((value) => value.toLowerCase().includes(normalizedSearch));

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
                
                <table className="min-w-max text-left border-collapse border border-gray-300 mx-auto">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Número de Boleto</th>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Nombre</th>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Email</th>
                            <th className="border border-gray-300 px-4 py-2 whitespace-nowrap">Teléfono</th>
                        </tr>
                    </thead>
                    <tbody>

                        {filteredTickets.length === 0 && (
                            <tr>
                                <td className="border border-gray-300 px-4 py-2 text-center text-gray-500" colSpan={4}>
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );
}