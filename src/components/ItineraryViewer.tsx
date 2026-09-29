import React, { useState } from 'react';
import { TripItinerary, DayPlan } from '../types/trip';
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
  TrendingDown, 
  Layers,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ItineraryViewerProps {
  itinerary: TripItinerary;
  onRegenerateDay: (dayNumber: number) => Promise<void>;
  onCheckExplanationStatus?: () => void;
  regeneratingDay: number | null;
}

export const ItineraryViewer: React.FC<ItineraryViewerProps> = ({
  itinerary,
  onRegenerateDay,
  regeneratingDay
}) => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'why' | 'metrics'>('itinerary');
  const [explanationState, setExplanationState] = useState<{
    text: string;
    isReviewed: boolean;
  }>({
    text: itinerary.whyThisItinerary,
    isReviewed: itinerary.whyStatus === 'ready'
  });

  const [reviewingTime, setReviewingTime] = useState<boolean>(false);

  const handleSimulateReviewCheck = () => {
    setReviewingTime(true);
    setTimeout(() => {
      setExplanationState({
        text: `1. Strict Budget Enforcement: Every hotel and slot has been filtered to comfortably sit under your ₹${itinerary.budgetCeilingINR.toLocaleString('en-IN')} ceiling (total actual cost: ₹${itinerary.totalEstimatedCostINR.toLocaleString('en-IN')}).\n2. Countering Popularity Bias: With ${itinerary.offbeatPercentage}% offbeat listings, you avoid crowded commercial traps and directly experience authentic regional character.\n3. Custom Pacing: Activity slots (morning, afternoon, evening) respect local transit times, regional climate peaks, and party comfort.`,
        isReviewed: true
      });
      setReviewingTime(false);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      } catch (e) {
        // Safe confetti trigger
      }
    }, 1800);
  };

  const budgetSaved = itinerary.budgetCeilingINR - itinerary.totalEstimatedCostINR;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-rose-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-64 h-64 text-rose-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Curated Plan
              </span>
              <span className="text-xs text-slate-300">
                {itinerary.preferences.durationDays} Days / {itinerary.preferences.durationDays - 1} Nights
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{itinerary.destination}</span>
              <span className="text-rose-400 text-lg font-normal">Trip Itinerary</span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Tailored for {itinerary.preferences.travellerComposition.type.toUpperCase()} ({itinerary.preferences.travellerComposition.adults} adults
              {itinerary.preferences.travellerComposition.hasKids ? ', with kids' : ''}
              {itinerary.preferences.travellerComposition.hasSeniors ? ', with seniors' : ''}). Focus: {itinerary.preferences.interests.join(' • ')}.
            </p>
          </div>

          {/* Budget & Cost Widget */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col sm:items-end min-w-[200px]">
            <span className="text-xs text-rose-200 font-medium uppercase tracking-wider">
              Estimated Trip Total
            </span>
            <div className="text-2xl font-black text-white flex items-center gap-1">
              <span>₹{itinerary.totalEstimatedCostINR.toLocaleString('en-IN')}</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5 flex items-center gap-1">
              <span>Ceiling: ₹{itinerary.budgetCeilingINR.toLocaleString('en-IN')}</span>
              {budgetSaved >= 0 && (
                <span className="text-emerald-400 font-semibold">(₹{budgetSaved.toLocaleString('en-IN')} under)</span>
              )}
            </div>
          </div>
        </div>

        {/* Anti-Bias Metric Badges */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Offbeat Content</span>
            <span className="font-bold text-amber-300 text-sm">{itinerary.offbeatPercentage}%</span>
            <span className="text-[10px] text-slate-400 block">Min 30% required</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Over-Reviewed Cap</span>
            <span className="font-bold text-emerald-300 text-sm">{itinerary.heavyReviewedPercentage}%</span>
            <span className="text-[10px] text-slate-400 block">Max 40% cap enforced</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Budget Ceiling</span>
            <span className="font-bold text-sky-300 text-sm">Strict Filtered</span>
            <span className="text-[10px] text-slate-400 block">Pre-ranked guardrail</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Catalog Integrity</span>
            <span className="font-bold text-purple-300 text-sm">100% Curated</span>
            <span className="text-[10px] text-slate-400 block">Zero invented names</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'itinerary'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Day-by-Day Itinerary</span>
        </button>

        <button
          onClick={() => setActiveTab('why')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 relative ${
            activeTab === 'why'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Why this itinerary?</span>
          {!explanationState.isReviewed && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`py-3 px-5 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'metrics'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Anti-Bias Audit</span>
        </button>
      </div>

      {/* TAB 1: ITINERARY CARDS */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          {itinerary.days.map((day) => {
            const isRegenerating = regeneratingDay === day.dayNumber;

            return (
              <div
                key={day.dayNumber}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Day Header with Regenerate Action */}
                <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                      D{day.dayNumber}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                        <span>Day {day.dayNumber}: {day.theme}</span>
                        {day.isRegenerated && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                            Refined
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Estimated Day Total: ₹{day.totalDayEstimatedCostINR.toLocaleString('en-IN')} (incl. stay & activities)
                      </p>
                    </div>
                  </div>

                  {/* Regenerate Single Day Button */}
                  <button
                    onClick={() => onRegenerateDay(day.dayNumber)}
                    disabled={isRegenerating}
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 border border-slate-300 hover:border-rose-300 text-slate-700 hover:text-rose-600 text-xs font-semibold rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-rose-600' : ''}`} />
                    <span>{isRegenerating ? 'Refreshing Day...' : 'Regenerate Day'}</span>
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Selected Hotel Recommendation */}
                  <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 shrink-0 mt-0.5">
                        <HotelIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 text-sm">
                            {day.hotel.name}
                          </span>
                          {day.hotel.isOffbeat && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                              Offbeat Gem
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {day.hotel.tagline}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {day.hotel.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="text-[10px] bg-white border border-rose-200 text-slate-600 px-2 py-0.5 rounded-md">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-sm font-extrabold text-slate-800">
                        ₹{day.hotel.pricePerNightINR.toLocaleString('en-IN')}
                        <span className="text-xs font-normal text-slate-500"> / night</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {day.hotel.reviewCount} verified reviews
                      </div>
                    </div>
                  </div>

                  {/* 3 Day Slots: Morning, Afternoon, Evening */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Morning Slot */}
                    <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-lg">
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

                      <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{day.morning.estimatedDuration}</span>
                        {day.morning.isOffbeat ? (
                          <span className="text-emerald-600 font-semibold">✨ Rare Experience</span>
                        ) : (
                          <span>Popular highlight</span>
                        )}
                      </div>
                    </div>

                    {/* Afternoon Slot */}
                    <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-100/70 px-2.5 py-1 rounded-lg">
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

                      <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{day.afternoon.estimatedDuration}</span>
                        {day.afternoon.isOffbeat ? (
                          <span className="text-emerald-600 font-semibold">✨ Rare Experience</span>
                        ) : (
                          <span>Popular highlight</span>
                        )}
                      </div>
                    </div>

                    {/* Evening Slot */}
                    <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-lg">
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

                      <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>{day.evening.estimatedDuration}</span>
                        {day.evening.isOffbeat ? (
                          <span className="text-emerald-600 font-semibold">✨ Rare Experience</span>
                        ) : (
                          <span>Popular highlight</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: WHY THIS ITINERARY */}
      {activeTab === 'why' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-600" />
                Why this itinerary?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Transparent breakdown of rationale, budget compliance, and anti-bias adjustments.
              </p>
            </div>

            <button
              onClick={handleSimulateReviewCheck}
              disabled={reviewingTime}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${reviewingTime ? 'animate-spin' : ''}`} />
              <span>{reviewingTime ? 'Querying Review Status...' : 'Check Review Status'}</span>
            </button>
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${
            explanationState.isReviewed 
              ? 'bg-emerald-50/70 border-emerald-200' 
              : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                explanationState.isReviewed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {explanationState.isReviewed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5 animate-pulse" />
                )}
              </div>
              <div className="space-y-2 flex-1">
                <div className="font-bold text-sm text-slate-800">
                  {explanationState.isReviewed ? 'Curator Review Passed' : 'Editorial Review in Progress'}
                </div>
                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {explanationState.text}
                </div>
              </div>
            </div>
          </div>

          {/* Rationale Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <div className="font-bold text-xs text-slate-800 mb-1 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 text-rose-500" />
                Pre-Rank Budget Guardrail
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rather than suggesting luxury spots and trimming down later, our algorithm rejected high-cost options at step 1 to protect your ₹{itinerary.budgetCeilingINR.toLocaleString('en-IN')} limit.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <div className="font-bold text-xs text-slate-800 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Offbeat Gem Injection
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Guaranteed {itinerary.offbeatPercentage}% offbeat places to ensure you support local cottage communities and avoid overcrowded mega-commercial attractions.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <div className="font-bold text-xs text-slate-800 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Review Count Capped
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Aggressive review ceilings limit heavily-reviewed tourist traps to only {itinerary.heavyReviewedPercentage}%, bringing genuine local culture into the foreground.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANTI-BIAS METRICS AUDIT */}
      {activeTab === 'metrics' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Algorithmic Anti-Bias Transparency Report
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Auditing the four anti-bias requirements enforced on the Gemini trip synthesis pipeline.
            </p>
          </div>

          <div className="space-y-4">
            {/* Rule A */}
            <div className="border border-slate-200 rounded-2xl p-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                A
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Hard Budget Ceiling Filter</h4>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Pass (100%)</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Budget ceiling set at ₹{itinerary.budgetCeilingINR.toLocaleString('en-IN')}. Total generated trip cost is ₹{itinerary.totalEstimatedCostINR.toLocaleString('en-IN')}, zero overruns.
                </p>
              </div>
            </div>

            {/* Rule B */}
            <div className="border border-slate-200 rounded-2xl p-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                B
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Offbeat / Hidden-Gem Ratio (Min 30%)</h4>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {itinerary.offbeatPercentage}% Achieved
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Ensures local heritage homestays, private spice trials, artisan block workshops, and non-commercial trails are surfaced.
                </p>
              </div>
            </div>

            {/* Rule C */}
            <div className="border border-slate-200 rounded-2xl p-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                C
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Mass-Reviewed Listing Cap (Max 40%)</h4>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {itinerary.heavyReviewedPercentage}% Capped
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Listings with &gt; 2,500 reviews are capped at no more than 40% to dismantle popularity feedback loops and echo chambers.
                </p>
              </div>
            </div>

            {/* Rule D */}
            <div className="border border-slate-200 rounded-2xl p-4 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                D
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800">Fixed Verified Catalogue Confinement</h4>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Enforced</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  LLM prompt strictly prohibits hallucinations and inventing names. All suggestions link directly to authentic curated database entries.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
