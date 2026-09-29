import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ItineraryRecordDoc, 
  ItineraryDay, 
  GeneratedItineraryJSON 
} from '../types/itinerary';
import { 
  PlanningInput, 
  generateItineraryPlan, 
  regenerateSingleDayInItinerary, 
  parsePartyComposition 
} from '../services/verifiedPlanningEngine';
import { ItineraryCardView } from './ItineraryCardView';
import { PastTripsSection } from './PastTripsSection';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Compass, 
  Send, 
  Sparkles, 
  LogOut, 
  History, 
  PlusCircle, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Users, 
  ToggleLeft, 
  ToggleRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ChatBubbleMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export const TripAssistantMain: React.FC = () => {
  const { user, logout } = useAuth();

  // Chat interview state
  const [messages, setMessages] = useState<ChatBubbleMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);

  // Form structured input state
  const [destination, setDestination] = useState('Munnar');
  const [dates, setDates] = useState('10–14 Dec 2026');
  const [durationDays, setDurationDays] = useState(4);
  const [budget, setBudget] = useState(75000);
  const [partySize, setPartySize] = useState('Family with 2 kids (6 and 9)');
  const [interests, setInterests] = useState<string[]>(['Nature', 'relaxation']);
  const [surpriseOffbeat, setSurpriseOffbeat] = useState(true);

  // Completed itinerary record stored in Firestore 'itineraries' collection
  const [activeRecord, setActiveRecord] = useState<ItineraryRecordDoc | null>(null);
  const [refreshTripsKey, setRefreshTripsKey] = useState<number>(0);

  const pastTripsRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSelectPastTrip = (trip: ItineraryRecordDoc) => {
    setActiveRecord(trip);
    // Smooth scroll down to active itinerary
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight * 0.7,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Initialize conversation
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text: `Namaste ${user?.displayName || 'Traveller'}! I am your MMT Trip Assistant. Where would you like to travel, and what are your dates, budget in ₹, party size (kids/seniors?), and interests?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [user]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  // Handle User Message in Chat
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userText = inputText.trim();
    setInputText('');

    // Append user message (UI: right-side for user)
    const userMsg: ChatBubbleMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages((prev) => [...prev, userMsg]);

    // Check if user is typing rapid parameter updates or generating
    setIsProcessing(true);

    try {
      // Execute Generation using Planning Engine
      const planningInput: PlanningInput = {
        destination,
        dates,
        durationDays,
        budget,
        partySize,
        interests,
        offbeatMode: surpriseOffbeat
      };

      const partyInfo = parsePartyComposition(partySize);
      const generated = await generateItineraryPlan(planningInput, partyInfo);

      const newRecord: ItineraryRecordDoc = {
        uid: user!.uid,
        destination,
        dates,
        budget,
        partySize,
        interests,
        generatedItinerary: generated,
        explanationText: 'Your personalised explanation is being reviewed — check back in a few minutes.',
        explanationStatus: 'pending',
        createdAt: new Date().toISOString(),
        offbeatMode: surpriseOffbeat,
        totalEstimatedCost: generated.totalEstimatedCost
      };

      // Store in Firebase Firestore collection 'itineraries'
      const docRef = await addDoc(collection(db, 'itineraries'), newRecord);
      newRecord.id = docRef.id;

      setActiveRecord(newRecord);
      setRefreshTripsKey((k) => k + 1);

      // Assistant response (UI: left-side chat bubble)
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: `I've prepared your custom ${destination} plan! Budget strictly respected (Total: ₹${generated.totalEstimatedCost.toLocaleString('en-IN')} vs Ceiling: ₹${budget.toLocaleString('en-IN')}). Scroll below to view your full day-by-day itinerary.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Itinerary generation error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-err-${Date.now()}`,
          sender: 'assistant',
          text: `I encountered an issue generating the itinerary. Please try clicking the Quick Plan button below.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Quick Plan trigger
  const handleQuickPlan = async () => {
    if (!user || isProcessing) return;
    setIsProcessing(true);

    const userSummary = `Planning ${destination} (${dates}), Budget: ₹${budget.toLocaleString('en-IN')}, Party: ${partySize}, Interests: ${interests.join(', ')}, Offbeat: ${surpriseOffbeat ? 'Yes' : 'No'}`;
    
    setMessages((prev) => [
      ...prev,
      {
        id: `usr-quick-${Date.now()}`,
        sender: 'user',
        text: userSummary,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      const planningInput: PlanningInput = {
        destination,
        dates,
        durationDays,
        budget,
        partySize,
        interests,
        offbeatMode: surpriseOffbeat
      };

      const partyInfo = parsePartyComposition(partySize);
      const generated = await generateItineraryPlan(planningInput, partyInfo);

      const newRecord: ItineraryRecordDoc = {
        uid: user.uid,
        destination,
        dates,
        budget,
        partySize,
        interests,
        generatedItinerary: generated,
        explanationText: 'Your personalised explanation is being reviewed — check back in a few minutes.',
        explanationStatus: 'pending',
        createdAt: new Date().toISOString(),
        offbeatMode: surpriseOffbeat,
        totalEstimatedCost: generated.totalEstimatedCost
      };

      const docRef = await addDoc(collection(db, 'itineraries'), newRecord);
      newRecord.id = docRef.id;

      setActiveRecord(newRecord);
      setRefreshTripsKey((k) => k + 1);

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-quick-${Date.now()}`,
          sender: 'assistant',
          text: `Itinerary synthesized and stored in Firestore under your UID. Itinerary cards rendered below!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error('Quick plan error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Regenerate Single Day
  const handleRegenerateDay = async (dayNumber: number) => {
    if (!activeRecord || !user) return;
    setRegeneratingDay(dayNumber);

    try {
      const planningInput: PlanningInput = {
        destination: activeRecord.destination,
        dates: activeRecord.dates,
        durationDays: activeRecord.generatedItinerary.days.length,
        budget: activeRecord.budget,
        partySize: activeRecord.partySize,
        interests: activeRecord.interests,
        offbeatMode: activeRecord.offbeatMode
      };

      const partyInfo = parsePartyComposition(activeRecord.partySize);
      const updatedDay = await regenerateSingleDayInItinerary(
        dayNumber,
        activeRecord.generatedItinerary.days,
        planningInput,
        partyInfo
      );

      const newDays = activeRecord.generatedItinerary.days.map((d) =>
        d.dayNumber === dayNumber ? updatedDay : d
      );

      let newTotal = 0;
      newDays.forEach((d) => (newTotal += d.estimatedCost));

      const updatedRecord: ItineraryRecordDoc = {
        ...activeRecord,
        generatedItinerary: {
          ...activeRecord.generatedItinerary,
          days: newDays,
          totalEstimatedCost: newTotal
        },
        totalEstimatedCost: newTotal
      };

      // Save updated doc to Firestore 'itineraries'
      if (activeRecord.id) {
        const itemDoc = doc(db, 'itineraries', activeRecord.id);
        await setDoc(itemDoc, updatedRecord, { merge: true });
      }

      setActiveRecord(updatedRecord);
    } catch (err) {
      console.error('Regenerate day error:', err);
    } finally {
      setRegeneratingDay(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-slate-900 text-lg tracking-tight">
                  MMT Trip Assistant
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Firestore Collections Synced
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">
                Strict Verified Catalogue Confinement • Hard Budget Ceilings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                pastTripsRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Past Trips</span>
            </button>

            {activeRecord && (
              <button
                onClick={() => {
                  setActiveRecord(null);
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      sender: 'assistant',
                      text: `Ready for a new adventure! Where would you like to travel next?`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline">New Plan</span>
              </button>
            )}

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase overflow-hidden ring-1 ring-slate-300">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.displayName?.[0] || user?.email?.[0] || 'U'
                )}
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1 flex flex-col gap-6">
        {/* Preferences Bar / Interview Controller */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                Trip Interview Parameters
              </span>
              <h2 className="text-base font-extrabold text-slate-900">
                Configure Preferences & Anti-Bias Filters
              </h2>
            </div>

            {/* Surprise me with offbeat options toggle */}
            <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-200/80 px-3.5 py-2 rounded-2xl">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Surprise me with offbeat options</span>
                <span className="text-[10px] text-slate-500">Min 30% lesser-known gems</span>
              </div>
              <button
                type="button"
                onClick={() => setSurpriseOffbeat(!surpriseOffbeat)}
                className="cursor-pointer text-rose-600 focus:outline-none"
              >
                {surpriseOffbeat ? (
                  <ToggleRight className="w-7 h-7 text-rose-600 fill-rose-100" />
                ) : (
                  <ToggleLeft className="w-7 h-7 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Destination */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-500" /> Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="Munnar">Munnar (Kerala Hills)</option>
                <option value="Goa">Goa (Coast & Spice)</option>
                <option value="Jaipur">Jaipur (Royal Heritage)</option>
                <option value="Kerala">Alleppey (Backwaters)</option>
                <option value="Himachal">Manali / Tirthan (Mountains)</option>
              </select>
            </div>

            {/* Dates & Duration */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-rose-500" /> Travel Dates
              </label>
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                placeholder="e.g. 10–14 Dec 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* Budget */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <IndianRupee className="w-3 h-3 text-rose-500" /> Budget (INR)
                </label>
                <span className="text-xs font-bold text-rose-600">
                  ₹{budget.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                step="2500"
                min="10000"
                max="200000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            {/* Party Composition */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Users className="w-3 h-3 text-rose-500" /> Party Composition
              </label>
              <input
                type="text"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                placeholder="Family with 2 kids / Couple / Solo"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>
          </div>

          {/* Quick Plan Execution Button */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] text-slate-500">
              * Personalization active: {partySize.toLowerCase().includes('kid') ? 'Kid-friendly safety weighted & night filters on' : partySize.toLowerCase().includes('couple') ? 'Romantic dining reservation included' : 'Offbeat review cap (<1000 reviews)'}.
            </span>
            <button
              onClick={handleQuickPlan}
              disabled={isProcessing}
              type="button"
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Catalogue Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Generate Itinerary & Save to Firestore</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* UI REQUIREMENT: Left-side chat bubble for assistant, Right-side for user */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Conversational Planning Chat
            </span>
            <span className="text-[11px] text-slate-500">
              {messages.length} messages
            </span>
          </div>

          <div
            ref={chatContainerRef}
            className="p-6 space-y-4 max-h-[360px] overflow-y-auto bg-slate-50/40"
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Left-side bubble for assistant */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shrink-0 shadow-xs text-xs font-bold mt-0.5">
                      MMT
                    </div>
                  )}

                  <div
                    className={`max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-rose-600 text-white rounded-tr-none shadow-xs font-medium'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{m.text}</div>
                    <div
                      className={`text-[10px] mt-1.5 ${
                        isUser ? 'text-rose-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {m.timestamp}
                    </div>
                  </div>

                  {/* Right-side bubble for user */}
                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 shadow-xs text-xs font-bold mt-0.5">
                      {user?.displayName?.[0] || 'U'}
                    </div>
                  )}
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 flex items-center justify-center text-white shrink-0 shadow-xs text-xs font-bold">
                  MMT
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-600 shadow-xs flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
                  <span>Synthesizing itinerary against verified catalogue...</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a question or adjust preferences (e.g. 'Can we do 5 days in Munnar for 80,000 INR?')..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="bg-rose-600 hover:bg-rose-700 text-white p-2.5 rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* UI REQUIREMENT: Itinerary renders below the chat once complete */}
        {activeRecord && (
          <div className="mt-2">
            <ItineraryCardView
              record={activeRecord}
              onRegenerateDay={handleRegenerateDay}
              regeneratingDay={regeneratingDay}
            />
          </div>
        )}

        {/* 'Past Trips' Section fetching from 'itineraries' Firestore collection */}
        <div ref={pastTripsRef} className="mt-4">
          <PastTripsSection
            uid={user!.uid}
            onSelectTrip={handleSelectPastTrip}
            activeTripId={activeRecord?.id}
            refreshKey={refreshTripsKey}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-slate-200 bg-white text-center text-xs text-slate-400">
        <p>MMT Trip Assistant • Firebase Auth & Firestore (`userProfiles`, `itineraries`).</p>
        <p className="text-[11px] mt-1 text-slate-400">
          Strict Anti-Bias Pipeline: Hard Budget Ceiling • 30%+ Offbeat Ratio • 40% Review Cap • Curated Catalog Confinement
        </p>
      </footer>
    </div>
  );
};
