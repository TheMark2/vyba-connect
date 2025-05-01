import React, { useState, useEffect, useRef } from 'react';
import UserDashboardLayout from '@/components/dashboard/UserDashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Tipos para mensajes y conversaciones
interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  isCurrentUser: boolean;
}

interface Conversation {
  id: string;
  artistId: string;
  artistName: string;
  artistAvatar: string;
  artistType: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
}

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Datos de ejemplo para conversaciones
  const mockConversations: Conversation[] = [
    {
      id: '1',
      artistId: '101',
      artistName: 'DJ Marcos',
      artistAvatar: '/images/dj1.webp',
      artistType: 'DJ',
      lastMessage: 'Hola, gracias por contactarme. ¿En qué puedo ayudarte?',
      lastMessageTime: '10:30',
      unread: true,
    },
    {
      id: '2',
      artistId: '102',
      artistName: 'Laura Voz',
      artistAvatar: '/images/dj2.webp',
      artistType: 'Cantante',
      lastMessage: 'Tengo disponibilidad para la fecha que mencionas',
      lastMessageTime: 'Ayer',
      unread: false,
    },
    {
      id: '3',
      artistId: '103',
      artistName: 'Carlos Sax',
      artistAvatar: '/images/dj3.webp',
      artistType: 'Saxofonista',
      lastMessage: 'Te envío el presupuesto en breve',
      lastMessageTime: 'Lun',
      unread: false,
    }
  ];

  // Datos de ejemplo para mensajes
  const mockMessages: Record<string, Message[]> = {
    '1': [
      {
        id: 'm1',
        content: 'Hola, estoy interesado en contratarte para un evento',
        timestamp: '2023-05-10T10:15:00',
        senderId: 'current-user',
        senderName: 'Tú',
        senderAvatar: '',
        isCurrentUser: true,
      },
      {
        id: 'm2',
        content: 'Hola, gracias por contactarme. ¿En qué puedo ayudarte?',
        timestamp: '2023-05-10T10:30:00',
        senderId: '101',
        senderName: 'DJ Marcos',
        senderAvatar: '/images/dj1.webp',
        isCurrentUser: false,
      },
    ],
    '2': [
      {
        id: 'm3',
        content: 'Hola Laura, me interesa tu música para un evento el próximo mes',
        timestamp: '2023-05-09T14:20:00',
        senderId: 'current-user',
        senderName: 'Tú',
        senderAvatar: '',
        isCurrentUser: true,
      },
      {
        id: 'm4',
        content: 'Hola, gracias por tu mensaje. ¿Qué día exactamente necesitas?',
        timestamp: '2023-05-09T15:10:00',
        senderId: '102',
        senderName: 'Laura Voz',
        senderAvatar: '/images/dj2.webp',
        isCurrentUser: false,
      },
      {
        id: 'm5',
        content: 'Sería para el 15 de junio, una boda en Madrid',
        timestamp: '2023-05-09T15:15:00',
        senderId: 'current-user',
        senderName: 'Tú',
        senderAvatar: '',
        isCurrentUser: true,
      },
      {
        id: 'm6',
        content: 'Tengo disponibilidad para la fecha que mencionas',
        timestamp: '2023-05-09T16:30:00',
        senderId: '102',
        senderName: 'Laura Voz',
        senderAvatar: '/images/dj2.webp',
        isCurrentUser: false,
      },
    ],
    '3': [
      {
        id: 'm7',
        content: 'Buenas tardes, ¿cuál es tu tarifa para eventos corporativos?',
        timestamp: '2023-05-08T09:00:00',
        senderId: 'current-user',
        senderName: 'Tú',
        senderAvatar: '',
        isCurrentUser: true,
      },
      {
        id: 'm8',
        content: 'Hola, depende del tipo de evento y duración. ¿Me podrías dar más detalles?',
        timestamp: '2023-05-08T11:45:00',
        senderId: '103',
        senderName: 'Carlos Sax',
        senderAvatar: '/images/dj3.webp',
        isCurrentUser: false,
      },
      {
        id: 'm9',
        content: 'Sería para un evento de 3 horas en una cena de empresa',
        timestamp: '2023-05-08T12:30:00',
        senderId: 'current-user',
        senderName: 'Tú',
        senderAvatar: '',
        isCurrentUser: true,
      },
      {
        id: 'm10',
        content: 'Te envío el presupuesto en breve',
        timestamp: '2023-05-08T14:20:00',
        senderId: '103',
        senderName: 'Carlos Sax',
        senderAvatar: '/images/dj3.webp',
        isCurrentUser: false,
      },
    ],
  };

  // Cargar conversaciones y mensajes
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoading(true);
        // En una aplicación real, aquí cargarías las conversaciones desde Supabase
        // Por ahora usamos datos simulados
        setConversations(mockConversations);
        
        // Seleccionar la primera conversación por defecto
        if (mockConversations.length > 0 && !selectedConversation) {
          setSelectedConversation(mockConversations[0].id);
          setMessages(mockMessages[mockConversations[0].id] || []);
        }
      } catch (error) {
        console.error('Error al cargar conversaciones:', error);
        toast.error('Error al cargar tus conversaciones');
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Cargar mensajes cuando se selecciona una conversación
  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation] || []);
    }
  }, [selectedConversation]);

  // Hacer scroll hacia abajo cuando se envían nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filtrar conversaciones basado en la búsqueda
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar envío de mensaje
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Crear nuevo mensaje
    const newMessageObj: Message = {
      id: `m${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      senderId: 'current-user',
      senderName: 'Tú',
      senderAvatar: '',
      isCurrentUser: true,
    };
    
    // Actualizar mensajes localmente
    setMessages([...messages, newMessageObj]);
    
    // Actualizar última conversación
    setConversations(
      conversations.map((conv) => {
        if (conv.id === selectedConversation) {
          return {
            ...conv,
            lastMessage: newMessage,
            lastMessageTime: 'Ahora',
            unread: false,
          };
        }
        return conv;
      })
    );
    
    // Limpiar input
    setNewMessage('');
    
    // En una aplicación real, aquí guardarías el mensaje en Supabase
  };

  // Seleccionar una conversación
  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    
    // Marcar como leída
    setConversations(
      conversations.map((conv) => {
        if (conv.id === conversationId && conv.unread) {
          return { ...conv, unread: false };
        }
        return conv;
      })
    );
  };

  // Formatear fecha para mostrar
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Obtener detalles de la conversación actual
  const currentConversation = conversations.find(
    (conv) => conv.id === selectedConversation
  );

  return (
    <UserDashboardLayout>
      <div className="h-[calc(100vh-64px)] flex flex-col">
        <div className="flex h-full">
          {/* Sidebar de conversaciones */}
          <div className="w-full md:w-80 border-r bg-white flex flex-col">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-vyba-tertiary" />
                <Input
                  placeholder="Buscar conversaciones"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center p-4 hover:bg-vyba-gray/20 cursor-pointer ${
                    selectedConversation === conversation.id
                      ? 'bg-vyba-gray/30'
                      : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.artistAvatar} alt={conversation.artistName} />
                      <AvatarFallback>{conversation.artistName[0]}</AvatarFallback>
                    </Avatar>
                    {conversation.unread && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-vyba-navy rounded-full" />
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{conversation.artistName}</p>
                      <span className="text-xs text-vyba-tertiary">{conversation.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-vyba-tertiary truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Área de mensajes */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Encabezado del chat */}
                <div className="p-4 border-b bg-white flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src={currentConversation?.artistAvatar} alt={currentConversation?.artistName} />
                      <AvatarFallback>{currentConversation?.artistName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-medium">{currentConversation?.artistName}</p>
                      <p className="text-xs text-vyba-tertiary">{currentConversation?.artistType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Video className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Heart className="h-4 w-4 mr-2" />
                          <span>Añadir a favoritos</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                        <DropdownMenuItem>Reportar</DropdownMenuItem>
                        <DropdownMenuItem>Bloquear</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Mensajes */}
                <div className="flex-1 p-4 overflow-y-auto bg-vyba-gray/10">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.isCurrentUser ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-3 ${
                            message.isCurrentUser
                              ? 'bg-vyba-navy text-white'
                              : 'bg-white'
                          }`}
                        >
                          <div className="flex items-end">
                            <p>{message.content}</p>
                            <span className={`text-xs ml-2 ${
                              message.isCurrentUser ? 'text-white/70' : 'text-vyba-tertiary'
                            }`}>
                              {formatMessageTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Formulario de envío */}
                <div className="p-4 border-t bg-white">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <Button type="button" variant="ghost" size="icon" className="rounded-full">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={!newMessage.trim()}
                      className="rounded-full"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-vyba-tertiary">
                  <p>Selecciona una conversación para empezar a chatear</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default MessagesPage; 