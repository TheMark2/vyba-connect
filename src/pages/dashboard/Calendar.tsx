import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, MapPin, X, Flame, Settings, Bell, Filter, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameWeek,
  isToday,
  isSameDay as isSameDate
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type CalendarView = 'month' | 'week' | 'day';

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  startDate: Date;
  endDate: Date;
  type: 'ensayo' | 'concierto' | 'reunion' | 'otro';
}

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [view, setView] = useState<CalendarView>('month');
  const [isDragging, setIsDragging] = useState(false);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [endHour, setEndHour] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    startTime: string;
    endTime: string;
    location: string;
    type: Event['type'];
    endDate?: Date;
  }>({
    title: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'ensayo',
    endDate: undefined
  });
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Ensayo general',
      startTime: '14:00',
      endTime: '16:00',
      location: 'Sala de ensayos A',
      startDate: new Date(2024, 2, 15),
      endDate: new Date(2024, 2, 15),
      type: 'ensayo'
    },
    {
      id: '2',
      title: 'Concierto en Sala B',
      startTime: '20:00',
      endTime: '22:00',
      location: 'Sala B, Calle Principal 123',
      startDate: new Date(2024, 2, 15),
      endDate: new Date(2024, 2, 15),
      type: 'concierto'
    }
  ]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [immediateAvailability, setImmediateAvailability] = useState<string>('yes');
  const [availableDays, setAvailableDays] = useState<{
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  }>({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true
  });

  const getEventColor = (type: Event['type'], isMultiDay: boolean = false) => {
    if (isMultiDay) {
      return 'bg-primary/20 text-primary-foreground';
    }
    switch (type) {
      case 'ensayo':
        return 'bg-blue-100 text-blue-800';
      case 'concierto':
        return 'bg-purple-100 text-purple-800';
      case 'reunion':
        return 'bg-green-100 text-green-800';
      case 'otro':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const nextPeriod = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const prevPeriod = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const normalizedStart = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
      const normalizedEnd = new Date(eventEnd.getFullYear(), eventEnd.getMonth(), eventEnd.getDate());
      return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventDialog(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleAddEvent = () => {
    if (selectedDate && newEvent.title && newEvent.startTime && newEvent.endTime) {
      const event: Event = {
        id: Date.now().toString(),
        ...newEvent,
        startDate: selectedDate,
        endDate: newEvent.endDate || selectedDate
      };
      setEvents(prevEvents => [...prevEvents, event]);
      setNewEvent({
        title: '',
        startTime: '',
        endTime: '',
        location: '',
        type: 'ensayo',
        endDate: null
      });
      setShowEventDialog(false);
    }
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getEventPosition = (startTime: string, endTime: string) => {
      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = parseInt(endTime.split(':')[0]);
      const startMinute = parseInt(startTime.split(':')[1]) / 60;
      const endMinute = parseInt(endTime.split(':')[1]) / 60;
      
      return {
        top: `${(startHour + startMinute) * 60}px`,
        height: `${((endHour + endMinute) - (startHour + startMinute)) * 60}px`
      };
    };

    // Función para calcular la superposición de eventos
    const calculateEventLayers = (events: Event[]) => {
      const layers: Event[][] = [];
      const sortedEvents = [...events].sort((a, b) => {
        const aStart = new Date(`2000-01-01T${a.startTime}`);
        const bStart = new Date(`2000-01-01T${b.startTime}`);
        return aStart.getTime() - bStart.getTime();
      });

      sortedEvents.forEach(event => {
        let placed = false;
        for (let i = 0; i < layers.length; i++) {
          const layer = layers[i];
          const lastEvent = layer[layer.length - 1];
          const lastEventEnd = new Date(`2000-01-01T${lastEvent.endTime}`);
          const currentEventStart = new Date(`2000-01-01T${event.startTime}`);
          
          if (currentEventStart >= lastEventEnd) {
            layer.push(event);
            placed = true;
            break;
          }
        }
        
        if (!placed) {
          layers.push([event]);
        }
      });

      return layers;
    };

    const eventLayers = calculateEventLayers(dayEvents);

    return (
      <div className="flex flex-col">
        <div className="text-center font-medium text-vyba-tertiary py-2 border-b flex items-center justify-center gap-2">
          {format(currentDate, 'EEEE d MMMM', { locale: es })}
          {isToday(currentDate) && <div className="w-2 h-2 rounded-full bg-primary"></div>}
        </div>
        <div className="flex-1 overflow-auto relative">
          {/* Líneas de horas */}
          {hours.map((hour) => (
            <div key={hour} className="flex border-b">
              <div className="w-16 p-2 text-sm text-vyba-tertiary border-r">
                {hour.toString().padStart(2, '0')}:00
              </div>
              <div className="flex-1 p-2 min-h-[60px] relative">
                <div className="absolute left-0 right-0 top-0 h-px bg-gray-200"></div>
              </div>
            </div>
          ))}

          {/* Capas de eventos */}
          {eventLayers.map((layer, layerIndex) => (
            <div 
              key={layerIndex} 
              className="absolute left-16 right-0 top-0 bottom-0"
              style={{
                marginLeft: `${layerIndex * 8}px`,
                width: `calc(100% - ${layerIndex * 8}px)`
              }}
            >
              {layer.map(event => {
                const position = getEventPosition(event.startTime, event.endTime);
                return (
                  <div
                    key={event.id}
                    className={`absolute ${getEventColor(event.type)}
                      rounded-md px-2 py-1 text-xs font-medium
                      flex items-center justify-between
                      shadow-sm cursor-pointer
                      ${selectedEvent?.id === event.id ? 'ring-2 ring-primary' : ''}
                    `}
                    style={{
                      top: position.top,
                      height: position.height,
                      width: `calc(100% - ${layerIndex * 8}px)`
                    }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{event.title}</span>
                      <span className="text-[10px] bg-white/20 px-1 rounded">
                        {event.startTime} - {event.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px]">{event.location}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Agrupar eventos por ID para mantener la misma altura
    const multiDayEvents = events.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return !isSameDay(start, end);
    });
    const singleDayEvents = events.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return isSameDay(start, end);
    });

    const getDayIntensity = (date: Date) => {
      const dayOfMonth = date.getDate();
      const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      
      // Si es el último jueves del mes
      if (dayOfMonth > lastDayOfMonth - 7 && date.getDay() === 4) return 'medium';
      // Si es el último viernes del mes
      if (dayOfMonth > lastDayOfMonth - 7 && date.getDay() === 5) return 'high';
      // Si es el último sábado del mes
      if (dayOfMonth > lastDayOfMonth - 7 && date.getDay() === 6) return 'high';
      // Si es el último domingo del mes
      if (dayOfMonth > lastDayOfMonth - 7 && date.getDay() === 0) return 'low';
      
      return null;
    };

    return (
      <div className="grid grid-cols-7">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div key={day} className="text-center font-medium text-vyba-tertiary py-2 border-b">
            {day}
          </div>
        ))}
        {daysInMonth.map((date) => {
          const intensity = getDayIntensity(date);
          const dayMultiDayEvents = multiDayEvents.filter(event => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            return date >= eventStart && date <= eventEnd;
          });
          const daySingleDayEvents = singleDayEvents.filter(event => isSameDay(date, new Date(event.startDate)));

          return (
            <div
              key={date.toString()}
              className={`min-h-[120px] p-2 border-b border-r cursor-pointer transition-colors
                ${isSameMonth(date, currentDate) ? 'hover:bg-vyba-gray' : 'bg-gray-50 text-gray-400'}
                ${selectedDate && isSameDay(date, selectedDate) ? 'bg-vyba-gray' : ''}
              `}
              onClick={() => handleDateClick(date)}
            >
              <div className="text-sm font-medium mb-1 flex items-center gap-1">
                {format(date, 'd')}
                {isToday(date) && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                {intensity && (
                  <Flame 
                    className={`h-3 w-3 ${
                      intensity === 'high' ? 'text-red-500' : 
                      intensity === 'medium' ? 'text-orange-500' : 
                      'text-yellow-500'
                    }`}
                  />
                )}
              </div>
              <div className="space-y-1">
                {/* Eventos de varios días */}
                {dayMultiDayEvents.map(event => {
                  const isFirstDay = isSameDay(date, new Date(event.startDate));
                  const isLastDay = isSameDay(date, new Date(event.endDate));
                  
                  return (
                    <div
                      key={event.id}
                      className={`text-xs px-2 py-1 truncate ${getEventColor(event.type, true)}
                        ${isFirstDay ? 'rounded-l-md' : ''}
                        ${isLastDay ? 'rounded-r-md' : ''}
                        ${!isFirstDay && !isLastDay ? 'rounded-none' : ''}
                        border-l-2 border-l-white/50
                        ${isFirstDay ? 'pl-3' : ''}
                        ${isLastDay ? 'pr-3' : ''}
                      `}
                    >
                      <div className="flex items-center gap-1">
                        {isFirstDay && (
                          <>
                            <span className="font-medium">{event.title}</span>
                            <span className="text-[10px] bg-white/20 px-1 rounded">
                              {format(new Date(event.startDate), 'd')}
                            </span>
                          </>
                        )}
                        {isFirstDay && <span className="text-[10px]">{event.startTime}</span>}
                        {isLastDay && !isFirstDay && (
                          <span className="text-[10px] bg-white/20 px-1 rounded">
                            {format(new Date(event.endDate), 'd')}
                          </span>
                        )}
                        {isLastDay && !isFirstDay && <span className="text-[10px]">{event.endTime}</span>}
                      </div>
                    </div>
                  );
                })}
                
                {/* Eventos de un solo día */}
                {daySingleDayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`text-xs px-2 py-1 rounded-md truncate ${getEventColor(event.type)}`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{event.title}</span>
                      <span className="text-[10px]">{event.startTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

    // Agrupar eventos por ID para mantener la misma altura
    const multiDayEvents = events.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return !isSameDay(start, end);
    });
    const singleDayEvents = events.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return isSameDay(start, end);
    });

    return (
      <div className="grid grid-cols-7">
        {daysInWeek.map((date) => {
          const dayEvents = getEventsForDate(date);
          return (
            <div
              key={date.toString()}
              className={`min-h-[120px] p-2 border-b border-r cursor-pointer transition-colors
                ${isSameWeek(date, currentDate) ? 'hover:bg-vyba-gray' : 'bg-gray-50 text-gray-400'}
                ${selectedDate && isSameDay(date, selectedDate) ? 'bg-vyba-gray' : ''}
              `}
              onClick={() => handleDateClick(date)}
            >
              <div className="text-sm font-medium mb-1 flex items-center gap-1">
                {format(date, 'EEE d', { locale: es })}
                {isToday(date) && <div className="w-2 h-2 rounded-full bg-primary"></div>}
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`text-xs px-2 py-1 rounded-md truncate ${getEventColor(event.type)}`}
                  >
                    {event.title} {event.startTime}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-[calc(100vh-12rem)]">
        <div className="lg:col-span-3 bg-white overflow-auto">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={prevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-medium">
              {view === 'month' && format(currentDate, 'MMMM yyyy', { locale: es })}
              {view === 'week' && `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM', { locale: es })} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: es })}`}
              {view === 'day' && format(currentDate, 'EEEE d MMMM yyyy', { locale: es })}
            </h2>
            <Button variant="ghost" size="icon" onClick={nextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>

        <div className="lg:col-span-1 bg-white border-l border-vyba-tertiary overflow-auto">
          {selectedEvent ? (
            <div>
              <div className="p-6 border-b border-vyba-tertiary">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-medium">Detalles del evento</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedEvent(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-vyba-tertiary mb-1">Título</h3>
                    <p className="text-lg font-medium">{selectedEvent.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-vyba-tertiary mb-1">Fecha</h3>
                    <p className="text-lg">
                      {format(new Date(selectedEvent.startDate), 'EEEE d MMMM yyyy', { locale: es })}
                      {!isSameDay(new Date(selectedEvent.startDate), new Date(selectedEvent.endDate)) && 
                        ` - ${format(new Date(selectedEvent.endDate), 'EEEE d MMMM yyyy', { locale: es })}`}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-vyba-tertiary mb-1">Horario</h3>
                    <p className="text-lg">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-vyba-tertiary mb-1">Ubicación</h3>
                    <p className="text-lg">{selectedEvent.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-vyba-tertiary mb-1">Tipo</h3>
                    <p className="text-lg capitalize">{selectedEvent.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      className="flex-1"
                      onClick={() => {
                        setNewEvent({
                          title: selectedEvent.title,
                          startTime: selectedEvent.startTime,
                          endTime: selectedEvent.endTime,
                          location: selectedEvent.location,
                          type: selectedEvent.type,
                          endDate: selectedEvent.endDate
                        });
                        setSelectedDate(new Date(selectedEvent.startDate));
                        setShowEventDialog(true);
                      }}
                    >
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-6">
                <h2 className="text-3xl font-medium">Configuración</h2>
                <Tabs defaultValue="general" className="mt-6" onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
                    <TabsTrigger value="availability" className="flex-1">Disponibilidad</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="p-6 space-y-6">
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-vyba-tertiary mb-3">Vista del calendario</h3>
                      <Select value={view} onValueChange={(value) => setView(value as CalendarView)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una vista" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Vista mensual</SelectItem>
                          <SelectItem value="week">Vista semanal</SelectItem>
                          <SelectItem value="day">Vista diaria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Button 
                        variant="secondary" 
                        className="w-full"
                        onClick={() => setShowEventDialog(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Añadir evento
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-vyba-tertiary mb-3">Eventos del día</h3>
                      {selectedDate ? (
                        <div className="space-y-4">
                          {getEventsForDate(selectedDate).length > 0 ? (
                            getEventsForDate(selectedDate).map(event => (
                              <div key={event.id} className="p-4 bg-vyba-gray rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{event.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-vyba-tertiary mt-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{event.startTime} - {event.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-vyba-tertiary mt-1">
                                      <MapPin className="h-4 w-4" />
                                      <span>{event.location}</span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 bg-vyba-gray rounded-lg w-max">
                              <p className="text-sm text-vyba-tertiary">De momento no hay eventos disponibles</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-4 bg-vyba-gray rounded-lg w-max">
                          <p className="text-sm text-vyba-tertiary">Selecciona un día para ver sus eventos</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-vyba-tertiary mb-3">Disponibilidad inmediata</h3>
                      <RadioGroup 
                        value={immediateAvailability} 
                        onValueChange={setImmediateAvailability}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="yes" />
                          <Label htmlFor="yes" className="text-sm">Sí, estoy disponible</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="no" />
                          <Label htmlFor="no" className="text-sm">No, no estoy disponible</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="depends" id="depends" />
                          <Label htmlFor="depends" className="text-sm">Depende de la fecha</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-vyba-tertiary mb-3">Días disponibles</h3>
                      <Carousel className="w-full">
                        <CarouselContent>
                          {[
                            { id: 'monday', label: 'Lunes', value: availableDays.monday },
                            { id: 'tuesday', label: 'Martes', value: availableDays.tuesday },
                            { id: 'wednesday', label: 'Miércoles', value: availableDays.wednesday },
                            { id: 'thursday', label: 'Jueves', value: availableDays.thursday },
                            { id: 'friday', label: 'Viernes', value: availableDays.friday },
                            { id: 'saturday', label: 'Sábado', value: availableDays.saturday },
                            { id: 'sunday', label: 'Domingo', value: availableDays.sunday }
                          ].map((day) => (
                            <CarouselItem key={day.id} className="md:basis-1/2 lg:basis-1/3">
                              <div 
                                className={`p-4 rounded-lg cursor-pointer transition-colors
                                  ${day.value ? 'bg-primary/10' : 'bg-vyba-gray'}
                                  hover:bg-primary/20
                                `}
                                onClick={() => setAvailableDays({...availableDays, [day.id]: !day.value})}
                              >
                                <div className="flex flex-col items-center gap-2">
                                  <CalendarIcon className="h-5 w-5 text-vyba-tertiary" />
                                  <span className="text-sm font-medium">{day.label}</span>
                                  <Checkbox 
                                    id={day.id}
                                    checked={day.value}
                                    onCheckedChange={(checked) => setAvailableDays({...availableDays, [day.id]: checked as boolean})}
                                    className="border-primary"
                                  />
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="flex justify-center gap-2 mt-4">
                          <CarouselPrevious className="static translate-y-0" />
                          <CarouselNext className="static translate-y-0" />
                        </div>
                      </Carousel>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newEvent.endDate ? format(newEvent.endDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: new Date(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Hora inicio</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endTime">Hora fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo de evento</Label>
              <Select
                value={newEvent.type}
                onValueChange={(value) => setNewEvent({ ...newEvent, type: value as Event['type'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ensayo">Ensayo</SelectItem>
                  <SelectItem value="concierto">Concierto</SelectItem>
                  <SelectItem value="reunion">Reunión</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowEventDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddEvent}>
              Añadir evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage; 