"use client";

interface ImportantInfoTabProps {
  exclusions: string[];
  additionalInfo: string[];
}

export function ImportantInfoTab({
  exclusions,
  additionalInfo,
}: ImportantInfoTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Important Information
        </h2>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Exclusions</h3>
          <ul className="list-disc pl-5 space-y-2">
            {exclusions.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">
            Additional Information
          </h3>
          <ul className="list-disc pl-5 space-y-2">
            {additionalInfo.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
