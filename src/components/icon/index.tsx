import { SvgIconProps } from '@mui/material';

interface IconProps extends SvgIconProps {
  icon: React.ElementType;
}

export const Icon = ({ icon: IconComponent, ...props }: IconProps) => {
  return <IconComponent {...props} />;
};
