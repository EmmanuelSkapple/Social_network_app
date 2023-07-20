import {
  View, Text, StyleSheet, Image,
} from 'react-native';
import React, { useState } from 'react';
import Colors from '../utils/Colors';
import TopBar from '../components/TopBar';
import PrimaryButton from '../components/buttons/PrimaryButton';
import Images from '../utils/Images';

export default function NewJoinGroup() {
  // eslint-disable-next-line no-unused-vars
  const [alredyJoined, setAlredyJoined] = useState(true);

  const btnJoinGroup = () => {
    // Implementar codigo para unirse a grupo
  };

  return (
    <View style={styles().container}>
      <TopBar
        backButton
        backAction={() => {}}
        leftText="Join group"
        rightButton
        rightAction={() => {}}
        rightButtonText="Cancel"
        divider
      />
      <View style={styles().content}>
        <View style={styles().group}>
          {alredyJoined ? (
            <View style={styles().alredyJoined}>
              <Image source={Images.logoJoin} style={styles().logo} />
              <Text style={styles().title}>Group already joined!</Text>
              <Text style={styles().subTitle}>Try another group</Text>
            </View>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {/* Mostrar Grupo a Unirse */}
            </>
          )}
        </View>
        <View style={styles().btnContainer}>
          <PrimaryButton
            text="Join Group"
            disabled={false}
            accion={btnJoinGroup}
          />
        </View>
      </View>
    </View>
  );
}

const styles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors().BackgroundSecondary,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '90%',
  },
  btnContainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
    marginBottom: 70,
  },
  group: {
    marginTop: 30,
    marginHorizontal: 20,
  },
  alredyJoined: {
    backgroundColor: Colors().CardGroupsBackground,
    width: '100%',
    height: 145,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors().CardGroupsBorderPrimary,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginBottom: 16,
  },
  title: {
    color: Colors().TextBlackWhite,
    fontSize: 16,
  },
  subTitle: {
    color: Colors().CardGroupsTitle,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
