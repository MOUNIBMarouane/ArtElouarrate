import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, X, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingWhatsAppProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

const FloatingWhatsApp = ({
  phoneNumber = "+212658651060",
  message = "Hi! I'm interested in your artworks. Could you please provide more information?",
  className,
}: FloatingWhatsAppProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleWhatsAppContact = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 bg-slate-800/95 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-4 shadow-2xl max-w-xs"
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 text-slate-400 hover:text-slate-200"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-slate-100 font-semibold text-sm">
                    Chat with us
                  </h3>
                  <p className="text-slate-400 text-xs">We're here to help!</p>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                Have questions about our artworks? Get in touch with us on
                WhatsApp for instant support.
              </p>

              <Button
                onClick={handleWhatsAppContact}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg h-10 transition-all duration-300"
              >
                <Phone className="h-4 w-4 mr-2" />
                Start Chat
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          onClick={
            isExpanded ? handleWhatsAppContact : () => setIsExpanded(true)
          }
          className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-2xl border-4 border-white/20 transition-all duration-300 hover:shadow-green-500/25"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? (
              <Phone className="h-6 w-6 text-white" />
            ) : (
              <MessageCircle className="h-6 w-6 text-white" />
            )}
          </motion.div>
        </Button>

        {/* Pulse Animation */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>

        {/* Online Indicator */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full">
          <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </motion.div>

      {/* Tooltip */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-slate-800/95 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-lg shadow-lg border border-slate-700/50 whitespace-nowrap"
        >
          Need help? Chat with us!
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-r border-b border-slate-700/50"></div>
        </motion.div>
      )}
    </div>
  );
};

export default FloatingWhatsApp;
