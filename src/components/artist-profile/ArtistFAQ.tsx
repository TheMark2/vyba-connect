
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ArtistFAQProps {
  artistName: string;
}

const ArtistFAQ = ({ artistName }: ArtistFAQProps) => {
  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-6">FAQ</h2>
      <Accordion type="single" collapsible className="bg-secondary dark:bg-vyba-dark-secondary/70 rounded-3xl overflow-hidden">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="px-8 py-6 text-sm font-bold">
            ¿Cómo puedo reservar una fecha?
          </AccordionTrigger>
          <AccordionContent className="px-8 text-base">
            Para reservar una fecha con {artistName}, simplemente haz clic en el botón "Contactar" y nuestro equipo te ayudará a coordinar los detalles de tu evento. Asegúrate de proporcionar toda la información relevante como fecha, ubicación y tipo de evento.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2" className="border-b-0">
          <AccordionTrigger className="px-8 py-6 text-sm font-bold">
            ¿Qué incluye el precio?
          </AccordionTrigger>
          <AccordionContent className="px-8 text-base">
            El precio incluye la actuación completa de {artistName}, equipo de sonido básico para espacios pequeños y una consulta previa al evento para discutir tus preferencias musicales. Cualquier requisito adicional se cotizará por separado.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3" className="border-b-0">
          <AccordionTrigger className="px-8 py-6 text-sm font-bold">
            ¿Cuánto tiempo dura una actuación?
          </AccordionTrigger>
          <AccordionContent className="px-8 text-base">
            Las actuaciones estándar suelen durar entre 2 y 3 horas, con descansos breves. Sin embargo, podemos adaptar la duración según las necesidades específicas de tu evento.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4" className="border-b-0">
          <AccordionTrigger className="px-8 py-6 text-sm font-bold">
            ¿Puedo solicitar canciones específicas?
          </AccordionTrigger>
          <AccordionContent className="px-8 text-base">
            ¡Por supuesto! Puedes proporcionar una lista de canciones que te gustaría escuchar y haremos todo lo posible para incluirlas en el repertorio. Recomendamos compartir estas solicitudes con al menos dos semanas de anticipación.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5" className="border-b-0">
          <AccordionTrigger className="px-8 py-6 text-sm font-bold">
            ¿Qué pasa si necesito cancelar?
          </AccordionTrigger>
          <AccordionContent className="px-8 text-base">
            Nuestra política de cancelación requiere un aviso con 30 días de anticipación para un reembolso completo. Las cancelaciones con menos tiempo pueden estar sujetas a cargos parciales. Cada caso se evalúa individualmente.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6" className="border-b-0">
          <AccordionTrigger className="px-8 py-6 text-sm font-bold">
            ¿Cómo funciona el pago?
          </AccordionTrigger>
          <AccordionContent className="px-8 text-base">
            Requerimos un depósito del 50% para confirmar la reserva, y el saldo restante debe pagarse una semana antes del evento. Aceptamos transferencias bancarias y otros métodos de pago que se acordarán al momento de la reserva.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ArtistFAQ;
