import Svg, { Path } from "react-native-svg";
import { MatterStampIconProps } from "../../../types/typesUI";


export default function MatterStampIcon({size, color, stroke}: MatterStampIconProps) {
  return (
    <Svg width={size} height={size} viewBox='0 0 28.449 28.449'>
      <Path
        stroke={color}
        d='M11.7,16.073l2.913,2.913,5.825-5.825M10.008,5.438a4.981,4.981,0,0,0,2.834-1.174,4.981,4.981,0,0,1,6.463,0,4.981,4.981,0,0,0,2.834,1.174,4.981,4.981,0,0,1,4.57,4.57,4.981,4.981,0,0,0,1.174,2.834,4.981,4.981,0,0,1,0,6.463,4.981,4.981,0,0,0-1.174,2.834,4.981,4.981,0,0,1-4.57,4.57A4.981,4.981,0,0,0,19.3,27.883a4.981,4.981,0,0,1-6.463,0,4.981,4.981,0,0,0-2.834-1.174,4.981,4.981,0,0,1-4.57-4.57A4.981,4.981,0,0,0,4.264,19.3a4.981,4.981,0,0,1,0-6.463,4.981,4.981,0,0,0,1.174-2.834,4.981,4.981,0,0,1,4.57-4.57Z'
        transform='translate(-1.849 -1.849)'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={stroke}
      />
    </Svg>
  );
}

MatterStampIcon.defaultProps = {
  size: 28.449,
  color: "#000",
  stroke: 2
};
