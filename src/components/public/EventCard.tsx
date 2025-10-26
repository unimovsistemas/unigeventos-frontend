import { EventDataResponse, EventType } from '@/services/eventsService';
import { Calendar, MapPin, Users, Clock, Tag, DollarSign, Eye, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface EventCardProps {
  event: EventDataResponse;
  onRegister: (eventId: string) => void;
}

const eventTypeLabels: Record<EventType, string> = {
  "": "Evento",
  "RETREAT": "Retiro",
  "LEADERS_RETREAT": "Retiro de Líderes",
  "MEETING": "Reunião",
  "CONFERENCE": "Conferência",
  "WORKSHOP": "Workshop",
  "SEMINARY": "Seminário",
  "VIGIL": "Vigília",
  "CULT": "Culto",
  "CORAL": "Coral",
  "CONCERT": "Concerto",
  "THEATER": "Teatro",
  "COURSE": "Curso",
  "EVANGELISM": "Evangelismo"
};

const eventTypeColors: Record<EventType, string> = {
  "": "bg-gray-100 text-gray-700 border border-gray-200",
  "RETREAT": "bg-blue-50 text-blue-700 border border-blue-200",
  "LEADERS_RETREAT": "bg-purple-50 text-purple-700 border border-purple-200",
  "MEETING": "bg-green-50 text-green-700 border border-green-200",
  "CONFERENCE": "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "WORKSHOP": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "SEMINARY": "bg-pink-50 text-pink-700 border border-pink-200",
  "VIGIL": "bg-orange-50 text-orange-700 border border-orange-200",
  "CULT": "bg-red-50 text-red-700 border border-red-200",
  "CORAL": "bg-teal-50 text-teal-700 border border-teal-200",
  "CONCERT": "bg-cyan-50 text-cyan-700 border border-cyan-200",
  "THEATER": "bg-rose-50 text-rose-700 border border-rose-200",
  "COURSE": "bg-lime-50 text-lime-700 border border-lime-200",
  "EVANGELISM": "bg-amber-50 text-amber-700 border border-amber-200"
};

export function EventCard({ event, onRegister }: EventCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLowestPrice = () => {
    if (event.isFree || !event.batches || event.batches.length === 0) return null;
    const prices = event.batches.map(batch => batch.price);
    return Math.min(...prices);
  };

  const isRegistrationOpen = () => {
    const now = new Date();
    const registrationStart = new Date(event.registrationStartDate);
    const registrationEnd = new Date(event.registrationDeadline);
    return now >= registrationStart && now <= registrationEnd;
  };

  const lowestPrice = getLowestPrice();

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 group h-full w-full max-w-full relative overflow-hidden">
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-orange-50/20 via-transparent to-orange-100/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Like Button */}
        <motion.button
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <motion.div
            animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart 
              className={`h-4 w-4 transition-colors duration-200 ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'
              }`} 
            />
          </motion.div>
        </motion.button>

        <CardHeader className="pb-3 sm:pb-4 relative z-10">
          <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
              <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium ${eventTypeColors[event.type]}`}>
                {eventTypeLabels[event.type]}
              </span>
              {event.hasTransport && (
                <span className="bg-green-50 text-green-700 border border-green-200 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium">
                  🚌 Transporte
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 line-clamp-2 mb-1">
              {event.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
              Organizado por {event.organizer?.name || 'Organizador não informado'}
            </p>
          </div>
          {lowestPrice !== null ? (
            <div className="text-right bg-orange-50 rounded-lg p-2 sm:p-3 border border-orange-100 ml-2 sm:ml-3 flex-shrink-0">
              <div className="text-sm sm:text-lg lg:text-xl font-bold text-orange-600">
                R$ {lowestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-orange-500">a partir de</div>
            </div>
          ) : (
            <div className="text-right bg-green-50 rounded-lg p-2 sm:p-3 border border-green-100 ml-2 sm:ml-3 flex-shrink-0">
              <div className="text-sm sm:text-lg lg:text-xl font-bold text-green-600">
                GRÁTIS
              </div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
        {event.description && (
          <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-100">
            <p className="text-gray-700 text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 leading-relaxed">
              {event.description}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 sm:gap-3 text-gray-700 bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-100">
            <div className="p-1 sm:p-1.5 bg-orange-100 rounded-full">
              <Calendar className="h-3 w-3 text-orange-600" />
            </div>
            <span className="font-medium text-xs sm:text-sm">{formatDateTime(event.startDatetime)}</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 text-gray-700 bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-100">
            <div className="p-1 sm:p-1.5 bg-purple-100 rounded-full">
              <Clock className="h-3 w-3 text-purple-600" />
            </div>
            <span className="font-medium text-xs sm:text-sm">até {formatDateTime(event.endDatetime)}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-gray-700 bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-100">
            <div className="p-1 sm:p-1.5 bg-green-100 rounded-full">
              <MapPin className="h-3 w-3 text-green-600" />
            </div>
            <span className="truncate font-medium text-xs sm:text-sm">{event.location}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-gray-700 bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-100">
            <div className="p-1 sm:p-1.5 bg-blue-100 rounded-full">
              <Users className="h-3 w-3 text-blue-600" />
            </div>
            <span className="font-medium text-xs sm:text-sm">{event.numberOfSubscribers} / {event.capacity} inscritos</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3 sm:pt-4">
          <div className="flex flex-col gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg px-2 sm:px-3 py-2 border border-gray-100">
              <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
              <span className="font-medium">Inscrições até: {formatDate(event.registrationDeadline)}</span>
            </div>
            {!event.isFree && (
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 rounded-lg px-2 sm:px-3 py-2 border border-gray-100">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                <span className="font-medium">Pagar até: {formatDate(event.finalDatePayment)}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 sm:pt-4 space-y-2 sm:space-y-3 relative z-10">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => router.push(`/events/${event.id}`)}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-orange-300 font-medium py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-all duration-300 text-sm sm:text-base group/btn"
          >
            <motion.div
              animate={{ x: isHovered ? 2 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover/btn:text-orange-600 transition-colors duration-200" />
            </motion.div>
            Saber Mais
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onRegister(event.id)}
            disabled={!isRegistrationOpen() || event.numberOfSubscribers >= event.capacity}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-md hover:shadow-lg relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative z-10">
              {!isRegistrationOpen() 
                ? "Inscrições Encerradas" 
                : event.numberOfSubscribers >= event.capacity 
                  ? "Lotado" 
                  : "Inscrever-se"
              }
            </span>
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
    </motion.div>
  );
}