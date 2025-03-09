interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => {
  return (
    <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">
          {title}
        </h2>
        <p className="mt-2 text-gray-600">
          {subtitle}
        </p>
      </div>
  );
};

export default SectionHeader;
