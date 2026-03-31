import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {SheetManager} from 'react-native-actions-sheet';
import {useStore} from '@src/stores';
import ChatHistory from '@src/components/ChatHistory';
import CustomDrawerHeader from './CustomDrawerHeader';
import DeleteChatConfirmationModal from '@src/components/Modals/DeleteChatConfirmationModal';
import {deleteConversation, getHistory} from '@src/apiConfigs/apiServices';
import {isIos, showToast} from '@src/utils/UiUtils';

export default function CustomDrawer(props: DrawerContentComponentProps) {
  const deleteConversationId = useStore(state => state.deleteConversationId);
  const setDeleteConversationId = useStore(
    state => state.setDeleteConversationId,
  );
  const setHistoryData = useStore(state => state.setHistoryData);
  const historyData = useStore(state => state.historyData);
  const conversationId = useStore(state => state.conversationId);
  const setConversationId = useStore(state => state.setConversationId);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const [isShowDeleteConfirmation, setIsShowDeleteConfirmation] =
    useState<boolean>(false);

  useEffect(() => {
    setDeleteConversationId({
      id: null,
      title: null,
    });
  }, [setDeleteConversationId]);

  function closeDrawer(): void {
    props.navigation.closeDrawer();
  }

  function onOpenDeleteModal(id: string, title: string) {
    SheetManager.show('delete-modal', {
      payload: {
        closeDrawer: closeDrawer,
        onDeleteChat: onDeleteChat,
      },
    });

    if (id && title) {
      setDeleteConversationId({
        id,
        title,
      });
    }
  }

  async function onDeleteChat() {
    try {
      await SheetManager.hide('delete-modal', {
        payload: false,
      });

      setTimeout(
        () => {
          setIsShowDeleteConfirmation(true);
        },
        isIos() ? 200 : 0,
      );
    } catch (error) {
      console.log('delete-modal sheet hide error', error);
    }
  }

  function updateAfterDelete(data) {
    setHistoryData(data);
    setDeleteConversationId({
      id: null,
      title: null,
    });

    if (conversationId === deleteConversationId?.id) {
      setConversationId(null);
    }
  }

  async function onDeleteChatAfterConfirmation() {
    setIsShowDeleteConfirmation(false);

    if (deleteConversationId?.id) {
      let copiedHistoryData = JSON.parse(JSON.stringify(historyData));
      let updatedHistoryData = historyData.filter(
        data => data.conversation_id !== deleteConversationId?.id,
      );
      updateAfterDelete(updatedHistoryData);
      try {
        // setShowLoader(true);
        await deleteConversation(deleteConversationId?.id);
        const response = await getHistory();
        updateAfterDelete(response.data);
      } catch (err) {
        console.log('err', err); // show toast
        showToast('Delete failed');
        updateAfterDelete(copiedHistoryData);
      } finally {
        // setShowLoader(false);
      }
    }
  }

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{paddingTop: 0, flex: 1}}
      showsVerticalScrollIndicator={false}
      bounces={false}
      testID="drawer-content-scroll-view">
      <Modal
        isVisible={showLoader}
        backdropColor="transparent"
        animationIn="bounceIn"
        animationOut={'bounceOut'}
        testID="loader-modal">
        <View
          className="flex-1 justify-center items-center"
          testID="loader-modal-view">
          <ActivityIndicator size="large" testID="drawer-screen-loader" />
        </View>
      </Modal>

      <View className="h-full flex" testID="drawer-screen-view">
        <CustomDrawerHeader closeDrawer={closeDrawer} />

        <ChatHistory
          onOpenDeleteModal={onOpenDeleteModal}
          closeDrawer={closeDrawer}
        />
      </View>

      {isShowDeleteConfirmation && (
        <DeleteChatConfirmationModal
          isVisible={isShowDeleteConfirmation}
          onCloseConfirmationModal={() => setIsShowDeleteConfirmation(false)}
          chatTitle={deleteConversationId.title ?? ''}
          onDeleteChatAfterConfirmation={onDeleteChatAfterConfirmation}
        />
      )}
    </DrawerContentScrollView>
  );
}
