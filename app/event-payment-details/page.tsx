"use client";

import React, { useState, useEffect, useMemo } from "react";
import { eventCategories } from "@/data/eventCategories";
import { eventsList } from "@/data/eventList";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Users, CreditCard, User, Phone, CheckCircle2, ChevronRight, QrCode, Search } from "lucide-react";
import QRCode from "qrcode";

export default function EventPaymentDetailsPage() {
  const [selectedEventNo, setSelectedEventNo] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  // Merge event categories with their detailed rules/coordinators
  const allEvents = useMemo(() => {
    return eventCategories.map((cat) => {
      const details = eventsList.find((e) => e.eventNo === cat.eventNo);
      return {
        ...cat,
        rules: details?.rules || [],
        coordinators: details?.coordinators || (details?.coordinator ? [details.coordinator] : []),
        image: details?.image,
      };
    }).sort((a, b) => a.eventName.localeCompare(b.eventName));
  }, []);

  const selectedEvent = useMemo(() => {
    return allEvents.find((e) => e.eventNo.toString() === selectedEventNo);
  }, [allEvents, selectedEventNo]);

  const upiLink = useMemo(() => {
    if (!selectedEvent || !selectedEvent.amount) return "";
    const params = new URLSearchParams({
      pa: "71159801@ubin",
      pn: "Global Academy Of Technology",
      am: selectedEvent.amount.toFixed(2),
      cu: "INR",
    });
    return `upi://pay?${params.toString()}`;
  }, [selectedEvent]);

  useEffect(() => {
    if (!upiLink) {
      setQrDataUrl("");
      return;
    }
    QRCode.toDataURL(upiLink, {
      width: 200,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("QR Generation Error:", err));
  }, [upiLink]);

  return (
    <div className="min-h-screen mt-20 bg-background text-foreground py-6 px-4 md:px-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Compact Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Event Hub & Payment
            </h1>
            <p className="text-muted-foreground text-xs">
              Select an event to view details and pay.
            </p>
          </div>
          <div className="w-full md:w-80">
            <Select value={selectedEventNo} onValueChange={setSelectedEventNo}>
              <SelectTrigger className="w-full h-10 text-sm">
                <SelectValue placeholder="Search or select an event..." />
              </SelectTrigger>
              <SelectContent>
                {allEvents.map((event) => (
                  <SelectItem key={event.eventNo} value={event.eventNo.toString()} className="text-sm">
                    {event.eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* 3-Column Layout */}
        <AnimatePresence mode="wait">
          {selectedEvent ? (
            <motion.div
              key={selectedEvent.eventNo}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Column 1: Selection & Summary */}
              <div className="space-y-6">
                <Card className="border-primary/20 shadow-sm overflow-hidden bg-card/50">
                  <CardHeader className="py-4 bg-primary/5 border-b border-primary/10">
                    <CardTitle className="text-base flex items-center gap-2 font-bold uppercase tracking-wider">
                      <Search className="w-4 h-4 text-primary" />
                      Event Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <Badge variant="outline" className="mb-2 text-[10px] font-bold uppercase tracking-tighter bg-primary/5">
                        {selectedEvent.category}
                      </Badge>
                      <h2 className="text-xl font-black leading-tight">{selectedEvent.eventName}</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center justify-between p-2 rounded-md bg-secondary/30 border border-border">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">Team Size</span>
                        </div>
                        <span className="text-xs font-bold">
                          {selectedEvent.minParticipant === selectedEvent.maxParticipant 
                            ? selectedEvent.maxParticipant 
                            : `${selectedEvent.minParticipant}-${selectedEvent.maxParticipant}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-md bg-secondary/30 border border-border">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">Reg. Fee</span>
                        </div>
                        <span className="text-sm font-black text-primary">₹{selectedEvent.amount}</span>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 text-center">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total to Pay</p>
                      <p className="text-3xl font-black text-primary">₹{selectedEvent.amount}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      Coordinators
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    {selectedEvent.coordinators.length > 0 ? (
                      selectedEvent.coordinators.map((coord, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-md border border-border bg-muted/20">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-xs font-medium">{coord.name}</span>
                          </div>
                          <a href={`tel:${coord.mobile}`} className="text-xs text-primary font-bold hover:underline">
                            {coord.mobile}
                          </a>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic text-center py-2">Info pending...</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Column 2: Rules & Regulations */}
              <Card className="border-primary/10 shadow-sm md:col-span-1">
                <CardHeader className="py-4 border-b bg-muted/10">
                  <CardTitle className="text-base flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Rules & Regulations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px] md:h-[600px] w-full p-4">
                    <div className="space-y-4">
                      {selectedEvent.rules.length > 0 ? (
                        selectedEvent.rules.map((rule, idx) => (
                          <div key={idx} className="flex gap-3 items-start group">
                            <span className="text-[10px] font-black text-primary mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                              {idx + 1}
                            </span>
                            <p className="text-xs leading-relaxed text-foreground/80 group-hover:text-foreground transition-colors">
                              {rule}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                          <Info className="w-8 h-8 opacity-20 mb-2" />
                          <p className="text-xs italic">No specific rules listed.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Column 3: Payment Section */}
              <div className="space-y-6">
                <Card className="border-primary/20 shadow-lg bg-gradient-to-b from-card to-primary/5">
                  <CardHeader className="py-4 text-center">
                    <CardTitle className="text-base font-bold flex items-center justify-center gap-2">
                      <QrCode className="w-4 h-4 text-primary" />
                      Payment Terminal
                    </CardTitle>
                    <CardDescription className="text-[10px]">Scan with any UPI App</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/40 rounded-lg blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
                      <div className="relative bg-white p-2 rounded-lg shadow-md border border-border">
                        {qrDataUrl ? (
                          <img 
                            src={qrDataUrl} 
                            alt="Payment QR" 
                            className="w-[180px] h-[180px]"
                          />
                        ) : (
                          <div className="w-[180px] h-[180px] flex items-center justify-center text-[10px] text-muted-foreground animate-pulse">
                            Loading QR...
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full space-y-2">
                      <Button 
                        asChild 
                        className="w-full h-10 text-xs font-bold shadow-md uppercase tracking-wider"
                      >
                        <a href={upiLink}>
                          Pay Now
                          <ChevronRight className="ml-2 w-3 h-3" />
                        </a>
                      </Button>
                      <p className="text-[9px] text-center text-muted-foreground">
                        Securely powered by UPI
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border shadow-sm bg-muted/5">
                  <CardHeader className="py-3 bg-muted/10 border-b">
                    <CardTitle className="text-xs uppercase tracking-widest font-bold">Bank Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-3 text-[11px]">
                    <div className="flex justify-between items-center border-b border-border/50 pb-1">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-bold">Union Bank</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border/50 pb-1">
                      <span className="text-muted-foreground">Beneficiary:</span>
                      <span className="font-bold truncate max-w-[120px]">GAT Bangalore</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-border/50 pb-1">
                      <span className="text-muted-foreground">Acc No:</span>
                      <span className="font-bold font-mono">143510100026360</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">IFSC:</span>
                      <span className="font-bold font-mono">UBIN0814351</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center space-y-4 border-2 border-dashed border-primary/10 rounded-2xl bg-muted/5"
            >
              <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center animate-bounce">
                <Search className="w-8 h-8 text-primary/40" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Ready to Start?</h3>
                <p className="text-muted-foreground text-xs">Choose an event from the search bar to see full details and payment options.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
