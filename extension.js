'use strict';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import {getInputSourceManager} from 'resource:///org/gnome/shell/ui/status/keyboard.js';

let lockScreenHandlerId = null;

export default class PrimaryInputOnLockScreen extends Extension {
  enable() {
    if (lockScreenHandlerId) return;
    lockScreenHandlerId = Main.screenShield.connect('lock-screen-shown', _check_state);
  }
 
  disable() {
    if (!Main.sessionMode.isLocked && lockScreenHandlerId) {
      Main.screenShield.disconnect(lockScreenHandlerId);
      lockScreenHandlerId = null;
    }
  }
}
               
function _check_state() {
    try {
        const primaryInput = getInputSourceManager().inputSources["0"];
        log('[PRIMARY_LOCK]', "primaryInput:" & primaryInput);
        
        const currentInput = getInputSourceManager().currentSource;
        log('[PRIMARY_LOCK]', "currentInput:" & currentInput);
        
        if (currentInput != primaryInput) {
            primaryInput.activate();
        }
    } catch (err) {
        log(`[PRIMARY_LOCK]: ERROR: ${err}`)
    }
}
