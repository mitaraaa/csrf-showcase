import { Card } from "@radix-ui/themes";
import classNames from "classnames";
import { LucideProps } from "lucide-react";
import { ElementType } from "react";

const InfoCard = ({ value, label, Icon, size }: InfoCardProps): JSX.Element => {
  const sizeClass =
    size === 3 ? "w-[600px]" : size === 2 ? "w-[396px]" : "w-[192px]";

  return (
    <Card
      className={classNames("flex flex-col items-end justify-end", sizeClass)}
    >
      <span className="text-2xl font-semibold opacity-90">{value}</span>
      <span className="text-sm opacity-70">{label}</span>
      <Icon
        size={72}
        className="absolute opacity-10 right-[-16px] bottom-[-16px]"
      />
    </Card>
  );
};

interface InfoCardProps {
  value: string;
  label: string;
  Icon: ElementType<LucideProps>;
  size?: 1 | 2 | 3;
}

export default InfoCard;
