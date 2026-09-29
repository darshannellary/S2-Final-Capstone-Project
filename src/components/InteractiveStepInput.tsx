import React, { useState } from 'react';
import { TripPreferences } from '../types/trip';
import { CURATED_DESTINATIONS } from '../data/curatedCatalog';
import { 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Users, 
  Compass, 
  Sparkles, 
  Check, 
  Flame, 
  Palmtree, 
  Landmark, 
  Utensils, 
  Mountain,
  Baby,
  Smile
} from 'lucide-react';

interface InteractiveStepInputProps {
  step: string;
  preferences: TripPreferences;
  onUpdatePreferences: (updates: Partial<TripPreferences>) => void;
  onSubmitStep: (userResponseText: string) => void;
  isProcessing: boolean;
}

export const InteractiveStepInput: React.FC<InteractiveStepInputProps> = ({
  step,
  preferences,
  onUpdatePreferences,
  onSubmitStep,
  isProcessing
}) => {
  const [tempBudget, setTempBudget] = useState(preferences.totalBudgetINR || 45000);
  const [selectedInterests, setSelectedInterests] = useState<('adventure' | 'relaxation' | 'culture' | 'food' | 'nature')[]>(
    preferences.interests.length > 0 ? preferences.interests : ['culture', 'food']
  );
  const [travellerType, setTravellerType] = useState(preferences.travellerComposition.type || 'couple');
  const [adultsCount, setAdultsCount] = useState(preferences.travellerComposition.adults || 2);
  const [hasKids, setHasKids] = useState(preferences.travellerComposition.hasKids || false);
  const [hasSeniors, setHasSeniors] = useState(preferences.travellerComposition.hasSeniors || false);

  // 1. Destination Step
  if (step === 'destination') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-500" />
          Choose Curated Destination
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {Object.entries(CURATED_DESTINATIONS).map(([key, dest]) => {
            const isSelected = preferences.destination === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onUpdatePreferences({ destination: key });
                  onSubmitStep(`I want to explore ${key}`);
                }}
                disabled={isProcessing}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer group ${
                  isSelected 
                    ? 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-500/20' 
                    : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50'
                }`}
              >
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  className="w-14 h-14 rounded-lg object-cover shrink-0 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors">
                      {dest.name}
                    </span>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-100/70 px-1.5 py-0.5 rounded">
                      {dest.state}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {dest.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. Dates Step
  if (step === 'dates') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-rose-500" />
          Select Trip Duration
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { days: 2, label: 'Weekend Getaway (2 Days)', tag: 'Quick Trip' },
            { days: 3, label: 'Long Weekend (3 Days)', tag: 'Most Popular' },
            { days: 4, label: 'Relaxed Holiday (4 Days)', tag: 'Deep Explore' },
            { days: 5, label: 'Grand Tour (5 Days)', tag: 'Immersive' }
          ].map((option) => (
            <button
              key={option.days}
              type="button"
              disabled={isProcessing}
              onClick={() => {
                const start = '2026-10-15';
                const end = `2026-10-${15 + option.days}`;
                onUpdatePreferences({
                  startDate: start,
                  endDate: end,
                  durationDays: option.days
                });
                onSubmitStep(`${option.days} Days (${option.label})`);
              }}
              className="p-3 border border-slate-200 hover:border-rose-400 hover:bg-rose-50/40 rounded-xl text-center transition-all cursor-pointer group"
            >
              <div className="text-lg font-black text-slate-800 group-hover:text-rose-600">
                {option.days} Days
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                {option.tag}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 3. Budget Step
  if (step === 'budget') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-rose-500" />
            Set Total Trip Budget (INR)
          </div>
          <div className="text-lg font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-xl border border-rose-200">
            ₹{tempBudget.toLocaleString('en-IN')}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          * Hard budget ceiling filter: The app will strictly filter candidate hotels and activities before ranking to guarantee you stay within this amount.
        </p>

        <input
          type="range"
          min={10000}
          max={150000}
          step={2500}
          value={tempBudget}
          onChange={(e) => setTempBudget(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
        />

        <div className="flex justify-between text-[11px] text-slate-400 font-medium">
          <span>₹10,000 (Backpacker)</span>
          <span>₹50,000 (Comfort)</span>
          <span>₹1,50,000 (Luxury)</span>
        </div>

        <div className="flex gap-2 pt-1">
          {[25000, 45000, 75000, 100000].map((quick) => (
            <button
              key={quick}
              type="button"
              onClick={() => setTempBudget(quick)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                tempBudget === quick
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              ₹{(quick / 1000)}k
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => {
            onUpdatePreferences({ totalBudgetINR: tempBudget });
            onSubmitStep(`My total budget is ₹${tempBudget.toLocaleString('en-IN')}`);
          }}
          className="w-full bg-slate-900 hover:bg-rose-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          Confirm Budget: ₹{tempBudget.toLocaleString('en-IN')}
        </button>
      </div>
    );
  }

  // 4. Travellers Step
  if (step === 'travellers') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-rose-500" />
          Traveller Composition
        </div>

        {/* Group Type */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'solo', label: 'Solo', adults: 1, icon: '🎒' },
            { id: 'couple', label: 'Couple', adults: 2, icon: '💑' },
            { id: 'family', label: 'Family', adults: 3, icon: '👨‍👩‍👧' },
            { id: 'group', label: 'Friends', adults: 4, icon: '🎉' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTravellerType(item.id as any);
                setAdultsCount(item.adults);
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                travellerType === item.id
                  ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold ring-1 ring-rose-500'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-medium'
              }`}
            >
              <div className="text-xl mb-1">{item.icon}</div>
              <div className="text-xs">{item.label}</div>
            </button>
          ))}
        </div>

        {/* Special needs flags: Kids & Seniors */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2.5">
          <div className="text-xs font-semibold text-slate-700">Any special companions?</div>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasKids}
                onChange={(e) => setHasKids(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <Baby className="w-4 h-4 text-amber-500" />
              <span>Travelling with Kids (under 12)</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasSeniors}
                onChange={(e) => setHasSeniors(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <Smile className="w-4 h-4 text-emerald-500" />
              <span>Senior Citizens in party</span>
            </label>
          </div>
        </div>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => {
            const comp = {
              type: travellerType as any,
              adults: adultsCount,
              hasKids,
              hasSeniors,
              kidsCount: hasKids ? 1 : 0,
              seniorsCount: hasSeniors ? 1 : 0
            };
            onUpdatePreferences({ travellerComposition: comp });
            let desc = `${travellerType.toUpperCase()} (${adultsCount} adults)`;
            if (hasKids) desc += ' + Kids';
            if (hasSeniors) desc += ' + Seniors';
            onSubmitStep(desc);
          }}
          className="w-full bg-slate-900 hover:bg-rose-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm cursor-pointer shadow-sm"
        >
          Confirm Travellers
        </button>
      </div>
    );
  }

  // 5. Interests Step
  if (step === 'interests') {
    const interestList: { id: 'adventure' | 'relaxation' | 'culture' | 'food' | 'nature'; label: string; icon: any }[] = [
      { id: 'culture', label: 'Culture & Heritage', icon: Landmark },
      { id: 'food', label: 'Local Food & Flavors', icon: Utensils },
      { id: 'nature', label: 'Nature & Scenic', icon: Palmtree },
      { id: 'relaxation', label: 'Relaxation & Wellness', icon: Smile },
      { id: 'adventure', label: 'Adventure & Trails', icon: Mountain }
    ];

    const toggleInterest = (id: any) => {
      if (selectedInterests.includes(id)) {
        if (selectedInterests.length > 1) {
          setSelectedInterests(selectedInterests.filter(i => i !== id));
        }
      } else {
        setSelectedInterests([...selectedInterests, id]);
      }
    };

    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-rose-500" />
          Select Trip Interests (Pick at least 1)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {interestList.map(({ id, label, icon: Icon }) => {
            const active = selectedInterests.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleInterest(id)}
                className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-all cursor-pointer ${
                  active
                    ? 'border-rose-500 bg-rose-50/80 text-rose-800 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg ${active ? 'bg-rose-200/60 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs">{label}</span>
                {active && <Check className="w-4 h-4 text-rose-600 ml-auto" />}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => {
            onUpdatePreferences({ interests: selectedInterests });
            onSubmitStep(`Selected Interests: ${selectedInterests.join(', ')}`);
          }}
          className="w-full bg-slate-900 hover:bg-rose-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm cursor-pointer shadow-sm"
        >
          Confirm Interests ({selectedInterests.length} selected)
        </button>
      </div>
    );
  }

  // 6. Mode & Anti-Bias Tuning Step
  if (step === 'mode') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          Curation Style (Anti-Bias Strategy)
        </div>

        <div className="space-y-2">
          {[
            {
              id: 'offbeat',
              title: 'Offbeat & Hidden Gems (30%+ lesser-known)',
              desc: 'Prioritizes uncrowded heritage stays, local artisan workshops, and secret scenic viewpoints.',
              badge: 'Anti-Overcrowding'
            },
            {
              id: 'surprise_me',
              title: 'Surprise Me! (Adventurous mix)',
              desc: 'High variety mix with capped famous landmarks (max 40%) and off-the-beaten-path experiences.',
              badge: 'Curator Recommended'
            },
            {
              id: 'standard',
              title: 'Balanced Classic (Authentic Blend)',
              desc: 'A steady combination of must-visit cultural touchstones and relaxing stays within your budget ceiling.',
              badge: 'Balanced'
            }
          ].map((modeOption) => (
            <button
              key={modeOption.id}
              type="button"
              disabled={isProcessing}
              onClick={() => {
                onUpdatePreferences({ mode: modeOption.id as any });
                onSubmitStep(modeOption.title);
              }}
              className="w-full p-3 border border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-slate-800 group-hover:text-rose-600">
                  {modeOption.title}
                </span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  {modeOption.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {modeOption.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 7. Summary Confirmation
  if (step === 'summary_confirm') {
    return (
      <div className="bg-white border-2 border-rose-200 rounded-2xl p-4 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600" />
            Ready to Generate Unbiased Itinerary
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Firestore Sync Ready
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 block font-medium">Destination</span>
            <span className="font-bold text-slate-800">{preferences.destination}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 block font-medium">Duration</span>
            <span className="font-bold text-slate-800">{preferences.durationDays} Days</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 block font-medium">Hard Budget Ceiling</span>
            <span className="font-bold text-rose-600">₹{preferences.totalBudgetINR.toLocaleString('en-IN')}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-slate-400 block font-medium">Travellers</span>
            <span className="font-bold text-slate-800 capitalize">
              {preferences.travellerComposition.type}
              {preferences.travellerComposition.hasKids ? ' + Kids' : ''}
            </span>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-800 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Anti-Bias Guarantee Active
          </div>
          <p className="text-[11px] leading-relaxed text-amber-700">
            Hotels & activities are restricted to our verified catalog. Capped at max 40% mass-reviewed spots, min 30% offbeat gems, and 100% budget compliance.
          </p>
        </div>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => onSubmitStep('Generate My Custom Itinerary')}
          className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Tailored Itinerary...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate My Tailored Itinerary Now</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return null;
};
