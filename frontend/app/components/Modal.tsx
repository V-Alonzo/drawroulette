"use client";

import RegistryForm from "./RegistryForm";

interface RegistryModalProps {
  ticketNumber: number;
  onClose: (registeredTicket : boolean) => void;
  children : React.ReactNode;
}

export default function RegistryModal({ ticketNumber, onClose, children }: RegistryModalProps) {
  return (
    <div className="overlayStyles" onClick={() => onClose(false)}>
      <div className="flex flex-col modalStyles" onClick={(e) => e.stopPropagation()}>
        <h2 className="titleModal">{`Registro de Boleto: ${ticketNumber}`}</h2>
        <button onClick={() => onClose(false)} className="closeButtonModal">Cancelar Registro</button>
        <div className="bodyModalStyles">
          {children}
        </div>
      </div>
    </div>
  )
}