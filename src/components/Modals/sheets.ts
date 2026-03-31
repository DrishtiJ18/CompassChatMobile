import {registerSheet} from 'react-native-actions-sheet';
import DeleteModal from './DeleteModal';
import SwitchModal from './SwitchModal';

registerSheet('delete-modal', DeleteModal);
registerSheet('switch-modal', SwitchModal);
export {};
