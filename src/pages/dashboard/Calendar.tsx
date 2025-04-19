import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, MapPin, X, Flame, Settings, Bell, Filter, Download, CalendarClock } from "lucide-react";
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
import { cn } from "@/lib/utils";

type CalendarView = 'month' | 'week' | 'day';

interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  startDate: Date;
  endDate: Date;
  type: 'ensayo' | 'bolo' | 'reunion' | 'otro';
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
      title: 'Bolo en Sala B',
      startTime: '20:00',
      endTime: '22:00',
      location: 'Sala B, Calle Principal 123',
      startDate: new Date(2024, 2, 15),
      endDate: new Date(2024, 2, 15),
      type: 'bolo'
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
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [multiDayEvents, setMultiDayEvents] = useState<Event[]>([]);
  const [singleDayEvents, setSingleDayEvents] = useState<Event[]>([]);

  const getEventColor = (type: Event['type'], isMultiDay: boolean = false) => {
    if (isMultiDay) {
      return 'bg-primary/20 text-primary-foreground';
    }
    switch (type) {
      case 'ensayo':
        return 'bg-blue-100 text-blue-800';
      case 'bolo':
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

  const handleEventTypeClick = (type: string) => {
    setSelectedEventType(type === 'all' ? null : type);
    setActiveTab('events');
  };

  const filteredEvents = selectedEventType 
    ? events.filter(event => event.type === selectedEventType)
    : events;

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

  useEffect(() => {
    // Separar eventos en multi-día y de un solo día
    const multiDay = events.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return !isSameDay(start, end);
    });
    const singleDay = events.filter(event => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return isSameDay(start, end);
    });
    
    setMultiDayEvents(multiDay);
    setSingleDayEvents(singleDay);
  }, [events]);

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
              className={`aspect-square p-1 flex flex-col border border-vyba-gray
                ${isSameMonth(date, currentDate) ? 'bg-white' : 'bg-vyba-gray/50'}
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
              <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)]">
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
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-7 border border-vyba-gray">
          {days.map((day) => {
            const dayEvents = getEventsForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "border-r border-vyba-gray last:border-r-0",
                  isToday && "bg-vyba-gray"
                )}
              >
                <div className="p-2 border-b border-vyba-gray">
                  <div className="text-xs font-medium text-vyba-tertiary">
                    {format(day, 'EEE', { locale: es })}
                  </div>
                  <div className="text-sm font-medium">
                    {format(day, 'd')}
                  </div>
                </div>
                <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
                  {dayEvents.map((event) => {
                    const startTime = new Date(event.startDate);
                    const endTime = new Date(event.endDate);
                    const isMultiDay = !isSameDay(startTime, endTime);
                    
                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "p-1 text-[8px] truncate",
                          getEventColor(event.type, isMultiDay)
                        )}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-vyba-tertiary truncate">
                          {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAllMonths = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(currentDate.getFullYear(), i, 1);
      return monthDate;
    });

    return (
      <div className="space-y-8">
        {months.map((monthDate) => (
          <div key={monthDate.toString()} className="space-y-4">
            <h3 className="text-xl font-medium text-center">
              {format(monthDate, 'MMMM yyyy', { locale: es })}
            </h3>
            {renderMonthViewForDate(monthDate)}
          </div>
        ))}
      </div>
    );
  };

  const renderMonthViewForDate = (date: Date) => {
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(date),
      end: endOfMonth(date)
    });

    const firstDayOfMonth = startOfMonth(date);
    const lastDayOfMonth = endOfMonth(date);
    const startPadding = Array(firstDayOfMonth.getDay()).fill(null);
    const endPadding = Array(6 - lastDayOfMonth.getDay()).fill(null);

    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-7 border-t border-vyba-gray">
          {/* Días de la semana - Solo visible en desktop */}
          <div className="hidden lg:flex col-span-7">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="flex-1 text-center text-xs font-medium text-vyba-tertiary py-1 border-b border-vyba-gray">
                {day}
              </div>
            ))}
          </div>
          {startPadding.map((_, index) => (
            <div key={`start-${index}`} className="aspect-square lg:border-b lg:border-r border-vyba-gray" />
          ))}
          {daysInMonth.map((dayDate, index) => {
            const isCurrentMonth = isSameMonth(dayDate, date);
            const isToday = isSameDay(dayDate, currentDate);
            const dayEvents = getEventsForDate(dayDate);
            const dayMultiDayEvents = dayEvents.filter(event => {
              const start = new Date(event.startDate);
              const end = new Date(event.endDate);
              return isSameDay(start, end);
            });
            const daySingleDayEvents = dayEvents.filter(event => !isSameDay(new Date(event.startDate), new Date(event.endDate)));

            return (
              <div
                key={dayDate.toISOString()}
                className={cn(
                  "aspect-square p-1 flex flex-col",
                  "border-b border-r border-vyba-gray",
                  index === 0 && "border-l",
                  isCurrentMonth ? "bg-white" : "bg-vyba-gray/50",
                  isToday && "bg-vyba-primary/20"
                )}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1 flex items-center justify-center">
                    <span className={cn(
                      "text-xs font-medium lg:text-xs lg:font-medium",
                      getDayIntensity(dayDate) === 'high' && "text-red-500",
                      getDayIntensity(dayDate) === 'medium' && "text-orange-500",
                      getDayIntensity(dayDate) === 'low' && "text-green-500"
                    )}>
                      {dayDate.getDate()}
                    </span>
                  </div>
                  {(dayMultiDayEvents.length > 0 || daySingleDayEvents.length > 0) && (
                    <div className="flex items-center justify-center gap-1">
                      {dayMultiDayEvents.length > 0 && (
                        <div className="flex gap-1">
                          {dayMultiDayEvents.map(event => (
                            <div
                              key={event.id}
                              className={cn(
                                "w-2 h-2 rounded-full lg:w-1.5 lg:h-1.5",
                                getEventColor(event.type, true)
                              )}
                            />
                          ))}
                        </div>
                      )}
                      {daySingleDayEvents.length > 0 && (
                        <div className="bg-vyba-navy/10 rounded-full px-2 py-0.5">
                          <span className="text-xs font-medium text-vyba-navy lg:text-[10px]">
                            {daySingleDayEvents.length}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {endPadding.map((_, index) => (
            <div key={`end-${index}`} className="aspect-square lg:border-b lg:border-r border-vyba-gray" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
        <div className="lg:col-span-3 bg-white overflow-auto">
          {/* Contenedor sticky para el botón de configuración en móvil */}
          <div className="sticky top-0 z-10 bg-white border-b border-vyba-gray lg:hidden">
            <div className="flex items-center justify-between p-4">
              <span className="text-sm font-medium text-vyba-navy">Usuario</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsConfigOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center justify-between px-6 pb-2">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                <div key={day} className="text-xs font-medium text-vyba-tertiary">
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Swipable Configuration Panel */}
          <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden z-50
            ${isConfigOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-medium">Configuración</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsConfigOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto">
                <Tabs defaultValue="general" className="mt-6" onValueChange={setActiveTab}>
                  <TabsList className="w-full shadow-none">
                    <TabsTrigger value="general" className="flex-1 shadow-none">General</TabsTrigger>
                    <TabsTrigger value="availability" className="flex-1 shadow-none">Disponibilidad</TabsTrigger>
                    <TabsTrigger value="events" className="flex-1 shadow-none">Eventos</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="mt-6 space-y-6 px-4">
                  {activeTab === 'general' && (
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-medium">
                          Configuración general
                        </h3>
                        <p className="text-sm text-vyba-tertiary font-light">Personaliza tu calendario según tus necesidades y preferencias</p>
                      </div>
                      <div>
                        <div className="flex gap-2">
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
                          <Button 
                            variant="secondary" 
                            className="w-full"
                            onClick={() => setShowEventDialog(true)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Añadir evento
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'availability' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-medium">
                          ¿Tienes disponibilidad para la semana del {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMMM', { locale: es })}?
                        </h3>
                        <p className="text-sm text-vyba-tertiary font-light">Selecciona una opción para indicar tu disponibilidad, mediante la disponibilidad, puedes atraer a clientes de última hora</p>
                      </div>
                      <div>
                        <div className="flex flex-col gap-2">
                          {[
                            { value: 'yes', label: 'Sí, estoy disponible' },
                            { value: 'no', label: 'No, no estoy disponible' },
                            { value: 'depends', label: 'Depende de la fecha' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setImmediateAvailability(option.value)}
                              className={`w-full py-4 px-4 rounded-md transition-all duration-300 ease-in-out
                                ${immediateAvailability === option.value 
                                  ? 'bg-vyba-beige text-black font-medium text-sm' 
                                  : 'bg-vyba-gray text-vyba-tertiary text-sm'}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        {immediateAvailability === 'yes' && (
                          <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                            <div className="relative">
                              <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <p className="text-base text-vyba-navy font-medium text-center mb-0">
                                Marcando en el compás
                              </p>
                              <p className="text-sm text-vyba-tertiary font-light text-center">
                                Los clientes podrán ver tu disponibilidad en tu perfil
                              </p>
                            </div>
                          </div>
                        )}
                        {immediateAvailability === 'no' && (
                          <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                            <div className="relative">
                              <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <p className="text-base text-vyba-navy font-medium text-center mb-0">
                                No disponible
                              </p>
                              <p className="text-sm text-vyba-tertiary font-light text-center">
                                Los clientes no podrán ver tu perfil en las búsquedas
                              </p>
                            </div>
                          </div>
                        )}
                        {immediateAvailability === 'depends' && (
                          <div className="mt-8">
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
                                      className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out
                                        ${day.value ? 'bg-vyba-beige' : 'bg-vyba-gray'}
                                        hover:bg-vyba-beige
                                      `}
                                      onClick={() => setAvailableDays({...availableDays, [day.id]: !day.value})}
                                    >
                                      <div className="flex flex-col items-left h-[100px] justify-between">
                                        <CalendarClock className="h-9 w-9 text-vyba-navy stroke-[1.5]" />
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-sm font-medium">{day.label}</span>
                                            <Checkbox 
                                            id={day.id}
                                            checked={day.value}
                                            onCheckedChange={(checked) => setAvailableDays({...availableDays, [day.id]: checked as boolean})}
                                            className="border-vyba-navy"
                                            />
                                        </div>
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
                            <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                              <div className="relative">
                                <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              </div>
                              <div className="flex flex-col items-center justify-center space-y-2">
                                <p className="text-base text-vyba-navy font-medium text-center mb-0">
                                  Días disponibles
                                </p>
                                <p className="text-sm text-vyba-tertiary font-light text-center">
                                  {Object.entries(availableDays)
                                    .filter(([_, value]) => value)
                                    .map(([key]) => {
                                      const days = {
                                        monday: 'Lunes',
                                        tuesday: 'Martes',
                                        wednesday: 'Miércoles',
                                        thursday: 'Jueves',
                                        friday: 'Viernes',
                                        saturday: 'Sábado',
                                        sunday: 'Domingo'
                                      };
                                      return days[key as keyof typeof days];
                                    })
                                    .join(', ')}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'events' && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-medium">
                          {selectedEventType === null ? 'Todos los eventos' : 
                           selectedEventType === 'ensayo' ? 'Ensayos' :
                           selectedEventType === 'bolo' ? 'Bolos' :
                           selectedEventType === 'reunion' ? 'Reuniones' : 'Otros eventos'}
                        </h3>
                      </div>
                      <div className="space-y-4">
                        {filteredEvents.length === 0 ? (
                          <div className="text-center py-8 text-vyba-tertiary">
                            No hay eventos en esta categoría
                          </div>
                        ) : (
                          filteredEvents.map(event => (
                            <div key={event.id} className="p-4 bg-vyba-gray rounded-lg">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{event.title}</h3>
                                  <div className="flex items-center gap-2 text-sm text-vyba-tertiary mt-1">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>{format(new Date(event.startDate), 'EEEE d MMMM', { locale: es })}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-vyba-tertiary mt-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{event.startTime} - {event.endTime}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-vyba-tertiary mt-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
                                <div className={`px-2 py-1 rounded-md text-xs font-medium ${getEventColor(event.type)}`}>
                                  {event.type}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Overlay for swipable panel */}
          {isConfigOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={() => setIsConfigOpen(false)}
            />
          )}

          <div className="hidden lg:flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={prevPeriod} className="lg:block hidden">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-medium">
                {view === 'month' && format(currentDate, 'MMMM yyyy', { locale: es })}
                {view === 'week' && `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM', { locale: es })} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMM yyyy', { locale: es })}`}
                {view === 'day' && format(currentDate, 'EEEE d MMMM yyyy', { locale: es })}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextPeriod} className="lg:block hidden">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {view === 'month' && (
            <>
              <div className="lg:hidden">
                {renderAllMonths()}
              </div>
              <div className="hidden lg:block">
                {renderMonthView()}
              </div>
            </>
          )}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>

        <div className="hidden lg:block lg:col-span-1 bg-white overflow-auto">
          {selectedEvent ? (
            <div className="h-full">
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
            <div className="h-auto">
              <div className="p-6">
                <h2 className="text-3xl font-medium">Configuración</h2>
                <Tabs defaultValue="general" className="mt-6" onValueChange={setActiveTab}>
                  <TabsList className="w-full shadow-none">
                    <TabsTrigger value="general" className="flex-1 shadow-none">General</TabsTrigger>
                    <TabsTrigger value="events" className="flex-1 shadow-none">Eventos</TabsTrigger>
                    <TabsTrigger value="availability" className="flex-1 shadow-none">Disponibilidad</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="p-6 space-y-6 h-[calc(100%-8rem)] overflow-auto">
                {activeTab === 'general' && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-medium">
                        Configuración general
                      </h3>
                      <p className="text-sm text-vyba-tertiary font-light">Personaliza tu calendario según tus necesidades y preferencias</p>
                    </div>
                    <div>
                      <div className="flex gap-2">
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
                        <Button 
                          variant="secondary" 
                          className="w-full"
                          onClick={() => setShowEventDialog(true)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Añadir evento
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-medium text-vyba-navy">Eventos disponibles</h3>
                        <p className="text-sm text-vyba-tertiary font-light">Aquí puedes ver todos tus eventos</p>
                      </div>
                      <div className="mt-4 bg-vyba-gray rounded-lg p-6 space-y-4">
                        <p className="text-sm text-vyba-navy font-light mb-0">Actualmente tienes</p>
                        <div 
                          className="flex items-end justify-between cursor-pointer hover:bg-vyba-gray/80 transition-colors p-2 rounded-lg"
                          onClick={() => handleEventTypeClick('all')}
                        >
                          <p className="text-5xl font-bold text-vyba-navy mb-0">
                            {events.length}
                          </p>
                          <p className="text-sm text-vyba-tertiary font-light mb-0">eventos disponibles</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        {[
                          { type: 'ensayo', label: 'Ensayos' },
                          { type: 'bolo', label: 'Bolos' },
                          { type: 'reunion', label: 'Reuniones' },
                          { type: 'otro', label: 'Otros' }
                        ].map((category) => (
                          <div 
                            key={category.type} 
                            className="bg-vyba-gray rounded-lg p-4 space-y-2 cursor-pointer hover:bg-vyba-gray/80 transition-colors"
                            onClick={() => handleEventTypeClick(category.type)}
                          >
                            <p className="text-sm text-vyba-navy font-light mb-0">{category.label}</p>
                            <div className="flex items-end justify-between">
                              <p className="text-3xl font-bold text-vyba-navy mb-0">
                                {events.filter(event => event.type === category.type).length}
                              </p>
                              <p className="text-xs text-vyba-tertiary font-light mb-0">eventos</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-medium">
                        {selectedEventType === null ? 'Todos los eventos' : 
                         selectedEventType === 'ensayo' ? 'Ensayos' :
                         selectedEventType === 'bolo' ? 'Bolos' :
                         selectedEventType === 'reunion' ? 'Reuniones' : 'Otros eventos'}
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setActiveTab('general')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {filteredEvents.length === 0 ? (
                        <div className="text-center py-8 text-vyba-tertiary">
                          No hay eventos en esta categoría
                        </div>
                      ) : (
                        filteredEvents.map(event => (
                          <div key={event.id} className="p-4 bg-vyba-gray rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{event.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-vyba-tertiary mt-1">
                                  <CalendarIcon className="h-4 w-4" />
                                  <span>{format(new Date(event.startDate), 'EEEE d MMMM', { locale: es })}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-vyba-tertiary mt-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{event.startTime} - {event.endTime}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-vyba-tertiary mt-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <div className={`px-2 py-1 rounded-md text-xs font-medium ${getEventColor(event.type)}`}>
                                {event.type}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'availability' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-medium">
                        ¿Tienes disponibilidad para la semana del {format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'd MMMM', { locale: es })}?
                      </h3>
                      <p className="text-sm text-vyba-tertiary font-light">Selecciona una opción para indicar tu disponibilidad, mediante la disponibilidad, puedes atraer a clientes de última hora</p>
                    </div>
                    <div>
                      <div className="flex flex-col gap-2">
                        {[
                          { value: 'yes', label: 'Sí, estoy disponible' },
                          { value: 'no', label: 'No, no estoy disponible' },
                          { value: 'depends', label: 'Depende de la fecha' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setImmediateAvailability(option.value)}
                            className={`w-full py-4 px-4 rounded-md transition-all duration-300 ease-in-out
                              ${immediateAvailability === option.value 
                                ? 'bg-vyba-beige text-black font-medium text-sm' 
                                : 'bg-vyba-gray text-vyba-tertiary text-sm'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {immediateAvailability === 'yes' && (
                        <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                          <div className="relative">
                            <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          </div>
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <p className="text-base text-vyba-navy font-medium text-center mb-0">
                              Marcando en el compás
                            </p>
                            <p className="text-sm text-vyba-tertiary font-light text-center">
                              Los clientes podrán ver tu disponibilidad en tu perfil
                            </p>
                          </div>
                        </div>
                      )}
                      {immediateAvailability === 'no' && (
                        <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                          <div className="relative">
                            <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          </div>
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <p className="text-base text-vyba-navy font-medium text-center mb-0">
                              No disponible
                            </p>
                            <p className="text-sm text-vyba-tertiary font-light text-center">
                              Los clientes no podrán ver tu perfil en las búsquedas
                            </p>
                          </div>
                        </div>
                      )}
                      {immediateAvailability === 'depends' && (
                        <div className="mt-8">
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
                                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ease-in-out
                                      ${day.value ? 'bg-vyba-beige' : 'bg-vyba-gray'}
                                      hover:bg-vyba-beige
                                    `}
                                    onClick={() => setAvailableDays({...availableDays, [day.id]: !day.value})}
                                  >
                                    <div className="flex flex-col items-left h-[100px] justify-between">
                                      <CalendarClock className="h-9 w-9 text-vyba-navy stroke-[1.5]" />
                                      <div className="flex items-center justify-between gap-4">
                                          <span className="text-sm font-medium">{day.label}</span>
                                          <Checkbox 
                                          id={day.id}
                                          checked={day.value}
                                          onCheckedChange={(checked) => setAvailableDays({...availableDays, [day.id]: checked as boolean})}
                                          className="border-vyba-navy"
                                          />
                                      </div>
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
                          <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                            <div className="relative">
                              <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <p className="text-base text-vyba-navy font-medium text-center mb-0">
                                Días disponibles
                              </p>
                              <p className="text-sm text-vyba-tertiary font-light text-center">
                                {Object.entries(availableDays)
                                  .filter(([_, value]) => value)
                                  .map(([key]) => {
                                    const days = {
                                      monday: 'Lunes',
                                      tuesday: 'Martes',
                                      wednesday: 'Miércoles',
                                      thursday: 'Jueves',
                                      friday: 'Viernes',
                                      saturday: 'Sábado',
                                      sunday: 'Domingo'
                                    };
                                    return days[key as keyof typeof days];
                                  })
                                  .join(', ')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-center">Nuevo evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-12">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha inicio (opcional)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha fin (opcional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newEvent.endDate ? format(newEvent.endDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setNewEvent({ ...newEvent, endDate: new Date(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Hora inicio</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newEvent.startTime}
                  onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Hora fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newEvent.endTime}
                  onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
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
                  <SelectItem value="bolo">Bolo</SelectItem>
                  <SelectItem value="reunion">Reunión</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-12 justify-between mt-8">
            <Button variant="secondary" onClick={() => setShowEventDialog(false)}>
              Cancelar
            </Button>
            <Button variant="terciary" onClick={handleAddEvent}>
              Añadir evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage; 