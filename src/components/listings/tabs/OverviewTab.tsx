"use client";

interface OverviewTabProps {
  description: string;
  highlights: string[];
  included: string[];
  sessionLength: string;
}

export function OverviewTab({
  description,
  highlights,
  included,
  sessionLength,
}: OverviewTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-700">{description}</p>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Highlights</h3>
          <ul className="list-disc pl-5 space-y-2">
            {highlights.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">What&apos;s Included</h3>
          <ul className="list-disc pl-5 space-y-2">
            {included.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Session Length</h3>
          <p className="text-gray-700">{sessionLength}</p>
        </div>
      </div>
    </div>
  );
}
