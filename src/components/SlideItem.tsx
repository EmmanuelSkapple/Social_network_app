import { StyleSheet, Text, View,Image,Dimensions } from 'react-native'
import React from 'react'
import PrimaryButton from './buttons/PrimaryButton'
import SecondaryButton from './buttons/SecondaryButton'
import metrics from '../utils/metrics'

interface sliderItemProps {
    id: number,
    title: string,
    subtitle: string,
    img: any
}
const {width,height}=Dimensions.get('screen')
const SlideItem = ({ id,title,subtitle,img }: sliderItemProps) => {
  console.log(title)
  return (
    <View style={styles.container}>
      <Image source={img} resizeMode='contain' style={styles.image}/>
      <View style={styles.containerText}>
        <Text numberOfLines={2} style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View>
      </View>
    </View>
  )
}

export default SlideItem

const styles = StyleSheet.create({
  container:{ width ,height:'90%',alignItems:'center',flexDirection:'column',justifyContent:'space-between',padding:25},
  image:{height: metrics.height*0.5, width:metrics.width*0.9,resizeMode:'contain',flex:2},
  containerText:{alignItems:'center',flex:0.7,paddingTop:50},
  title:{fontWeight:'700',fontSize:22,paddingTop:20, textAlign:'center'},
  subtitle:{fontWeight:'500',fontSize:16,color:'#1D1D1F',marginHorizontal:10,marginTop:30,textAlign:'center'}
})

