import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { ModalComments } from '../modals/ModalComments';
import { Ionicons } from '@expo/vector-icons';
import Icons from '../utils/Icons';
import metrics from '../utils/metrics';
import Colors from '../utils/Colors';
import { useEffect, useState } from 'react';
import { getComments } from '../database/commentsFirebase';
import I18n from 'i18n-js';
import { CommentsProps } from '../../types/typesComments';
import Loading from './Loading';

type PostCommentProps = {
  setShowComments: (show: boolean) => void;
  showComments: boolean;
  setCommentText: (text: any) => void;
  commentText: string;
  sendNewComment: () => void;
  idPost: string;
  refreshComments: boolean;
  loading: boolean;
};

function Comments({ itemComment }: CommentsProps) {
  return (
    <View style={[styles.titleTextContainer]}>
      <Text
        style={[
          styles.fontFamilyTextBold,
          {
            color: Colors().textColorModal,
          },
        ]}>
        {itemComment.poster.name}
      </Text>
      <Text
        style={[
          styles.fontFamilyTextRegular,
          styles.messageText,
          {
            color: Colors().textColorModal,
          },
        ]}>
        {itemComment.comment}
      </Text>
      <View style={styles.timeContainer}>
        {/* <Text
          style={[
            styles.fontFamilyTextRegular,
            styles.textTimeAndReply,
            styles.timeText,
            {
              color: Colors().textColorReplyTime,
            },
          ]}>
          {time}
        </Text> */}
      </View>
    </View>
  );
}

export function PostComment({
  setShowComments,
  showComments,
  setCommentText,
  commentText,
  sendNewComment,
  idPost,
  refreshComments,
  loading,
}: PostCommentProps) {
  const [comments, setComments] = useState([] as any);
  useEffect(() => {
    getCommentsFromDB();
  }, [refreshComments]);

  const getCommentsFromDB = async () => {
    let commentReq = await getComments(idPost);
    if (commentReq.status == 200) {
      setComments(commentReq.commentsList.reverse());
    }
  };

  const getTitleComments =
    comments.length > 0
      ? comments.length + ' ' + I18n.t('comments')
      : I18n.t('notComments');

  return (
    <ModalComments
      setShowModal={setShowComments}
      showModal={showComments}
      title={getTitleComments}>
      <FlatList
        data={comments}
        keyboardShouldPersistTaps={'always'}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {}}
        style={styles.scrollViewModal}
        renderItem={({ item }) => (
          <>
            <Comments itemComment={item} key={`message${item.id}`} />
            {/* {item.answers.length ? (
              <FlatList
                data={item.answers}
                keyExtractor={(item) => item.title}
                onEndReached={() => {}}
                renderItem={({ item }) => (
                  <Comments
                    {...item}
                    key={`answers${item.title}`}
                    styleComment={styles.answerContainer}
                  />
                )}
              />
            ) : null} */}
          </>
        )}
      />

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: Colors().textFieldColor,
            borderColor: Colors().textFieldBorderColor,
          },
        ]}>
        <View style={styles.texFieldContainer}>
          <TextInput
            style={[
              styles.textField,
              styles.fontFamilyTextRegular,
              {
                backgroundColor: Colors().textFieldColor,
                color: Colors().textColorModal,
              },
            ]}
            placeholder='Comment'
            onChangeText={setCommentText}
            value={commentText}
            placeholderTextColor='#cbcbcc'
          />
        </View>
        <View style={styles.textFieldButtonContainer}>
          <TouchableOpacity onPress={() => !loading && sendNewComment()}>
            <View style={styles.iconSendContainer}>
              {loading ? (
                <Loading color={Colors().textBtnPrimary} />
              ) : (
                <Icons
                  IconFamily={Ionicons}
                  name='send'
                  size={15}
                  color={Colors().iconSendColor}
                  style={styles.iconSend}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ModalComments>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 25,
    flexDirection: 'row',
    height: 50,
    marginBottom: 20,
    width: metrics.width * 0.85,
  },
  texFieldContainer: {
    width: metrics.width * 0.85 - 43,
  },
  textField: {
    fontSize: 15,
    marginLeft: 15,
    width: '100%',
  },
  textFieldButtonContainer: {
    backgroundColor: '#E45975', //Colors().PlayBtn
    borderRadius: 35,
    height: 35,
    justifyContent: 'center',
    marginRight: 8,
    width: 35,
  },
  iconSendContainer: {
    alignItems: 'center',
  },
  fontFamilyTextRegular: {
    fontFamily: 'PlusJakartaSans-Regular',
  },
  fontFamilyTextBold: {
    fontFamily: 'PlusJakartaSans-Bold',
  },
  textTimeAndReply: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollViewModal: {
    flexDirection: 'column',
    marginBottom: 20,
    marginHorizontal: 20,
    maxHeight: 200,
  },
  iconSend: {
    position: 'absolute',
    right: 6,
    top: -8,
  },
  messageText: {
    letterSpacing: 0.01,
  },
  titleTextContainer: {
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
  },
  timeText: {
    marginRight: 10,
  },
  answerContainer: {
    marginLeft: 15,
  },
});
