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
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import { getFilesInFolder, indexObjects, isSamePath } from './folders.js';

export const BeekeeperWindow = GObject.registerClass({
        GTypeName: 'BeekeeperWindow',
        Template: 'resource:///xyz/trollcall/Beekeeper/window.ui',
        InternalChildren: [
          'userName',
          'timeThingy',
          'holderBox',
          'entryBox',
          'emergencyProp'
        ],
}, class BeekeeperWindow extends Gtk.ApplicationWindow {
    #_userName;
    #_timeThingy;
    #_entryBox;
    #_emergencyProp;

    #bigBox;
    #continueLabel;
    #folders;
    #earlierLabel;

    _init(application) {
      super._init({application})

      this._userName.set_text(`Welcome, ${GLib.get_real_name()}!`);
      this._timeThingy.set_text(`It is ${GLib.DateTime.new_now_local().format("%X")}.`);
      setInterval(() => this._timeThingy.set_text(`It is ${GLib.DateTime.new_now_local().format("%X")}.`), 500);

      settings.bind('pathname', this._entryBox, 'text', Gio.SettingsBindFlags.BIND_SET << Gio.SettingsBindFlags.BIND_GET);
      let prev = this._entryBox.text;
      this._entryBox.connect("activate", () => {
        this.make_window(false, this._entryBox.text, prev);
        prev = this._entryBox.text;
      });
      this.make_window(true, prev);
    }

    make_window(immune, now, prev) {
        if (!immune && isSamePath(now, prev)) return;
        if (this.bigBox) this._holderBox.remove(this.bigBox);
        if (this.continueLabel) this._holderBox.remove(this.continueLabel);
        if (this.folders) this._holderBox.remove(this.folders);
        if (this.earlierLabel) this._holderBox.remove(this.earlierLabel);

      const launch_shit = (row, offset) => {
        console.log(row);
        if (row.get_selected_row) row = row.get_selected_row();
        const file = files[row.get_index() + offset];

        const filetype = Gio.AppInfo.get_default_for_type(file.type, false);
        const path = GLib.filename_to_uri(file.path, null);

        if (filetype) filetype.launch_default_for_uri(path);
        else Gio.AppInfo.launch_default_for_uri(path, null);
      }

      const offset = 3;

      const folderPath = now || "";
      const files = getFilesInFolder(folderPath);
      const GtkBoxThings = indexObjects(files);
      if (GtkBoxThings.length > 0) {
        this.continueLabel = new Gtk.Label({
          label: "Continue",
          xalign: "0",
          css_classes: [
            "heading"
          ]
        });
        this._holderBox.append(this.continueLabel);
        this.bigBox = new Gtk.ListBox({
          name: "main-button",
          selection_mode: "single",
          css_classes: [
            "boxed-list"
          ]
        })
        this._holderBox.append(this.bigBox);
        this.bigBox.connect("row-activated", (l, r) => launch_shit(r, 0));
        GtkBoxThings.splice(0, offset).map(x => this.bigBox.append(x));
      }
      if (GtkBoxThings.length > 0) {
        this.earlierLabel = new Gtk.Label({
          label: "Earlier",
          xalign: "0",
          css_classes: [
            "heading"
          ]
        });
        this._holderBox.append(this.earlierLabel);
        this.folders = new Gtk.ListBox({
          margin_start: 8,
          margin_end: 8,
          selection_mode: "single",
          css_classes: [
            "boxed-list"
          ]
        })
        this._holderBox.append(this.folders);
        this.folders.connect("row-activated", (l, r) => launch_shit(r, offset));
        GtkBoxThings.map(x => this.folders.append(x));
      }
      this._emergencyProp.set_propagate_natural_height(true);
    }
});
