import React, { useState, useEffect } from 'react';
import { ItineraryRecordDoc } from '../types/itinerary';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  History, 
  Calendar, 
  IndianRupee, 
  Users, 
  MapPin, 
  Trash2, 
  ArrowRight, 
  RefreshCw, 
  Sparkles, 
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PastTripsSectionProps {
  uid: string;
  onSelectTrip: (trip: ItineraryRecordDoc) => void;
  activeTripId?: string;
  refreshKey?: number;
}

export const PastTripsSection: React.FC<PastTripsSectionProps> = ({
  uid,
  onSelectTrip,
  activeTripId,
  refreshKey = 0
}) => {
  const [trips, setTrips] = useState<ItineraryRecordDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTrips = async () => {
    if (!uid) return;
    setLoading(true);
    setError(null);
    try {
      const itinerariesRef = collection(db, 'itineraries');
      // Query previous itinerary documents from the 'itineraries' Firestore collection using current user's UID
      const q = query(
        itinerariesRef,
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetched: ItineraryRecordDoc[] = [];
      querySnapshot.forEach((docSnap) => {
        fetched.push({ id: docSnap.id, ...docSnap.data() } as ItineraryRecordDoc);
      });
      setTrips(fetched);
    } catch (err: any) {
      console.warn('PastTrips query notice (e.g. index building or offline):', err);
      // Fallback query without orderBy if Firestore composite index is pending
      try {
        const fallbackQ = query(
          collection(db, 'itineraries'),
          where('uid', '==', uid)
        );
        const fallbackSnap = await getDocs(fallbackQ);
        const fetchedFallback: ItineraryRecordDoc[] = [];
        fallbackSnap.forEach((docSnap) => {
          fetchedFallback.push({ id: docSnap.id, ...docSnap.data() } as ItineraryRecordDoc);
        });
        fetchedFallback.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTrips(fetchedFallback);
      } catch (innerErr: any) {
        setError('Could not fetch past itineraries. Please check connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [uid, refreshKey]);

  const handleDeleteTrip = async (e: React.MouseEvent, tripId: string) => {
    e.stopPropagation();
    if (!window.confirm('Delete this saved itinerary from your account?')) return;
    setDeletingId(tripId);
    try {
      await deleteDoc(doc(db, 'itineraries', tripId));
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      console.error('Failed to delete itinerary:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <History className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Past Trips
            </h2>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full">
              {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'} Saved
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fetched live from your Firestore <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono text-slate-700">itineraries</code> collection (UID: {uid.slice(0, 8)}...)
          </p>
        </div>

        <button
          onClick={fetchTrips}
          disabled={loading}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-rose-600' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-10 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
          <div className="w-6 h-6 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
          <span className="text-xs font-medium">Fetching previous trip documents from Firestore...</span>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && trips.length === 0 && (
        <div className="py-10 px-4 rounded-2xl border-2 border-dashed border-slate-200 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">No Past Trips Found Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Use the interview controls above or type into the chat to generate your first itinerary and store it in Firestore.
          </p>
        </div>
      )}

      {/* Summary Cards Grid */}
      {!loading && trips.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => {
            const isSelected = activeTripId === trip.id;
            const daysCount = trip.generatedItinerary?.days?.length || 0;
            const formattedDate = trip.createdAt ? new Date(trip.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            }) : 'Saved';

            return (
              <div
                key={trip.id}
                onClick={() => onSelectTrip(trip)}
                className={`group relative rounded-2xl border p-4.5 transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-rose-500 bg-rose-50/50 shadow-sm ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:border-rose-300 hover:bg-slate-50/80 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top Row: Destination & Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {formattedDate}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base group-hover:text-rose-600 transition-colors flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{trip.destination}</span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      {trip.offbeatMode && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Offbeat
                        </span>
                      )}
                      <button
                        onClick={(e) => handleDeleteTrip(e, trip.id!)}
                        disabled={deletingId === trip.id}
                        title="Delete past trip"
                        className="p-1 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Dates & Party meta */}
                  <div className="space-y-1.5 my-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{trip.dates} ({daysCount} Days)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{trip.partySize}</span>
                    </div>
                  </div>

                  {/* Interests Pills */}
                  {trip.interests && trip.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {trip.interests.slice(0, 3).map((interest, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Row: Cost and Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Estimated Total</span>
                    <span className="text-sm font-extrabold text-slate-900 flex items-center gap-0.5">
                      ₹{trip.totalEstimatedCost ? trip.totalEstimatedCost.toLocaleString('en-IN') : '—'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-rose-600 group-hover:translate-x-0.5 transition-transform">
                    <span>{isSelected ? 'Viewing' : 'View Itinerary'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
