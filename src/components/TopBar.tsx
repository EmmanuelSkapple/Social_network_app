import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Colors from '../utils/Colors';
import Icons from '../utils/Icons';
import TopBarButton from './buttons/TopBarButton';
import NewDivider from './NewDivider';
import { TopBarProps } from '../../types/typesComponents';


export default function TopBar({
  leftText,
  centerText,
  backButton,
  backAction,
  rightButton,
  rightButtonPrimary,
  rightButtonText,
  rightAction,
  divider,
  children,
  css,
}: TopBarProps) {
  return (
    <>
      <View style={[styles().container, css]}>
        <View style={styles().left}>
          {backButton ? (
            <TouchableOpacity
              onPress={() => (backAction ? backAction() : null)}
              style={{ marginLeft: -10 }}
            >
              <Icons
                name="chevron-left"
                color={Colors().placeholder}
                size={34}
              />
            </TouchableOpacity>
          ) : null}
          {leftText ? (
            <Text style={styles().text}>{leftText}</Text>
          ) : null }
        </View>
        <View style={styles().right}>
          {rightButton && (
            <TopBarButton
              accion={() => (rightAction ? rightAction() : null)}
              text={rightButtonText || ''}
              Primary={rightButtonPrimary}
            />
          )}
        </View>
        {centerText ? (
          <View
            style={[
              styles().center,
              // { top: `${topCenterText!=null ? topCenterText : 25}}` },
            ]}
          >
            <Text style={styles().text}>{centerText}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles().children}>{children}</View>
      {divider ? <NewDivider /> : null}
    </>
  );
}

TopBar.defaultProps = {
  leftText: '',
  centerText: '',
  backButton: false,
  backAction: null,
  rightButton: false,
  rightButtonPrimary: false,
  rightButtonText: '',
  rightAction: null,
  divider: false,
  children: null,
  css: null,
  // topCenterText: null,
};

const styles = () => StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors().TopBarPrimary,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 21,
    position: 'relative',
  },
  text: {
    color: Colors().TextTopBar,
    fontSize: 16,
    fontWeight: 'bold',
  },
  left: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  right: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  center: {
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  children: {
    backgroundColor: Colors().BackgroundPrimary,
  },
});
