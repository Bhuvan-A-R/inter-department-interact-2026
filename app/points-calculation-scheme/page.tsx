import React from 'react';

const pointTiers = [
  {
    title: "Solo Event",
    subtitle: "Single participant",
    participation: 5,
    podium: {
      first: 5,
      second: 3,
      third: 1,
    },
  },
  {
    title: "Small Group Events",
    subtitle: "2 to 5 members",
    participation: 7,
    podium: {
      first: 7,
      second: 5,
      third: 3,
    },
  },
  {
    title: "Group Events",
    subtitle: "6+ members",
    participation: 10,
    podium: {
      first: 15,
      second: 10,
      third: 5,
    },
  },
];

const TrophyCard = ({ title, description, iconColor }: { title: string, description: string, iconColor: string }) => (
  <div className="rounded-2xl border border-gat-blue/10 bg-white/90 p-5 shadow-sm flex flex-col gap-2">
    <div className={`w-10 h-10 rounded-full ${iconColor} flex items-center justify-center text-xl`}>
      🏆
    </div>
    <h3 className="font-heading font-bold text-gat-midnight">{title}</h3>
    <p className="text-xs text-gat-steel leading-relaxed">
      {description}
    </p>
  </div>
);

export default function PointsCalculationSchemePage() {
  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-gat-blue/10 bg-white shadow-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(10,66,106,0.08),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(248,250,252,0.6),_rgba(250,250,250,0))]" />
          
          <div className="relative p-6 md:p-10">
            {/* Header Section */}
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.35em] text-gat-steel font-bold">
                Championship Scoring
              </p>
              <h1 className="text-3xl md:text-4xl font-heading font-black text-gat-midnight">
                Points Calculation Scheme
              </h1>
              <p className="text-sm md:text-base text-gat-steel max-w-3xl">
                Total points for each department are calculated based on three specific categories below. 
                {/* Winning points consist of <span className="font-bold text-gat-midnight text-blue-600">Participation Points + Podium Bonus</span>. */}
              </p>
            </div>

            {/* Trophy Logic Section */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <TrophyCard 
                title="Rally Trophy" 
                iconColor="bg-red-100"
                description="Awarded to the winner of the Rally. These winning points are also added to the cumulative Rolling Trophy tally."
              />
              <TrophyCard 
                title="Rolling Trophy" 
                iconColor="bg-yellow-100"
                description="The ultimate championship prize. It includes points from every event podium finish and Rally points."
              />
              <TrophyCard 
                title="Participation Trophy" 
                iconColor="bg-blue-100"
                description="Awarded to the department with the highest level of engagement across all events throughout the fest."
              />
            </div>

            {/* Points Table Section */}
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {pointTiers.map((tier) => (
                <div
                  key={tier.title}
                  className="rounded-2xl border border-gat-blue/10 bg-white/90 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-heading font-bold text-gat-midnight">
                        {tier.title}
                      </h2>
                      <p className="text-xs text-gat-steel">{tier.subtitle}</p>
                    </div>
                    <div className="rounded-full bg-gat-blue/10 px-3 py-1 text-xs font-bold text-gat-blue">
                      Entry: +{tier.participation}
                    </div>
                  </div>

                  {/* <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-yellow-300/40 bg-gradient-to-r from-yellow-50 to-amber-50 p-3">
                      <span className="font-bold text-gat-midnight">1st Place</span>
                      <span className="font-mono font-black text-amber-700">
                        {tier.podium.first + tier.participation}
                        <span className="text-[10px] text-gat-steel ml-1">
                          ({tier.participation}+{tier.podium.first})
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-gray-300/40 bg-gradient-to-r from-gray-50 to-slate-50 p-3">
                      <span className="font-bold text-gat-midnight">2nd Place</span>
                      <span className="font-mono font-black text-slate-600">
                        {tier.podium.second + tier.participation}
                        <span className="text-[10px] text-gat-steel ml-1">
                          ({tier.participation}+{tier.podium.second})
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-orange-300/40 bg-gradient-to-r from-orange-50 to-amber-50/50 p-3">
                      <span className="font-bold text-gat-midnight">3rd Place</span>
                      <span className="font-mono font-black text-orange-700">
                        {tier.podium.third + tier.participation}
                        <span className="text-[10px] text-gat-steel ml-1">
                          ({tier.participation}+{tier.podium.third})
                        </span>
                      </span>
                    </div>
                  </div> */}
                </div>
              ))}
            </div>

            {/* Summary Rules */}
            <div className="mt-8 rounded-2xl border border-gat-blue/10 bg-white p-5 shadow-sm">
              <h3 className="text-base font-heading font-bold text-gat-midnight">
                Scoring Guidelines
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-gat-steel">
                <li>
                  <span className="font-semibold text-gat-midnight">Rolling Trophy Calculation:</span> (Sum of all Podium Bonuses) + (Rally Winning Points).
                </li>
                <li>
                  <span className="font-semibold text-gat-midnight">Participation Trophy Calculation:</span> Determined exclusively by the department with the highest total participation points across all solo and group tiers.
                </li>
                <li>
                  <span className="font-semibold text-gat-midnight">Event Points:</span> If no podium is secured, only the baseline participation points are credited to the department.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
