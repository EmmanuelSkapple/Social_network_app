import React, { useState } from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import metrics from '../utils/metrics';
import { Post } from './Post';
import PostVideoOrImage from './PostVideoOrImage';
import { CarouselProps } from '../../types/typesComponents';


const SLIDER_WIDTH = metrics.width ;

const CarouselCardItem = ({currentPostId,setCurrentPostId, item}: any) => {

  return (
    <Post currentPostId={currentPostId} setCurrentPostId={setCurrentPostId} key={item.id} postData={item}  />
  );
};

export const CarouselElements = ({
  arrayOfAnswers,
  refCarousel,
  setIndexCarousel,
}: CarouselProps) => {
  const [currentPostId, setCurrentPostId] = useState('')

  return (
    <SafeAreaView >
      <View style={styles.container}>
        <Carousel
          layout='tinder'
          ref={refCarousel}
          data={arrayOfAnswers}
          renderItem={({ item, index }) =>
            CarouselCardItem({ currentPostId,setCurrentPostId,item })
          }
          sliderWidth={SLIDER_WIDTH}
          itemWidth={SLIDER_WIDTH}
          onSnapToItem={(index) => setIndexCarousel(index)}
          removeClippedSubviews={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  image: {
    borderRadius: 12,
    height: 300,
    width: SLIDER_WIDTH,
  },
});
