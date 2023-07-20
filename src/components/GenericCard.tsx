import React from 'react';
import {
  Text, View, StyleSheet, TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Colors from '../utils/Colors';

import { GenericCardProps } from '../../types/typesComponents';

export default function GenericCard({
  iconName,
  title,
  subTitle,
  notificationNumber = 0,
  notificationActive = false,
}: GenericCardProps) {
  return (
    <TouchableOpacity style={styles().card} onPress={() => null}>
      {notificationActive && notificationNumber >= 1 ? (
        <View style={styles().notification}>
          <Text style={styles().notificationText}>
            {notificationNumber > 9 ? '9+' : notificationNumber}
          </Text>
        </View>
      ) : notificationActive && notificationNumber === 0 ? (
        <View style={styles().notificationEmpty} />
      ) : null}
      <View>
        <Text style={styles().tittle}>{title}</Text>
        {subTitle && <Text style={styles().subTitle}>{subTitle}</Text>}
      </View>
      <View>
        {iconName && (
          <AntDesign name={iconName} color={Colors().text} size={20} />
        )}
      </View>
    </TouchableOpacity>
  );
}

GenericCard.defaultProps = {
  iconName: '',
  subTitle: '',
  notificationNumber: 0,
};

const styles = () => StyleSheet.create({
  card: {
    width: '95%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors().border,
    borderRadius: 8,
    marginTop: 15,
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notification: {
    backgroundColor: Colors().primary,
    borderRadius: 50,
    height: 20,
    width: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: -6,
    top: -6,
  },
  notificationEmpty: {
    backgroundColor: Colors().primary,
    borderRadius: 50,
    height: 6,
    width: 6,
    position: 'absolute',
    right: -3,
    top: -3,
  },
  notificationText: {
    color: Colors().text,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  tittle: {
    textAlign: 'left',
    color: Colors().text,
    fontSize: 16,
  },
  subTitle: {
    textAlign: 'left',
    color: Colors().textLigth,
    fontSize: 14,
  },
});
