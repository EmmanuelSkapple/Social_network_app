import { Pagination } from 'react-native-snap-carousel';
import Colors from '../utils/Colors';

type PaginationCarouselProps = {
  refCarousel: any;
  arrayLength: number;
  index: number;
};

export function PaginationCarousel({
  refCarousel,
  arrayLength,
  index,
}: PaginationCarouselProps) {
  return (
    <Pagination
      carouselRef={refCarousel}
      tappableDots={true}
      dotsLength={arrayLength}
      activeDotIndex={index}
      dotStyle={{
        width: 20,
        height: 3,
        marginHorizontal: 0,
        backgroundColor: '#E45975',
        borderRadius: 0,
      }}
      containerStyle={{
        paddingTop:10,
        paddingBottom:10,
      }}
      inactiveDotOpacity={1}
      inactiveDotScale={1}
      inactiveDotStyle={{ backgroundColor: Colors().placeholder }}
    />
  );
}
