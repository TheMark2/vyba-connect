import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, MapPin, X, Flame, Settings, Bell, Filter, Download, CalendarClock, CalendarDays, Calendar, CalendarFold, EyeOff, ChartSpline, Menu, LayoutDashboard, User, MessageSquare, BarChart } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';

type CalendarView = 'month' | 'year';

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
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'closest'>('closest');
  const [isSwiped, setIsSwiped] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsSwiped(true),
    onSwipedRight: () => setIsSwiped(false),
    trackMouse: true
  });

  const navigate = useNavigate();

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
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevPeriod = () => {
    setCurrentDate(subMonths(currentDate, 1));
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
    if (date >= new Date()) {
      setSelectedDate(date);
      setShowEventDialog(true);
    }
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

  // Filtrar eventos para excluir los pasados
  const currentEvents = events.filter(event => new Date(event.endDate) >= new Date());

  const filteredEvents = selectedEventType 
    ? currentEvents.filter(event => event.type === selectedEventType)
    : currentEvents;

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    } else {
      const today = new Date();
      const diffA = Math.abs(new Date(a.startDate).getTime() - today.getTime());
      const diffB = Math.abs(new Date(b.startDate).getTime() - today.getTime());
      return diffA - diffB;
    }
  });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const handleMonthClick = (month: Date) => {
    setSelectedMonth(month);
    setDrawerOpen(true);
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value, 10);
    setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
  };

  const handleEditEvent = (event: Event) => {
    setEventToEdit(event);
    setShowEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (eventToEdit) {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === eventToEdit.id ? { ...event, ...eventToEdit } : event
        )
      );
      setShowEditDialog(false);
    }
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startDayOfWeek = (monthStart.getDay() + 6) % 7;

    return (
      <div className="grid grid-cols-7">
        <div className="sticky top-0 bg-white z-10 flex justify-center items-center py-2">
          <h2 className="text-2xl font-medium text-center">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
        </div>
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
          <div key={day} className="text-center font-medium text-vyba-tertiary py-2 sticky top-10 bg-white z-10">
            {day}
          </div>
        ))}
        {Array.from({ length: startDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2"></div>
        ))}
        {daysInMonth.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isMondayColumn = (index + startDayOfWeek) % 7 === 0;
          const hasEvents = dayEvents.length > 0;
          return (
            <div
              key={date.toString()}
              className={`min-h-[120px] p-2 border-b border-r cursor-pointer transition-colors
                ${isSameMonth(date, monthStart) ? 'hover:bg-vyba-gray' : 'bg-gray-50 text-gray-400'}
                ${selectedDate && isSameDay(date, selectedDate) ? 'bg-vyba-gray' : ''}
                ${date < new Date() && !isToday(date) ? 'bg-vyba-gray' : ''}
                ${isMondayColumn ? 'border-l' : ''}
                ${index < 7 ? 'border-t' : ''}
                sm:min-h-[60px] sm:min-w-[60px]
                sm:h-[60px] sm:w-[60px]
              `}
              onClick={() => handleDateClick(date)}
            >
              <div className="text-sm font-medium mb-1 flex items-center gap-1 justify-center">
                {format(date, 'd')}
                {isToday(date) && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                {hasEvents && <div className="w-2 h-2 rounded-full bg-black"></div>}
              </div>
              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    className={`text-xs px-2 py-1 rounded-md truncate ${getEventColor(event.type)} inline-block cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                  >
                    <Popover>
                      <PopoverTrigger asChild>
                        <span className="cursor-pointer">{event.title}</span>
                      </PopoverTrigger>
                      <PopoverContent className="z-50">
                        <div className="p-2">
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm">Fecha: {format(new Date(event.startDate), 'EEEE d MMMM', { locale: es })}</p>
                          <p className="text-sm">Hora: {event.startTime} - {event.endTime}</p>
                          <p className="text-sm">Ubicación: {event.location}</p>
                          <p className="text-sm">Tipo: {event.type}</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const monthHeight = e.currentTarget.scrollHeight / 12;
    let newMonthIndex = Math.floor(scrollTop / monthHeight);
    if (newMonthIndex < 0) newMonthIndex = 0;
    const newDate = new Date(currentDate.getFullYear(), newMonthIndex, 1);
    if (newDate.getMonth() !== currentDate.getMonth()) {
      setCurrentDate(newDate);
    }
  };

  const renderAllMonthsView = () => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1));
    return (
      <div className="flex flex-col gap-6 md:gap-12">
        {months.map((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
          const startDayOfWeek = (monthStart.getDay() + 6) % 7;
          return (
            <div key={month.toString()} className="mb-6">
              {month.getMonth() !== 0 && (
                <h2 className="text-2xl font-medium text-center py-2">
                  {format(month, 'MMMM yyyy', { locale: es })}
                </h2>
              )}
              <div className="grid grid-cols-7">
                {Array.from({ length: startDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-2"></div>
                ))}
                {daysInMonth.map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const hasEvents = dayEvents.length > 0;
                  return (
                    <div
                      key={date.toString()}
                      className={`h-[70px] md:min-h-[120px] p-2 border-b border-r cursor-pointer transition-colors
                        ${isSameMonth(date, month) ? 'hover:bg-vyba-gray' : 'bg-gray-50 text-gray-400'}
                        ${selectedDate && isSameDay(date, selectedDate) ? 'bg-vyba-gray' : ''}
                        ${date < new Date() && !isToday(date) ? 'bg-vyba-gray' : ''}
                        ${index === 0 ? 'border-l' : ''}
                        ${index < 7 ? 'border-t' : ''}
                      `}
                      onClick={() => handleDateClick(date)}
                    >
                      <div className="text-xs md:text-sm font-medium mb-1 flex flex-col items-center justify-center md:justify-start gap-1">
                        {format(date, 'd')}
                        {isToday(date) && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                        {hasEvents && (
                          <>
                            <div className="w-2 h-2 rounded-full bg-black mt-1 md:hidden"></div>
                            <div className="hidden md:block space-y-1">
                              {dayEvents.map(event => (
                                <div
                                  key={event.id}
                                  className={`text-xs px-2 py-1 rounded-md truncate ${getEventColor(event.type)}`}
                                >
                                  {event.title} {event.startTime}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1));
    return (
      <div className="grid grid-cols-3 gap-4 px-6">
        {months.map((month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
          const startDayOfWeek = (monthStart.getDay() + 6) % 7;
          return (
            <div key={month.toString()} className="mb-6 cursor-pointer hover:bg-vyba-gray/50 p-6 rounded-lg transition-colors duration-300 ease-in-out" onClick={() => handleMonthClick(month)}>
              <h3 className="text-xl font-medium text-left mb-6 py-2">
                {format(month, 'MMMM', { locale: es })}
              </h3>
              <div className="grid grid-cols-7">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
                  <div key={day} className="text-center text-xs font-light text-vyba-tertiary py-1 mb-4">
                    {day}
                  </div>
                ))}
                {Array.from({ length: startDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-2"></div>
                ))}
                {daysInMonth.map((date, index) => {
                  const dayEvents = getEventsForDate(date);
                  const isMondayColumn = (index + startDayOfWeek) % 7 === 0;
                  const isFirstDayOfMonth = date.getDate() === 1;
                  const hasEvents = dayEvents.length > 0;
                  return (
                    <div
                      key={date.toString()}
                      className={`min-h-[60px] p-1 border-b border-r cursor-pointer transition-colors
                        ${isSameMonth(date, month) ? 'hover:bg-vyba-gray' : 'bg-gray-50 text-gray-400'}
                        ${selectedDate && isSameDay(date, selectedDate) ? 'bg-vyba-gray' : ''}
                        ${date < new Date() && !isToday(date) ? 'bg-vyba-gray' : ''}
                        ${(isMondayColumn || isFirstDayOfMonth) ? 'border-l' : ''}
                        ${index < 7 ? 'border-t' : ''}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(date);
                      }}
                    >
                      <div className="text-xs font-medium mb-2 flex justify-center">
                        {format(date, 'd')}
                      </div>
                      {hasEvents && <div className="w-2 h-2 rounded-full bg-black mx-auto"></div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAvailabilityTab = () => {
    const today = new Date();
    const isSunday = today.getDay() === 0;
    const startOfNextWeek = isSunday ? addDays(today, 1) : startOfWeek(addDays(today, 7), { weekStartsOn: 1 });

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-medium">
            ¿Tienes disponibilidad para la semana del {format(startOfNextWeek, 'd MMMM', { locale: es })}?
          </h3>
          <p className="text-sm text-vyba-tertiary font-light">Selecciona una opción para indicar tu disponibilidad, mediante la disponibilidad, puedes atraer a clientes de última hora</p>
        </div>
        <div>
          <div className="flex gap-2">
            {[
              { value: 'yes', label: 'Sí, estoy disponible' },
              { value: 'no', label: 'No, no estoy disponible' },
              { value: 'depends', label: 'Depende de la fecha' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setImmediateAvailability(option.value)}
                className={`flex-1 py-4 px-4 rounded-md transition-all duration-300 ease-in-out
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
        </div>

        {immediateAvailability === 'depends' && (
          <div>
            <h3 className="text-xl font-medium text-vyba-navy mb-3">Días disponibles</h3>
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
            <div className="flex items-center gap-2 mt-8">
              <div className="relative">
                <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm text-vyba-tertiary font-light">
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
        )}
      </div>
    );
  };

  // Función para obtener eventos de un mes
  const getEventsForMonth = (month) => {
    return events.filter(event => {
      const eventMonth = new Date(event.startDate).getMonth();
      const selectedMonth = month.getMonth();
      return eventMonth === selectedMonth;
    });
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-full">
        <div className="lg:col-span-3 bg-white overflow-y-auto h-full" onScroll={handleScroll} {...handlers}>
          <div className="sticky top-0 bg-white z-10 flex justify-between items-center py-2 px-4">
            <select
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="text-2xl font-medium text-center bg-transparent appearance-none"
            >
              {Array.from({ length: 10 }, (_, i) => currentDate.getFullYear() - 5 + i).map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <button className="p-2 bg-blue-500 text-white rounded-full md:hidden" onClick={() => setIsSwiped(!isSwiped)}>
              <Menu className="w-6 h-6" />
            </button>
            <Select value={view} onValueChange={(value) => setView(value as CalendarView)}>
              <SelectTrigger className="w-auto gap-8">
                <SelectValue placeholder="Selecciona una vista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Vista mensual</SelectItem>
                <SelectItem value="year">Vista anual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {view === 'year' ? renderYearView() : renderAllMonthsView()}
        </div>
        <div className={`lg:col-span-1 bg-white overflow-auto fixed inset-0 z-20 ${isSwiped ? 'block' : 'hidden'} md:relative md:block`}>
          <Tabs defaultValue={activeTab} className="mt-6" onValueChange={setActiveTab}>
            <TabsList className="w-full shadow-none">
              <TabsTrigger value="general" className="flex-1 shadow-none">General</TabsTrigger>
              <TabsTrigger value="events" className="flex-1 shadow-none">Eventos</TabsTrigger>
              <TabsTrigger value="availability" className="flex-1 shadow-none">Disponibilidad</TabsTrigger>
            </TabsList>
            <div className="p-6 space-y-6 h-[calc(100%-8rem)] overflow-auto">
              {activeTab === 'general' && (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-medium">
                      ¿Tienes un evento en el calendario?
                    </h3>
                  </div>
                  <div>
                    <div className="flex gap-2">
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
                      <h3 className="text-2xl font-medium text-vyba-navy">Eventos disponibles</h3>
                      <p className="text-sm text-vyba-tertiary font-light">Aquí puedes ver todos tus eventos</p>
                    </div>
                    <div className="mt-4 bg-vyba-gray rounded-lg p-6 space-y-4">
                      <p className="text-sm text-vyba-navy font-light mb-0">Actualmente tienes</p>
                      <div 
                        className="flex items-end justify-between cursor-pointer hover:bg-vyba-gray/80 transition-colors p-2 rounded-lg"
                        onClick={() => handleEventTypeClick('all')}
                      >
                        <p className="text-5xl font-bold text-vyba-navy mb-0">
                          {currentEvents.length}
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
                              {currentEvents.filter(event => event.type === category.type).length}
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
                  <div className="flex justify-start mb-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => setSortBy(sortBy === 'recent' ? 'closest' : 'recent')}
                    >
                      Ordenar por: {sortBy === 'recent' ? 'Más cercanos' : 'Más recientes'}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {sortedEvents.length === 0 ? (
                      <div className="text-center py-8 text-vyba-tertiary">
                        No hay eventos en esta categoría
                      </div>
                    ) : (
                      sortedEvents.map(event => (
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
                            <div className="flex items-center gap-2">
                              <div className={`px-2 py-1 rounded-md text-xs font-medium ${getEventColor(event.type)}`}>{event.type}</div>
                              <Button variant="ghost" size="icon" onClick={() => handleEditEvent(event)}>
                                <Settings className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'availability' && renderAvailabilityTab()}
            </div>
          </Tabs>
        </div>
      </div>

      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Nuevo evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-12">
            <div className="space-y-2" >
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                />
              </div>
              <div className="space-y-2">
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
          <DialogFooter className="px-12 justify-between mt-4">
            <Button variant="secondary" onClick={() => setShowEventDialog(false)}>
              Cancelar
            </Button>
            <Button variant="terciary" onClick={handleAddEvent}>
              Añadir evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Editar Evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-12">
            {eventToEdit && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editTitle">Título</Label>
                <Input
                  id="editTitle"
                  value={eventToEdit.title}
                  onChange={(e) => setEventToEdit({ ...eventToEdit, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStartDate">Fecha inicio</Label>
                  <Input
                    id="editStartDate"
                    type="date"
                    value={format(eventToEdit.startDate, 'yyyy-MM-dd')}
                    onChange={(e) => setEventToEdit({ ...eventToEdit, startDate: new Date(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEndDate">Fecha fin</Label>
                  <Input
                    id="editEndDate"
                    type="date"
                    value={format(eventToEdit.endDate, 'yyyy-MM-dd')}
                    onChange={(e) => setEventToEdit({ ...eventToEdit, endDate: new Date(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editStartTime">Hora inicio</Label>
                  <Input
                    id="editStartTime"
                    type="time"
                    value={eventToEdit.startTime}
                    onChange={(e) => setEventToEdit({ ...eventToEdit, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEndTime">Hora fin</Label>
                  <Input
                    id="editEndTime"
                    type="time"
                    value={eventToEdit.endTime}
                    onChange={(e) => setEventToEdit({ ...eventToEdit, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLocation">Ubicación</Label>
                <Input
                  id="editLocation"
                  value={eventToEdit.location}
                  onChange={(e) => setEventToEdit({ ...eventToEdit, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editType">Tipo de evento</Label>
                <Select
                  value={eventToEdit.type}
                  onValueChange={(value) => setEventToEdit({ ...eventToEdit, type: value as Event['type'] })}
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
          )}
          </div>
          <DialogFooter className="px-12 justify-between mt-4" >
            <Button variant="secondary" onClick={() => setShowEditDialog(false)}>Cerrar</Button>
            <Button variant="terciary" onClick={handleSaveEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <nav className="fixed bottom-0 left-0 w-full bg-white z-50 flex justify-around items-center py-2 md:hidden">
        <button onClick={() => navigate('/dashboard')}><LayoutDashboard className="w-6 h-6" /></button>
        <button onClick={() => navigate('/dashboard/profile')}><User className="w-6 h-6" /></button>
        <button onClick={() => navigate('/dashboard/messages')}><MessageSquare className="w-6 h-6" /></button>
        <button onClick={() => navigate('/dashboard/analytics')}><BarChart className="w-6 h-6" /></button>
        <button onClick={() => navigate('/dashboard/calendar')}><CalendarIcon className="w-6 h-6" /></button>
      </nav>
    </div>
  );
};

export default CalendarPage; 