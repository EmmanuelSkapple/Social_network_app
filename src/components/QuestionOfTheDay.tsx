import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  QuestionOfTheDayProps,
} from '../../types/typesQuestions';
import { RootState } from '../redux/appReducer';
import Colors from '../utils/Colors';
import Images from '../utils/Images';
import Typography from './ui/Typography';

const screenWidth = Dimensions.get('window').width;


export default function QuestionOfTheDay({
  navigation,
  variant = 'white',
}: QuestionOfTheDayProps) {
  const [titleQuestion, settitleQuestion] = useState('')
  const dispatch = useDispatch();
  const leguage = useSelector(
    (state: RootState) => state.language.currentLanguage
  );
  const questionsOfDay = useSelector(
    (state: RootState) => state.questions.questionOfDay
  );
  const userData = useSelector((state: RootState) => state.user.userData);
  const asker = {id: 'matter-questions',name: questionsOfDay?.creatorID, photo:questionsOfDay?.photo};

useEffect(() => {
    questionsOfDay?.questionTitle && getTitle()
  }, [questionsOfDay])
  

  const getTitle = () => {
    switch (leguage) {
      case 'es':
        settitleQuestion(questionsOfDay.questionTitle.es)
        break;
      case 'en':
        settitleQuestion(questionsOfDay.questionTitle.en);
        break;
      default:
        settitleQuestion(questionsOfDay.questionTitle.en);
        break;
    }
  };

  const btnQuestion = () => {
    dispatch({
      type: 'setPostToUpdate',
      payload: {
        poster: {
          id: userData.uid,
          name: userData.firstname,
          photo: userData.photo,
        },
        status:'inQuestion',
        asker: { ...asker, idQuestion: questionsOfDay.id },
        ask: titleQuestion,
      },
    });
    navigation.navigate('CameraPost');
  };
 
  const colorTitle = variant == "blue"? Colors().white : Colors().text
  const colorBackground = variant == "blue"? Colors().BackgroundRectangleColor : Colors().CardRightRoundedBackground;
  const imageIcon = variant == "blue"?Images.logoNewGroupDark : Images.circleLogo;
  const textVariant = variant == "blue"?'b4': 'b3';
  const iconStyle = variant == "blue"?
  {
    height: 25,
    tintColor: Colors().BackgroundRectangleColor,
    width: 25,
  }:
  {
    backgroundColor:Colors().CardRightRoundedBackground,
    width: screenWidth / 7.8,
    height: screenWidth / 7.8,
    borderRadius: 100,
  } 

  return (
    <View style={styles().container}>
      <TouchableOpacity
        onPress={btnQuestion}
        style={[styles().rectangle, styles().row,{backgroundColor:colorBackground}]}>
        <View style={styles().rightContainer}>
          <View style={styles().iconContainer}>
            <Image source={imageIcon} style={[styles().logoIcon,iconStyle]} />
          </View>
          <View style={styles().middleText}>
            <Typography color={colorTitle} variant={textVariant}>
              {titleQuestion}
            </Typography>
            {variant == "blue" && (
              <Typography color={Colors().white} variant='b3'>
                #question of the day.
              </Typography>
            )}
          </View>
        </View>
        {variant == "blue" && (
          <View style={styles().rightText}>
           {questionsOfDay.usersWithAnswers &&
              <Typography color={Colors().white} variant='b1'>
              {questionsOfDay.usersWithAnswers.length>0?`+${questionsOfDay.usersWithAnswers.length}`:''}
            </Typography>
           }
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    rectangle: {
      alignItems: 'center',
      backgroundColor: Colors().CardRightRoundedBackground,
      borderBottomRightRadius: 10.5,
      borderRadius: 40,
      borderTopRightRadius: 10.5,
      height: 60,
      margin: 20,
      marginLeft: 10,
      width: '94%',
    },
    rightContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    middleText: {
      marginLeft: 14,
      width: '68%',
    },
    rightText: {
      marginRight: 22,
    },
    rightNumber: {
      fontSize: 23,
    },
    iconContainer: {
      alignItems: 'center',
      backgroundColor: Colors().white,
      borderRadius: 40,
      height: 52,
      justifyContent: 'center',
      width: 52,
      marginLeft: 4,
    },
    logoIcon: {
      resizeMode: 'contain',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
