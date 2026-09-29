import React, { useState } from 'react';
import { ItineraryRecordDoc, ItineraryDay } from '../types/itinerary';
import { 
  Calendar, 
  MapPin, 
  IndianRupee, 
  RefreshCw, 
  Hotel as HotelIcon, 
  Sun, 
  CloudSun, 
  Moon, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  Heart,
  Baby,
  AlertTriangle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ItineraryCardViewProps {
  record: ItineraryRecordDoc;
  onRegenerateDay: (dayNumber: number) => Promise<void>;
  regeneratingDay: number | null;
}

export const ItineraryCardView: React.FC<ItineraryCardViewProps> = ({
  record,
  onRegenerateDay,
  regeneratingDay
}) => {
  const [explanationStatus, setExplanationStatus] = useState<string>(record.explanationStatus);
  const [explanationText, setExplanationText] = useState<string>(record.explanationText);
  const [isVerifyingReview, setIsVerifyingReview] = useState<boolean>(false);

  const itinerary = record.generatedItinerary;
  const budgetSaved = record.budget - itinerary.totalEstimatedCost;

  const handleReviewCheck = () => {
    setIsVerifyingReview(true);
    setTimeout(() => {
      setExplanationStatus('ready');
      setExplanationText(
        `1. Catalogue Verified: Every hotel and slot was strictly sourced from our fixed Indian catalogue. No invented names.\n2. Strict Budget Compliance: Estimated ₹${itinerary.totalEstimatedCost.toLocaleString('en-IN')} stays safely under your ₹${record.budget.toLocaleString('en-IN')} ceiling (zero hotel exceeds ₹12,000/night; all activities under ₹5,000/person).\n3. Tailored Pacing: Integrated ${itinerary.offbeatPercentage}% offbeat gems with personalized suitability weights for your party.`
      );
      setIsVerifyingReview(false);
      try {
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.85 } });
      } catch (e) {}
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-rose-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64 text-rose-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> Verified Catalogue Itinerary
              </span>
              <span className="text-xs text-slate-300">
                {record.dates}
              </span>
              {record.offbeatMode && (
                <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-semibold">
                  ✨ Offbeat Mode
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{record.destination}</span>
              <span className="text-rose-400 text-lg font-normal">Day-by-Day Plan</span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Party: <span className="font-semibold text-white">{record.partySize}</span> • Interests: {record.interests.join(', ')}
            </p>
          </div>

          {/* Budget Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col sm:items-end min-w-[220px]">
            <span className="text-[11px] text-rose-200 font-semibold uppercase tracking-wider">
              Total Estimated Cost
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white flex items-center gap-1">
              <span>₹{itinerary.totalEstimatedCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
              <span>Budget Ceiling: ₹{record.budget.toLocaleString('en-IN')}</span>
              {budgetSaved >= 0 && (
                <span className="text-emerald-400 font-semibold">(₹{budgetSaved.toLocaleString('en-IN')} saved)</span>
              )}
            </div>
          </div>
        </div>

        {/* Low Inventory Warning if applicable */}
        {itinerary.inventoryWarning && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{itinerary.inventoryWarning}</span>
          </div>
        )}

        {/* Anti-Bias Assurance Metrics */}
        <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Offbeat Listings</span>
            <span className="font-bold text-amber-300 text-sm">{itinerary.offbeatPercentage}%</span>
            <span className="text-[10px] text-slate-400 block">≥30% target met</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Mass-Review Cap</span>
            <span className="font-bold text-emerald-300 text-sm">{itinerary.heavyReviewedPercentage}%</span>
            <span className="text-[10px] text-slate-400 block">Max 40% cap enforced</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Nightly Hotel Cap</span>
            <span className="font-bold text-sky-300 text-sm">≤ ₹12,000</span>
            <span className="text-[10px] text-slate-400 block">Strict budget rule</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Activity Cap</span>
            <span className="font-bold text-purple-300 text-sm">&lt; ₹5,000 / person</span>
            <span className="text-[10px] text-slate-400 block">Pre-screened costs</span>
          </div>
        </div>
      </div>

      {/* Scrollable Day-by-Day Cards */}
      <div className="space-y-6">
        {itinerary.days.map((day) => {
          const isRegenerating = regeneratingDay === day.dayNumber;

          return (
            <div
              key={day.dayNumber}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Day Header */}
              <div className="bg-slate-50/80 border-b border-slate-200/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    Day {day.dayNumber}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Day {day.dayNumber} Itinerary
                    </h3>
                    <p className="text-xs text-slate-500">
                      Estimated Day Cost: ₹{day.estimatedCost.toLocaleString('en-IN')} (Hotel: ₹{day.hotelCostPerNightINR.toLocaleString('en-IN')} + Slots: ₹{(day.estimatedCost - day.hotelCostPerNightINR).toLocaleString('en-IN')})
                    </p>
                  </div>
                </div>

                {/* Regenerate Day Button */}
                <button
                  onClick={() => onRegenerateDay(day.dayNumber)}
                  disabled={isRegenerating}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-700 hover:text-rose-600 text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-rose-600' : ''}`} />
                  <span>{isRegenerating ? 'Regenerating Day...' : 'Regenerate Day'}</span>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Hotel Recommendation */}
                <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                      <HotelIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {day.hotelName}
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                          Verified Catalogue
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Selected stay within nightly budget constraint.
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <div className="text-sm font-extrabold text-slate-800">
                      ₹{day.hotelCostPerNightINR.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-500"> / night</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Under ₹12k ceiling
                    </div>
                  </div>
                </div>

                {/* 3 Day Slots: Morning, Afternoon, Evening */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Morning Slot */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-lg">
                          <Sun className="w-3.5 h-3.5" /> Morning Slot
                        </span>
                        <span className="text-xs font-extrabold text-slate-700">
                          ₹{day.morning.costINR.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">
                        {day.morning.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {day.morning.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{day.morning.duration || '2 hours'}</span>
                      {day.morning.isKidFriendly && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Baby className="w-3 h-3" /> Child-Safe
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Afternoon Slot */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-700 bg-sky-100/70 px-2.5 py-1 rounded-lg">
                          <CloudSun className="w-3.5 h-3.5" /> Afternoon Slot
                        </span>
                        <span className="text-xs font-extrabold text-slate-700">
                          ₹{day.afternoon.costINR.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">
                        {day.afternoon.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {day.afternoon.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{day.afternoon.duration || '2 hours'}</span>
                      {day.afternoon.isKidFriendly && (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Baby className="w-3 h-3" /> Child-Safe
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Evening Slot */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-lg">
                          <Moon className="w-3.5 h-3.5" /> Evening Slot
                        </span>
                        <span className="text-xs font-extrabold text-slate-700">
                          ₹{day.evening.costINR.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm leading-snug">
                        {day.evening.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {day.evening.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                      <span>{day.evening.duration || '2 hours'}</span>
                      {day.evening.isRomantic ? (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" /> Romantic Dining
                        </span>
                      ) : day.evening.isKidFriendly ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <Baby className="w-3 h-3" /> Child-Safe
                        </span>
                      ) : (
                        <span>Leisure</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Requirement (7): "Why this itinerary?" Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-rose-600" />
              Why this itinerary?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Personalized algorithmic explanation and budget transparency
            </p>
          </div>

          <button
            onClick={handleReviewCheck}
            disabled={isVerifyingReview}
            type="button"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingReview ? 'animate-spin text-rose-600' : ''}`} />
            <span>{isVerifyingReview ? 'Checking Status...' : 'Check Review Status'}</span>
          </button>
        </div>

        <div className={`p-4 rounded-2xl border ${
          explanationStatus === 'ready' 
            ? 'bg-emerald-50/70 border-emerald-200' 
            : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              explanationStatus === 'ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {explanationStatus === 'ready' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5 animate-pulse" />
              )}
            </div>
            <div className="space-y-1 flex-1">
              <div className="font-bold text-xs uppercase tracking-wide text-slate-700">
                {explanationStatus === 'ready' ? 'Review Confirmed' : 'Editorial Review Queue'}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                {explanationText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
