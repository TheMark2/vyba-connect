
import React from "react";
import { Button } from "@/components/ui/button";

interface EventTypesProps {
  eventTypes: string[];
  onEventTypeClick: (eventType: string) => void;
}

const EventTypes = ({ eventTypes, onEventTypeClick }: EventTypesProps) => {
  return (
    <div className="mt-8 mb-16">
      <h2 className="text-3xl font-black mb-6">Tipos de Eventos</h2>
      <div className="flex flex-wrap gap-3">
        {eventTypes?.map((eventType, index) => (
          <Button 
            key={index} 
            variant="secondary" 
            className="rounded-full text-sm font-medium" 
            onClick={() => onEventTypeClick(eventType)}
          >
            {eventType}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default EventTypes;
