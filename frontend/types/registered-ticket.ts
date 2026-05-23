export const PAYMENT_OPTIONS = ["Efectivo", "Transferencia", "Ninguno"] as const;
export const YES_NO_UNKNOWN_OPTIONS = ["SI", "NO", "DESCONOCIDO"] as const;
export const PHYSICAL_DELIVERY_OPTIONS = ["SI", "NO", "NO APLICA", "DESCONOCIDO"] as const;

export type PaymentOption = (typeof PAYMENT_OPTIONS)[number];
export type YesNoUnknownOption = (typeof YES_NO_UNKNOWN_OPTIONS)[number];
export type PhysicalDeliveryOption = (typeof PHYSICAL_DELIVERY_OPTIONS)[number];

export type EditableTicketField = "TipoPago" | "Pagado" | "DeseaFisico" | "BoletoFisicoEntregado";
export type EditableTicketValue = PaymentOption | YesNoUnknownOption | PhysicalDeliveryOption;

export type RegisteredTicket = {
    name: string;
    email: string;
    phone: string;
    TipoPago?: unknown;
    Pagado?: unknown;
    DeseaFisico?: unknown;
    BoletoFisicoEntregado?: unknown;
};

export type RegisteredTickets = Record<string, RegisteredTicket>;