/* main.js
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
import Gio from 'gi://Gio';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk?version=4.0';
import Adw from 'gi://Adw?version=1';

import { BeekeeperWindow } from './window.js';

pkg.initGettext();
pkg.initFormat();

export const BeekeeperApplication = GObject.registerClass(
    class BeekeeperApplication extends Adw.Application {
        constructor() {
            super({application_id: 'xyz.trollcall.Beekeeper', flags: Gio.ApplicationFlags.FLAGS_NONE});

            const quit_action = new Gio.SimpleAction({name: 'quit'});
            quit_action.connect('activate', action => {
                this.quit();
            });
            this.add_action(quit_action);
            this.set_accels_for_action('app.quit', ['<primary>q', 'Escape']);

            const show_about_action = new Gio.SimpleAction({name: 'about'});
            show_about_action.connect('activate', action => {
                const aboutDialog = new Adw.AboutWindow({
                    developer_name: 'MeowcaTheoRange',
                    copyright: '\u00A9 2023 MeowcaTheoRange',
                    version: '0.1.0',
                    application_icon: 'xyz.trollcall.Beekeeper',
                    license_type: Gtk.License.APACHE_2_0,
                    application_name: 'Beekeeper',
                    transient_for: this.active_window,
                    website: 'https://trollcall.xyz/',
                    modal: true,
                    comments: `Beekeeper is a productive project manager made for easy access to your project directories.`
                });
                aboutDialog.present();
            });
            this.add_action(show_about_action);

            this.#loadSettings();
        }

        vfunc_activate() {
            let {active_window} = this;

            if (!active_window)
                active_window = new BeekeeperWindow(this);

            active_window.present();
        }

        #loadSettings() {
          globalThis.settings = new Gio.Settings({ schemaId: this.applicationId });
        }
    }
);

export function main(argv) {
    const application = new BeekeeperApplication();
    return application.run(argv);
}
