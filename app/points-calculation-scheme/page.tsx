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

export default function PointsCalculationSchemePage() {
  return (
    <div className="min-h-screen bg-gat-off-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-gat-blue/10 bg-white shadow-card">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(10,66,106,0.08),_transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(248,250,252,0.6),_rgba(250,250,250,0))]" />
          <div className="relative p-6 md:p-10">
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-[0.35em] text-gat-steel font-bold">
                Department Points
              </p>
              <h1 className="text-3xl md:text-4xl font-heading font-black text-gat-midnight">
                Points Calculation Scheme
              </h1>
              <p className="text-sm md:text-base text-gat-steel max-w-3xl">
                Total points for an event are calculated as:
                <span className="font-bold text-gat-midnight">
                  {" "}
                  Participation Points + Placement Bonus
                </span>
                . Each event type has a fixed participation value, then adds the
                podium bonus for 1st/2nd/3rd place.
              </p>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
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
                      Participation = {tier.participation}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-yellow-300/40 bg-gradient-to-r from-yellow-50 to-amber-50 p-3">
                      <span className="font-bold text-gat-midnight">
                        1st Place
                      </span>
                      <span className="font-mono font-black text-amber-700">
                        {tier.podium.first + tier.participation}
                        <span className="text-xs text-gat-steel">
                          {" "}
                          ({tier.participation}+{tier.podium.first})
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-gray-300/40 bg-gradient-to-r from-gray-50 to-slate-50 p-3">
                      <span className="font-bold text-gat-midnight">
                        2nd Place
                      </span>
                      <span className="font-mono font-black text-slate-600">
                        {tier.podium.second + tier.participation}
                        <span className="text-xs text-gat-steel">
                          {" "}
                          ({tier.participation}+{tier.podium.second})
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-orange-300/40 bg-gradient-to-r from-orange-50 to-amber-50/50 p-3">
                      <span className="font-bold text-gat-midnight">
                        3rd Place
                      </span>
                      <span className="font-mono font-black text-orange-700">
                        {tier.podium.third + tier.participation}
                        <span className="text-xs text-gat-steel">
                          {" "}
                          ({tier.participation}+{tier.podium.third})
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-gat-blue/10 bg-gat-off-white p-3 text-xs text-gat-steel">
                    Example: Participation = {tier.participation} + 1st place
                    bonus = {tier.podium.first} =
                    <span className="font-bold text-gat-midnight">
                      {" "}
                      {tier.participation + tier.podium.first} points
                    </span>
                    .
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-gat-blue/10 bg-white p-5 shadow-sm">
              <h3 className="text-base font-heading font-bold text-gat-midnight">
                Notes
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-gat-steel">
                <li>
                  Participation points are awarded to all participating teams in
                  that event.
                </li>
                <li>
                  Placement bonus is added only for 1st, 2nd, or 3rd place
                  finishers.
                </li>
                <li>
                  If an event has no podium finish, only participation points
                  apply.
                </li>
                <li>
                  All these points will be added to your department for getting the participation trophy.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
