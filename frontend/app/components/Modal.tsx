"use client";

import RegistryForm from "./RegistryForm";

interface RegistryModalProps {
  ticketNumber: number;
  onClose: (registeredTicket : boolean) => void;
}

export default function RegistryModal({ ticketNumber, onClose }: RegistryModalProps) {
  return (
    <div className="overlayStyles" onClick={() => onClose(false)}>
      <div className="modalStyles" onClick={(e) => e.stopPropagation()}>
        <h2 className="titleModal">{`Vamos a registrar el Boleto: ${ticketNumber}`}</h2>
        <button onClick={() => onClose(false)} className="closeButtonModal">&times;</button>
        <div className="bodyModalStyles">
          <RegistryForm ticketNumber={ticketNumber} closeModal={onClose}/>
        </div>
      </div>
    </div>
  )
}