/* window.js
 *
 * Copyright 2023 MeowcaTheoRange
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import { getFilesInFolder, indexObjects } from './folders.js';

export const BeekeeperWindow = GObject.registerClass({
        GTypeName: 'BeekeeperWindow',
        Template: 'resource:///xyz/trollcall/Beekeeper/window.ui',
        InternalChildren: ['label', 'folders', 'bigBox', 'userName', 'timeThingy'],
}, class BeekeeperWindow extends Gtk.ApplicationWindow {
    #_folders;
    #_bigBox;
    #_userName;
    #_timeThingy;

    _init(application) {
      super._init({application})

      this._userName.set_text(`Welcome, ${GLib.get_real_name().split(" ")[0]}!`);
      this._timeThingy.set_text(`It is ${GLib.DateTime.new_now_local().format("%X")}.`);
      setInterval(() => this._timeThingy.set_text(`It is ${GLib.DateTime.new_now_local().format("%X")}.`), 500);
      const getModal = (row) => {
        let builder = Gtk.Builder.new_from_resource("/xyz/trollcall/Beekeeper/gtk/modal.ui");
        let modalWindow = builder.get_object("modalWindow");
        modalWindow.set_modal(true);
        modalWindow.set_transient_for(this);
        print(row);
        const recommendedTypes = Gio.AppInfo.get_recommended_for_type(row.get_child().get_child_at_index(0).icon_name);
        modalWindow.present();
      }

      this._bigBox.connect("row_activated", getModal);
      this._folders.connect("row_activated", getModal);

      let folderPath = "Documents/github/";
        let files = getFilesInFolder(folderPath);
        let GtkBoxThings = indexObjects(files);
        GtkBoxThings.splice(0, 3).map(x => this._bigBox.append(x));
        GtkBoxThings.map(x => this._folders.append(x));
    }
});
