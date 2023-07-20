import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { RefObject, useRef, useState } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import SlideItem from './SlideItem'
import PrimaryButton from './buttons/PrimaryButton';
import SecondaryButton from './buttons/SecondaryButton';
import metrics from '../utils/metrics';
import { RootStackAuthParamList } from '../navigators/StackAuth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
const { width, height } = Dimensions.get('window');

interface SliderProps {
  dataSlider:Array<{
    id : number,
    title : string,
    subtitle :string,
    img : string,
  }>;
}

interface FooterSlideProps {
  dataSlider:Array<{
    id : number,
    title : string,
    subtitle :string,
    img : string,
  }>;
  goToNextSlideCallback: Function;
  currentSlideIndex: number;
}
type initialScreenProp = StackNavigationProp<
  RootStackAuthParamList,
  'InitialScreen'
>;

const Slider = ({ dataSlider } : SliderProps) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef<FlatList>(null);
   const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != dataSlider.length) {
      const offset = nextSlideIndex * width;
      ref.current != null && ref.current.scrollToOffset({ offset });
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };



  return (
    <View style={styles.mainContainer}>
       <View
        style={styles.IndicatorContainer}>
        {/* Render indicator */}
        {dataSlider.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              currentSlideIndex == index && {
                backgroundColor: '#000',
                width: 25,
              },
            ]}
          />
        ))}
      </View>
      <FlatList
        ref={ref}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        scrollEnabled={false}
        data={dataSlider}
        renderItem={({ item }) => <SlideItem id={item.id} title={item.title} subtitle={item.subtitle} img={item.img} />}
      />

      <FooterSlide currentSlideIndex={currentSlideIndex}  goToNextSlideCallback={goToNextSlide} dataSlider={dataSlider} />

    </View>
  )
}

const FooterSlide = ({ goToNextSlideCallback, dataSlider,currentSlideIndex } : FooterSlideProps) => {
  const navigation = useNavigation<initialScreenProp>();

  return (
    <View
      style={styles.footerContainer}>
      {/* Indicator container */}
    
      {/* Render buttons */}
      <View>
        {currentSlideIndex == dataSlider.length - 1 ? (
          <View style={styles.finalButtonContainer}>
            <PrimaryButton text={'Let’s begin'} accion={() => navigation.navigate('LoginAndSign', { action: 'login' })} />
            <View style={styles.containerText}>
              <Text>Already have  an account?</Text>
              <Text style={styles.login} onPress={() => navigation.navigate('LoginAndSign', { action: 'login' })}>Log in</Text>
            </View>
          </View>
        ) : (
          <View style={styles.regularButtonsContainer}>
            <SecondaryButton text={'Skip'} double accion={() => navigation.navigate('LoginAndSign', { action: 'login' })} disabled={false} />
            <PrimaryButton text={'Next'} double accion={goToNextSlideCallback} />
          </View>
        )}
      </View>
    </View>

  );
};

export default Slider




const styles = StyleSheet.create({
  mainContainer:{ height: '100%',flexDirection:'column',justifyContent:'flex-end',alignItems:'center'},
  
  footerContainer:{
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width:metrics.width,
  },
  IndicatorContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 0,
    position:'absolute',
    top:metrics.height*0.48,
    zIndex:1
  },
  
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 6,
    marginHorizontal: 3,
    backgroundColor: '#ccc',
  },
  btn: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerText: {
    marginTop: 20,
    flexDirection: 'row',
    fontSize: 16
  },
  login: {
    paddingLeft: 15,
    fontSize: 16,
    fontWeight: '700'

  },
  finalButtonContainer: {  width: 350, alignItems: 'center', bottom: 80 },
  regularButtonsContainer:{ flexDirection: 'row', marginBottom: 30,width:'100%',alignItems:'center',justifyContent:'space-between',paddingHorizontal:24}
})